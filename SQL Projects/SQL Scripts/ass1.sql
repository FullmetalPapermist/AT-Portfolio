-- COMP3311 T2 2025 ass1.sql
--
-- Name: Alexander Tan
-- Student ID: z5477240

----------------------------------------------------------------
CREATE OR REPLACE VIEW Q1(player, born) AS
SELECT
    name,
    birthday
FROM
    Players
WHERE
    birthday = (SELECT MIN(birthday) FROM Players)
ORDER BY name ASC;

----------------------------------------------------------------
CREATE OR REPLACE VIEW Q2(team, country, total_matches) AS
SELECT DISTINCT
    team,
    country,
    COUNT(team) AS total_matches
FROM
    Teams t
    JOIN Involves i ON t.id=i.team
GROUP BY
    team,
    country
HAVING
    COUNT(team) >= 5

ORDER BY total_matches DESC
;

----------------------------------------------------------------
CREATE OR REPLACE VIEW Q3(player_id, player, goals_scored, first_goal_date) AS
SELECT
    p.id AS player_id,
    p.name AS player,
    COUNT(g.id) AS goals_scored,
    MIN(m.played_on) AS first_goal_date
FROM
    Players p
    JOIN GOALS g ON p.id = g.scored_by
    JOIN Matches m ON g.scored_in = m.id
GROUP BY
    p.id,
    p.name
HAVING
    COUNT(g.id) >= 6
ORDER BY
    COUNT(g.id) DESC,
    p.name ASC,
    p.id ASC
;

----------------------------------------------------------------
CREATE OR REPLACE VIEW Q4(player_id, player, yellow_cards, red_cards, discipline_score)  AS
SELECT
    p.id AS player_id,
    p.name AS player,
    SUM(CASE WHEN c.card_type = 'yellow' THEN 1 ELSE 0 END) AS yellow_cards,
    SUM(CASE WHEN c.card_type = 'red' THEN 1 ELSE 0 END) AS red_cards,
    SUM(CASE WHEN c.card_type = 'yellow' THEN 1 ELSE 0 END) * 2 +
    SUM(CASE WHEN c.card_type = 'red' THEN 1 ELSE 0 END) * 5 AS discipline_score
FROM
    Players p
    JOIN Cards c ON p.id = c.given_to
GROUP BY
    p.id,
    p.name
HAVING
    COUNT(c.id) >= 2
ORDER BY
    discipline_score DESC,
    player ASC,
    player_id ASC
;

----------------------------------------------------------------=

CREATE OR REPLACE FUNCTION get_home_goals(match_id INTEGER) RETURNS INTEGER
LANGUAGE plpgsql AS $$
DECLARE
    home_goals INTEGER;
BEGIN
    -- We use COALESCE to handle cases where there are no goals scored by home team
    -- MAX ensures we don't get return both home and away goals
    SELECT COALESCE(MAX(g.goals), 0)
    INTO home_goals
    FROM Involves i
    LEFT JOIN (
        SELECT g.scored_in AS match_id, p.member_of AS team_id, COUNT(*) AS goals
        FROM Goals g
        JOIN Players p ON g.scored_by = p.id
        GROUP BY g.scored_in, p.member_of
    ) g ON i.match = g.match_id AND i.team = g.team_id
    WHERE i.match = get_home_goals.match_id AND i.is_home;
    RETURN home_goals;
END;
$$;


CREATE OR REPLACE FUNCTION get_away_goals(match_id INTEGER) RETURNS INTEGER
LANGUAGE plpgsql AS $$
DECLARE
    away_goals INTEGER;
BEGIN
    SELECT COALESCE(MAX(g.goals), 0)
    INTO away_goals
    FROM Involves i
    LEFT JOIN (
        SELECT g.scored_in AS match_id, p.member_of AS team_id, COUNT(*) AS goals
        FROM Goals g
        JOIN Players p ON g.scored_by = p.id
        GROUP BY g.scored_in, p.member_of
    ) g ON i.match = g.match_id AND i.team = g.team_id
    WHERE i.match = get_away_goals.match_id AND NOT i.is_home;
    RETURN away_goals;
END;
$$;

CREATE OR REPLACE FUNCTION get_winner(match_id INTEGER) RETURNS VARCHAR(50)
LANGUAGE plpgsql AS $$
DECLARE
    result VARCHAR(50);
    home_goals INTEGER;
    away_goals INTEGER;
