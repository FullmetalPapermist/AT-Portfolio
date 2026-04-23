import socket
import argparse
import threading
from helpers import *
from cache.cache import Cache

class ClientThread(threading.Thread):
    def __init__(self, clientAddress, clientSocket, port, timeout, cache):
        threading.Thread.__init__(self)
        self.clientAddress = clientAddress
        self.clientSocket = clientSocket
        self.port = port
        self.timeout = timeout
        self.cache = cache
        self.clientAlive = False

    def run(self):
        self.clientAlive = True
        self.clientSocket.settimeout(self.timeout)
        try:
            data = self.clientSocket.recv(BUFFER)
            if not data:
                print("Received empty packet, closing connection")
                return
            request = data.decode()
            self.handle_request(request)
        except socket.timeout:
            print("Socket timeout, closing connection")
        except Exception as e:
            print(f"Unexpected error: {e}")
        finally:
            self.clientAlive = False
            self.clientSocket.close()

    def handle_bad_request(self, request, host, port):
            log(host, port, NONE, request, BAD_REQUEST, EMPTY)
            response = create_response(
                NULL_STRING,
                BAD_REQUEST,
                "Bad Request",
                TEXT,
                NONE,
                EMPTY
            )
            self.clientSocket.sendall(response)

    def parse_request(self, request):
        header, _, body = request.partition('\r\n\r\n')
        header_lines = header.splitlines()
        request_line = header_lines[0]
        method, url, http_version = request_line.split()

        headers = {}
        for line in header_lines:
            if ':' in line:
                key, value = line.split(':', 1)
                headers[key.strip().lower()] = value.strip()

        if not url.startswith("http://"):
            raise InvalidRequest('invalid request')
        url_args = url[len("http://"):]
        if '/' in url_args:
            host_port, path = url_args.split('/', 1)
        else:
            host_port = url_args
            path = '/index.html'

        if ':' in host_port:
            host, port_str = host_port.split(":", 1)
            port = int(port_str)
        else:
            host = host_port
            port = 80
        return {
            "request_line": request_line,
            "method": method,
            "http_version": http_version,
            "headers": headers,
            "body": body,
            "path": path,
            "host": host,
            "port": port
        }

    def handle_request(self, request):
        try:
            req_data = self.parse_request(request)
            host = req_data['host']
            method = req_data['method']
            path = req_data['path']
            request_line = req_data['request_line']
            body = req_data['body']
            port = req_data['port']
        except (IndexError, ValueError, InvalidRequest):
            self.handle_bad_request(request, host, port)
            return
        if method == GET:
            self.handle_GET(path, request_line, host, port)
        elif method == HEAD:
            self.handle_HEAD(path, request_line, host, port)
        elif method == POST:
            try:
                self.handle_POST(path, body, request_line, host, port)
            except IndexError:
                self.handle_bad_request(request_line, host, port)
        else:
            self.handle_bad_request(request_line, host, port)

    def handle_file_too_large(self, request, client_host, port):
        log(client_host, port, MISS, request, BAD_REQUEST, EMPTY)
        response = create_response(NULL_STRING, BAD_REQUEST, "File Too Large", TEXT, MISS, EMPTY)
        self.clientSocket.sendall(response)

    def cache_file(self, filename, cache):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.connect((HOST, SERVER_PORT))
                s.sendall(f"{GET} {filename} HTTP/1.1\r\nHost: {HOST}\r\nConnection: close\r\n\r\n".encode())
                response = b""
                while True:
                    chunk = s.recv(BUFFER)
                    if not chunk:
                        break
                    response += chunk
            except Exception as e:
                raise ServerError(f"Error connecting to server: {e}")
        parts = response.split(b"\r\n\r\n", 1)

        if len(parts) < 2:
            raise ServerError("malformed response from server")
        headers, data = parts
        status_line = headers.decode().splitlines()[0]
        if "404" in status_line:
            raise FileNotFoundError("File not found")
        if cache:
            try:
                self.cache.cache_file(filename, data.decode())
            except FileTooLargeError:
                print("unable to cache")
                pass
        return data.decode()

    def handle_GET(self, path, request, host, port):
        try:
            content = self.cache.fetch_file(path)
            log(host, port, HIT, request, OK, len(content))
            response = create_response(content, OK, "OK", TEXT, HIT, len(content))
            self.clientSocket.sendall(response)
        except FileNotFoundError:
            try:
                data = self.cache_file(path, cache=True)
                log(host, port, MISS, request, OK, len(data.encode()))
                response = create_response(data, OK, "OK", TEXT, MISS, len(data.encode()))
                self.clientSocket.sendall(response)

            except FileNotFoundError:
                log(host, port, MISS, request, FILE_NOT_FOUND, EMPTY)
                response = create_response(NULL_STRING, FILE_NOT_FOUND, "File Not Found", TEXT, MISS, EMPTY)
                self.clientSocket.sendall(response)
        except FileTooLargeError:
            self.handle_file_too_large(request, host, port)

    def handle_HEAD(self, path, request, host, port):
        try:
            content = self.cache.fetch_file(path)
            encoded_content = content.encode()
            log(host, port, HIT, request, OK, len(encoded_content))
            response = create_response(NULL_STRING, OK, "OK", TEXT, HIT, len(encoded_content))
            self.clientSocket.sendall(response)
        except FileNotFoundError:
            try:
                file = self.cache_file(path, cache=False)
                encoded_content = file.encode()
                log(host, port, HIT, request, OK, len(encoded_content))
                response = create_response(NULL_STRING, OK, "OK", TEXT, MISS, len(encoded_content))
                self.clientSocket.sendall(response)
            except FileNotFoundError:
                log(host, port, MISS, request, FILE_NOT_FOUND, EMPTY)
                response = create_response(NULL_STRING, FILE_NOT_FOUND, "File Not Found", TEXT, MISS, EMPTY)
                self.clientSocket.sendall(response)

    def handle_POST(self, path, data, request, host, port):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.connect((HOST, SERVER_PORT))
                proxy_request = f"POST {path} HTTP/1.1\r\nHost: {HOST}\r\nContent-Length: {len(data)}\r\nConnection: close\r\n\r\n{data}"
                s.sendall(proxy_request.encode())
                response = b""
                while True:
                    chunk = s.recv(BUFFER)
                    if not chunk:
                        break
                    response += chunk
            log(host, port, NONE, request, OK, EMPTY)
            response = create_response(NULL_STRING, OK, "OK", TEXT, NONE, EMPTY)
            self.clientSocket.sendall(response)
        except Exception as e:
            self.handle_bad_request(request, host, port)

