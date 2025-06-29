-- Create the SMP database
CREATE DATABASE smp;

-- Connect to the SMP database
\c smp;

-- Create the 'users' table
CREATE TABLE public.users (
    username VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Create the 'accounts' table with a foreign key reference to 'users' table
CREATE TABLE public.accounts (
    username VARCHAR(50) PRIMARY KEY,
    facebook VARCHAR(100),
    instagram VARCHAR(100),
    access_token VARCHAR(300) NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username)
);

-- Create the 'scheduled_posts' table with a foreign key reference to 'users' table
CREATE TABLE public.scheduled_posts (
    jobid VARCHAR PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    imageurl VARCHAR,
    caption VARCHAR,
    "time" TIMESTAMP NOT NULL,
    is_posted BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (username) REFERENCES users(username)
);

-- Create Trigger Function to notify on changes
CREATE OR REPLACE FUNCTION notify_scheduled_posts_change()
  RETURNS trigger AS
$BODY$
    DECLARE
        user_rows JSON;
    BEGIN
        IF TG_OP = 'DELETE' THEN
            -- For DELETE operation, use OLD instead of NEW
            SELECT json_agg(row_to_json(sub))
            INTO user_rows
            FROM (
                SELECT *
                FROM scheduled_posts r
                WHERE r.username = OLD.username
                ORDER BY r.is_posted ASC, r.time ASC
            ) sub;
        ELSE
            SELECT json_agg(row_to_json(sub))
            INTO user_rows
            FROM (
                SELECT *
                FROM scheduled_posts r
                WHERE r.username = NEW.username
                ORDER BY r.is_posted ASC, r.time ASC
            ) sub;
        END IF;

        RAISE NOTICE 'Data being sent: %', user_rows::text;

        PERFORM pg_notify('scheduled_posts_change', user_rows::text);
        RETURN NEW;
    END; 
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;

-- Create Trigger to notify on changes
CREATE TRIGGER notify_scheduled_posts_change_insert
  AFTER INSERT OR UPDATE
  ON scheduled_posts
  FOR EACH ROW
  EXECUTE PROCEDURE notify_scheduled_posts_change();

CREATE TRIGGER notify_scheduled_posts_change_delete
  AFTER DELETE
  ON scheduled_posts
  FOR EACH ROW
  EXECUTE PROCEDURE notify_scheduled_posts_change();