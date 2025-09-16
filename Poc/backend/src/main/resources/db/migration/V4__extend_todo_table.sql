-- Add columns for user_id, due_date, tags, audit fields, soft-delete
ALTER TABLE todos
    ADD COLUMN IF NOT EXISTS user_id BIGINT,
    ADD COLUMN IF NOT EXISTS due_date TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS tags TEXT,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- add index for user_id + completed
CREATE INDEX IF NOT EXISTS idx_todos_user_completed ON todos (user_id, completed);
