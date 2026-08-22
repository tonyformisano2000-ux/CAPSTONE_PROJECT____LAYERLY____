CREATE TABLE users (
id BIGSERIAL PRIMARY KEY,
first_name VARCHAR(255) NOT NULL,
last_name VARCHAR(255) NOT NULL,
 email VARCHAR(255) NOT NULL UNIQUE,
password_hash VARCHAR(255) NOT NULL,
role VARCHAR(20) NOT NULL,
profile_photo_url VARCHAR(255),
background_photo_url VARCHAR(255),
location VARCHAR(255),
stripe_customer_id VARCHAR(255),
created_at TIMESTAMP NOT NULL,
iban VARCHAR(255),
designer_level VARCHAR(20)
);