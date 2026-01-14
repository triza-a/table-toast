-- Create menu_items table
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  ingredients TEXT,
  allergens TEXT[] DEFAULT '{}',
  available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory table
CREATE TABLE public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ingredient TEXT NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 10,
  unit TEXT NOT NULL DEFAULT 'kg',
  status TEXT NOT NULL DEFAULT 'good',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create staff table
CREATE TABLE public.staff (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  shift TEXT NOT NULL,
  contact TEXT,
  status TEXT NOT NULL DEFAULT 'present',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  items JSONB NOT NULL DEFAULT '[]',
  special_instructions TEXT,
  allergies TEXT[] DEFAULT '{}',
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (restaurant data visible to all staff)
CREATE POLICY "Anyone can view menu items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Anyone can view inventory" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "Anyone can view staff" ON public.staff FOR SELECT USING (true);
CREATE POLICY "Anyone can view orders" ON public.orders FOR SELECT USING (true);

-- Create policies for insert/update/delete (for now allow all authenticated users)
CREATE POLICY "Authenticated users can insert menu items" ON public.menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update menu items" ON public.menu_items FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete menu items" ON public.menu_items FOR DELETE USING (true);

CREATE POLICY "Authenticated users can insert inventory" ON public.inventory FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update inventory" ON public.inventory FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete inventory" ON public.inventory FOR DELETE USING (true);

CREATE POLICY "Authenticated users can insert staff" ON public.staff FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update staff" ON public.staff FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete staff" ON public.staff FOR DELETE USING (true);

CREATE POLICY "Authenticated users can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete orders" ON public.orders FOR DELETE USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_staff_updated_at
  BEFORE UPDATE ON public.staff
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE public.staff;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Insert sample menu items
INSERT INTO public.menu_items (name, price, category, ingredients, allergens, available) VALUES
  ('Margherita Pizza', 12.99, 'Main Course', 'Tomato, Mozzarella, Basil', ARRAY['Gluten', 'Dairy'], true),
  ('Caesar Salad', 8.99, 'Appetizer', 'Lettuce, Parmesan, Croutons, Caesar Dressing', ARRAY['Gluten', 'Dairy', 'Eggs'], true),
  ('Pasta Carbonara', 14.99, 'Main Course', 'Pasta, Bacon, Eggs, Parmesan', ARRAY['Gluten', 'Dairy', 'Eggs'], false),
  ('Grilled Chicken', 16.99, 'Main Course', 'Chicken breast, Herbs, Olive oil', ARRAY[]::TEXT[], true),
  ('Tiramisu', 6.99, 'Dessert', 'Mascarpone, Coffee, Ladyfingers', ARRAY['Gluten', 'Dairy', 'Eggs'], true),
  ('Tomato Soup', 5.99, 'Appetizer', 'Tomatoes, Cream, Basil', ARRAY['Dairy'], true);

-- Insert sample inventory
INSERT INTO public.inventory (ingredient, current_stock, min_stock, unit, status) VALUES
  ('Tomatoes', 25, 20, 'kg', 'good'),
  ('Mozzarella', 8, 15, 'kg', 'low'),
  ('Olive Oil', 12, 10, 'L', 'good'),
  ('Chicken Breast', 5, 10, 'kg', 'critical'),
  ('Pasta', 30, 20, 'kg', 'good'),
  ('Eggs', 40, 50, 'pcs', 'low');

-- Insert sample staff
INSERT INTO public.staff (name, role, shift, contact, status) VALUES
  ('John Doe', 'Head Chef', 'Morning', '555-0101', 'present'),
  ('Jane Smith', 'Sous Chef', 'Morning', '555-0102', 'present'),
  ('Mike Johnson', 'Waiter', 'Evening', '555-0103', 'leave'),
  ('Sarah Williams', 'Waiter', 'Morning', '555-0104', 'present'),
  ('Tom Brown', 'Manager', 'Full Day', '555-0105', 'present');

-- Insert sample orders
INSERT INTO public.orders (table_number, status, items, special_instructions, allergies, subtotal, tax, total) VALUES
  (5, 'pending', '[{"name": "Margherita Pizza", "quantity": 2, "price": 12.99}, {"name": "Caesar Salad", "quantity": 1, "price": 8.99}]', 'Extra cheese on pizza', ARRAY['Nuts'], 34.97, 4.55, 39.52),
  (3, 'preparing', '[{"name": "Grilled Chicken", "quantity": 1, "price": 16.99}, {"name": "Tomato Soup", "quantity": 2, "price": 5.99}]', NULL, ARRAY[]::TEXT[], 28.97, 3.77, 32.74),
  (8, 'ready', '[{"name": "Pasta Carbonara", "quantity": 1, "price": 14.99}, {"name": "Tiramisu", "quantity": 1, "price": 6.99}]', 'No onions', ARRAY['Shellfish'], 21.98, 2.86, 24.84);