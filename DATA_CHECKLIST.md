# 📋 DATA COLLECTION CHECKLIST

## What You Need to Provide to Complete the Setup

This checklist outlines all the information and resources you need to gather to make your Zpluse Security platform fully operational.

---

## ✅ IMMEDIATE REQUIREMENTS (Must Have)

### 1. Firebase Credentials
- [ ] Firebase Project created
- [ ] Firebase Config Object (from Project Settings)
  ```javascript
  {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
  }
  ```
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore Database created
- [ ] Storage enabled

### 2. Admin Account
- [ ] Admin email address
- [ ] Admin password (strong password)
- [ ] Admin full name
- [ ] Admin phone number

### 3. Company Information
- [ ] Official company name: **Zpluse Security** (or your name)
- [ ] Company address
- [ ] Company phone number (for Contact page)
- [ ] Company email (for Contact page)
- [ ] Emergency contact number
- [ ] Support email address

---

## 📊 OPERATIONAL DATA (For Full Functionality)

### 4. Security Guards List
Provide an Excel/CSV file or list with the following for each guard:

- [ ] Full Name
- [ ] Email address
- [ ] Phone number
- [ ] License/ID number
- [ ] Joining date
- [ ] Current assignment (if any)
- [ ] Shift preference
- [ ] Home address (optional)
- [ ] Emergency contact (optional)

**Sample Format:**
```csv
Name,Email,Phone,License,Joining Date,Assignment,Shift
Rajesh Kumar,rajesh@email.com,+91 9876543210,SEC-001,2024-01-15,Main Gate,Day
```

### 5. Clients List
Provide an Excel/CSV file or list with the following for each client:

- [ ] Company/Client name
- [ ] Contact person name
- [ ] Email address
- [ ] Phone number
- [ ] Full address
- [ ] Location/Site name
- [ ] Number of guards needed
- [ ] Contract start date
- [ ] Contract end date
- [ ] Special requirements (optional)

**Sample Format:**
```csv
Company,Contact Person,Email,Phone,Address,Guards Needed,Start Date,End Date
Tech Corp,Mr. Sharma,contact@techcorp.com,+91 11 1234567,Cyber City,8,2024-01-01,2024-12-31
```

### 6. Site/Location Information
For each client location:

- [ ] Site name
- [ ] Full address
- [ ] Number of security positions
- [ ] Position names (Main Gate, Lobby, etc.)
- [ ] Shift timings for each position
- [ ] Special instructions
- [ ] Access requirements

### 7. Shift Schedule Information
- [ ] Shift names (Day Shift, Night Shift, etc.)
- [ ] Shift timings (6AM-2PM, 2PM-10PM, etc.)
- [ ] Number of guards per shift
- [ ] Rotation pattern (if any)

---

## 🎨 BRANDING & DESIGN (Optional but Recommended)

### 8. Visual Assets
- [ ] Company logo (PNG, transparent background preferred)
  - Size: 512x512px or larger
- [ ] Company favicon (32x32px)
- [ ] Brand colors (if different from current theme)
  - Primary color
  - Secondary color
  - Accent color
- [ ] Hero image for homepage (optional)
- [ ] Team photos (for About page)

### 9. Content Updates
- [ ] Company tagline/slogan
- [ ] About Us description
- [ ] Mission statement
- [ ] Vision statement
- [ ] Core values
- [ ] Service descriptions (updated if needed)
- [ ] Team member bios (if showing team)

---

## 📧 COMMUNICATION SETUP (For Notifications)

### 10. Email Service (Optional - For Production)
If you want to send custom emails:

- [ ] SendGrid API Key (recommended)
  - OR Mailgun API Key
  - OR AWS SES credentials
- [ ] Sender email address (e.g., noreply@zplusesecurity.com)
- [ ] Email templates customization

### 11. SMS Service (Optional - For Alerts)
If you want SMS notifications:

- [ ] Twilio Account SID and Auth Token
  - OR AWS SNS credentials
  - OR other SMS service credentials
- [ ] Sender phone number

---

## 💳 PAYMENT INTEGRATION (Future Feature)

### 12. Payment Gateway (If Needed)
For billing and subscriptions:

- [ ] Stripe Account and API Keys
  - OR Razorpay Account and API Keys
  - OR PayPal Business Account
- [ ] Tax ID/GST Number (for invoices)
- [ ] Bank account details (for reports)

---

## 🗺️ ADDITIONAL SERVICES (Optional)

### 13. Google Maps Integration
For location tracking features:

- [ ] Google Maps API Key
- [ ] Enable Maps JavaScript API
- [ ] Enable Geocoding API

### 14. Push Notifications (Mobile/Web)
For real-time alerts:

- [ ] Firebase Cloud Messaging setup
- [ ] Vapid Keys (for web push)

---

## 📝 LEGAL & COMPLIANCE (Recommended)

### 15. Legal Documents
- [ ] Terms of Service document
- [ ] Privacy Policy document
- [ ] Cookie Policy (if applicable)
- [ ] Data Protection Policy
- [ ] Service Level Agreement (SLA)

### 16. Licenses & Certifications
- [ ] Company security license
- [ ] Insurance certificates
- [ ] Industry certifications
- [ ] Compliance documents

---

## 🎯 SAMPLE DATA FORMAT

### Excel Template for Guards
```
| Name          | Email              | Phone          | License  | Joining Date | Assignment      | Shift     | Status   |
|---------------|-------------------|----------------|----------|--------------|-----------------|-----------|----------|
| Rajesh Kumar  | rajesh@email.com  | +91 9876543210 | SEC-001  | 2024-01-15   | Main Gate       | Day       | On Duty  |
| Amit Singh    | amit@email.com    | +91 9876543211 | SEC-002  | 2024-01-20   | Lobby           | Day       | On Duty  |
```

### Excel Template for Clients
```
| Company        | Contact     | Email                | Phone         | Address           | Guards | Start Date | End Date   | Status |
|----------------|-------------|----------------------|---------------|-------------------|--------|------------|------------|--------|
| Tech Corp      | Mr. Sharma  | contact@techcorp.com | +91 111234567 | Cyber City S-5    | 8      | 2024-01-01 | 2024-12-31 | Active |
| Global Finance | Ms. Gupta   | security@gf.com      | +91 229876543 | BKC Mumbai        | 12     | 2024-02-01 | 2025-01-31 | Active |
```

---

## 📤 HOW TO SUBMIT YOUR DATA

### Option 1: Excel/CSV Files
Send me Excel or CSV files with the above information to:
- guards.csv
- clients.csv
- sites.csv

### Option 2: Manual Entry
Provide the information in any format (Word doc, Google Sheets, email, etc.)

### Option 3: Use Seeder Script
After Firebase setup, I can help you create a custom seeder script with your data.

---

## 🔐 SECURITY NOTES

**NEVER SHARE IN PUBLIC:**
- Firebase API keys (keep in .env file)
- Payment gateway keys
- Database credentials
- User passwords

**SAFE TO SHARE WITH DEVELOPER:**
- Company information
- Guard/Client lists (non-sensitive data)
- Branding assets
- Content/descriptions

---

## 📞 NEXT STEPS

1. **Immediately:** Provide Firebase config
2. **Next:** Create admin account
3. **Then:** Share guard and client lists
4. **Finally:** Provide branding materials

Once you provide these, I'll:
- ✅ Configure Firebase
- ✅ Set up authentication
- ✅ Import your data
- ✅ Customize branding
- ✅ Deploy to Netlify
- ✅ Configure your domain
- ✅ Test everything
- ✅ Hand over fully functional platform! 🚀

---

## 💡 TIPS

- **Start Small:** You can begin with just 2-3 sample guards and clients
- **Test First:** Use test data initially, then replace with real data
- **Incremental:** Add more data as you go
- **Backup:** Keep a backup of all data you provide
- **Privacy:** Remove any sensitive personal information from test data

---

## ✉️ CONTACT

If you have any questions about what data to provide or how to format it, just ask!

**Your data is safe and will be:**
- ✅ Stored securely in Firebase
- ✅ Protected by security rules
- ✅ Encrypted in transit and at rest
- ✅ Accessible only by authenticated users
- ✅ Never shared with third parties