BEGIN
    home_goals := get_home_goals(match_id);
    away_goals := get_away_goals(match_id);
    IF home_goals > away_goals THEN
        SELECT MAX(t.country)::varchar(50) INTO result
        FROM Involves i
        JOIN Teams t ON i.team = t.id
        WHERE i.match = match_id AND i.is_home;
    ELSIF home_goals < away_goals THEN
        SELECT MAX(t.country)::varchar(50) INTO result
        FROM Involves i
        JOIN Teams t ON i.team = t.id
        WHERE i.match = match_id AND NOT i.is_home;
    ELSE
        result := NULL;
    END IF;
    RETURN result;
END;
$$;


CREATE OR REPLACE FUNCTION get_score(match_id INTEGER) RETURNS TEXT
LANGUAGE plpgsql AS $$
DECLARE
    result TEXT;
    home_goals INTEGER;
    away_goals INTEGER;
BEGIN
    home_goals := get_home_goals(match_id);
    away_goals := get_away_goals(match_id);
    result := home_goals::varchar(50) || '-' || away_goals::varchar(50);
    RETURN result;
END;
$$;



CREATE OR REPLACE FUNCTION get_total_goals(match_id INTEGER) RETURNS INTEGER
LANGUAGE plpgsql AS $$
DECLARE
    total_goals INTEGER;
BEGIN
    total_goals := get_home_goals(match_id) + get_away_goals(match_id);
    RETURN total_goals;
END;
$$;

CREATE OR REPLACE VIEW Q5(match_id, home_team, away_team, goals_for_each_team) AS
SELECT
    m.id AS match_id,
    MAX(CASE WHEN i.is_home = TRUE THEN t.country END)::varchar(50) AS home_team,
    MAX(CASE WHEN i.is_home = FALSE THEN t.country END)::varchar(50) AS away_team,
    get_score(m.id) AS goals_for_each_team
FROM
    Matches m
    JOIN Involves i ON m.id = i.match
    JOIN Teams t ON i.team = t.id
GROUP BY
    m.id
HAVING
    -- Use get_score to get the score string, but still need to filter by total goals
    get_total_goals(m.id) > 4
ORDER BY
    m.id ASC
;

----------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_goal_difference(match_id INTEGER) RETURNS INTEGER
LANGUAGE plpgsql AS $$
DECLARE
    home_goals INTEGER;
    away_goals INTEGER;
BEGIN
    home_goals := get_home_goals(match_id);
    away_goals := get_away_goals(match_id);
    RETURN home_goals - away_goals;
END;
$$;


CREATE OR REPLACE VIEW Q6(match_id, score, yellow, red) AS
SELECT
    i.match AS match_id,
    get_score(i.match) AS score,
    SUM(CASE WHEN c.card_type = 'yellow' THEN 1 ELSE 0 END) AS yellow,
    SUM(CASE WHEN c.card_type = 'red' THEN 1 ELSE 0 END) AS red
FROM
    Involves i
    LEFT JOIN (
        SELECT
            c.given_in as given_in,
            p.member_of as team_id,
            c.card_type as card_type
        FROM
            Cards c
            JOIN Players p ON c.given_to = p.id
    ) c ON i.match = c.given_in AND i.team = c.team_id
GROUP BY
    i.match
HAVING
    get_goal_difference(i.match) <= 1
    AND SUM(CASE WHEN c.card_type = 'yellow' THEN 1 ELSE 0 END) >= 1
    AND SUM(CASE WHEN c.card_type = 'red' THEN 1 ELSE 0 END) >= 1
ORDER BY
    COUNT(c.given_in) DESC,
    i.match ASC
;

----------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_halftime_score(match_id INTEGER) RETURNS TEXT
LANGUAGE plpgsql AS $$
DECLARE
    result TEXT;
    home_goals INTEGER;
    away_goals INTEGER;
BEGIN
    -- Home goals at halftime
    SELECT COALESCE(MAX(g.halftime_goals), 0)
    INTO home_goals
    FROM Involves i
    LEFT JOIN (
        SELECT g.scored_in AS match_id, p.member_of AS team_id, COUNT(*) AS halftime_goals
        FROM Goals g
        JOIN Players p ON g.scored_by = p.id
        WHERE g.time_scored <= 45
        GROUP BY g.scored_in, p.member_of
    ) g ON i.match = g.match_id AND i.team = g.team_id
    WHERE i.match = get_halftime_score.match_id AND i.is_home;

    -- Away goals at halftime
    SELECT COALESCE(MAX(g.halftime_goals), 0)
    INTO away_goals
    FROM Involves i
    LEFT JOIN (
        SELECT g.scored_in AS match_id, p.member_of AS team_id, COUNT(*) AS halftime_goals
        FROM Goals g
        JOIN Players p ON g.scored_by = p.id
        WHERE g.time_scored <= 45
        GROUP BY g.scored_in, p.member_of
    ) g ON i.match = g.match_id AND i.team = g.team_id
    WHERE i.match =  get_halftime_score.match_id AND NOT i.is_home;

    result := home_goals::varchar(50) || '-' || away_goals::varchar(50);
    RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION get_halftime_winner(match_id INTEGER) RETURNS VARCHAR(50)
