-- Enable RLS on the KV store table (if not already enabled)
ALTER TABLE kv_store_3ea9e007 ENABLE ROW LEVEL SECURITY;

-- Create policies for public read/write (suitable for demo/testing)
-- For production, restrict these to authenticated users only

-- Allow anyone to read
CREATE POLICY "allow_read" ON kv_store_3ea9e007
  FOR SELECT USING (true);

-- Allow anyone to insert
CREATE POLICY "allow_insert" ON kv_store_3ea9e007
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update
CREATE POLICY "allow_update" ON kv_store_3ea9e007
  FOR UPDATE USING (true) WITH CHECK (true);

-- Allow anyone to delete
CREATE POLICY "allow_delete" ON kv_store_3ea9e007
  FOR DELETE USING (true);
