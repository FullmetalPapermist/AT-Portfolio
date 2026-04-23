#!/usr/bin/env python3
import sys
import re
import psycopg2

def main():
    if len(sys.argv) != 2:
        print("Usage: ./q3.py <zID>")
        sys.exit(1)
    zid = sys.argv[1]
    if zid[0] == 'z':
        zid = zid[1:8]
    digits = re.compile("^\d{7}$")
    if not digits.match(zid):
        print("Invalid zID")
        exit(1)
    conn = psycopg2.connect(dbname="mymyunsw")
    cur = conn.cursor()

    cur.execute("""
    SELECT p.id, p.family_name, p.given_names
    FROM People as p
    WHERE p.zid = %s
    """, (zid,))

    data = cur.fetchone()
    if not data:
        print(f"No one has the zID {zid}.")
        cur


    student_id, family_name, given_names = data


    cur.execute("""
        SELECT s.id
        FROM Students as s
        WHERE s.id = %s
    """, (student_id,))

    if not cur.fetchone():
        print(f"{zid} {family_name}, {given_names} is a staff member, and not a student.")
        cur.close()
        conn.close()
        sys.exit(1)

    cur.execute("""
        SELECT stu.status, c.name, prog.code, prog.name, pe.id
        FROM People as p
        JOIN Students AS stu ON stu.id = p.id
        JOIN Countries AS c ON p.origin = c.id
        JOIN Program_enrolments as pe ON pe.student = stu.id
        JOIN Programs as prog ON prog.id = pe.program
        JOIN Terms as t ON pe.term = t.id
        WHERE stu.id = %s
        ORDER BY t.starting DESC, pe.id DESC
    """, (student_id,))

    data = cur.fetchone()
    if not data:
        print("no streams")
        cur.close()
        conn.close()
        sys.exit(1)

    status, country, program_code, program_name, program_id = data

    student_type = "Domestic"
    if status == "INTL":
        student_type = "International"


    cur.execute("""
        SELECT s.code
        FROM Stream_enrolments as se
        JOIN Streams as s ON s.id = se.stream
        WHERE se.part_of = %s
        ORDER BY s.code
    """, (program_id,))

    rows = cur.fetchall()
    stream_codes = [row[0] for row in rows]

    streams_str = ' and '.join(stream_codes)

    print(f"{zid} {family_name}, {given_names} ({student_type} student from {country})")
    print(f"{program_code} {program_name} ({streams_str})")

    cur.execute("""
        SELECT s.code, t.code, s.title, ce.mark, ce.grade, s.uoc
        FROM Courses AS c
        JOIN Course_enrolments AS ce ON ce.course = c.id
        JOIN Terms AS t ON t.id = c.term
        JOIN Subjects AS s ON s.id = c.subject
        WHERE ce.student = %s
        ORDER BY t.starting, s.code
    """, (student_id,))

    grade_labels = {
        "A": "Xuoc", "B": "Xuoc", "C": "Xuoc", "D": "Xuoc",
        "A+": "Xuoc", "B+": "Xuoc", "C+": "Xuoc", "D+": "Xuoc",
        "A+": "Xuoc", "B-": "Xuoc", "C-": "Xuoc", "D-": "Xuoc", "HD": "Xuoc",
        "DN": "Xuoc", "CR": "Xuoc", "PS": "Xuoc", "XE": "Xuoc",
        "T": "Xuoc", "SY": "Xuoc", "EC": "Xuoc", "RC": "Xuoc",

        "AF": " fail", "FL": " fail", "UF": " fail", "E": " fail", "F": " fail",
        "E+": " fail", "E-": " fail", "F+": " fail", "F-": " fail"
    }

    wam_dict = {
        "HD": True, "DN": True, "CR": True, "PS": True,

        "AF": True, "FL": True, "UF": True, "E": True, "F": True,
        "E+": True, "E-": True, "F+": True, "F-": True
        }

    rows = cur.fetchall()
    for subject_code, term, subject_title, mark, grade, UOC in rows:
        mark_str = f"{mark:>3}" if mark is not None else " -"
        title_str = subject_title[:40]

        grade_label = grade_labels.get(grade, " unrs")
        if grade_label == "Xuoc":
            grade_label = f"{UOC:2d}uoc"
        if grade:
            grade_str = f"{grade:>2s}"
        else:
            grade_str = " -"
            grade_label = ""
        print(f"{subject_code} {term} {title_str:<40s}{mark_str:>3} {grade_str:>2}  {grade_label}")

    cur.execute("""
        SELECT
            SUM(CASE WHEN grade IN ('HD', 'DN', 'CR', 'PS', 'XE', 'SY', 'EC', 'RC', 'A', 'B', 'C', 'D') THEN s.uoc ELSE 0 END),
            ROUND(
                SUM(CASE WHEN grade IN ('HD', 'DN', 'CR', 'PS', 'AF', 'FL', 'UF', 'E', 'F', 'E-', 'E+') THEN COALESCE(ce.mark, 0) * s.uoc ELSE 0 END)::numeric
                /
                NULLIF(SUM(CASE WHEN grade IN ('HD', 'DN', 'CR', 'PS', 'AF', 'FL', 'UF', 'E', 'F', 'E-', 'E+') THEN s.uoc ELSE 0 END), 0),
            3
        )

        FROM Courses AS c
        JOIN Course_enrolments AS ce ON ce.course = c.id
        JOIN Subjects AS s ON s.id = c.subject
        WHERE ce.student = %s
    """, (student_id,))

    total_achieved_uoc, wam = cur.fetchone()

    if wam is None:
        print(f"Total achieved UOC = {total_achieved_uoc}, Can't compute WAM")
    else:
        print(f"Total achieved UOC = {total_achieved_uoc}, WAM = {wam}")

    cur.close()
    conn.close()

if __name__ == "__main__":
    main()