LANGUAGE plpgsql AS $$
DECLARE
    result VARCHAR(50);
    home_goals INTEGER;
    away_goals INTEGER;
BEGIN
    -- Home goals at halftime
    SELECT COALESCE(MAX(g.halftime_goals), 0)
    INTO home_goals
    FROM Involves i
    LEFT JOIN (
        SELECT g.scored_in AS match_id, p.member_of AS team_id, COUNT(*) AS halftime_goals
        FROM Goals g
        JOIN Players p ON g.scored_by = p.id
        WHERE g.time_scored <= 45
        GROUP BY g.scored_in, p.member_of
    ) g ON i.match = g.match_id AND i.team = g.team_id
    WHERE i.match = get_halftime_winner.match_id AND i.is_home;

    -- Away goals at halftime
    SELECT COALESCE(MAX(g.halftime_goals), 0)
    INTO away_goals
    FROM Involves i
    LEFT JOIN (
        SELECT g.scored_in AS match_id, p.member_of AS team_id, COUNT(*) AS halftime_goals
        FROM Goals g
        JOIN Players p ON g.scored_by = p.id
        WHERE g.time_scored <= 45
        GROUP BY g.scored_in, p.member_of
    ) g ON i.match = g.match_id AND i.team = g.team_id
    WHERE i.match = get_halftime_winner.match_id AND NOT i.is_home;

    IF home_goals > away_goals THEN
        SELECT MAX(t.country)::varchar(50) INTO result
        FROM Involves i
        JOIN Teams t ON i.team = t.id
        WHERE i.match = get_halftime_winner.match_id AND i.is_home;
    ELSIF home_goals < away_goals THEN
        SELECT MAX(t.country)::varchar(50) INTO result
        FROM Involves i
        JOIN Teams t ON i.team = t.id
        WHERE i.match = get_halftime_winner.match_id AND NOT i.is_home;
    ELSE
        result := NULL;
    END IF;
    RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION is_comeback(match_id INTEGER) RETURNS BOOLEAN
LANGUAGE plpgsql AS $$
DECLARE
    halftime_winner VARCHAR(50);
    fulltime_winner VARCHAR(50);
BEGIN
    SELECT get_halftime_winner(match_id) INTO halftime_winner;
    SELECT get_winner(match_id) INTO fulltime_winner;
    CASE WHEN halftime_winner IS NOT NULL AND fulltime_winner IS NOT NULL THEN
        RETURN halftime_winner <> fulltime_winner;
    ELSE
        RETURN FALSE;
    END CASE;
END;
$$;

CREATE OR REPLACE VIEW Q7(match_id, winning_team, halftime_score, fulltime_score) AS
SELECT
    i.match AS match_id,
    get_winner(i.match) AS winning_team,
    get_halftime_score(i.match)::varchar(50) AS halftime_score,
    get_score(i.match)::varchar(50) AS fulltime_score
FROM
    Involves i
    JOIN Teams t ON i.team = t.id
    LEFT JOIN (
        SELECT
            g.scored_in AS match_id,
            p.member_of AS team_id,
            COUNT(*) FILTER (WHERE g.time_scored <= 45) AS halftime_goals,
            COUNT(*) AS goals
        FROM
            Goals g
            JOIN Players p ON g.scored_by = p.id
        GROUP BY
            g.scored_in,
            p.member_of
    ) g ON i.match = g.match_id AND i.team = g.team_id
GROUP BY
    i.match

HAVING
    is_comeback(i.match) = TRUE

ORDER BY
    i.match ASC
;

----------------------------------------------------------------

CREATE OR REPLACE FUNCTION Q8(search_term text) RETURNS SETOF TEXT
LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.name || ' | ' || t.country || ' | ' || p.position || ' | ' ||
        COUNT(DISTINCT g.id) || ' | ' || COUNT(DISTINCT c.id)
    FROM
        Players p
        JOIN Teams t ON p.member_of = t.id
        LEFT JOIN Goals g ON p.id = g.scored_by
        LEFT JOIN Cards c ON p.id = c.given_to
    WHERE
    -- Searching for players whose name matches the regex pattern (case insensitive)
        p.name ILIKE '%' || search_term || '%'
    GROUP BY
        p.name, t.country, p.position, p.id
    ORDER BY
        COUNT(DISTINCT g.id) DESC,
        p.name ASC,
        p.id ASC;
