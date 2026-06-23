-- Migration: Add module_order table
-- Created: 2026-06-24 00:07 WIB

-- Create module_order table
CREATE TABLE IF NOT EXISTS public.module_order (
  id BIGSERIAL PRIMARY KEY,
  "moduleId" INTEGER NOT NULL,
  "order" INTEGER NOT NULL,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  CONSTRAINT module_order_moduleId_key UNIQUE ("moduleId")
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_module_order_order ON public.module_order("order");

-- Enable Row Level Security
ALTER TABLE public.module_order ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow public read access
CREATE POLICY "Allow public read access" ON public.module_order
  FOR SELECT
  TO public
  USING (true);

-- Create policy: Allow authenticated users to insert/update
CREATE POLICY "Allow authenticated insert/update" ON public.module_order
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default order if not exists
INSERT INTO public.module_order ("moduleId", "order", "updatedAt")
VALUES 
  (1, 1, NOW()),
  (2, 2, NOW()),
  (3, 3, NOW()),
  (4, 4, NOW()),
  (5, 5, NOW()),
  (6, 6, NOW())
ON CONFLICT ("moduleId") DO NOTHING;

-- Grant permissions
GRANT SELECT ON public.module_order TO anon;
GRANT ALL ON public.module_order TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE module_order_id_seq TO authenticated;

COMMENT ON TABLE public.module_order IS 'Stores the display order of learning modules';
