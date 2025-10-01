# Kumiko Components Alt

A modern HTML/CSS component library for the Kumiko restaurant platform with shadcn-inspired design.

![Components Preview](https://via.placeholder.com/1200x400/000000/ffffff?text=Kumiko+Components+Alt)

## 🎨 Design Philosophy

Unlike the ultra-minimalist `kumiko-components`, this library features:

- **Modern aesthetic** - Subtle shadows, depth, and visual hierarchy
- **shadcn/ui inspiration** - Clean but not minimal, with more visual richness
- **Smooth interactions** - Transitions, hover states, and animations
- **Restaurant-focused** - Purpose-built components for food service platforms
- **Zero dependencies** - Pure HTML/CSS, no build tools required

## 🚀 Quick Start

### 1. Include CSS Files

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="path/to/css/variables.css">
    <link rel="stylesheet" href="path/to/css/base.css">
    <link rel="stylesheet" href="path/to/css/components.css">
</head>
<body>
    <!-- Your content -->
</body>
</html>
```

### 2. Use Components

```html
<!-- Button Example -->
<button class="btn btn-primary">Click Me</button>

<!-- Card Example -->
<div class="card">
    <div class="card-header">
        <h3 class="card-title">Card Title</h3>
        <p class="card-description">Description text</p>
    </div>
    <div class="card-content">
        Content goes here
    </div>
    <div class="card-footer">
        <button class="btn btn-outline btn-sm">Cancel</button>
        <button class="btn btn-primary btn-sm">Confirm</button>
    </div>
</div>
```

### 3. Customize

Modify CSS variables in `css/variables.css`:

```css
:root {
  --primary: 0 0% 9%;
  --radius: 0.5rem;
  /* Add your customizations */
}
```

## 📁 Project Structure

```
kumiko-components-alt/
├── index.html              # Component showcase & documentation
├── css/
│   ├── variables.css      # Design tokens (colors, spacing, etc.)
│   ├── base.css           # Reset, base styles, utilities
│   └── components.css     # All component styles
├── components/
│   ├── basics/            # Basic UI elements
│   │   ├── button.html
│   │   ├── input.html
│   │   ├── card.html
│   │   └── ...
│   └── restaurant/        # Restaurant-specific components
│       ├── menu-item.html
│       ├── order-management.html
│       └── ...
└── README.md
```

## 🧩 Components

### Basic Components

- **Buttons** - Primary, secondary, outline, ghost, destructive, success variants
- **Inputs** - Text fields, password, email, search with icon support
- **Textarea** - Multi-line text input
- **Select** - Dropdown selections
- **Checkbox** - Standard checkboxes with labels
- **Switch** - Toggle switches
- **Cards** - Flexible containers with header, content, footer
- **Badges** - Status indicators and tags
- **Alerts** - Success, warning, error, info messages
- **Tables** - Data tables with hover states
- **Avatars** - User profile images
- **Tabs** - Tabbed navigation
- **Progress** - Progress bars
- **Skeleton** - Loading placeholders
- **Dropdown Menu** - Context menus
- **Separator** - Horizontal and vertical dividers

### Restaurant Components

- **Menu Item Cards** - Beautiful dish displays with images, prices, and tags
- **Order Cards** - Order management with status indicators
- **Order Status Badges** - Pending, preparing, ready, completed states
- **Reservation Cards** - Table reservation displays
- **Stats Cards** - Dashboard statistics
- **Compact Menu Lists** - Alternative menu layout

## 🎨 Color System

The library uses HSL color values for easy theming:

```css
/* Light Mode */
--background: 0 0% 100%;
--foreground: 0 0% 3.9%;
--primary: 0 0% 9%;
--secondary: 0 0% 96.1%;
--muted: 0 0% 96.1%;
--accent: 0 0% 96.1%;
--destructive: 0 84.2% 60.2%;
--success: 142 76% 36%;
--warning: 38 92% 50%;
--border: 0 0% 89.8%;

/* Dark Mode */
.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  /* ... */
}
```

## 🌓 Dark Mode

Toggle between light and dark themes:

```html
<script>
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
}
</script>

<button onclick="toggleTheme()">Toggle Theme</button>
```

## 📏 Spacing & Sizing

Pre-defined spacing utilities:

- `.space-y-2` to `.space-y-8` - Vertical spacing
- `.space-x-2` to `.space-x-4` - Horizontal spacing
- `.gap-2` to `.gap-6` - Flexbox/Grid gaps
- `.w-full` - Full width
- `.max-w-md` to `.max-w-2xl` - Max widths

## 🎯 Utility Classes

Common utilities included:

```html
<!-- Layout -->
<div class="flex items-center justify-between gap-4">
<div class="grid grid-cols-3 gap-6">

