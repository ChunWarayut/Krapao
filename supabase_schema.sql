-- Krapao Supabase Schema Setup
-- Run this script in the Supabase SQL Editor to create the necessary tables and policies.

-- 1. Pockets Table
CREATE TABLE IF NOT EXISTS public.pockets (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    balance NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    type TEXT CHECK (type IN ('income', 'expense')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id TEXT PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    pocket_id TEXT REFERENCES public.pockets(id) ON DELETE CASCADE,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')),
    note TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Goals Table
CREATE TABLE IF NOT EXISTS public.goals (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    emoji TEXT,
    target_amount NUMERIC NOT NULL,
    current_amount NUMERIC DEFAULT 0,
    deadline TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) Policies
-- Enable RLS for all tables
ALTER TABLE public.pockets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Pockets Policies
CREATE POLICY "Users can only see their own pockets" ON public.pockets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own pockets" ON public.pockets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pockets" ON public.pockets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own pockets" ON public.pockets FOR DELETE USING (auth.uid() = user_id);

-- Categories Policies
CREATE POLICY "Users can only see their own categories" ON public.categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own categories" ON public.categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own categories" ON public.categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own categories" ON public.categories FOR DELETE USING (auth.uid() = user_id);

-- Transactions Policies
CREATE POLICY "Users can only see their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own transactions" ON public.transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own transactions" ON public.transactions FOR DELETE USING (auth.uid() = user_id);

-- Goals Policies
CREATE POLICY "Users can only see their own goals" ON public.goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own goals" ON public.goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON public.goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON public.goals FOR DELETE USING (auth.uid() = user_id);
-- 5. Insert Default Data (Required for initial sync)
-- Use a special 'system' UUID or just leave user_id as NULL if policies allow, 
-- but since RLS is enabled, we should probably tell the user to replace 'YOUR_USER_ID' 
-- or use a trigger. 

-- HOWEVER, since the app sends user_id from the store, we need to make sure 
-- these existing local pockets are uploaded. 

-- QUICK FIX: Disable the constraint or insert them with the user's ID.
-- Better yet, let's just make the columns optional for now or provide the seed.

-- RECOMMENDATION: Use this snippet to insert default pockets for your specific user.
-- Replace 'YOUR_USER_ID' with your actual User ID from Supabase Auth.

/*
INSERT INTO public.pockets (id, user_id, name, icon, color, balance)
VALUES 
  ('pk-1', 'YOUR_USER_ID', 'กระเป๋าหลัก', 'Wallet', '#10b981', 0),
  ('pk-2', 'YOUR_USER_ID', 'เงินออม', 'PiggyBank', '#34d399', 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.categories (id, user_id, name, icon, color, type)
VALUES
  ('cat-1', 'YOUR_USER_ID', 'อาหารและเครื่องดื่ม', 'Utensils', '#10b981', 'expense'),
  ('cat-2', 'YOUR_USER_ID', 'การเดินทาง', 'Bus', '#0ea5e9', 'expense'),
  ('cat-3', 'YOUR_USER_ID', 'ช้อปปิ้ง', 'ShoppingBag', '#ec4899', 'expense'),
  ('cat-4', 'YOUR_USER_ID', 'บันเทิง', 'Film', '#a855f7', 'expense'),
  ('cat-5', 'YOUR_USER_ID', 'บิลและค่าใช้จ่าย', 'Receipt', '#ef4444', 'expense'),
  ('cat-10', 'YOUR_USER_ID', 'สุขภาพ', 'HeartPulse', '#f43f5e', 'expense'),
  ('cat-6', 'YOUR_USER_ID', 'เงินเดือน', 'Banknote', '#10b981', 'income'),
  ('cat-7', 'YOUR_USER_ID', 'ฟรีแลนซ์', 'Laptop', '#6366f1', 'income'),
  ('cat-8', 'YOUR_USER_ID', 'การลงทุน', 'TrendingUp', '#f59e0b', 'income'),
  ('cat-9', 'YOUR_USER_ID', 'รายรับอื่นๆ', 'PlusCircle', '#64748b', 'income')
ON CONFLICT (id) DO NOTHING;
*/
