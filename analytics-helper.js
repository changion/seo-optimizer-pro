import { logEvent } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';
import { analyticsReadyPromise } from './firebase-init.js';

class AnalyticsHelper {
    constructor() {
        this.analytics = null;
        this.eventQueue = [];
        this.analyticsReady = false;

        analyticsReadyPromise.then((instance) => {
            this.analytics = instance;
            this.analyticsReady = Boolean(instance);
            if (this.analyticsReady) {
                this.flushQueue();
            }
        });
    }

    log(eventName, params = {}) {
        const payload = {
            page_path: window.location.pathname,
            ...params
        };

        if (this.analyticsReady && this.analytics) {
            try {
                logEvent(this.analytics, eventName, payload);
            } catch (error) {
                console.error(`[Analytics] 记录事件失败: ${eventName}`, error);
            }
        } else {
            this.eventQueue.push({ eventName, payload });
        }
    }

    flushQueue() {
        if (!this.analyticsReady || !this.analytics || this.eventQueue.length === 0) {
            return;
        }

        while (this.eventQueue.length) {
            const { eventName, payload } = this.eventQueue.shift();
            try {
                logEvent(this.analytics, eventName, payload);
            } catch (error) {
                console.error(`[Analytics] 队列事件失败: ${eventName}`, error);
            }
        }
    }

    trackHeroCta(ctaType) {
        this.log('hero_cta_click', {
            cta_type: ctaType,
            section: 'hero'
        });
    }

    trackNavMenu(destinationSection) {
        this.log('nav_menu_click', {
            destination_section: destinationSection
        });
    }

    trackFeatureCardView(featureKey, sequence) {
        this.log('feature_card_view', {
            feature_key: featureKey,
            sequence
        });
    }

    trackToolCta(toolName, ctaLabel) {
        this.log('tool_cta_click', {
            tool_name: toolName,
            cta_label: ctaLabel
        });
    }

    trackPricingInteraction(planName, ctaLabel, billingCycle = 'monthly') {
        this.log('pricing_interaction', {
            plan_name: planName,
            cta_label: ctaLabel,
            billing_cycle: billingCycle
        });
    }
}

const analyticsHelper = new AnalyticsHelper();
window.analyticsHelper = analyticsHelper;

export default analyticsHelper;

