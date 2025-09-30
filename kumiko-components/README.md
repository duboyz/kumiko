# Kumiko Component Library

A comprehensive Japanese minimalist component library for restaurant and hospitality websites. Built with pure HTML, CSS, and vanilla JavaScript.

## 🎌 Design Philosophy

- **Japanese Minimalism** - Clean, understated elegance inspired by Japanese design principles
- **Noto Sans JP Typography** - Authentic Japanese-inspired font with multiple weights
- **No Clutter** - Only essential elements, generous white space
- **Mobile First** - Fully responsive on all devices

## 📁 Project Structure

```
kumiko-components/
├── index.html                          # Component library showcase
├── components/
│   ├── basics/                         # Foundation UI components
│   │   ├── button.html                 # Icon, primary, secondary, add buttons
│   │   ├── input.html                  # Text inputs with labels
│   │   ├── textarea.html               # Auto-resizing textareas
│   │   ├── select.html                 # Native & custom dropdowns
│   │   └── card.html                   # Container components
│   │
│   ├── sections/                       # Composed sections
│   │   ├── hero-section.html           # Hero variants (centered, bg, split, etc.)
│   │   ├── text-section.html           # Content sections with text
│   │   ├── menu-section.html           # Restaurant menu display
│   │   └── contact-section.html        # Contact forms & info
│   │
│   └── templates/
│       ├── page-templates/             # Complete pages
│       │   ├── home-page.html          # Landing page
│       │   ├── menu-page.html          # Full menu
│       │   ├── about-page.html         # Story/about
│       │   └── contact-page.html       # Contact with form
│       │
│       └── website-templates/          # Full websites
│           └── restaurant-classic.html  # Complete site
```

## ✅ Component Status

### Basic Components (5/5) ✅
- **Button** - Icon buttons, primary, secondary, add buttons
- **Input** - Text fields with clean underline style, prefixes, error states
- **Textarea** - Auto-resizing, character counter
- **Select** - Native and custom dropdowns
- **Card** - Containers with hover effects, variants

### Section Components (4/4) ✅
- **Hero Section** - Centered, with background, split layout, minimal, full-height
- **Text Section** - Centered, left-aligned, with background, two-column, with quotes
- **Menu Section** - Categories, items with options, grid layout
- **Contact Section** - Info, form, split layout, with hours, with map

### Page Templates (4/4) ✅
- **Home Page** - Hero + Story + Features + CTA
- **Menu Page** - Hero + Full Menu Display
- **About Page** - Hero + Multiple Story Sections
- **Contact Page** - Hero + Contact Form + Map + Hours

### Website Templates (1/3) ✅
- **Restaurant Classic** - Complete single-page website with smooth scrolling

## 🚀 Getting Started

1. **View the Library**
   ```bash
   open index.html
   ```

2. **Use Individual Components**
   - Navigate to any component file
   - Copy the HTML structure and CSS styles
   - Adapt to your needs

3. **Use Page Templates**
   - Open any page template
   - Replace content with your own
   - Customize colors and spacing

4. **Use Website Templates**
   - Start with a complete website
   - Customize all sections
   - Deploy immediately

## 🎨 Design Tokens

### Typography
- **Font Family**: Noto Sans JP
- **Weights**: 100 (Thin), 200 (ExtraLight), 300 (Light), 400 (Regular)
- **Letter Spacing**: Generous spacing for Japanese aesthetic

### Colors
```css
--black: #000000;
--white: #ffffff;
--gray-dark: #666666;
--gray-medium: #999999;
--gray-light: #cccccc;
--gray-bg: #fafafa;
--gray-border: #e0e0e0;
```

### Spacing
- Base unit: 8px
- Scale: 8px, 16px, 24px, 32px, 40px, 60px, 80px, 120px

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) {
  /* Mobile-specific styles */
}
```

## 🔧 For Storybook Implementation

Each component is:
- **Self-contained** - Includes all necessary styles
- **Well-documented** - Clear usage examples
- **Variant-rich** - Multiple options for each component
- **Copy-paste ready** - Can be converted to React easily

### Conversion Steps:
1. Extract component HTML structure
2. Convert to React JSX
3. Extract styles to CSS modules or styled-components
4. Add props for dynamic content
5. Create Storybook stories

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Notes

- No external dependencies (except Noto Sans JP from Google Fonts)
- Pure vanilla JavaScript for interactions
- Semantic HTML5
- Accessible markup
- Mobile-first responsive design

## 🎯 Use Cases

Perfect for:
- Restaurant websites
- Hotel websites
- Café websites
- Street food businesses
- Any hospitality business

## 📄 License

This component library is part of the Kumiko platform project.

## 🙏 Credits

Design inspiration from Japanese minimalist principles and brands like MUJI and Uniqlo.

---

**Built with ❤️ for Kumiko** - Making restaurant websites beautiful and simple.
