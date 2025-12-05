# Permanent Solution: Auto-Create Leases When Tenant Signs Up

## Problem
When a new tenant creates an account, they are not automatically linked to a landlord via the `leases` table. This causes:
- Chat to not show tenants in landlord's list
- No lease relationship between tenant and property
- Manual lease creation required

## Permanent Solution

### Option 1: Supabase Database Triggers (RECOMMENDED)

Create a PostgreSQL trigger that automatically creates a lease when a tenant is created.

#### Step 1: Create the Trigger Function

```sql
-- Create function to auto-create lease when tenant profile is created
CREATE OR REPLACE FUNCTION public.create_default_lease()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create lease for tenants
  IF NEW.role = 'tenant' THEN
    -- Get the first property (or you can modify this logic)
    -- For now, we'll create a lease without a property
    INSERT INTO public.leases (
      property_id,
      landlord_id,
      tenant_id,
      monthly_rent,
      status,
      start_date,
      end_date,
      is_active
    ) VALUES (
      NULL,  -- Will be assigned later when tenant chooses a property
      NULL,  -- Will be assigned when tenant applies to a property
      NEW.id,
      0,
      'pending',
      CURRENT_DATE,
      CURRENT_DATE + INTERVAL '1 year',
      true
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on profiles table
CREATE TRIGGER trigger_create_default_lease
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.create_default_lease();
```

#### Step 2: Better Solution - Create Lease When Tenant Applies to Property

```sql
-- Create function to create lease when tenant applies
CREATE OR REPLACE FUNCTION public.create_lease_on_application()
RETURNS TRIGGER AS $$
BEGIN
  -- Assuming you have an applications table
  -- This creates a lease when a tenant's application is approved
  IF NEW.status = 'approved' THEN
    INSERT INTO public.leases (
      property_id,
      landlord_id,
      tenant_id,
      monthly_rent,
      status,
      start_date,
      end_date,
      is_active
    ) VALUES (
      NEW.property_id,
      (SELECT landlord_id FROM public.properties WHERE id = NEW.property_id),
      NEW.tenant_id,
      (SELECT monthly_rent FROM public.properties WHERE id = NEW.property_id),
      'active',
      CURRENT_DATE,
      CURRENT_DATE + INTERVAL '1 year',
      true
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

### Option 2: Application-Level Solution (Backend)

Create a function in your Next.js API that creates a lease when tenant signs up.

#### Step 1: Create API Route

**File:** `/src/app/api/auth/create-tenant/route.ts`

```typescript
import { supabase } from "@/lib/supabaseClient"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { tenantId, propertyId, landlordId } = await request.json()

    // Create lease for the tenant
    const { data, error } = await supabase
      .from("leases")
      .insert({
        tenant_id: tenantId,
        landlord_id: landlordId,
        property_id: propertyId,
        monthly_rent: 0,
        status: "pending",
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        is_active: true,
      })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

#### Step 2: Call API After Tenant Registration

**In your registration/signup component:**

```typescript
const handleTenantSignup = async (tenantData) => {
  try {
    // 1. Create auth user and profile
    const { data: authData } = await supabase.auth.signUp({
      email: tenantData.email,
      password: tenantData.password,
    })

    // 2. Create profile
    await supabase.from("profiles").insert({
      id: authData.user.id,
      full_name: tenantData.fullName,
      role: "tenant",
      email: tenantData.email,
    })

    // 3. Auto-create lease
    await fetch("/api/auth/create-tenant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenantId: authData.user.id,
        propertyId: tenantData.propertyId,
        landlordId: tenantData.landlordId,
      }),
    })
  } catch (error) {
    console.error("Signup error:", error)
  }
}
```

---

### Option 3: Hybrid Solution (BEST PRACTICE)

Combine database triggers with application logic for maximum reliability.

#### Step 1: Create Trigger for Default Lease

```sql
-- Create default lease when tenant profile is created
CREATE OR REPLACE FUNCTION public.auto_create_lease_on_tenant_signup()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'tenant' THEN
    INSERT INTO public.leases (
      tenant_id,
      monthly_rent,
      status,
      start_date,
      end_date,
      is_active
    ) VALUES (
      NEW.id,
      0,
      'pending',
      CURRENT_DATE,
      CURRENT_DATE + INTERVAL '1 year',
      true
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_create_lease
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.auto_create_lease_on_tenant_signup();
```

