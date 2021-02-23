Drop TABLE IF EXISTS users;
CREATE table users (
    id INT NOT NULL  AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY(id),
    UNIQUE(email)
);

