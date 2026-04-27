from datetime import datetime

HOST = '127.0.0.1'
TIMEOUT = 10

HIT = 'H'
MISS = 'M'
NONE = '-'

OK = 200
BAD_REQUEST = 400
FILE_NOT_FOUND = 404

SERVER_PORT = 42000

TEXT = 'text/plain'

GET = "GET"
CONNECT = "CONNECT"
HEAD = "HEAD"
POST = "POST"

EMPTY = 0
NULL_STRING = ""

BUFFER = 4096

CACHE_DIR = "cache"

class FileTooLargeError(Exception):
    def __init__(self, message):
        super().__init__(message)
        self.message = message

def create_response(data, res_code, res, type, cache_control, data_len):
    date = datetime.now().strftime("%a, %d %b %Y %H:%M:%S GMT")
    headers = (
        f"HTTP/1.1 {res_code} {res}\r\n"
        f"Server: {HOST}\r\n"
        f"Date: {date}\r\n"
        f"Content-length: {data_len}\r\n"
        f"Content-type: {type}\r\n"
        f"Cache-Control: {cache_control}\r\n"
        f"\r\n"
    )
    if isinstance(data, str):
        data = data.encode()
    return headers.encode() + data

def log(host, port, cache, request, status, bytes):
    date = datetime.now().strftime("%d/%b/%Y:%H:%M:%S %z")
    print(f"{host} {port} {cache} {date} {request} {status} {bytes}")

class ServerError(Exception):
    def __init__(self, message):
        super().__init__(message)
        self.message = message

class InvalidRequest(Exception):
    def __init__(self, message):
        super().__init__(message)
        self.message = message