#### Step 2: Update Lease When Tenant Applies to Property

```typescript
// In your property application handler
const handleApplyToProperty = async (propertyId: string, tenantId: string) => {
  try {
    // Get property details
    const { data: property } = await supabase
      .from("properties")
      .select("*")
      .eq("id", propertyId)
      .single()

    // Update existing lease or create new one
    const { data: existingLease } = await supabase
      .from("leases")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("status", "pending")
      .single()

    if (existingLease) {
      // Update existing lease
      await supabase
        .from("leases")
        .update({
          property_id: propertyId,
          landlord_id: property.landlord_id,
          monthly_rent: property.monthly_rent,
          status: "pending",
        })
        .eq("id", existingLease.id)
    } else {
      // Create new lease
      await supabase.from("leases").insert({
        tenant_id: tenantId,
        property_id: propertyId,
        landlord_id: property.landlord_id,
        monthly_rent: property.monthly_rent,
        status: "pending",
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        is_active: true,
      })
    }
  } catch (error) {
    console.error("Error applying to property:", error)
  }
}
```

---

## Implementation Steps

### For Option 1 (Database Triggers):

1. Go to Supabase → SQL Editor
2. Copy the trigger function code
3. Run the SQL
4. Test by creating a new tenant profile

### For Option 2 (API Route):

1. Create `/src/app/api/auth/create-tenant/route.ts`
2. Copy the API code
3. Call the API after tenant registration
4. Test the flow

### For Option 3 (Hybrid - RECOMMENDED):

1. Create the trigger (Option 1)
2. Create the API route (Option 2)
3. Call the API when tenant applies to property
4. Trigger handles default lease creation
5. API handles lease updates

---

## Database Schema Update

If you need to modify the leases table to allow NULL values:

```sql
-- Allow NULL for landlord_id and property_id initially
ALTER TABLE public.leases
ALTER COLUMN landlord_id DROP NOT NULL;

ALTER TABLE public.leases
ALTER COLUMN property_id DROP NOT NULL;

-- Add constraints to ensure they're set before lease becomes active
ALTER TABLE public.leases
ADD CONSTRAINT check_active_lease_has_landlord
CHECK (status != 'active' OR landlord_id IS NOT NULL);

ALTER TABLE public.leases
ADD CONSTRAINT check_active_lease_has_property
CHECK (status != 'active' OR property_id IS NOT NULL);
```

---

## Testing the Solution

### Test 1: Create New Tenant

```sql
-- Create new tenant profile
INSERT INTO public.profiles (
  id,
  full_name,
  role,
  email
) VALUES (
  gen_random_uuid(),
  'Test Tenant',
  'tenant',
  'test@example.com'
);

-- Check if lease was auto-created
SELECT * FROM public.leases WHERE tenant_id = (
  SELECT id FROM public.profiles WHERE full_name = 'Test Tenant'
);
```

### Test 2: Chat Should Show Tenant

1. Sign in as landlord
2. Go to Dashboard → Chat
3. Tenant should appear in the list

---

## Advantages of Each Option

| Option | Pros | Cons |
|--------|------|------|
| **Database Triggers** | Automatic, reliable, no app code needed | Complex SQL, hard to debug |
| **API Route** | Easy to understand, flexible logic | Requires app code, manual calls |
| **Hybrid** | Best of both, automatic + flexible | More complex setup |

---

## Recommended Implementation

**Use Option 3 (Hybrid):**

1. **Trigger** creates default lease when tenant signs up
2. **API** updates lease when tenant applies to property
3. **Chat** works immediately because lease exists
4. **Landlord** can see tenant in chat list

This ensures:
- ✅ Automatic lease creation
- ✅ Chat works immediately
- ✅ Flexible property assignment
- ✅ Reliable and maintainable

---

## Current Workaround

Until you implement the permanent solution, use the fallback logic already in chat code:
- If no leases exist, chat loads all tenants from profiles
- This is temporary and will be replaced once leases are auto-created

---

**Status:** Ready to implement

**Recommended:** Option 3 (Hybrid Solution)

**Time to implement:** 15-20 minutes
