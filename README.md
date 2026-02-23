# Zpluse Security - Professional Security Management Platform

A modern, full-stack security management platform built with React, Firebase, Tailwind CSS, and Framer Motion. Complete with real-time updates, role-based dashboards, and enterprise-grade features.

🌐 **Live Demo:** [https://zplusesecurity.com](https://zplusesecurity.com)

---

## ✨ Features

### 🎨 **Modern UI/UX**
- **Cyberpunk-Professional Design** - Sleek, futuristic interface
- **Responsive Layout** - Works perfectly on all devices
- **Glassmorphism Effects** - Frosted glass UI elements
- **Matrix Background** - Animated digital rain effect
- **Smooth Animations** - Powered by Framer Motion
- **Custom Scrollbar** - Themed to match the design

### 🔐 **Complete Authentication System**
- Email/Password authentication via Firebase
- Password reset functionality
- Email verification (optional)
- Role-based access control (Client, Worker, Manager, Admin)
- Protected routes
- User profile management

### 📊 **Role-Based Dashboards**

#### **Client Dashboard**
- View assigned guards in real-time
- Monitor guard status (on-duty, off-duty, on-break)
- View incident reports
- Track guard check-ins and activities
- Emergency alert system
- Monthly reports access

#### **Worker/Guard Dashboard**
- View assignments and schedule
- Clock in/out system
- Submit incident reports with photos
- View assigned tasks
- Track work hours
- Performance metrics

#### **Manager Dashboard**
- Manage security guard team
- Manage client accounts
- Create and edit shift schedules
- Approve leave requests
- View analytics and reports
- Revenue tracking
- Team performance monitoring

#### **Admin Dashboard**
- Complete user management (CRUD)
- System settings configuration
- Audit logs viewer
- Database management
- System health monitoring
- Role assignment
- Global settings

### 🔥 **Real-Time Features**
- Live guard status updates
- Real-time incident notifications
- Activity feed with instant updates
- Multi-user collaboration
- WebSocket connections via Firebase

### 📱 **Core Functionalities**
- Guard management (add, edit, delete, assign)
- Client management
- Incident reporting with severity levels
- Shift scheduling system
- Attendance tracking (clock in/out)
- Activity logging
- Notification system
- Report generation

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Firebase account
- Git (optional)

### 1. Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/zpluse-security.git

# Navigate to project directory
cd zpluse-security

# Install dependencies
npm install
\`\`\`

### 2. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Copy `.env.example` to `.env`
3. Fill in your Firebase credentials in `.env`

\`\`\`env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
\`\`\`

### 3. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production

\`\`\`bash
npm run build
\`\`\`

---

## 🌍 Production Deployment

**SGMS is currently LIVE in production!**

| Component | Production URL | Status |
|-----------|---------------|--------|
| **Backend API** | https://sgms-backend-production.up.railway.app/api | ✅ Live |
| **Frontend** | https://zplusesecurity.com | ✅ Live |
| **Database** | Railway PostgreSQL | ✅ Live |
| **API Docs** | https://sgms-backend-production.up.railway.app/swagger-ui.html | ✅ Live |

### Test Production

\`\`\`powershell
# Run comprehensive health check
.\test_production.ps1

# Inspect production database
railway run "psql -f psql_inspection.sql"

# Run project auditor
python sgms_auditor.py
\`\`\`

### Production Test Credentials

- **Admin**: admin@zpluse.com / Admin@123
- **Supervisor**: supervisor@zpluse.com / Super@123
- **Guard**: guard1@zpluse.com / Guard@123
- **Client**: client1@zpluse.com / Client@123

### Deployment Documentation

- **[PRODUCTION_DEPLOYMENT_REFERENCE.md](PRODUCTION_DEPLOYMENT_REFERENCE.md)** - Complete production reference
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Full deployment guide
- **[GITHUB_DEPLOYMENT.md](GITHUB_DEPLOYMENT.md)** - GitHub deployment automation

---

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - Complete Firebase setup guide
- **[DATA_CHECKLIST.md](DATA_CHECKLIST.md)** - Data requirements and templates
- **[HOSTING.md](HOSTING.md)** - Deployment guide (Netlify + GoDaddy)
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Detailed project overview

---- **React 18**: Modern React with hooks
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
