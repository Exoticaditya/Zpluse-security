# 🔥 Firebase Backend Setup Guide

## Complete Implementation Checklist for Zpluse Security

This document outlines **everything** you need to provide and configure to make the Zpluse Security platform fully functional with Firebase backend.

---

## 📋 STEP 1: Firebase Project Setup

### A. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `zpluse-security` (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Create project

### B. Get Firebase Configuration

1. In Firebase Console, click ⚙️ Settings → Project Settings
2. Scroll down to "Your apps" section
3. Click the **Web icon** `</>`
4. Register app with nickname: `Zpluse Security Web`
5. Copy the `firebaseConfig` object - **YOU MUST PROVIDE THIS**

**Example of what you'll get:**
```javascript
{
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "zpluse-security.firebaseapp.com",
  projectId: "zpluse-security",
  storageBucket: "zpluse-security.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
}
```

### C. Update `src/config/firebase.js`

Replace the placeholder values in `/src/config/firebase.js` with your actual Firebase config.

---

## 🔐 STEP 2: Enable Authentication

### A. Enable Email/Password Authentication

1. In Firebase Console → **Authentication**
2. Click "Get Started"
3. Go to **Sign-in method** tab
4. Click **Email/Password**
5. Toggle **Enable**
6. Save

### B. Enable Email Verification (Optional but Recommended)

1. Go to **Authentication** → **Templates**
2. Customize email templates for:
   - Email verification
   - Password reset
   - Email change

---

## 💾 STEP 3: Firestore Database Setup

### A. Create Firestore Database

1. In Firebase Console → **Firestore Database**
2. Click "Create Database"
3. Choose **Production mode** (we'll add rules next)
4. Select your region (choose closest to your users)
5. Click "Enable"

### B. Create Collections Structure

**You have TWO options:**

#### Option 1: Manual Creation (Recommended for Learning)
Create each collection manually through Firebase Console:

1. Click "Start collection"
2. Create the following collections one by one:

```
📁 Collections to Create:
├── users
├── guards
├── clients
├── incidents
├── schedules
├── attendance
├── activities
├── notifications
├── reports
└── settings
```

#### Option 2: Automated Import (Faster)
I'll provide a script to auto-create sample data (see below).

### C. Set Firestore Security Rules

1. Go to **Firestore Database** → **Rules** tab
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to get user role
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthenticated() && getUserRole() == 'admin';
    }
    
    // Helper function to check if user is manager or admin
    function isManagerOrAdmin() {
      return isAuthenticated() && (getUserRole() == 'manager' || getUserRole() == 'admin');
    }
    
    // Users collection
    match /users/{userId} {
      // Users can read their own data
      allow read: if isAuthenticated() && request.auth.uid == userId;
      // Only user can update their own profile (except role)
      allow update: if isAuthenticated() && request.auth.uid == userId 
                    && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role']);
      // Admins can read/write all users
      allow read, write: if isAdmin();
    }
    
    // Guards collection
    match /guards/{guardId} {
      // Managers and Admins can read all guards
      allow read: if isManagerOrAdmin();
      // Managers and Admins can create/update guards
      allow create, update: if isManagerOrAdmin();
      // Only Admins can delete guards
      allow delete: if isAdmin();
    }
    
    // Clients collection
    match /clients/{clientId} {
      // Clients can read their own data
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      // Managers and Admins can read all clients
      allow read: if isManagerOrAdmin();
      // Managers and Admins can create/update clients
      allow create, update: if isManagerOrAdmin();
      // Only Admins can delete clients
      allow delete: if isAdmin();
    }
    
    // Incidents collection
    match /incidents/{incidentId} {
      // All authenticated users can read incidents
      allow read: if isAuthenticated();
      // All authenticated users can create incidents
      allow create: if isAuthenticated();
      // Managers and Admins can update/delete incidents
      allow update, delete: if isManagerOrAdmin();
    }
    
    // Schedules collection
    match /schedules/{scheduleId} {
      // All authenticated users can read schedules
      allow read: if isAuthenticated();
      // Managers and Admins can create/update/delete schedules
      allow create, update, delete: if isManagerOrAdmin();
    }
    
    // Attendance collection
    match /attendance/{attendanceId} {
      // All authenticated users can read attendance
      allow read: if isAuthenticated();
      // Guards can create their own attendance records
      allow create: if isAuthenticated() && request.resource.data.guardId == request.auth.uid;
      // Managers and Admins can update/delete attendance
      allow update, delete: if isManagerOrAdmin();
    }
    
    // Activities collection
    match /activities/{activityId} {
      // All authenticated users can read activities
      allow read: if isAuthenticated();
      // All authenticated users can create activities
      allow create: if isAuthenticated();
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      // Users can read their own notifications
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      // System can create notifications
      allow create: if isAuthenticated();
      // Users can update their own notifications (mark as read)
      allow update: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Reports collection
    match /reports/{reportId} {
      // All authenticated users can read reports
      allow read: if isAuthenticated();
      // Managers and Admins can create/update reports
      allow create, update: if isManagerOrAdmin();
    }
    
    // Settings collection (system-wide settings)
    match /settings/{settingId} {
      // All authenticated users can read settings
      allow read: if isAuthenticated();
      // Only Admins can update settings
      allow update: if isAdmin();
    }
  }
}
```

3. Click **Publish**

---

## 📦 STEP 4: Firebase Storage Setup

### A. Enable Firebase Storage

1. In Firebase Console → **Storage**
2. Click "Get Started"
3. Start in **Production mode**
4. Choose your storage location
5. Click "Done"

### B. Set Storage Security Rules

1. Go to **Storage** → **Rules** tab
2. Replace with these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // User profile photos
    match /profile-photos/{userId}/{allPaths=**} {
      allow read: if true; // Public read
      allow write: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // Incident photos
    match /incidents/{incidentId}/{allPaths=**} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
    
    // Resume uploads
    match /resumes/{userId}/{allPaths=**} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
    
    // Reports
    match /reports/{reportId}/{allPaths=**} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
    
    // Documents
    match /documents/{allPaths=**} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
  }
}
```

