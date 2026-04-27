create table x ( id integer primary key, name text unique );
create table y ( id integer primary key, x_id integer references x(id), defn text );

