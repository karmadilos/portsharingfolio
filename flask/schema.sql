CREATE table IF NOT EXISTS User (
    id INT NOT NULL  AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY(id),
    UNIQUE(email)
);

CREATE table IF NOT EXISTS UserInfo (
    id INT NOT NULL  AUTO_INCREMENT,
    image_path VARCHAR(255) NOT NULL,
    info TEXT,
    user_id INT NOT NULL
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES User(id)
);