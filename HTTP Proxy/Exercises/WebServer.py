from socket import *
import sys

HOST = '127.0.0.1'

if len(sys.argv) != 2:
    print("python3 WebServer.py <port>")
    sys.exit(1)

PORT = int(sys.argv[1])


server = socket(AF_INET, SOCK_STREAM)
address = (HOST, PORT)

server.bind((HOST, PORT))
server.listen(1)
print(f"Starting server on http://{HOST}:{PORT}/")
try :
    while True:
        connectionSocket, addr = server.accept()
        try:
            request = connectionSocket.recv(1024).decode()
            print(f"Received request:\n{request}")
            requestLine = request.splitlines()[0]
            method, path = requestLine.split()[:2]
            if path == '/':
                path = 'index.html'
            else:
                path = path.lstrip('/')
            with open (path, 'r') as file:
                content = file.read()

                httpResponse =  f"HTTP/1.1 200 OK\r\n" \
                                f"Content-Type: text/html; charset=UTF-8\r\n" \
                                f"Content-Length: {len(content)}\r\n" \
                                f"Connection: close\r\n" \
                                f"\r\n" + content
                connectionSocket.sendall(httpResponse.encode())
        except FileNotFoundError as e:
            body = "<h1>404 Not Found</h1>".encode()
            header = (
                "HTTP/1.1 404 Not Found\r\n"
                "Content-Type: text/html; charset=UTF-8\r\n"
                f"Content-Length: {len(body)}\r\n"
                "Connection: close\r\n"
                "\r\n"
            ).encode()
            connectionSocket.sendall(header + body)
        except Exception as e:
            print("Error:", e)
except KeyboardInterrupt:
    print("\nServer shutting down...")
    server.close()

