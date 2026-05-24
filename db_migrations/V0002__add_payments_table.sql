ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS payment_id VARCHAR(100);
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending';

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    yookassa_payment_id VARCHAR(100) UNIQUE NOT NULL,
    amount INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    paid_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_yookassa_id ON payments(yookassa_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
