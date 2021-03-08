CREATE table IF NOT EXISTS users (
    id INT NOT NULL  AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    report_count TINYINT DEFAULT 0
    PRIMARY KEY(id),
    UNIQUE(email)
);

CREATE table IF NOT EXISTS userinfo (
    id INT NOT NULL  AUTO_INCREMENT,
    image_path VARCHAR(255) NOT NULL,
    info TEXT,
    user_id INT NOT NULL,
    PRIMARY KEY(id),
    UNIQUE(user_id),
    FOREIGN KEY(user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE table IF NOT EXISTS educations (
    id INT NOT NULL  AUTO_INCREMENT,
    college VARCHAR(64) NOT NULL,
    major VARCHAR(64) NOT NULL,
    degree TINYINT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE table IF NOT EXISTS awards (
    id INT NOT NULL  AUTO_INCREMENT,
    title VARCHAR(64) NOT NULL,
    description TEXT,
    user_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE table IF NOT EXISTS projects (
    id INT NOT NULL  AUTO_INCREMENT,
    title VARCHAR(64) NOT NULL,
    description TEXT,
    startdate DATE NOT NULL,
    enddate DATE NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE table IF NOT EXISTS certificates (
    id INT NOT NULL  AUTO_INCREMENT,
    title VARCHAR(64) NOT NULL,
    description TEXT,
    acquisition_date DATE NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE table IF NOT EXISTS blacklists (
    id INT NOT NULL  AUTO_INCREMENT,
    user_id INT NOT NULL,
    reported_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
    ON DELETE CASCADE,
    FOREIGN KEY(reported_id) REFERENCES users(id)
    ON DELETE CASCADE
);