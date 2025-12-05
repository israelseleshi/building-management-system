# 🎨 Lease Management UI - Visual Guide

## 📱 Landlord Dashboard - Leases Page

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│  Header: "Lease Management"                             │
│  Subtitle: "Manage and track all tenant leases"         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Stats Grid (4 columns on desktop, responsive)          │
│  ┌──────────┬──────────┬──────────┬──────────┐         │
│  │ Total    │ Active   │ Pending  │ Monthly  │         │
│  │ Leases   │ Leases   │ Leases   │ Revenue  │         │
│  │ [icon]   │ [icon]   │ [icon]   │ [icon]   │         │
│  │ 12       │ 8        │ 3        │ $45.2K   │         │
│  └──────────┴──────────┴──────────┴──────────┘         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  "Your Leases" Section                                  │
│  Manage and track all tenant leases                     │
│                                                         │
│  [Search Box] [Status Filter ▼]  [+ Create Lease]      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Leases Table                                           │
│  ┌────────────┬──────────┬──────────┬────────┬────────┐ │
│  │ Tenant     │ Property │ Monthly  │ Period │ Status │ │
│  │            │          │ Rent     │        │        │ │
│  ├────────────┼──────────┼──────────┼────────┼────────┤ │
│  │ [A] Ahmed  │ Office A │ $1,500   │ 1yr    │ Active │ │
│  │ [F] Fatima │ Office B │ $2,000   │ 1yr    │ Active │ │
│  │ [M] Marta  │ Office C │ $1,800   │ 6mo    │ Pending│ │
│  └────────────┴──────────┴──────────┴────────┴────────┘ │
│  [View] [Edit] [Delete]                                 │
└─────────────────────────────────────────────────────────┘
```

### Color Scheme
- **Cards:** White background with shadow
- **Stats Icons:** Brand green (#7D8B6F)
- **Status Badges:**
  - Active: Emerald green
  - Pending: Yellow
  - Inactive: Gray
  - Expired: Red

### Interactive Elements
- **Buttons:** Brand green with hover effect
- **Inputs:** Rounded borders, focus ring
- **Dropdowns:** Native select with styling
- **Modals:** Centered with backdrop

---

## 🎴 Tenant Dashboard - My Leases Page

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│  Header: "My Leases"                                    │
│  Subtitle: "View and manage your lease agreements"      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Stats Grid (3 columns on desktop, responsive)          │
│  ┌──────────┬──────────┬──────────┐                    │
│  │ Active   │ Pending  │ Monthly  │                    │
│  │ Leases   │ Leases   │ Rent     │                    │
│  │ [icon]   │ [icon]   │ [icon]   │                    │
│  │ 2        │ 1        │ $3,500   │                    │
│  └──────────┴──────────┴──────────┘                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  "Your Leases" Section                                  │
│  View and manage your lease agreements                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Lease Cards Grid (3 columns on desktop, responsive)    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ [Home Icon]  │  │ [Home Icon]  │  │ [Home Icon]  │  │
│  │ Office A     │  │ Office B     │  │ Office C     │  │
│  │ 123 Main St  │  │ 456 Oak Ave  │  │ 789 Pine Rd  │  │
│  │              │  │              │  │              │  │
│  │ [L] Landlord │  │ [L] Landlord │  │ [L] Landlord │  │
│  │ John Smith   │  │ Jane Doe     │  │ Bob Johnson  │  │
│  │ john@ex.com  │  │ jane@ex.com  │  │ bob@ex.com   │  │
│  │              │  │              │  │              │  │
│  │ $1,500/month │  │ $2,000/month │  │ $1,800/month │  │
│  │              │  │              │  │              │  │
│  │ Jan 1 - Dec 31 │ Feb 1 - Jul 31 │ Mar 1 - Sep 1 │  │
│  │ 365 days left   │ 180 days left   │ 150 days left │  │
│  │ [Active]      │ [Active]      │ [Pending]     │  │
│  │              │              │              │  │
│  │ [View Details]│ [View Details]│ [View Details]│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Card Design
- **Header:** Property name with home icon
- **Address:** Property location
- **Landlord:** Avatar + name + email
- **Rent:** Large, bold, green text
- **Dates:** Start and end dates
- **Days Remaining:** Blue indicator box
- **Status:** Color-coded badge
- **Action:** View Details button

---

## 🎯 Modal Designs

### Create Lease Modal
```
┌─────────────────────────────────────────┐
│ Create New Lease                        │
│ Set up a new lease agreement            │
├─────────────────────────────────────────┤
│                                         │
│ Select Tenant          Select Property  │
│ [Dropdown ▼]          [Dropdown ▼]     │
│                                         │
│ Monthly Rent           Initial Status   │
│ [$] [0.00]            [Dropdown ▼]     │
│                                         │
│ Start Date             End Date         │
│ [📅] [Date]           [📅] [Date]      │
│                                         │
│ Additional Notes (Optional)             │
│ [Textarea - Add any special terms...]   │
│                                         │
├─────────────────────────────────────────┤
│ [Cancel]              [+ Create Lease]  │
└─────────────────────────────────────────┘
```

### View Details Modal
```
┌─────────────────────────────────────────┐
│ Lease Details                           │
├─────────────────────────────────────────┤
│                                         │
│ Tenant                 Property         │
│ [A] Ahmed Hassan       [🏠] Office A    │
│ ahmed@ex.com          123 Main St       │
│                                         │
│ Monthly Rent           Status           │
│ $1,500                 [Active]         │
│                                         │
│ Start Date             End Date         │
│ Jan 1, 2024           Dec 31, 2024     │
│                                         │
│ Duration               Total Value      │
│ 365 days              $18,000           │
│                                         │
│ Created                                 │
│ Dec 1, 2024                            │
│                                         │
├─────────────────────────────────────────┤
│ [Close]                                 │
└─────────────────────────────────────────┘
```

### Edit Status Modal
```
┌─────────────────────────────────────────┐
│ Update Lease Status                     │
│ Change the status of this lease         │
├─────────────────────────────────────────┤
│                                         │
│ New Status                              │
│ [Dropdown ▼]                            │
│ - Pending                               │
│ - Active                                │
│ - Inactive                              │
│ - Expired                               │
│                                         │
├─────────────────────────────────────────┤
│ [Cancel]                                │
└─────────────────────────────────────────┘
```

### Delete Confirmation Modal
```
┌─────────────────────────────────────────┐
│ Delete Lease                            │
│ Are you sure you want to delete this    │
│ lease? This action cannot be undone.    │
├─────────────────────────────────────────┤
│                                         │
│ ⚠️  Warning                             │
│ Deleting this lease will remove all     │
│ associated records. Make sure this is   │
│ intentional.                            │
│                                         │
├─────────────────────────────────────────┤
│ [Cancel]              [🗑️ Delete Lease] │
└─────────────────────────────────────────┘
```

---

## 🎨 Color Palette

### Primary Colors
- **Brand Green:** #7D8B6F
- **Hover Green:** #6a7a5f
- **Light Green:** #E8EBE5

### Status Colors
- **Active:** #10B981 (Emerald)
- **Pending:** #F59E0B (Yellow)
- **Inactive:** #6B7280 (Gray)
- **Expired:** #EF4444 (Red)

### Neutral Colors
- **Background:** #FFFFFF
- **Card Background:** var(--card)
- **Border:** var(--border)
- **Text:** var(--foreground)
- **Muted Text:** var(--muted-foreground)

### Shadows
- **Card Shadow:** 0 4px 12px rgba(107, 90, 70, 0.25)
- **Hover Shadow:** 0 8px 16px rgba(107, 90, 70, 0.35)

---

## 📐 Responsive Breakpoints

### Mobile (< 768px)
```
Single Column Layout
- Stats: 1 column
- Table: Scrollable horizontally
- Cards: 1 column
- Modals: Full width with padding
```

### Tablet (768px - 1024px)
```
2-3 Column Layout
- Stats: 2 columns
- Table: Scrollable with better spacing
- Cards: 2 columns
- Modals: 90% width
```

### Desktop (> 1024px)
```
Full Layout
- Stats: 4 columns (landlord) / 3 columns (tenant)
- Table: Full width with all columns visible
- Cards: 3 columns
- Modals: Max 600px width, centered
```

---

## 🎭 Interactive States

### Buttons
- **Default:** Brand green background
- **Hover:** Darker green, shadow
- **Active:** Pressed effect
- **Disabled:** Gray, no interaction

### Inputs
- **Default:** Border, light background
- **Focus:** Ring effect, primary color
- **Error:** Red border (for validation)
- **Disabled:** Gray background

### Cards
- **Default:** White background, subtle shadow
- **Hover:** Enhanced shadow, slight scale
- **Active:** Highlight border

### Status Badges
- **Active:** Green background, green text
- **Pending:** Yellow background, yellow text
- **Inactive:** Gray background, gray text
- **Expired:** Red background, red text

---

## 🎬 Animations

### Transitions
- **Duration:** 300ms
- **Easing:** ease-in-out
- **Properties:** color, background, shadow, transform

### Effects
- **Hover Scale:** 1.02x
- **Active Scale:** 0.98x
- **Shadow Increase:** On hover
- **Color Shift:** On interaction

---

## 📊 Typography

### Headings
- **H1:** 32px, bold
- **H2:** 24px, bold
- **H3:** 20px, semibold

### Body Text
- **Regular:** 16px
- **Small:** 14px
- **Tiny:** 12px

### Font Family
- **Primary:** System fonts (Segoe UI, Roboto, etc.)
- **Monospace:** For data/numbers

---

## 🎯 User Experience

### Landlord Flow
1. View all leases at a glance
2. Search/filter for specific leases
3. Click to view full details
4. Create new leases easily
5. Update status quickly
6. Delete with confirmation

### Tenant Flow
1. See all leases as cards
2. Quick status overview
3. View full lease details
4. Monitor lease duration
5. Track days remaining
6. Download documents (future)

---

## ✨ Polish Details

### Micro-interactions
- ✅ Smooth hover effects
- ✅ Loading states
- ✅ Success feedback
- ✅ Error messages
- ✅ Confirmation dialogs
- ✅ Toast notifications (ready)

### Accessibility
- ✅ Proper heading hierarchy
- ✅ Color contrast
- ✅ Keyboard navigation
- ✅ ARIA labels (ready)
- ✅ Focus indicators

### Performance
- ✅ Optimized renders
- ✅ Lazy loading (ready)
- ✅ Image optimization
- ✅ Smooth animations
- ✅ Fast interactions

---

## 🎉 Design Summary

**Overall Aesthetic:** Modern, Professional, Clean

**Key Principles:**
- Minimalist design
- Professional typography
- Consistent spacing
- Intuitive navigation
- Responsive across devices
- Accessible to all users
- Beautiful animations
- Clear visual hierarchy

**Status:** ✅ **Production Ready**

**Last Updated:** December 5, 2025
