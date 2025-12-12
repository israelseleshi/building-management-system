-- Supabase Schema for Payouts and Notifications
-- This file contains the SQL to create tables for payment processing and notifications

-- ============================================
-- PAYOUTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'ETB',
  payment_method VARCHAR(50) NOT NULL, -- 'bank_transfer', 'mobile_money', 'check', 'cash'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'cancelled'
  transaction_id VARCHAR(100) UNIQUE,
  payment_date TIMESTAMP,
  due_date TIMESTAMP,
  description TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  
  CONSTRAINT valid_amount CHECK (amount > 0),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled'))
);

-- Create indexes for faster queries
CREATE INDEX idx_payouts_landlord_id ON public.payouts(landlord_id);
CREATE INDEX idx_payouts_property_id ON public.payouts(property_id);
CREATE INDEX idx_payouts_status ON public.payouts(status);
CREATE INDEX idx_payouts_created_at ON public.payouts(created_at DESC);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'payment', 'inquiry', 'message', 'maintenance', 'listing', 'system'
  related_entity_type VARCHAR(50), -- 'property', 'payout', 'message', 'maintenance_request'
  related_entity_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(500),
  icon VARCHAR(50), -- lucide icon name
  priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  created_at TIMESTAMP DEFAULT now(),
  read_at TIMESTAMP,
  
  CONSTRAINT valid_type CHECK (type IN ('payment', 'inquiry', 'message', 'maintenance', 'listing', 'system')),
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

-- Create indexes for notifications
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON public.notifications(type);

-- ============================================
-- NOTIFICATION PREFERENCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_notifications BOOLEAN DEFAULT TRUE,
  inquiry_notifications BOOLEAN DEFAULT TRUE,
  message_notifications BOOLEAN DEFAULT TRUE,
  maintenance_notifications BOOLEAN DEFAULT TRUE,
  listing_notifications BOOLEAN DEFAULT TRUE,
  system_notifications BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create index for preferences
CREATE INDEX idx_notification_preferences_user_id ON public.notification_preferences(user_id);

-- ============================================
-- PAYMENT METHODS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  method_type VARCHAR(50) NOT NULL, -- 'bank_account', 'mobile_money', 'check'
  account_name VARCHAR(255),
  account_number VARCHAR(100),
  bank_name VARCHAR(255),
  mobile_provider VARCHAR(100), -- 'Telebirr', 'Ethio Telecom', etc.
  mobile_number VARCHAR(20),
  is_default BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  
  CONSTRAINT valid_method_type CHECK (method_type IN ('bank_account', 'mobile_money', 'check'))
);

-- Create indexes for payment methods
CREATE INDEX idx_payment_methods_landlord_id ON public.payment_methods(landlord_id);
CREATE INDEX idx_payment_methods_is_default ON public.payment_methods(is_default);

-- ============================================
-- PAYOUT HISTORY VIEW
-- ============================================
CREATE OR REPLACE VIEW payout_summary AS
SELECT 
  p.landlord_id,
  COUNT(*) as total_payouts,
  SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END) as total_paid,
  SUM(CASE WHEN p.status = 'pending' THEN p.amount ELSE 0 END) as pending_amount,
  SUM(CASE WHEN p.status = 'processing' THEN p.amount ELSE 0 END) as processing_amount,
  COUNT(CASE WHEN p.status = 'failed' THEN 1 END) as failed_count,
  MAX(p.created_at) as last_payout_date
FROM public.payouts p
GROUP BY p.landlord_id;

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Payouts: Users can only see their own payouts
CREATE POLICY "Users can view their own payouts" ON public.payouts
  FOR SELECT USING (auth.uid() = landlord_id);

CREATE POLICY "Users can create their own payouts" ON public.payouts
  FOR INSERT WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Users can update their own payouts" ON public.payouts
  FOR UPDATE USING (auth.uid() = landlord_id);

-- Notifications: Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Notification Preferences: Users can only manage their own preferences
CREATE POLICY "Users can view their notification preferences" ON public.notification_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notification preferences" ON public.notification_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can create their notification preferences" ON public.notification_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payment Methods: Users can only manage their own payment methods
CREATE POLICY "Users can view their payment methods" ON public.payment_methods
  FOR SELECT USING (auth.uid() = landlord_id);

CREATE POLICY "Users can create payment methods" ON public.payment_methods
  FOR INSERT WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Users can update their payment methods" ON public.payment_methods
  FOR UPDATE USING (auth.uid() = landlord_id);

CREATE POLICY "Users can delete their payment methods" ON public.payment_methods
  FOR DELETE USING (auth.uid() = landlord_id);
