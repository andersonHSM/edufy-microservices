-- Create a dedicated user and database for the Enrollments API
CREATE USER enrollments_user WITH PASSWORD 'enrollments_password';
CREATE DATABASE enrollments_db OWNER enrollments_user;

-- Grant all privileges on the new database to the new user
GRANT ALL PRIVILEGES ON DATABASE enrollments_db TO enrollments_user;

-- Connect to the new database to create the schema
\c enrollments_db;

-- Create the schema for the enrollments service
CREATE SCHEMA IF NOT EXISTS enrollments AUTHORIZATION enrollments_user;
