CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES users(id),
    status VARCHAR(20) NOT NULL,
    total DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP NOT NULL,
    stripe_payment_intent_id VARCHAR(255)
);