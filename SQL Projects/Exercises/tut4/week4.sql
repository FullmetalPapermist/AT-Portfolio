SELECT DISTINCT
    s.sname, p.colour

FROM Suppliers s
    JOIN Catalog c ON c.sid = s.sid
    JOIN Parts p ON c.pid = p.pid

WHERE
    colour = 'red' OR colour = 'green'

ORDER BY s.sname
;

SELECT DISTINCT
    s.sid

FROM Suppliers s
    JOIN Catalog c ON c.sid = s.sid
    JOIN Parts p ON c.pid = p.pid

WHERE
    colour = 'green'

INTERSECT

SELECT DISTINCT
    s.sid

FROM Suppliers s
    JOIN Catalog c ON c.sid = s.sid
    JOIN Parts p ON c.pid = p.pid

WHERE
    colour = 'red'

;

SELECT DISTINCT
    s.sid,
    COUNT(DISTINCT p.pid) AS num_parts
FROM Suppliers s
    JOIN Catalog c ON c.sid = s.sid
    JOIN Parts p ON c.pid = p.pid

GROUP BY s.sid

HAVING COUNT(DISTINCT p.pid) = (SELECT COUNT(DISTINCT p.pid) FROM Parts p)
;