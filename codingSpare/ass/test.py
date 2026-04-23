#!/usr/bin/env python3
import sys
import re
import psycopg2
from helpers import get_student, get_program, get_stream

def main():
    argc = len(sys.argv)
    if argc < 2:
      print(f"Usage: {sys.argv[0]} zID [Program Stream]")
      exit(1)
    zid = sys.argv[1]
    if zid[0] == 'z':
        zid = zid[1:8]
    digits = re.compile("^\d{7}$")
    if not digits.match(zid):
        print("Invalid zID")
        exit(1)

    prog_code = None
    strm_code = None

    if argc >= 3:
        prog_code = sys.argv[2]
    if argc >= 4:
        strm_code = sys.argv[3]

    conn = psycopg2.connect("dbname=mymyunsw")
    cur = conn.cursor()

    stu_info = get_student(conn,zid)
    if not stu_info:
        print(f"Invalid student id {zid}")
        exit(1)
    #print(stu_info) # debug

    if prog_code:
        prog_info = get_program(conn,prog_code)
        if not prog_info:
            print(f"Invalid program code {prog_code}")
            exit(1)
            #print(prog_info)  #debug

    if strm_code:
        strm_info = get_stream(conn,strm_code)
        if not strm_info:
            print(f"Invalid stream code {strm_code}")
            exit(1)
    # your code goes here
    cur.execute("""
        SELECT p.code, s.code
        FROM Programs AS p
        JOIN Program_enrolments AS pe ON pe.program = p.id
        JOIN Terms AS t ON pe.term = t.id
        JOIN Stream_enrolments AS se ON se.part_of = pe.id
        JOIN Streams AS s ON se.stream = s.id
        JOIN People AS peop ON peop.id = pe.student
        WHERE peop.zid = %s
        ORDER BY t.starting DESC
    """, (zid, ))

    row = cur.fetchone()

    if not prog_info:
        prog_info = get_program(row[0])

    if not strm_info:
        strm_info = get_stream(row[1])

    cur.execute("""
        SELECT p.family_name, p.given_names, p.id
        FROM People AS p
        WHERE p.zid = %s
    """, (zid, ))
    student = cur.fetchone()
    pid = student[2]
    print(f"{zid} {student[0]}, {student[1]}")
    print(f"{prog_code} {strm_code} {prog_info[2]}")

    cur.execute("""
        SELECT 1
        FROM Programs AS p
        JOIN Requirements AS r ON r.for_stream = p.id
        JOIN Streams AS s ON r.for_stream = s.id
        WHERE s.code = %s
    """, (strm_code, ))
    if not cur.fetchone():
        print(f"{strm_code} is not a stream in {prog_code}")
        sys.exit(1)

    cur.execute("""
        SELECT s.code, t.code, s.title, ce.mark, ce.grade, s.uoc
        FROM Courses AS c
        JOIN Course_enrolments AS ce ON ce.course = c.id
        JOIN Terms AS t ON t.id = c.term
        JOIN Subjects AS s ON s.id = c.subject
        WHERE ce.student = %s
        ORDER BY t.starting, s.code
    """, (pid,))

    rows = cur.fetchall()

    for code, term, title, mark, grade, uoc in rows:
        requirement = ""
        print(f"{code} {term} {title:<40s}{mark:>3} {grade:>2s}  {uoc:2d}uoc  {requirement}")
    cur.close()
    conn.close()
if __name__ == "__main__":
    main()