3. Click **Publish**

---

## 🎯 STEP 5: Create First Admin User

### Option 1: Through Firebase Console

1. Go to **Authentication** → **Users**
2. Click "Add User"
3. Enter admin email and password
4. Copy the **User UID**
5. Go to **Firestore Database**
6. Click "Start collection" → Name it `users`
7. Document ID: Paste the **User UID**
8. Add fields:
   ```
   uid: [paste User UID]
   email: [admin email]
   name: "Admin User"
   role: "admin"
   phone: ""
   createdAt: [current timestamp]
   ```
9. Save

### Option 2: Through Code (After First Login)

After you log in with any account, manually update its role in Firestore to `admin`.

---

## 📊 STEP 6: Sample Data Structure

### You Need to Provide Data For:

#### 1. **Guards Collection** (`guards`)
```javascript
{
  id: "auto-generated",
  name: "Rajesh Kumar",
  email: "rajesh@example.com",
  phone: "+91 98765 43210",
  assignedSite: "Main Office Building",
  position: "Main Gate",
  shift: "Day Shift (6AM-2PM)",
  status: "on-duty", // on-duty, off-duty, on-break
  licenseNumber: "SEC-2024-001",
  joiningDate: "2024-01-15",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 2. **Clients Collection** (`clients`)
```javascript
{
  id: "auto-generated",
  companyName: "Tech Corp India",
  contactPerson: "Mr. Sharma",
  email: "contact@techcorp.com",
  phone: "+91 98765 00000",
  location: "Cyber City, Sector 5",
  address: "Plot 123, Tech Park, Cyber City",
  guardsAssigned: 8,
  contractStatus: "active", // active, pending, expired
  contractStartDate: "2024-01-01",
  contractEndDate: "2024-12-31",
  userId: "[Firebase Auth UID of client user]",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 3. **Incidents Collection** (`incidents`)
```javascript
{
  id: "auto-generated",
  title: "Unauthorized Vehicle Attempt",
  description: "Unknown vehicle attempted entry without proper authorization",
  site: "Main Office Building",
  reportedBy: "Rajesh Kumar",
  guardId: "[guard document ID]",
  severity: "medium", // low, medium, high, critical
  status: "resolved", // reported, investigating, resolved
  timestamp: Timestamp,
  resolvedAt: Timestamp (optional),
  photos: ["url1", "url2"], // Firebase Storage URLs
  updatedAt: Timestamp
}
```

#### 4. **Schedules Collection** (`schedules`)
```javascript
{
  id: "auto-generated",
  guardId: "[guard document ID]",
  guardName: "Rajesh Kumar",
  clientId: "[client document ID]",
  siteName: "Main Office Building",
  date: "2024-02-07",
  shift: "Day Shift (6AM-2PM)",
  position: "Main Gate",
  status: "scheduled", // scheduled, completed, cancelled
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 5. **Attendance Collection** (`attendance`)
```javascript
{
  id: "auto-generated",
  guardId: "[guard document ID]",
  siteId: "[client/site document ID]",
  clockIn: Timestamp,
  clockOut: Timestamp (optional),
  status: "active", // active, completed
  hoursWorked: 8.5, // calculated on clock out
  notes: "Regular shift",
  createdAt: Timestamp
}
```

#### 6. **Activities Collection** (`activities`)
```javascript
{
  id: "auto-generated",
  message: "Rajesh Kumar checked in at Main Gate",
  type: "success", // success, warning, error, info
  userId: "[user document ID]",
  timestamp: Timestamp
}
```

---

## 🚀 STEP 7: Testing Your Setup

### A. Test Authentication

1. Run `npm run dev`
2. Go to `/register`
3. Create a test account
4. Check Firebase Console → Authentication → Users
5. Verify user was created

### B. Test Firestore

1. Log in with your test account
2. Try navigating to different dashboards
3. Check Firebase Console → Firestore Database
4. Verify data is being read/written

### C. Test Storage

1. Try uploading a profile photo (once implemented)
2. Check Firebase Console → Storage
3. Verify files are being uploaded

---

## 📧 STEP 8: Email Configuration (Optional but Recommended)

### A. Customize Email Templates

1. Go to **Authentication** → **Templates**
2. Customize:
   - **Email address verification**
   - **Password reset**
   - **SMS verification** (if using phone auth)

### B. Setup Custom SMTP (Production)

For production, you may want to use a custom email service:
- SendGrid
- Mailgun
- AWS SES

This requires Firebase Cloud Functions (advanced).

---

## 🔧 STEP 9: Environment Variables

Create a `.env` file in your project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here

# Optional: For production deployment
VITE_API_URL=https://your-api-url.com
```

**Important:** Add `.env` to your `.gitignore` file!

---

## 📝 STEP 10: Data You Must Provide

### Immediately Required:

1. ✅ **Firebase Config Object** - From Firebase Console
2. ✅ **First Admin Account** - Email and password
3. ✅ **Company Information** - Name, address, contact details

### For Full Functionality:

4. 📋 **List of Guards** - Names, contacts, assignments (CSV/Excel)
5. 📋 **List of Clients** - Company names, contacts, locations (CSV/Excel)
6. 📋 **Site Locations** - Where guards will be deployed
7. 📋 **Shift Schedules** - Timing patterns
8. 📸 **Logo and Branding** - Company logo, colors, images

### Optional but Recommended:

9. 🔔 **Notification Preferences** - Email templates, SMS settings
10. 💳 **Payment Integration** - Stripe/Razorpay keys (for billing)
11. 🗺️ **Google Maps API** - For location tracking (future feature)
12. 📱 **Push Notification Keys** - For mobile notifications

---

## 🎨 STEP 11: Customization Checklist

Update these files with your actual information:

### `/src/pages/Contact.jsx`
- [ ] Update phone number
- [ ] Update email address
- [ ] Update physical address

### `/src/components/Footer.jsx`
- [ ] Update company name
- [ ] Update copyright year
- [ ] Update social media links

### `/public/index.html`
- [ ] Update page title
- [ ] Update meta description
- [ ] Add favicon

### `/README.md`
- [ ] Update project name
- [ ] Update description
- [ ] Add deployment instructions

---

## 🚨 Common Issues & Solutions

### Issue 1: Firebase Config Error
**Error:** `Firebase: Error (auth/invalid-api-key)`
**Solution:** Double-check your Firebase config in `src/config/firebase.js`

### Issue 2: Permission Denied
**Error:** `Missing or insufficient permissions`
**Solution:** Check Firestore Security Rules and ensure user has correct role

### Issue 3: CORS Error
**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`
**Solution:** Add your domain to Firebase authorized domains (Authentication → Settings → Authorized domains)

### Issue 4: Storage Upload Fails
**Error:** `storage/unauthorized`
**Solution:** Check Storage Security Rules and ensure user is authenticated

---

## 📞 Need Help?

If you encounter any issues:

1. Check Firebase Console → Project Overview → Usage and Billing
2. Review Firebase Console → Functions → Logs (for errors)
3. Check browser console for JavaScript errors
4. Verify all Firebase services are enabled

---

## ✅ Final Checklist

Before deploying to production:

- [ ] Firebase config updated with real credentials
- [ ] All authentication methods enabled
- [ ] Firestore security rules published
- [ ] Storage security rules published
- [ ] Admin user created
- [ ] Sample data added to collections
- [ ] Email templates customized
- [ ] Environment variables configured
- [ ] All company information updated
- [ ] Tested all user roles (client, worker, manager, admin)
- [ ] Tested authentication flow (login, register, reset password)
- [ ] Tested data creation/reading/updating
- [ ] Ready for deployment! 🚀

---

## 🌐 Next Steps: Deployment

Once Firebase is configured, you're ready to deploy:

1. **Build the project:** `npm run build`
2. **Deploy to Netlify** (follow HOSTING.md)
3. **Configure custom domain** (GoDaddy integration)
4. **Enable HTTPS** (automatic via Netlify)
5. **Test live site**
6. **Monitor Firebase usage** and billing

---

**🎉 Congratulations!** You're ready to launch Zpluse Security platform!