def parse_command_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("port", type=int)
    parser.add_argument("timeout", type=float)
    parser.add_argument("max_size_object", type=int)
    parser.add_argument("max_cache_size", type=int)
    return parser.parse_args()

if __name__ == "__main__":
    args = parse_command_args()
    cache = Cache(args.max_cache_size, args.max_size_object)
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as proxy:
        proxy.bind((HOST, args.port))
        proxy.listen()
        print(f"Starting proxy on http://{HOST}:{args.port}/")
        client_threads = []
        client_sockets = []
        try:
            while True:
                clientSocket, clientAddress = proxy.accept()
                client_sockets.append(clientSocket)
                clientThread = ClientThread(
                    clientAddress,
                    clientSocket,
                    args.port,
                    args.timeout,
                    cache
                )
                clientThread.daemon = True
                client_threads.append(clientThread)
                clientThread.start()

        except KeyboardInterrupt:
            print("Shutting down proxy...")
        except Exception as e:
            print("An error occurred:", e)
        finally:
            print("closing client sockets")
            for sock in client_sockets:
                try:
                    sock.shutdown(socket.SHUT_RDWR)
                    sock.close()
                except Exception:
                    pass
            print("Closing threads")
            for thread in client_threads:
                thread.join(timeout=1.0)

            proxy.close()

