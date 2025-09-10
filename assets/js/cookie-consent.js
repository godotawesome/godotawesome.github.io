---
layout: null
---
/**
 * Cookie Consent Management System
 * GodotAwesome - GDPR/KVKK Compliant
 */

class CookieConsent {
    constructor() {
        this.cookieName = 'godotawesome_cookie_consent';
        this.cookieExpiry = 365; // days
        this.consentData = this.getConsentData();
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        console.log('Cookie consent system starting up...');
        console.log('Current consent data:', this.consentData);
        
        this.createFloatingButton();
        
        // Always load Microsoft Clarity immediately (necessary for site performance)
        if (!window.clarity) {
            console.log('Loading Microsoft Clarity immediately...');
            this.loadMicrosoftClarity();
        } else {
            console.log('Microsoft Clarity already loaded');
        }
        
        // Show banner if no consent given
        if (!this.consentData.timestamp) {
            console.log('No consent found, showing banner');
            this.showBanner();
        } else {
            console.log('Existing consent found, loading consented scripts');
            // Load scripts based on existing consent
            this.loadConsentedScripts();
        }

        this.bindEvents();
    }

    createFloatingButton() {
        // Create floating cookie settings button
        const floatingButton = document.createElement('button');
        floatingButton.className = 'cookie-settings-float';
        floatingButton.innerHTML = '<i class="fas fa-cog"></i>';
        floatingButton.title = 'Cookie Settings';
        floatingButton.onclick = () => this.showSettings();
        
        // Only show if consent has been given before
        if (this.consentData.timestamp) {
            document.body.appendChild(floatingButton);
        }
    }

