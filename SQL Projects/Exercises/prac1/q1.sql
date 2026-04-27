CREATE OR REPLACE VIEW Q1(beer, avgscore, brewer) AS 
SELECT b.name AS beer, r.avgscore AS avgscore, br.name AS brewer
FROM Beers AS b
JOIN Brewers AS br ON b.brewer = br.id
JOIN (
    SELECT SUM(r.score) / COUNT(r.score)::numeric(10,2) AS avgscore, r.beer
    FROM Ratings AS r
    GROUP BY r.beer

) AS r
WHERE r.avgscore = (
    SELECT MAX(avgscore)
    FROM (
        SELECT SUM(r.score) / COUNT(r.score)::numeric(10,2) AS avgscore
        FROM Ratings
        GROUP BY beer
    )
) 
