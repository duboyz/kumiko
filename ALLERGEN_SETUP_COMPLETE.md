# ✅ Allergen System - Complete Setup Guide

## 🎯 Where to See Allergens

Your allergen system is now **fully functional**! Here's where you'll see allergens:

### 1. **Creating a New Menu Item** ✨
**Location:** Menu Editor → Any Category → "Add New Item" button

You'll see:
```
┌─────────────────────────────────────┐
│ New Menu Item                       │
│                                     │
│ Item Name: [____________]           │
│ Description: [____________]         │
│ Price: [____]                       │
│                                     │
│ Allergens                           │
│ Select all allergens present        │
│                                     │
│ ☐ Gluten      ☐ Soy               │
│ ☐ Crustaceans ☐ Milk              │
│ ☐ Eggs        ☐ Tree Nuts         │
│ ☐ Fish        ☐ Celery            │
│ ☐ Peanuts     ☐ Mustard           │
│ ☐ Sesame      ☐ Sulphites         │
│ ☐ Lupin       ☐ Molluscs          │
│                                     │
│ [Cancel] [Save]                     │
└─────────────────────────────────────┘
```

### 2. **Editing Existing Menu Items** ✏️
**Location:** Menu Editor → Click pencil icon on any item

When you click edit on a menu item, you'll see:
- All the item details
- An "Allergens" section at the bottom with checkboxes
- Previously selected allergens will be checked

### 3. **Viewing Menu Items (Non-Edit Mode)** 👀
**Location:** Menu Editor → Any menu item display

Menu items now show allergens with badges:
```
┌─────────────────────────────────────┐
│ Pizza Margherita         $12.99     │
│ Classic Italian pizza with cheese   │
│                                     │
│ ⚠️ [Gluten] [Milk]                 │
└─────────────────────────────────────┘
```

### 4. **Menu Items Page (Card View)** 📋
**Location:** `/menu-items` page → Card view

Each card shows:
- Item name and price
- Up to 3 allergen badges
- "+2" indicator if more than 3 allergens

### 5. **Available Allergens** (Auto-Seeded)

The system automatically includes these 14 standard allergens:
1. ✅ Gluten
2. ✅ Crustaceans
3. ✅ Eggs
4. ✅ Fish
5. ✅ Peanuts
6. ✅ Soy
7. ✅ Milk
8. ✅ Tree Nuts
9. ✅ Celery
10. ✅ Mustard
11. ✅ Sesame
12. ✅ Sulphites
13. ✅ Lupin
14. ✅ Molluscs

## 🚀 How to Test

1. **Go to:** http://localhost:3004
2. **Navigate to:** Menus → Select a restaurant → Open a menu
3. **Click:** "Add New Item" button
4. **Scroll down** to see the Allergens section
5. **Select some allergens** by clicking checkboxes
6. **Save the item**
7. **View the item** - you'll see allergen badges with a ⚠️ icon

## 📸 Visual Indicators

- **Alert Icon:** ⚠️ (Orange) - indicates allergens are present
- **Badges:** Gray pills showing allergen names
- **Selection:** Checkboxes in create/edit forms

## 🔧 Technical Details

**Backend:**
- Endpoint: `GET /api/allergens`
- Auto-seeds on first call
- Creates `MenuItemAllergen` junction table records

**Frontend:**
- Component: `<AllergenSelector>` at `web/src/components/menus/AllergenSelector.tsx`
- Hook: `useAllergens()` from `@shared/hooks`
- API: `menuApi.getAllergens()` from `@shared/api`

## ✅ Complete Integration

Allergens are now integrated into:
- ✅ NewMenuItemForm (create)
- ✅ MenuItem Editable (edit)
- ✅ MenuItem NonEditable (display)
- ✅ MenuItemCard (display)
- ✅ Backend API (CRUD operations)
- ✅ All TypeScript types

## 🎉 You're All Set!

Go create a menu item and add some allergens! They'll display automatically throughout your app.

