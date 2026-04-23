#!/usr/bin/env python3
import sys
import psycopg2

def main():
    conn = psycopg2.connect(dbname="mymyunsw")
    cur = conn.cursor()

    cur.execute("""
        SELECT name
        FROM Orgunits
        WHERE type = "faculty"
        ORDER BY name
    """)
    type_name = cur.fetchall()[0]
    print(type_name)

    # print(f"{type_name:<40}{num_schools:>8}{num_staff:>7}")

    cur.close()
    conn.close()

if __name__ == "__main__":
    main()