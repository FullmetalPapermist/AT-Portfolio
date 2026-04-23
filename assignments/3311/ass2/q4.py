#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import re
import psycopg2

def main():
    if len(sys.argv) != 2:
        print("Usage: ./q4.py <filter_expr>")
        sys.exit(1)

    filter_expr = sys.argv[1]

    if not filter_expr.strip():
        print("Error: No filter conditions provided")
        sys.exit(1)

    valid_fields = {"code", "title", "uoc", "career"}
    parsed_clauses = []
    filter_lines = re.split(r';\s*', filter_expr.strip())
    for clause in filter_lines:
        if not ':' in clause:
            print(f'Error: missing a ":" in "{clause}"')
            sys.exit(1)
        field, expr = clause.split(':', 1)
        field = field.strip()
        expr = expr.strip()

        if field not in valid_fields:
            print(f'Error: Unknown field "{field}"')
            sys.exit(1)
        try:
            expr = re.sub(r"&&", "and", expr)
            expr = re.sub(r"\|\|", "or", expr)
            expr = re.sub(r"!", "not", expr)
            expr = re.sub(r"(?<![!<>=])=(?!=)", "==", expr)

            if field == "uoc":
                expr = re.sub(
                    r"([<>!=]=?|==)\s*'?(\d+)'?",
                    rf"subject['{field}'] \1 \2",
                    expr)
            else:
                # we replace e.g. '<query>' with:
                # '<query>' (in lower case) in subject['{<field>}'] in lower case
                expr = re.sub(
                    r"'([^']*)'",
                    lambda x: f"'{x.group(1).lower()}' in subject['{field}'].lower()",
                    expr)

            if re.search(
                r"\b(and|or|not)$", expr) or re.search(r"[><=!]=?$",
                expr.strip()):
                raise ValueError()

        except Exception:
            print(f'Error: The "{field}" expression is not evaluable')
            sys.exit(1)
        parsed_clauses.append((field, expr))

    conn = psycopg2.connect(dbname="mymyunsw")

    cur = conn.cursor()
    cur.execute("""
        SELECT s.code, s.title, s.uoc, s.career
        FROM Subjects as s
    """)

    filtered_subjects = []
    subjects = cur.fetchall()
    for subject in subjects:
        subject_dict = {
            "code": subject[0],
            "title": subject[1],
            "uoc": subject[2],
            "career": subject[3]
        }
        match = True
        for field, expr in parsed_clauses:
            try:
                # We evaluate the expression before using subject as subject dictionary
                if not eval(expr, {}, {"subject": subject_dict}):
                    match = False
                    break
            except:
                print(f'Error: The "{field}" expression is not evaluable')
                cur.close()
                conn.close()
                sys.exit(1)
        if match:
            title = subject_dict["title"]
            if len(title) > 55:
                title = title[:52] + "..."
            filtered_subjects.append(
                (subject_dict["code"],title, subject_dict["uoc"],
                subject_dict["career"]))
    if filtered_subjects:
        filtered_subjects.insert(0, ("Code", "Title", "UoC", "Career"))
    else:
        print("There are no subjects that match the conditions")
    for code, title, uoc, career in filtered_subjects:
        print(f"{code:<10}{title:<55}{uoc:>5}{career:>10}")
    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
