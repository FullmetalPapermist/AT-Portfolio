CREATE OR REPLACE VIEW Q2(style, beer, brewer, avgscore) AS
SELECT s.name AS style, b.name AS beer, br.name AS brewer, r.avgscore AS avgscore
FROM Beers AS b
JOIN Brewers AS br ON b.brewer = br.id
JOIN Beer_Styles AS s ON b.style = s.id 
JOIN (
    SELECT AVG(r.score) AS avgscore, b.id AS beer
    FROM Ratings AS r 
    JOIN Beers AS b ON r.beer = b.id
    GROUP BY b.id
) AS r ON b.id = r.beer
WHERE r.avgscore = 

(   
    SELECT MAX(r3.avgscore)
    FROM (
        SELECT AVG(r2.score) AS avgscore, b2.id
        FROM Ratings AS r2
        JOIN Beers AS b2 ON r2.beer = b2.id
        WHERE s.style = b2.style
        GROUP BY b2.id
    ) AS r3
)
ORDER BY style, beer;