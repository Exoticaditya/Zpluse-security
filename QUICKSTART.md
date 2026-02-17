# 🚀 QUICK START GUIDE

Get your Zpluse Security platform up and running in minutes!

---

## ⚡ IMMEDIATE SETUP (5 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase

**A. Create `.env` file in project root:**
```bash
cp .env.example .env
```

**B. Open `.env` and update with YOUR Firebase credentials:**
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456:web:abcdef
```

**Where to get these?**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ → Project Settings
4. Scroll to "Your apps" → Web app
5. Copy each value to `.env`

### 3. Start Development Server
```bash
npm run dev
```

**✅ Your app should now be running at `http://localhost:5173`**

---

## 🔐 CREATE FIRST ADMIN USER

### Option 1: Through Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Authentication** → **Users** tab
4. Click **Add User**
5. Enter:
   - Email: `admin@zplusesecurity.com`
   - Password: `YourSecurePassword123!`
6. Click **Add User**
7. **Copy the User UID** (looks like: `abc123def456...`)
8. Go to **Firestore Database**
9. Click **+ Start collection**
10. Collection ID: `users`
11. Click **Next**
12. Document ID: **Paste the User UID**
13. Add these fields:
    ```
    uid: [paste User UID]
    email: admin@zplusesecurity.com
    name: Admin User
    role: admin
    phone: +91 9876543210
    createdAt: [click "Add field" → Type: timestamp → Use server timestamp]
    ```
14. Click **Save**

### Option 2: Through Register Page

1. Go to `http://localhost:5173/register`
2. Fill in the form
3. Select role: **Admin** (if available)
4. Submit
5. If role dropdown doesn't show Admin:
   - Complete registration
   - Go to Firebase Console → Firestore → users
   - Find your user document
   - Change `role` field to `admin`

---

## 📊 IMPORT SAMPLE DATA (Optional)

### Method 1: Automated Seeding

1. Create file: `src/utils/runSeeder.js`
```javascript
import { seedAllData } from '../../scripts/seedData';
seedAllData();
```

2. Temporarily add to `src/main.jsx`:
```javascript
import './utils/runSeeder'; // Add this line at the top
```

3. Run the app:
```bash
npm run dev
```

4. Open browser console - you'll see seeding progress
5. Wait for completion message
6. **Remove the import** from `main.jsx`
7. Refresh Firebase Console to see data

### Method 2: Manual Entry

Use Firebase Console to manually add data:
- Guards → Collection: `guards`
- Clients → Collection: `clients`
- See `FIREBASE_SETUP.md` for data structure

---

## ✅ VERIFY SETUP

### Test Authentication
1. Go to `http://localhost:5173/login`
2. Login with admin credentials
3. Should redirect to Admin Dashboard

### Test Navigation
- ✅ Click "Home" - Should load
- ✅ Click "About" - Should load
- ✅ Click "Contact" - Should load
- ✅ Click "Careers" - Should load
- ✅ Login and access dashboards

### Check Firebase Console
- ✅ Authentication → Users (should see your admin user)
- ✅ Firestore → users collection (should see admin document)
- ✅ Firestore → Other collections (if seeded)

---

## 🎨 CUSTOMIZE YOUR PLATFORM

### 1. Update Company Info

**File: `src/pages/Contact.jsx`**
```javascript
// Line ~50-65
<p className="text-silver-grey">+1 (555) 000-ZERO</p>
// Change to your phone

<p className="text-silver-grey">access@zpluse-security.com</p>
// Change to your email

<p className="text-silver-grey">Sector 7, Neo-Tokyo Dist, Cyber City</p>
// Change to your address
```

### 2. Update Site Title

**File: `index.html`**
```html
<title>Zpluse Security - Your Title Here</title>
```

### 3. Add Your Logo

1. Replace `/public/logo.png` with your logo
2. Update in `src/components/Navbar.jsx`

---

## 🚀 DEPLOY TO NETLIFY

### 1. Build for Production
```bash
npm run build
```

### 2. Deploy
- Drag `dist` folder to Netlify drop zone
- OR connect GitHub repository
- See `HOSTING.md` for detailed deployment guide

---

## 🐛 TROUBLESHOOTING

### Error: "Firebase config is missing"
**Solution:** Make sure `.env` file exists and has all values

### Error: "Permission denied"
**Solution:** Check Firestore Security Rules are published

### Error: "User not found"
**Solution:** Verify user exists in Firebase Authentication

### Error: "Cannot read properties of undefined"
**Solution:** Make sure Firebase is fully configured and initialized

### Blank screen or white screen
**Solution:**
1. Check browser console for errors
2. Verify `.env` file is configured
3. Ensure npm install completed successfully

---

## 📚 IMPORTANT FILES

- `FIREBASE_SETUP.md` - Complete Firebase setup guide
- `DATA_CHECKLIST.md` - What data you need to provide
- `HOSTING.md` - Netlify deployment guide
- `.env.example` - Environment variables template

---

## 💡 NEXT STEPS

1. ✅ Complete Firebase setup
2. ✅ Create admin user
3. ✅ Import sample data (optional)
4. ✅ Test the platform
5. ✅ Customize branding
6. ✅ Add your real data
7. ✅ Deploy to production
8. 🎉 **Launch!**

---

## 🆘 NEED HELP?

If you encounter any issues:

1. Check the browser console for errors
2. Review Firebase Console for setup issues
3. Verify all environment variables are set
4. Read the detailed guides in this project
5. Contact support

---

## 🎯 CHECKLIST

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore database created
- [ ] Admin user created
- [ ] App runs locally (`npm run dev`)
- [ ] Can login successfully
- [ ] Dashboards load correctly
- [ ] Ready for customization!

---

**🎉 You're all set! Start building your security management platform!**
