// public/ai-tracker.js - فقط جمع‌آوری داده
console.log('📦 AI Tracker - Data Collector v4');

class AITracker {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.apiUrl = config.apiUrl || 'http://localhost:3000/api/v1';
        this.sessionId = 'session_' + Date.now();

        // ⭐ ذخیره همه داده‌های خام
        this.data = {
            session_id: this.sessionId,
            start_time: Date.now(),
            clicks: [],
            mouse_path: [],
            scroll_depths: [],
            hover_events: [],
            page_url: window.location.href,
            referrer: document.referrer,
            device: {
                screen: `${window.screen.width}x${window.screen.height}`,
                platform: navigator.platform,
                language: navigator.language,
                user_agent: navigator.userAgent.substring(0, 100)
            }
        };

        this.init();
    }

    init() {
        this.trackClicks();
        this.trackMouse();
        this.trackScroll();
        this.trackHover();
        this.setupSendOnExit();

        console.log('🚀 Collector started:', this.sessionId);
    }

    // ===== ردیابی کلیک =====
    trackClicks() {
        document.addEventListener('click', (e) => {
            this.data.clicks.push({
                tag: e.target.tagName,
                text: (e.target.textContent || '').trim().substring(0, 100),
                className: (e.target.className || '').substring(0, 100),
                id: e.target.id || '',
                href: e.target.closest('a')?.href || '',
                x: e.clientX,
                y: e.clientY,
                time: Date.now()
            });
        });
    }

    // ===== ردیابی موس =====
    trackMouse() {
        let lastTime = Date.now();

        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastTime > 500) { // هر نیم ثانیه
                this.data.mouse_path.push({
                    x: e.clientX,
                    y: e.clientY,
                    time: now
                });
                lastTime = now;
            }
        });
    }

    // ===== ردیابی اسکرول =====
    trackScroll() {
        window.addEventListener('scroll', () => {
            const depth = window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
            this.data.scroll_depths.push({
                depth: Math.round(depth * 100),
                time: Date.now()
            });
        });
    }

    // ===== ردیابی توقف موس (hover) =====
    trackHover() {
        let hoverTimer = null;
        let currentElement = null;

        document.addEventListener('mouseover', (e) => {
            const target = e.target;
            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('[class*="product"]')) {
                currentElement = {
                    tag: target.tagName,
                    text: (target.textContent || '').trim().substring(0, 100),
                    className: (target.className || '').substring(0, 100)
                };
                hoverTimer = Date.now();
            }
        });

        document.addEventListener('mouseout', () => {
            if (hoverTimer && currentElement) {
                const duration = Date.now() - hoverTimer;
                if (duration > 1000) { // بیش از ۱ ثانیه توقف
                    this.data.hover_events.push({
                        ...currentElement,
                        duration_ms: duration,
                        time: Date.now()
                    });
                }
                hoverTimer = null;
                currentElement = null;
            }
        });
    }

    // ===== ارسال موقع خروج =====
    setupSendOnExit() {
        const sendData = () => {
            this.data.end_time = Date.now();
            this.data.duration_seconds = Math.floor((this.data.end_time - this.data.start_time) / 1000);

            const payload = this.preparePayload();

            if (navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
                navigator.sendBeacon(`${this.apiUrl}/behavior/collect`, blob);
            } else {
                fetch(`${this.apiUrl}/behavior/collect`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    keepalive: true
                });
            }

            console.log('📤 Raw data sent to server:', this.data.clicks.length, 'clicks');
        };

        // موقع بستن/رفرش صفحه
        window.addEventListener('beforeunload', sendData);

        // موقع کلیک روی لینک
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && !link.href.startsWith('javascript') && !link.href.startsWith('#')) {
                sendData();
            }
        }, true);
    }

    preparePayload() {
        return {
            api_key: this.apiKey,
            session_id: this.data.session_id,
            page_url: this.data.page_url,
            referrer: this.data.referrer,
            device: this.data.device,
            start_time: new Date(this.data.start_time).toISOString(),
            end_time: new Date(this.data.end_time).toISOString(),
            duration_seconds: this.data.duration_seconds,
            total_clicks: this.data.clicks.length,
            total_mouse_moves: this.data.mouse_path.length,
            max_scroll_depth: Math.max(...this.data.scroll_depths.map(s => s.depth), 0),
            total_hovers: this.data.hover_events.length,
            clicks: this.data.clicks,
            mouse_path_sample: this.data.mouse_path.slice(-50),
            scroll_samples: this.data.scroll_depths.slice(-20),
            hover_samples: this.data.hover_events.slice(-20)
        };
    }
}

// ⭐ استارت
window.AITracker = AITracker;
new AITracker({
    apiKey: 'ai_sales_cd3fe1fbea1e326e529bae7d1ddaa629',
    apiUrl: 'http://localhost:3000/api/v1'
});