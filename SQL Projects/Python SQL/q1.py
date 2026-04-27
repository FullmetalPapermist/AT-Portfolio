#!/usr/bin/env python3
import sys
import psycopg2

def main():
    conn = psycopg2.connect(dbname="mymyunsw")
    cur = conn.cursor()

    cur.execute("""
        SELECT f.name, COUNT(DISTINCT s.id), COUNT(DISTINCT c.convenor)
        FROM Orgunits f
        LEFT JOIN Orgunits s ON s.parent = f.id AND s.utype = 'school'
        LEFT JOIN Subjects sub ON sub.owner = s.id or sub.owner = f.id
        LEFT JOIN Courses c ON c.subject = sub.id
        WHERE f.utype = 'faculty'
        GROUP BY f.name
        ORDER BY f.name
    """)
    data = cur.fetchall()

    print(f"{'Faculty':<40}{'#Schools':>8}{'#Staff':>7}")
    for type_name, num_schools, num_staff in data:
        print(f"{type_name:<40}{num_schools:>8}{num_staff:>7}")

    cur.close()
    conn.close()

if __name__ == "__main__":
    main()