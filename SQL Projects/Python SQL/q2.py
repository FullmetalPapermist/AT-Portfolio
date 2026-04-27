#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import psycopg2

def main():
    if len(sys.argv) != 2:
        print("Usage: ./q2.py <SubjectCode>")
        sys.exit(1)
    subject_code = sys.argv[1]

    conn = psycopg2.connect(dbname="mymyunsw")
    cur = conn.cursor()
    cur.execute("""
        SELECT sub.title
        FROM Subjects AS sub
        WHERE sub.code = %s;
    """,(subject_code,))
    row = cur.fetchone()
    if row is None:
        print(f'Subject {subject_code} not found.')
        cur.close()
        conn.close()
        sys.exit(1)
    subject_title = row[0]


    cur.execute("""
    SELECT sub.code, sub.title, t.code, ROUND(AVG(ce.mark), 2)
    FROM Subjects AS sub
    JOIN Courses AS c ON c.subject = sub.id
    LEFT JOIN Course_enrolments AS ce ON ce.course = c.id
    JOIN Terms as t ON t.id = c.term
    WHERE sub.code = %s AND ce.mark IS NOT NULL
    GROUP BY sub.code, sub.title, t.code, c.term
    ORDER BY c.term;
    """, (subject_code,))

    max_list = []
    test_list = []

    for subject_code, title, term, avg in cur.fetchall():
        if not test_list or test_list[-1][1] < avg:
            test_list.append((term, avg))
        else:
            if len(test_list) >= len(max_list):
                max_list = test_list.copy()
            test_list = [(term, avg)]

    if len(test_list) >= len(max_list):
        max_list = test_list.copy()

    if (len(max_list) == 1):
        print(f'No increasing run found for {subject_code}.')
        cur.close()
        conn.close()
        sys.exit(1)


    print(f"{subject_code} ({subject_title}):")
    print(' -> '.join(f"{term}({avg})" for term, avg in max_list))

    cur.close()
    conn.close()

if __name__ == "__main__":
    main()