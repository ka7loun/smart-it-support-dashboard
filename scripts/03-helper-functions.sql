-- Create a helper function to get table names
CREATE OR REPLACE FUNCTION get_table_names()
RETURNS TABLE(table_name text) AS $$
BEGIN
  RETURN QUERY
  SELECT t.table_name::text
  FROM information_schema.tables t
  WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_table_names() TO authenticated;
GRANT EXECUTE ON FUNCTION get_table_names() TO anon;
