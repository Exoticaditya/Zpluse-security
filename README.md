# Aegis Robotics Security Website

A high-end, futuristic security website with a cyberpunk-professional theme, built with React, Tailwind CSS, and Framer Motion.

## Features

### Visual Design
- **Cyberpunk-Professional Aesthetic**: Sleek, futuristic design with glassmorphism effects
- **Color Palette**: 
  - Deep obsidian black (#0A0A0A)
  - Electric cobalt blue (#0047FF)
  - Silver-grey text (#B8B8B8)
- **Matrix Background**: Animated digital rain effect with Japanese characters
- **Glassmorphic UI**: Frosted glass effects with glowing borders
- **HUD Elements**: Heads-up display brackets around headings for robotic feel

### Animations
- Matrix-style data-stream background
- Glowing borders and neon accents
- Smooth parallax scrolling effects
- Fade-in-up transitions on scroll
- Hover effects with micro-interactions
- 3D rotating robotic eye on homepage
- Scanning line animations
- Pulsing glow effects

### Pages

#### 1. Home/Landing Page
- 3D animated robotic eye centerpiece
- Hero section with compelling headline
- Interactive service cards that glow on hover:
  - Residential Nano-Shield
  - Corporate Cyber-Physical Defense
  - Automated Perimeter Patrol
- Real-time statistics section
- Smooth scroll indicator

#### 2. Security Portal (Client Login)
- Glassmorphic dashboard layout
- Live camera feed displays with scanning effects
- Autonomous drone fleet monitoring
- Real-time biometric access logs
- Emergency response button with pulsing animation
- Dynamic time display

#### 3. Careers Page
- "Building the Shield of Tomorrow" header
- Modern accordion-style job listings
- Detailed job descriptions with requirements and benefits
- Interactive application form with:
  - Glowing input fields
  - Drag-and-drop resume upload
  - "Scanning..." animation on file upload
  - Form validation

### Technical Features
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Smooth Animations**: Powered by Framer Motion
- **Custom Fonts**: Orbitron for headings, Rajdhani for body text
- **Dark Mode**: Built-in dark theme
- **Custom Scrollbar**: Themed scrollbar matching the design
- **Interactive UI Components**: Reusable components with hover states

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── UIComponents.jsx      # Reusable UI components (buttons, cards, inputs)
│   ├── MatrixBackground.jsx  # Animated matrix background
│   ├── Navbar.jsx            # Navigation bar
│   └── Footer.jsx            # Footer component
├── pages/
│   ├── Home.jsx              # Landing page
│   ├── SecurityPortal.jsx    # Security dashboard
│   └── Careers.jsx           # Careers page
├── App.jsx                   # Main app component with routing
├── main.jsx                  # Entry point
└── index.css                 # Global styles and Tailwind config
```

## Technologies Used

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Router**: Client-side routing
- **Lucide React**: Beautiful icon library

## Customization

### Colors
Edit the color palette in `tailwind.config.js`:
```javascript
colors: {
  obsidian: '#0A0A0A',
  cobalt: '#0047FF',
  'silver-grey': '#B8B8B8',
}
```

### Animations
Custom animations are defined in `tailwind.config.js` and can be modified:
- `pulse-glow`: Glowing effect
- `scan`: Scanning line animation
- `matrix`: Matrix background animation
- `glitch`: Glitch effect

### Content
Update page content in:
- `src/pages/Home.jsx` - Homepage content
- `src/pages/SecurityPortal.jsx` - Dashboard data
- `src/pages/Careers.jsx` - Job listings

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this template for your projects!

## Credits

Built with ❤️ using modern web technologies.
