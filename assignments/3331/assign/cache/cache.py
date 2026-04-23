import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from helpers import *

EXCLUDED_FILES = {"cache.py"}

class Cache():
    def __init__(self, max_cache_size, max_size_object):
        if not os.path.exists("cache"):
            os.makedirs("cache")
        self.max_cache_size = max_cache_size
        self.max_size_object = max_size_object

    def is_cache_full(self, data_len):
        total_size = data_len
        try:
            for filename in os.listdir(CACHE_DIR):
                file_path = os.path.join(CACHE_DIR, filename)
                if os.path.isdir(file_path) or file_path in EXCLUDED_FILES:
                    continue
                total_size += os.path.getsize(file_path)
        except Exception as e:
            print(f"Error occurred in calculating {e}")
            return False
        return total_size >= self.max_cache_size

    def make_space(self, data_len):
        while self.is_cache_full(data_len):
            try:
                files = [f for f in os.listdir(CACHE_DIR)
                         if f not in EXCLUDED_FILES and
                         os.path.isfile(os.path.join(CACHE_DIR, f))]
                oldest_file = min(
                    files, key=lambda f: os.path.getctime(
                        os.path.join(CACHE_DIR, f
                                     )))
                os.remove(os.path.join(CACHE_DIR, oldest_file))
            except Exception as e:
                print(f"An error occurred while clearing cache: {e}")
                break

    def fetch_file(self, filename):
        safe_filename = filename.replace("/", "_")
        try:
            with open(f"cache/{safe_filename}", "rb") as f:
                return f.read().decode()
        except FileNotFoundError:
            raise FileNotFoundError("File not in cache")

    def cache_file(self, filename, data):
        encoded = data.encode()
        if len(encoded) > self.max_size_object:
            raise FileTooLargeError("File size exceeds maximum")
        self.make_space(len(encoded))
        safe_filename = filename.replace("/", "_")
        with open(f"cache/{safe_filename}", "wb") as f:
            f.write(encoded)