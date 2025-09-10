---
layout: page
title: Analytics Test
permalink: /analytics-test
comments: false
---

<div style="text-align: center; margin: 2rem 0;">
<h1>📊 Analytics Test Page</h1>
<p style="font-size: 1.1em; color: #666;">Real analytics testing</p>
</div>

---

## 🔍 Real-Time Analytics Check

### 1. **Google Analytics Test**

**Console Commands:**
```javascript
// Check if gtag is loaded
console.log('gtag function:', typeof window.gtag);

// Check dataLayer
console.log('dataLayer:', window.dataLayer);

// Send test event manually
if (window.gtag) {
    gtag('event', 'test_event', {
        'event_category': 'engagement',
        'event_label': 'manual_test',
        'value': 1
    });
    console.log('Test event sent to Google Analytics');
}

// Check if GA is really working
if (window.gtag) {
    gtag('config', '{{ site.google_analytics }}', {
        'custom_map': {'custom_parameter': 'test_value'},
        'send_page_view': true
    });
    console.log('Page view sent to GA');
}
```

### 2. **Microsoft Clarity Test**

**Console Commands:**
```javascript
// Check if clarity is loaded
console.log('Clarity function:', typeof window.clarity);

// Check clarity object
console.log('Clarity object:', window.clarity);

// Send test event manually
if (window.clarity) {
    clarity('set', 'test_tag', 'analytics_test_page');
    console.log('Test tag sent to Microsoft Clarity');
}
```

### 3. **Network Tab Verification**

**Check these requests in Network tab:**

1. **Google Analytics:**
   - URL: `https://www.google-analytics.com/g/collect`
   - Method: POST
   - Should contain: `tid={{ site.google_analytics }}`

2. **Microsoft Clarity:**
   - URL: `https://www.clarity.ms/collect`
   - Method: POST
   - Should contain session data

---

## 🚨 **Troubleshooting Steps**

### Step 1: Force Manual Loading
```javascript
// Force load Google Analytics manually
const script = document.createElement('script');
script.src = 'https://www.googletagmanager.com/gtag/js?id={{ site.google_analytics }}';
script.async = true;
script.onload = function() {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '{{ site.google_analytics }}', {
        'send_page_view': true,
        'debug_mode': true
    });
    console.log('GA manually loaded and configured');
};
document.head.appendChild(script);
```

### Step 2: Check Real-Time Reports
1. **Google Analytics**: Go to Realtime → Overview
2. **Microsoft Clarity**: Go to your Clarity dashboard
3. **Browse this page** and check if visitor appears

### Step 3: Debug Mode
```javascript
// Enable GA debug mode
if (window.gtag) {
    gtag('config', '{{ site.google_analytics }}', {
        'debug_mode': true,
        'send_page_view': true
    });
}
```

---

## 🎯 **Test Actions**

Click these buttons to generate events:

<div style="margin: 20px 0;">
<button onclick="testGoogleAnalytics()" class="btn btn-primary">Test Google Analytics Event</button>
<button onclick="testMicrosoftClarity()" class="btn btn-success">Test Microsoft Clarity</button>
<button onclick="testPageView()" class="btn btn-info">Test Page View</button>
</div>

<script>
function testGoogleAnalytics() {
    if (window.gtag) {
        gtag('event', 'button_click', {
            'event_category': 'engagement',
            'event_label': 'analytics_test_button',
            'value': 1
        });
        alert('Google Analytics event sent! Check Network tab.');
    } else {
        alert('Google Analytics not loaded!');
    }
}

function testMicrosoftClarity() {
    if (window.clarity) {
        clarity('set', 'test_button', 'clicked');
        alert('Microsoft Clarity event sent!');
    } else {
        alert('Microsoft Clarity not loaded!');
    }
}

function testPageView() {
    if (window.gtag) {
        gtag('config', '{{ site.google_analytics }}', {
            'page_title': 'Analytics Test Page',
            'page_location': window.location.href,
            'send_page_view': true
        });
        alert('Page view sent to Google Analytics!');
    } else {
        alert('Google Analytics not loaded!');
    }
}

// Auto-run tests on page load
window.addEventListener('load', function() {
    console.log('=== ANALYTICS TEST PAGE LOADED ===');
    console.log('gtag available:', typeof window.gtag);
    console.log('clarity available:', typeof window.clarity);
    console.log('dataLayer:', window.dataLayer);
    
    // Wait a bit for scripts to load
    setTimeout(function() {
        console.log('=== AFTER 3 SECONDS ===');
        console.log('gtag available:', typeof window.gtag);
        console.log('clarity available:', typeof window.clarity);
        
        if (window.gtag) {
            console.log('Sending test page view...');
            gtag('event', 'page_view', {
                'page_title': 'Analytics Test Page',
                'page_location': window.location.href
            });
        }
        
        if (window.clarity) {
            console.log('Setting clarity tag...');
            clarity('set', 'test_page', 'analytics_test');
        }
    }, 3000);
});
</script>

---

## 📱 **Expected Results**

### ✅ **If Working:**
- Network requests to `google-analytics.com/g/collect`
- Network requests to `clarity.ms/collect`
- Real-time visitors in GA dashboard
- Session data in Clarity dashboard

### ❌ **If Not Working:**
- No network requests
- Console errors
- `gtag` or `clarity` undefined
- No real-time data in dashboards

---

<div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 30px 0; border-left: 4px solid #ffc107;">
<h4 style="color: #856404; margin-bottom: 15px;">⚠️ Important</h4>
<p style="margin: 0; color: #856404;">Real-time analytics may take 1-5 minutes to appear in dashboards. Check Network tab for immediate verification of data sending.</p>
</div>
