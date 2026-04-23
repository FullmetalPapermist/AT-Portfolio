import psycopg2
import sys

if len(sys.argv) != 2:
    print("more than 1 cmd line arg")
    exit(1)

style_part = sys.argv[1]

try:
   conn = psycopg2.connect("dbname=MyDB")
except:
   print("Can't open database")
   exit()

cur = conn.cursor()
query = """
SELECT s.id
FROM Beer_Styles AS s
WHERE s.name ILIKE %s
"""
cur.execute(query, [style_part])

rows = cur.fetchall()

if len(rows) == 0:
    print("No matching style")
    exit()

if len(rows) > 1:
    print("Style is ambiguous")
    exit()

style = rows[0][0]

query = """
SELECT br.name, b.name, a.avgscore
FROM Beers AS b
JOIN Brewers AS br ON br.id = b.brewer 
JOIN (
    SELECT AVG(r.score) AS avgscore, b.id AS beer
    FROM Ratings AS r
    JOIN Beers AS b ON b.id = r.beer
    GROUP BY b.id
) AS a
WHERE b.style = %s AND a.avgscore = (
    SELECT MAX(avgscore)
    FROM (
        SELECT AVG(r.score)
        FROM Ratings AS r2
        JOIN Beers AS b2 ON b2.id = r2.beer
        GROUP BY b2.id
        WHERE b2.style = %s
    )
)
ORDER BY b.name;
"""
cur.execute(query, [style])
rows = cur.fetchall()
if len(rows) == 0:
    print("- no beers from this brewer in this style")
    exit()

for brewer, beer, avgscore in rows:
    print(f"{brewer} {beer} {avgscore:.2f}")


cur.close()
conn.close()