    bindEvents() {
        // Banner buttons
        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');
        const settingsBtn = document.getElementById('cookie-settings');
        const saveSettingsBtn = document.getElementById('save-cookie-settings');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.acceptAll());
        }
        
        if (declineBtn) {
            declineBtn.addEventListener('click', () => this.declineAll());
        }
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSettings());
        }
        
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        }

        // Load current settings when modal opens
        $('#cookieSettingsModal').on('shown.bs.modal', () => {
            this.loadCurrentSettings();
        });
    }

    showBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'block';
            // Add some animation
            setTimeout(() => {
                banner.style.opacity = '1';
                banner.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(100%)';
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300);
        }
    }

    showSettings() {
        $('#cookieSettingsModal').modal('show');
    }

    loadCurrentSettings() {
        // Load current consent settings into modal
        document.getElementById('analytics-cookies').checked = this.consentData.analytics || false;
        document.getElementById('functional-cookies').checked = this.consentData.functional || false;
    }

    acceptAll() {
        console.log('User accepted all cookies');
        
        this.setConsent({
            necessary: true,
            analytics: true,
            functional: true,
            timestamp: Date.now()
        });
        
        this.hideBanner();
        this.loadConsentedScripts();
        this.createFloatingButton();
        this.showToast('All cookies accepted', 'success');
    }

    declineAll() {
        this.setConsent({
            necessary: true,
            analytics: false,
            functional: false,
            timestamp: Date.now()
        });
        
        this.hideBanner();
        this.createFloatingButton();
        this.showToast('Only necessary cookies accepted', 'info');
    }

    saveSettings() {
        const analytics = document.getElementById('analytics-cookies').checked;
        const functional = document.getElementById('functional-cookies').checked;
        
        this.setConsent({
            necessary: true,
            analytics: analytics,
            functional: functional,
            timestamp: Date.now()
        });
        
        this.hideBanner();
        this.loadConsentedScripts();
        $('#cookieSettingsModal').modal('hide');
        
        if (!document.querySelector('.cookie-settings-float')) {
            this.createFloatingButton();
        }
        
        this.showToast('Cookie settings saved', 'success');
    }

    setConsent(consentData) {
        this.consentData = consentData;
        const cookieValue = JSON.stringify(consentData);
        const expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + (this.cookieExpiry * 24 * 60 * 60 * 1000));
        
        document.cookie = `${this.cookieName}=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    }

    getConsentData() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === this.cookieName) {
                try {
                    return JSON.parse(decodeURIComponent(value));
                } catch (e) {
                    return {};
                }
            }
        }
        return {};
    }

    hasConsent(type) {
        return this.consentData[type] === true;
    }

    loadConsentedScripts() {
        // Always load Microsoft Clarity (necessary for site performance)
        if (!window.clarity) {
            this.loadMicrosoftClarity();
        }
        
        // Load Google Analytics only if consented
        if (this.hasConsent('analytics') && !window.gtag) {
            this.loadGoogleAnalytics();
        }
        
        // Load functional scripts if consented
        if (this.hasConsent('functional')) {
            this.loadDisqus();
        }
    }

    loadGoogleAnalytics() {
        // Check if Google Analytics is already loaded
        if (window.gtag) {
            console.log('Google Analytics already loaded in head');
            return;
        }

        const gaId = this.getGoogleAnalyticsId();
        if (!gaId) {
            console.log('Google Analytics ID not found');
            return;
        }

        console.log('Loading Google Analytics with ID:', gaId);
        console.log('GA ID from config:', '{{ site.google_analytics }}');

        // Load gtag script
        const gtagScript = document.createElement('script');
        gtagScript.async = true;
        gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(gtagScript);

        // Initialize gtag
        gtagScript.onload = () => {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', gaId, {
                'anonymize_ip': true,
                'cookie_flags': 'SameSite=Lax;Secure',
                'send_page_view': true,
                'debug_mode': false
            });
            window.gtag = gtag;
            console.log('Google Analytics loaded successfully');
            
            // Send test event to verify it's working
            setTimeout(() => {
                gtag('event', 'cookie_consent', {
                    'event_category': 'engagement',
                    'event_label': 'analytics_accepted',
                    'value': 1
                });
                console.log('Test event sent to Google Analytics');
            }, 1000);
        };

        gtagScript.onerror = () => {
            console.error('Failed to load Google Analytics script');
        };
    }

    loadMicrosoftClarity() {
        if (window.clarity) {
            console.log('Microsoft Clarity already loaded');
            return;
        }
        
        console.log('Loading Microsoft Clarity');
        console.log('Clarity ID from config:', '{{ site.microsoft_clarity }}');
        
        const clarityScript = document.createElement('script');
        clarityScript.innerHTML = `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "{{ site.microsoft_clarity }}");
        `;
        document.head.appendChild(clarityScript);
        console.log('Microsoft Clarity script added to page');
        
        // Wait for Clarity to load and send test event
        setTimeout(() => {
            if (window.clarity) {
                clarity('set', 'cookie_consent', 'accepted');
                console.log('Test tag sent to Microsoft Clarity');
            } else {
                console.log('Microsoft Clarity not yet available');
            }
        }, 2000);
    }

    loadDisqus() {
        // Disqus will be loaded by the include file when needed
        // This is just to track that functional cookies are accepted
        window.functionalCookiesAccepted = true;
    }

    getGoogleAnalyticsId() {
        // Try to get GA ID from meta tag first
        const gaMeta = document.querySelector('meta[name="google-analytics"]');
        if (gaMeta && gaMeta.content) {
            return gaMeta.content;
        }
        
        // Fallback - try to extract from existing gtag script
        const gtagScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
        if (gtagScript) {
            const match = gtagScript.src.match(/id=([^&]+)/);
            return match ? match[1] : null;
        }
        
        // Final fallback - this will be replaced by Jekyll
        return '{{ site.google_analytics }}';
    }

    showToast(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `cookie-toast cookie-toast-${type}`;
        toast.innerHTML = `
            <div class="cookie-toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add toast styles if not already present
        if (!document.querySelector('#cookie-toast-styles')) {
            const style = document.createElement('style');
            style.id = 'cookie-toast-styles';
            style.textContent = `
                .cookie-toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    padding: 15px 20px;
                    z-index: 10001;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                    max-width: 300px;
                }
                .cookie-toast-success { border-left: 4px solid #28a745; }
                .cookie-toast-info { border-left: 4px solid #17a2b8; }
                .cookie-toast-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .cookie-toast-content i {
                    color: #28a745;
                    font-size: 18px;
                }
                .cookie-toast-info .cookie-toast-content i {
                    color: #17a2b8;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // Public method to check consent from other scripts
    static hasConsent(type) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'godotawesome_cookie_consent') {
                try {
                    const consentData = JSON.parse(decodeURIComponent(value));
                    return consentData[type] === true;
                } catch (e) {
                    return false;
                }
            }
        }
        return false;
    }

    // Public method to revoke consent
    static revokeConsent() {
        document.cookie = 'godotawesome_cookie_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        location.reload();
    }
}

// Initialize cookie consent system
function initializeCookieConsent() {
    console.log('Initializing cookie consent system...');
    try {
        window.cookieConsent = new CookieConsent();
        console.log('Cookie consent system initialized successfully');
    } catch (error) {
        console.error('Failed to initialize cookie consent system:', error);
    }
}

// Initialize immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCookieConsent);
} else {
    // DOM is already ready
    initializeCookieConsent();
}

// Export for use in other scripts
window.CookieConsent = CookieConsent;
