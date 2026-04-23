import socket
import random
import sys

from datetime import datetime

client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

if len(sys.argv) != 3:
    print("python3 PingClient.py <host> <port>")
    sys.exit(1)

address = (sys.argv[1], int(sys.argv[2]))

seq = random.randint(40000, 50000)
client.settimeout(.6)
rtts = []
packets = 15
packet_acknowledged = 0
for i in range (packets):
    timestamp = datetime.now()
    client.sendto(f"PING {seq} {timestamp}".encode(), address)
    try:
        data, addr = client.recvfrom(1024)
        rtt_seconds = datetime.now() - timestamp
        rtt = f"{round(rtt_seconds.total_seconds() * 1000)}ms"
        packet_acknowledged += 1
        rtts.append(round(rtt_seconds.total_seconds() * 1000))
    except socket.timeout:
        rtt = 'timeout'
        pass
    print(f"PING to {sys.argv[1]}, seq={seq}, rtt={rtt}")
    seq += 1
client.close()

print("...")
print(f"Total packets sent: {packets}")
print(f"Packets acknowledged: {packet_acknowledged}")
print(f"Packet loss: {round((packets - packet_acknowledged) / packets * 100)}%")
print(f"Minimum RTT: {min(rtts)} ms, Maximum RTT: {max(rtts)} ms, Average RTT: {round(sum(rtts) / len(rtts))} ms")
print(f"Total transmission time: {sum(rtts) + 600 * (packets - packet_acknowledged)} ms")

deviations = []
for i in range(len(rtts) - 1):
    deviations.append(abs(rtts[i] - rtts[i+1]))

print(f"Jitter: {round(sum(deviations) / len(deviations))} ms")