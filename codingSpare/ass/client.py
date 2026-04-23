import telnetlib
import sys
import time

HOST = "127.0.0.1"

def send_http_request(method, path, port, host_header="127.0.0.1"):
    request = f"{method} http://{host_header}/{path} HTTP/1.1\r\n" \
              f"Host: {host_header}\r\n" \
              f"Connection: close\r\n\r\n"

    with telnetlib.Telnet(HOST, port) as tn:
        tn.write(request.encode('ascii'))
        print(f"=== {method} {path} ===")
        response = tn.read_all()
        print(response.decode('utf-8', errors='replace'))
        print("=" * 40 + "\n")
        time.sleep(0.2)

def send_http_post(path, port, body, host_header="127.0.0.1"):
    content_length = len(body.encode('utf-8'))
    request = f"POST http://{host_header}/{path} HTTP/1.1\r\n" \
              f"Host: {host_header}\r\n" \
              f"Connection: close\r\n" \
              f"Content-Length: {content_length}\r\n" \
              f"Content-Type: text/plain\r\n\r\n" \
              f"{body}"

    with telnetlib.Telnet(HOST, port) as tn:
        tn.write(request.encode('ascii'))
        print(f"=== POST {path} ===")
        response = tn.read_all()
        print(response.decode('utf-8', errors='replace'))
        print("=" * 40 + "\n")
        time.sleep(0.2)

def send_raw_request(raw, port):
    with telnetlib.Telnet(HOST, port) as tn:
        tn.write(raw.encode('ascii'))
        print("=== RAW REQUEST ===")
        response = tn.read_all()
        print(response.decode('utf-8', errors='replace'))
        print("=" * 40 + "\n")
        time.sleep(0.2)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(f"Usage: python {sys.argv[0]} <port>")
        sys.exit(1)

    PORT = int(sys.argv[1])

    print("\n--- Testing valid requests ---")
    send_http_request("GET", "index.html", PORT)
    send_http_request("HEAD", "index.html", PORT)

    print("\n--- Testing POST and read-back ---")
    send_http_post("hi.html", PORT, "Hello, World!")
    send_http_request("GET", "hi.html", PORT)

    print("\n--- Testing missing file ---")
    send_http_request("GET", "nonexistent.html", PORT)

    print("\n--- Testing large file handling ---")
    send_http_request("GET", "big.html", PORT)
    send_http_request("GET", "too_big.html", PORT)  # Should return 400

    print("\n--- Testing cache fill and eviction (if applicable) ---")
    send_http_request("GET", "bigcopy.html", PORT)
    send_http_request("GET", "bigcopy2.html", PORT)
    send_http_request("GET", "bigcopy3.html", PORT)

    print("\n--- Testing cache HIT ---")
    send_http_request("GET", "index.html", PORT)  # Should be HIT if cache kept it

    print("\n--- Testing malformed request ---")
    send_raw_request("GET /no-http-version\r\n\r\n", PORT)

    print("\n--- Testing unsupported method ---")
    send_raw_request("PUT http://127.0.0.1/test HTTP/1.1\r\nHost: 127.0.0.1\r\n\r\n", PORT)

    print("\n--- All tests complete ---")
