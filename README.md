## Getting Started

- Setup Mysql locally `docker-compose up`

- Run app locally `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Setup

CREATE TABLE <Table-Name> (
    UUID VARCHAR(255) PRIMARY KEY,
    ID VARCHAR(4),
    Number INT,
    Semester INT,
    Year INT
);
