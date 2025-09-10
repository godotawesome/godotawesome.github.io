---
layout: page
title: Cookie Test Page
permalink: /cookie-test
comments: false
---

<div style="text-align: center; margin: 2rem 0;">
<h1>🧪 Cookie System Test Page</h1>
<p style="font-size: 1.1em; color: #666;">Test cookie consent functionality</p>
</div>

---

## 🔍 Debug Information

Open your browser's **Developer Console** (F12) to see debug messages.

### Test Steps:

1. **Open Console** (F12 → Console tab)
2. **Refresh this page**
3. **Look for these messages:**
   - `Initializing cookie consent system...`
   - `Cookie consent system starting up...`
   - `Loading Microsoft Clarity`
   - Current consent data

4. **Test Cookie Banner:**
   - If no consent given → Banner should appear
   - Click "Accept" → Should see `User accepted all cookies`
   - Check for `Loading Google Analytics with ID: {{ site.google_analytics }}`

5. **Check Network Tab:**
   - Look for requests to:
     - `googletagmanager.com/gtag/js?id={{ site.google_analytics }}`
     - `clarity.ms/tag/{{ site.microsoft_clarity }}`

---

## 🛠️ Manual Test Commands

Copy and paste these into your console:

```javascript
// Check if cookie consent system is loaded
console.log('Cookie consent system:', window.cookieConsent);

// Check current consent
console.log('Current consent:', window.cookieConsent?.consentData);

// Check if Google Analytics is loaded
console.log('Google Analytics loaded:', !!window.gtag);

// Check if Microsoft Clarity is loaded  
console.log('Microsoft Clarity loaded:', !!window.clarity);

// Force reload analytics (if consented)
if (window.cookieConsent && window.cookieConsent.hasConsent('analytics')) {
    window.cookieConsent.loadGoogleAnalytics();
}

// Clear all cookies and reload (reset test)
// CookieConsent.revokeConsent();
```

---

## 📊 Expected Behavior

### ✅ **Microsoft Clarity (Always Loads)**
- Should load immediately on page load
- Console message: `Loading Microsoft Clarity`
- Network request to `clarity.ms`

### ✅ **Google Analytics (Only with Consent)**
- Should load only after accepting analytics cookies
- Console message: `Loading Google Analytics with ID: {{ site.google_analytics }}`
- Network request to `googletagmanager.com`

### ✅ **Cookie Banner**
- Shows on first visit
- Disappears after making choice
- Floating settings button appears after consent

---

## 🚨 Common Issues

1. **No console messages** → Script not loading
2. **GA ID not found** → Meta tag missing
3. **Scripts not loading** → Check browser console for errors
4. **Banner not showing** → Check if consent cookie already exists

---

<div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 30px 0;">
<h4 style="color: #495057; margin-bottom: 15px;">🔧 Debugging Tips</h4>
<ul style="margin: 0; color: #6c757d;">
<li>Clear all cookies for this domain to reset</li>
<li>Use incognito/private mode for fresh testing</li>
<li>Check Network tab for failed requests</li>
<li>Verify console for JavaScript errors</li>
</ul>
</div>
