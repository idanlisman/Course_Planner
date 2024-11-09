USE CoursePlanner;

CREATE TABLE IF NOT EXISTS courses (
  UUID VARCHAR(255) PRIMARY KEY,
  ID VARCHAR(4),
  Number INT,
  Semester INT,
  Year INT
);