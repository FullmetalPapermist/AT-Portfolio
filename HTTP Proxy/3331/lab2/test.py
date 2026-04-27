import socket

server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

ip = 'localhost'
port = 9998
address = (ip, port)
server.bind(address)
print(f"Server started at {ip}:{port}")

while True:
    data, addr = server.recvfrom(1024)
    print(f"Received message: {data.decode()} from {addr}")
    message = "Pong"
    server.sendto(message.encode(), addr)
