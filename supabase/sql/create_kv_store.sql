-- Creates the key-value table used by the Edge Function
-- Run once via Supabase SQL editor if not using migrations
CREATE TABLE IF NOT EXISTS kv_store_3ea9e007 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);
