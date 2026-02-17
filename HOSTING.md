# Hosting Guide - Zpluse Security

This project is hosted on Netlify with custom GoDaddy domain integration.

## 🚀 Deploying to Netlify

### Option 1: Git Integration (Recommended)
1. Push your code to GitHub
2. Go to [Netlify](https://www.netlify.com/) and sign in
3. Click **Add new site** → **Import an existing project**
4. Connect to GitHub and select your repository
5. Build settings (auto-detected for Vite):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **Deploy site**

### Option 2: Manual Deploy
1. Run `npm run build` to create the `dist` folder
2. Drag and drop the `dist` folder to Netlify dashboard

---

## 🌐 Connecting Your GoDaddy Domain to Netlify

### Step 1: Add Custom Domain in Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Domain settings**
3. Click **Add custom domain**
4. Enter your GoDaddy domain (e.g., `zpluse.com`)
5. Click **Verify** → **Add domain**

Netlify will provide you with **nameservers** to configure.

### Step 2: Get Your Netlify Nameservers

Your Netlify nameservers are:
```
dns1.p09.nsone.net
dns2.p09.nsone.net
dns3.p09.nsone.net
dns4.p09.nsone.net
```

### Step 3: Update Nameservers in GoDaddy

1. **Log into GoDaddy**
   - Go to [GoDaddy.com](https://www.godaddy.com/)
   - Sign in to your account

2. **Navigate to Your Domain**
   - Click **My Products** in the top menu
   - Find your domain in the list
   - Click **DNS** or **Manage** next to your domain

3. **Change Nameservers**
   - Scroll down to the **Nameservers** section
   - Click the **Change** button
   - Select **Enter my own nameservers (advanced)**
   - You'll see input fields for nameservers

4. **Replace with Netlify Nameservers**
   - Remove existing GoDaddy nameservers
   - Enter the Netlify nameservers:
     - **Nameserver 1**: `dns1.p09.nsone.net`
     - **Nameserver 2**: `dns2.p09.nsone.net`
     - **Nameserver 3**: `dns3.p09.nsone.net`
     - **Nameserver 4**: `dns4.p09.nsone.net`
   - Click **Save**

5. **Confirm Changes**
   - GoDaddy may show a warning about losing email/hosting services
   - If you don't have email set up, click **Confirm** or **Continue**

### Step 4: Wait for DNS Propagation

- **Typical time**: 1-2 hours
- **Maximum time**: Up to 48 hours
- **Check status**: Use [WhatsMyDNS.net](https://www.whatsmydns.net/)
  - Enter your domain name
  - Select "NS" (nameserver) record type
  - You should see the Netlify nameservers propagating globally

### Step 5: Verify DNS in Netlify

1. Return to your Netlify **Domain settings**
2. Wait for the verification status to change
3. Netlify will automatically detect when DNS is configured correctly
4. You'll see a success message: ✅ **Domain verified**

### Step 6: Enable HTTPS (SSL Certificate)

1. In Netlify **Domain settings**, scroll to **HTTPS** section
2. Click **Verify DNS configuration** (if needed)
3. Click **Provision certificate**
   - Netlify uses **Let's Encrypt** for free SSL
   - This takes 1-2 minutes
4. Once provisioned, enable **Force HTTPS**
   - This redirects all HTTP traffic to HTTPS

---

## 📋 Important Notes

### ⚠️ Email Services
If you have email configured on your domain (GoDaddy Email, Google Workspace, etc.):
- You'll need to add **MX records** in Netlify DNS after nameserver change
- Go to Netlify → **Domain settings** → **DNS panel**
- Add your email provider's MX records manually

### ✅ www Subdomain
- Netlify automatically handles both `yourdomain.com` and `www.yourdomain.com`
- You can set which version is primary in **Domain settings**
- The other will automatically redirect to the primary

### 🔄 Automatic Deployments
- After domain connection, every push to GitHub triggers a rebuild
- Changes go live in 1-2 minutes
- You can view deployment status in Netlify dashboard

---

## 🛠️ Troubleshooting

### Domain Not Connecting After 48 Hours
- ✅ Verify nameservers in GoDaddy (check for typos)
- ✅ Clear browser cache or use incognito mode
- ✅ Check DNS with: `nslookup yourdomain.com` in terminal
- ✅ Try removing and re-adding domain in Netlify

### SSL Certificate Not Provisioning
- ✅ Ensure DNS propagation is complete (all green on WhatsMyDNS)
- ✅ Check that both root and www resolve correctly
- ✅ Wait 24 hours after nameserver change
- ✅ Contact Netlify support if still failing

### 404 Errors on Page Refresh
This happens with React Router SPAs. Fix it by creating a `_redirects` file:

**Create**: `public/_redirects` (already configured in this project)
```
/*  /index.html  200
```

This tells Netlify to serve `index.html` for all routes, allowing React Router to handle routing.

---

## 📊 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Site deployed on Netlify
- [ ] Custom domain added in Netlify
- [ ] Nameservers updated in GoDaddy
- [ ] DNS propagation complete (1-48 hours)
- [ ] Domain verified in Netlify
- [ ] SSL certificate provisioned
- [ ] Force HTTPS enabled
- [ ] Test site on custom domain
- [ ] Verify all pages load correctly
- [ ] Verify SSL shows as secure in browser

---

## 🔗 Useful Links

- [Netlify Dashboard](https://app.netlify.com/)
- [GoDaddy Domain Management](https://dcc.godaddy.com/domains)
- [Check DNS Propagation](https://www.whatsmydns.net/)
- [Netlify Documentation](https://docs.netlify.com/)

---

**Your site will be live at your custom domain once DNS propagation completes!** 🎉
