// US Region Configuration
const US_CONFIG = {
    timezone: 'America/New_York', // Eastern Time (can be changed to other US timezones)
    locale: 'en-US',
    currency: 'USD',
    dateFormat: { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'America/New_York'
    },
    timeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/New_York',
        hour12: true
    }
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeDateTime();
    initializePhoneFormatting();
    setupSmoothScrolling();
});

// Initialize date and time display
function initializeDateTime() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Display timezone
    const timezoneElement = document.getElementById('timezone');
    if (timezoneElement) {
        const timezoneName = Intl.DateTimeFormat('en-US', {
            timeZone: US_CONFIG.timezone,
            timeZoneName: 'short'
        }).formatToParts(new Date())
        .find(part => part.type === 'timeZoneName')?.value || 'EST';
        timezoneElement.textContent = timezoneName;
    }
}

// Update date and time
function updateDateTime() {
    const now = new Date();
    
    // Update current date
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = formatUSDate(now);
    }
    
    // Update current time
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = formatUSTime(now);
    }
}

// Format date in US format
function formatUSDate(date) {
    return new Intl.DateTimeFormat(US_CONFIG.locale, {
        ...US_CONFIG.dateFormat,
        weekday: 'long'
    }).format(date);
}

// Format time in US format
function formatUSTime(date) {
    return new Intl.DateTimeFormat(US_CONFIG.locale, US_CONFIG.timeFormat).format(date);
}

// Initialize phone number formatting (US format)
function initializePhoneFormatting() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
            e.target.value = value;
        });
    }
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Show welcome message
function showWelcome() {
    const message = `Welcome to SEO Optimizer Pro! 🔍\n\n` +
                   `Start optimizing your website for search engines today.\n\n` +
                   `✨ Free SEO Analysis Includes:\n` +
                   `• Keyword research & suggestions\n` +
                   `• On-page SEO audit\n` +
                   `• Content optimization score\n` +
                   `• Meta tag analysis\n` +
                   `• Technical SEO check\n\n` +
                   `Ready to boost your rankings? Start your free analysis now!`;
    alert(message);
}

// Show demo information
function showDemo() {
    const info = `SEO Optimizer Pro Demo\n\n` +
                `🎬 See how easy SEO optimization can be:\n\n` +
                `1. Enter your website URL or keywords\n` +
                `2. AI analyzes your SEO performance\n` +
                `3. Get detailed optimization recommendations\n` +
                `4. Implement suggested improvements\n` +
                `5. Track your ranking improvements!\n\n` +
                `Join 30,000+ businesses already using SEO Optimizer Pro\n` +
                `to improve their search rankings and drive more traffic.\n\n` +
                `Start your free trial - No credit card required!`;
    alert(info);
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };
    
    // Validate phone number (US format)
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    if (!phoneRegex.test(formData.phone)) {
        alert('Please enter a valid US phone number in the format (555) 123-4567');
        return;
    }
    
    // Here you would typically send the data to a server
    console.log('Form submitted:', formData);
    
    // Show success message
    alert('Thank you for your message! We will get back to you soon.');
    
    // Reset form
    event.target.reset();
}

// Format currency in US format
function formatCurrency(amount) {
    return new Intl.NumberFormat(US_CONFIG.locale, {
        style: 'currency',
        currency: US_CONFIG.currency
    }).format(amount);
}

// Get current US timezone
function getCurrentTimezone() {
    return Intl.DateTimeFormat('en-US', {
        timeZone: US_CONFIG.timezone,
        timeZoneName: 'long'
    }).formatToParts(new Date())
    .find(part => part.type === 'timeZoneName')?.value || 'Eastern Time';
}

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        US_CONFIG,
        formatUSDate,
        formatUSTime,
        formatCurrency,
        getCurrentTimezone
    };
}

