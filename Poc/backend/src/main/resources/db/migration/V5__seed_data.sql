-- Insert sample users
INSERT INTO users (username, email) VALUES
('alice', 'alice@example.com') ON CONFLICT DO NOTHING;
INSERT INTO users (username, email) VALUES
('bob', 'bob@example.com') ON CONFLICT DO NOTHING;

-- Insert sample todos referencing users
INSERT INTO todos (title, completed, todo_order, user_id, tags, created_at)
VALUES
('Buy milk', false, 0, (SELECT id FROM users WHERE username='alice'), 'shopping,groceries', now())
ON CONFLICT DO NOTHING;

INSERT INTO todos (title, completed, todo_order, user_id, tags, created_at)
VALUES
('Write report', false, 1, (SELECT id FROM users WHERE username='bob'), 'work', now())
ON CONFLICT DO NOTHING;
