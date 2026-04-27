CREATE OR REPLACE FUNCTION 
    Q3(_styleID integer) RETURNS setof text AS 
$$
DECLARE
    style_id integer;
    rec record;
    all_rated boolean := TRUE;
BEGIN
    
    SELECT s.id INTO style_id
    FROM Beer_Styles AS s
    WHERE s.id = _styleID;

    IF style IS NULL THEN 
        RETURN NEXT 'No such style';
        RETURN;
    END IF;

    FOR rec IN
        SELECT b.name AS beer, br.name AS brewer, r.score
        FROM Beers AS b
        JOIN Brewers AS br ON b.brewer = br.id
        LEFT JOIN Ratings AS r ON b.id = r.beer
        WHERE b.style = _styleID

    LOOP
        IF rec.score IS NULL THEN
            all_rated := FALSE;
            RETURN NEXT (rec.beer || ' ' || rec.brewer);
        END IF;
    END LOOP;

    IF all_rated THEN
        return NEXT 'Every beer has been rated';
        RETURN
    END IF;

END
$$ language plpgsql;