<!-- Typography -->
<p class="text-sm text-muted">
<h2 class="text-2xl font-bold">

<!-- Spacing -->
<div class="space-y-4">

<!-- Display -->
<div class="hidden md:block">
```

## 🔧 Customization

### Changing Colors

Edit `css/variables.css`:

```css
:root {
  --primary: 220 90% 50%;  /* Blue primary */
  --success: 142 76% 36%;  /* Green success */
}
```

### Adjusting Border Radius

```css
:root {
  --radius: 0.75rem;  /* More rounded */
}
```

### Custom Shadows

```css
:root {
  --shadow-lg: 0 20px 25px -5px rgb(0 0 0 / 0.2);
}
```

## 🎓 Examples

### Restaurant Menu Card

```html
<div class="menu-item-card">
    <div class="menu-item-image" style="background: url('dish.jpg');"></div>
    <div class="menu-item-content">
        <div class="menu-item-header">
            <h3 class="menu-item-title">Spicy Ramen</h3>
            <span class="menu-item-price">$12.99</span>
        </div>
        <p class="menu-item-description">
            Rich tonkotsu broth with chashu pork
        </p>
        <div class="menu-item-tags">
            <span class="badge badge-secondary">Spicy</span>
            <span class="badge badge-outline">Popular</span>
        </div>
        <div class="menu-item-footer">
            <div class="text-sm text-muted">⏱️ 15 min</div>
            <button class="btn btn-primary btn-sm">Add to Cart</button>
        </div>
    </div>
</div>
```

### Order Management

```html
<div class="order-card">
    <div class="order-card-header">
        <div>
            <div class="order-number">#1234</div>
            <div class="order-time">5 minutes ago</div>
        </div>
        <div class="order-status order-status-preparing">
            <span class="order-status-indicator"></span>
            Preparing
        </div>
    </div>
    <div class="order-items">
        <div class="order-item">
            <div>
                <span class="order-item-quantity">2x</span>
                <span class="order-item-name">Ramen</span>
            </div>
            <span>$25.98</span>
        </div>
    </div>
    <div class="order-total">
        <span>Total</span>
        <span>$25.98</span>
    </div>
</div>
```

### Form with Validation

```html
<form class="space-y-4" style="max-width: 28rem;">
    <div>
        <label class="label">Email</label>
        <input type="email" class="input" placeholder="you@example.com" required>
    </div>
    
    <div>
        <label class="label">Password</label>
        <input type="password" class="input" required>
    </div>
    
    <div class="checkbox-wrapper">
        <input type="checkbox" id="remember" class="checkbox">
        <label for="remember">Remember me</label>
    </div>
    
    <button type="submit" class="btn btn-primary w-full">Sign In</button>
</form>
```

## 🆚 Differences from kumiko-components

| Feature | kumiko-components | kumiko-components-alt |
|---------|------------------|---------------------|
| Style | Ultra-minimalist | Modern with depth |
| Shadows | None/minimal | Subtle shadows throughout |
| Borders | Thin/minimal | More defined borders |
| Interactions | Basic | Smooth transitions & animations |
| Visual Hierarchy | Flat | Clear depth & layering |
| Inspiration | Pure minimal | shadcn/ui aesthetic |

## 🚧 Roadmap

- [ ] Add more restaurant components (reservations, staff management)
- [ ] Website builder sections (hero, menu, contact, etc.)
- [ ] Animation library
- [ ] Component variants (outlined cards, filled buttons, etc.)
- [ ] Print styles for receipts and reports
- [ ] RTL support
- [ ] More color themes

## 📝 Best Practices

1. **Use semantic HTML** - Components use proper HTML5 elements
2. **Maintain accessibility** - All interactive elements are keyboard accessible
3. **Test dark mode** - Always check components in both themes
4. **Keep it simple** - Don't over-nest components
5. **Customize variables** - Use CSS variables for consistent theming

## 🤝 Contributing

This is an experimental library. Feel free to:
- Add new components
- Improve existing ones
- Report issues
- Suggest enhancements

## 📄 License

MIT License - Use freely in your projects

## 🔗 Related

- [kumiko-components](../kumiko-components) - The ultra-minimalist version
- [Kumiko Platform](../) - The main restaurant platform

---

**Built with ❤️ for the Kumiko Restaurant Platform**