END;
$$;

----------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_match_header(match_id INTEGER) RETURNS TEXT
LANGUAGE plpgsql AS $$
DECLARE
    home_country TEXT;
    home_id INTEGER;
    away_country TEXT;
    away_id INTEGER;
    city TEXT;
    played_on DATE;
BEGIN
    SELECT m.city, m.played_on INTO city, played_on
    FROM Matches m
    WHERE m.id = match_id;

    SELECT t.country, t.id INTO home_country, home_id
    FROM Involves i
    JOIN Teams t ON i.team = t.id
    WHERE i.match = match_id AND i.is_home;

    SELECT t.country, t.id INTO away_country, away_id
    FROM Involves i
    JOIN Teams t ON i.team = t.id
    WHERE i.match = match_id AND NOT i.is_home;

    RETURN '[' || city || ', ' || played_on || '] ' ||
               home_country || ' (Team ' || home_id || ') vs ' ||
               away_country || ' (Team ' || away_id || ')' || E'\n';
END;
$$;


CREATE OR REPLACE FUNCTION get_match_summary(match_id INTEGER) RETURNS TEXT
LANGUAGE plpgsql AS $$
DECLARE
    summary TEXT := '';
    rec RECORD;
BEGIN
    FOR rec IN
        SELECT * FROM (
            SELECT
                g.time_scored AS minute,
                'Goal (' || g.rating || ')' AS event_type,
                p.name AS player_name,
                t.country AS country,
                p.position AS position
            FROM Goals g
            JOIN Players p ON g.scored_by = p.id
            JOIN Teams t ON p.member_of = t.id
            WHERE g.scored_in = match_id

            UNION ALL

            SELECT
                c.time_given AS minute,
                'Card (' || c.card_type || ')' AS event_type,
                p.name AS player_name,
                t.country AS country,
                p.position AS position
            FROM Cards c
            JOIN Players p ON c.given_to = p.id
            JOIN Teams t ON p.member_of = t.id
            WHERE c.given_in = match_id
        ) events
        ORDER BY minute ASC
    LOOP
        summary := summary ||
            'Minute ' || rec.minute || ': ' || rec.event_type || ' - ' ||
            rec.player_name || ' (' || rec.country || ', ' || rec.position || ')' || E'\n';
    END LOOP;
    IF summary = '' THEN
        summary := 'No goals or cards occurred in this match. ' || E'\n';
    END IF;
    RETURN summary;
END;
$$;



CREATE OR REPLACE FUNCTION get_winner_text(match_id INTEGER) RETURNS TEXT
LANGUAGE plpgsql AS $$
DECLARE
    winner TEXT;
BEGIN
    winner := get_winner(match_id);
    IF winner IS NOT NULL THEN
        RETURN winner || ' wins!'|| E'\n';
    ELSE
        RETURN 'The match ended in a draw.' || E'\n';
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION get_win_red_card(match_id INTEGER) RETURNS TEXT
LANGUAGE plpgsql AS $$
DECLARE
    is_win_red_card BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM
            Cards c
            JOIN Players p ON c.given_to = p.id
        WHERE
            c.given_in = get_win_red_card.match_id AND
            c.card_type = 'red' AND
            p.member_of = (
                SELECT t.id
                FROM Involves i
                JOIN Teams t ON i.team = t.id
                WHERE i.match = match_id AND t.country = get_winner(match_id)
                LIMIT 1
            )
    )
    INTO is_win_red_card;
    IF is_win_red_card THEN
        RETURN get_winner(match_id) || ' won despite ending up with less than 11 players!' || E'\n';
    ELSE
        RETURN '';
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION get_comeback_text(match_id INTEGER) RETURNS TEXT
LANGUAGE plpgsql AS $$
BEGIN
    IF is_comeback(match_id) THEN
        RETURN 'A stunning comeback occurred!' || E'\n';
    ELSE
        RETURN '';
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION Q9(_match_id INTEGER) RETURNS TEXT
LANGUAGE plpgsql AS $$
DECLARE
    summary TEXT;
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM Matches m
        WHERE m.id = _match_id
    ) THEN
        RETURN 'Match ID ' || _match_id || ' not found.';
    END IF;
    summary := get_match_header(_match_id) ||
               'Half-time: ' || get_halftime_score(_match_id) || E'\n' ||
               'Full-time: ' || get_score(_match_id) || E'\n' ||
               get_match_summary(_match_id) ||
               get_winner_text(_match_id) ||
               get_win_red_card(_match_id) ||
               get_comeback_text(_match_id);

    RETURN summary;
END;
$$;
