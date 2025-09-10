/**
 * Cookie Consent (Vanilla JS)
 * GDPR/KVKK Compliant
 * Works with your existing HTML banner + modal
 */

class CookieConsent {
    constructor() {
        this.storageKey = "cookieConsent";
        this.settings = this.loadConsent() || null;
        this.init();
    }

    init() {
        if (!this.settings) {
            this.showBanner();
        } else {
            this.applyConsent();
        }
        this.bindEvents();
        this.createFloatingButton();
    }

    bindEvents() {
        const acceptBtn = document.getElementById("cookie-accept");
        const declineBtn = document.getElementById("cookie-decline");
        const saveBtn = document.getElementById("save-cookie-settings");

        if (acceptBtn) acceptBtn.addEventListener("click", () => this.acceptAll());
        if (declineBtn) declineBtn.addEventListener("click", () => this.declineAll());
        if (saveBtn) saveBtn.addEventListener("click", () => this.saveSettings());
    }

    showBanner() {
        const banner = document.getElementById("cookie-banner");
        if (banner) banner.style.display = "block";
    }

    hideBanner() {
        const banner = document.getElementById("cookie-banner");
        if (banner) banner.style.display = "none";
    }

    acceptAll() {
        this.settings = {
            necessary: true,
            analytics: true,
            functional: true,
            clarity: true,
            timestamp: Date.now()
        };
        this.saveConsent();
        this.applyConsent();
        this.hideBanner();
    }

    declineAll() {
        this.settings = {
            necessary: true,
            analytics: false,
            functional: false,
            clarity: false,
            timestamp: Date.now()
        };
        this.saveConsent();
        this.applyConsent();
        this.hideBanner();
    }

    saveSettings() {
        this.settings = {
            necessary: true,
            analytics: document.getElementById("analytics-cookies").checked,
            functional: document.getElementById("functional-cookies").checked,
            clarity: document.getElementById("necessary-cookies").checked, // optional toggle if you want clarity opt-in
            timestamp: Date.now()
        };
        this.saveConsent();
        this.applyConsent();
        this.hideBanner();

        // close modal (Bootstrap 5)
        const modal = bootstrap.Modal.getInstance(document.getElementById("cookieSettingsModal"));
        if (modal) modal.hide();
    }

    saveConsent() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    }

    loadConsent() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey));
        } catch {
            return null;
        }
    }

    applyConsent() {
        if (!this.settings) return;

        // Google Analytics
        if (this.settings.analytics) {
            this.loadGoogleAnalytics("{{ site.google_analytics }}"); // <- GA ID buraya
        }

        // Microsoft Clarity
        if (this.settings.clarity) {
            this.loadClarity("{{ site.microsoft_clarity }}"); // <- Clarity ID buraya
        }

        // Disqus / diğer fonksiyonel şeyler
        if (this.settings.functional) {
            console.log("Functional cookies allowed → load Disqus or others");
        }
    }

    loadGoogleAnalytics(gaId) {
        if (!gaId) return;
        if (window.gtag) return; // already loaded

        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        script.onload = () => {
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            window.gtag = gtag;

            gtag("js", new Date());
            gtag("config", gaId, { anonymize_ip: true });
            console.log("Google Analytics loaded");
        };
    }

    loadClarity(clarityId) {
        if (!clarityId) return;
        if (window.clarity) return;

        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", clarityId);

        console.log("Microsoft Clarity loaded");
    }

    createFloatingButton() {
        if (document.querySelector(".cookie-settings-float")) return;

        const btn = document.createElement("button");
        btn.className = "cookie-settings-float";
        btn.innerHTML = '<i class="fas fa-cog"></i>';
        btn.title = "Cookie Settings";
        btn.addEventListener("click", () => {
            const modal = new bootstrap.Modal(document.getElementById("cookieSettingsModal"));
            modal.show();
            this.loadCurrentSettings();
        });

        document.body.appendChild(btn);
    }

    loadCurrentSettings() {
        if (!this.settings) return;
        document.getElementById("analytics-cookies").checked = this.settings.analytics || false;
        document.getElementById("functional-cookies").checked = this.settings.functional || false;
    }
}

// initialize
document.addEventListener("DOMContentLoaded", () => {
    window.cookieConsent = new CookieConsent();
});
