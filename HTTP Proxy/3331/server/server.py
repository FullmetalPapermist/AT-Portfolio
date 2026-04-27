import socket

import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from helpers import *

def handle_bad_request(method):
    print(f"400 Bad Request: {method}")
    return create_response(
        NULL_STRING,
        BAD_REQUEST,
        "Bad Request",
        TEXT,
        NONE,
        EMPTY
    )

def handle_GET(path):
    try:
        with open(os.path.join('server', path), 'r') as file:
            data = file.read()
        print(f"200 OK: {path} GET")
        return create_response(
            data,
            OK,
            "OK",
            TEXT,
            MISS,
            len(data.encode())
        )
    except FileNotFoundError:
        print(f"404 Not Found: {path} GET")
        return create_response(
            NULL_STRING,
            FILE_NOT_FOUND,
            "File Not Found",
            TEXT,
            MISS,
            EMPTY
        )


def handle_POST(path, data):
    try:
        with open(path, 'w') as file:
            file.write(data)
        print(f"200 OK: {path} POST")
        return create_response(
            NULL_STRING,
            OK,
            "OK",
            TEXT,
            NONE,
            EMPTY
        )
    except Exception as e:
        return create_response(
            NULL_STRING,
            BAD_REQUEST,
            f"Error writing to file: {str(e)}",
            TEXT,
            NONE,
            EMPTY
        )

def handle_request(request):
    try:
        request_lines = request.splitlines()[0]
        method, path = request_lines.split()[:2]
    except (IndexError, ValueError):
        return handle_bad_request('Malformed Request')
    if method == GET:
        return handle_GET(path)
    elif method == POST:
        try:
            data = request.split("\r\n\r\n", 1)[1]
            return handle_POST(path, data)
        except IndexError:
            return handle_bad_request('Malformed POST')
    else:
        return handle_bad_request('Unsupported Method')

if __name__ == "__main__":

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
        server.bind((HOST, SERVER_PORT))
        server.listen()
        print("Server runnning")

        try:
            while True:
                proxySocket, proxyAddress = server.accept()
                try:
                    proxySocket.settimeout(TIMEOUT)
                    data = proxySocket.recv(1024)
                    if not data:
                        print("Received empty packet, closing connection")
                        break
                    request = data.decode()
                    response = handle_request(request)
                    proxySocket.sendall(response)
                except socket.timeout:
                    print("Socket timeout, closing connection")
                except Exception as e:
                    print(f"Unexpected error: {e}")
                finally:
                    proxySocket.close()
        except KeyboardInterrupt:
            print("Server shutting down...")
            server.close()


