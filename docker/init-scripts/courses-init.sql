CREATE USER courses_user WITH PASSWORD 'courses_password';
CREATE DATABASE courses_db WITH OWNER courses_user;
GRANT ALL PRIVILEGES ON DATABASE courses_db TO courses_user;

CREATE SCHEMA IF NOT EXISTS courses;