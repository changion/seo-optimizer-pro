// SEO Analyzer JavaScript

// Initialize date/time when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (typeof initializeDateTime === 'function') {
        initializeDateTime();
    }
});

// Analyze SEO function
async function analyzeSEO(event) {
    event.preventDefault();
    
    const url = document.getElementById('websiteUrl').value.trim();
    if (!url) {
        alert('Please enter a valid URL');
        return;
    }

    // Show loading
    document.getElementById('loading').classList.add('active');
    document.getElementById('results').classList.remove('active');

    try {
        // Simulate analysis delay (in real implementation, this would call an API)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Perform SEO analysis
        const analysis = await performSEOAnalysis(url);
        
        // Display results
        displayResults(analysis);
        
    } catch (error) {
        console.error('SEO Analysis Error:', error);
        
        // Show user-friendly error message
        let errorMessage = 'Error analyzing website. ';
        if (error.message.includes('backend server')) {
            errorMessage = error.message;
        } else if (error.message.includes('timeout')) {
            errorMessage = 'The website took too long to respond. Please try again.';
        } else if (error.message.includes('not found')) {
            errorMessage = 'Website not found. Please check the URL and try again.';
        } else {
            errorMessage += error.message || 'Please try again.';
        }
        
        alert(errorMessage);
    } finally {
        document.getElementById('loading').classList.remove('active');
    }
}

// API Configuration
// 从配置文件获取API地址，如果没有则自动检测环境
const API_BASE_URL = window.API_CONFIG?.apiBaseUrl || (() => {
    // 自动检测环境
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    }
    // 生产环境：部署时请修改 config.js 中的 production.apiBaseUrl
    return 'https://your-backend-domain.com/api';
})();

// Perform SEO Analysis
async function performSEOAnalysis(url) {
    try {
        // Call backend API
        const response = await fetch(`${API_BASE_URL}/analyze-seo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success && result.data) {
            return result.data;
        } else {
            throw new Error(result.error || 'Analysis failed');
        }
    } catch (error) {
        console.error('API Error:', error);
        // If API is not available, show helpful error message
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('Unable to connect to SEO analysis service. Please make sure the backend server is running on http://localhost:3000');
        }
        throw error;
    }
}

// Note: SEO analysis is now performed by the backend API
// The actual analysis functions are in server/services/seoAnalyzer.js

// Display analysis results
function displayResults(analysis) {
    // Overall score
    document.getElementById('overallScore').textContent = analysis.overallScore;
    const scoreDesc = getScoreDescription(analysis.overallScore);
    document.getElementById('scoreDescription').textContent = scoreDesc;
    
    // On-page SEO
    displayChecks('onPageChecks', analysis.onPage);
    
    // Content analysis
    displayChecks('contentChecks', analysis.content);
    
    // Technical SEO
    displayChecks('technicalChecks', analysis.technical);
    
    // Keywords
    displayKeywords(analysis.keywords);
    
    // Recommendations
    displayRecommendations(analysis.recommendations);
    
    // Show results
    document.getElementById('results').classList.add('active');
    
    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Display check items
function displayChecks(containerId, checks) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    checks.forEach(check => {
        const icon = getStatusIcon(check.status);
        const item = document.createElement('div');
        item.className = 'check-item';
        item.innerHTML = `
            <div class="check-icon status-${check.status}">${icon}</div>
            <div class="check-content">
                <div class="check-title">${check.title}</div>
                <div class="check-description">${check.description}</div>
            </div>
            <div style="color: var(--text-light); font-size: 0.9rem;">${check.value}</div>
        `;
        container.appendChild(item);
    });
}

// Display keywords
function displayKeywords(keywords) {
    const container = document.getElementById('keywordsSection');
    container.innerHTML = `
        <p style="color: var(--text-light); margin-bottom: 1rem;">
            Keywords found in URL and content analysis:
        </p>
        <div class="keyword-list">
            ${keywords.map(kw => `<span class="keyword-tag">${kw}</span>`).join('')}
        </div>
    `;
}

// Display recommendations
function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendations');
    container.innerHTML = '';
    
    recommendations.forEach(rec => {
        const priorityClass = rec.priority === 'high' ? 'status-error' : 
                             rec.priority === 'medium' ? 'status-warning' : 'status-good';
        const item = document.createElement('div');
        item.className = 'check-item';
        item.innerHTML = `
            <div class="check-icon ${priorityClass}">💡</div>
            <div class="check-content">
                <div class="check-title">${rec.title} <span style="font-size: 0.8rem; color: var(--text-light);">(${rec.priority} priority)</span></div>
                <div class="check-description">${rec.description}</div>
            </div>
        `;
        container.appendChild(item);
    });
}

// Get status icon
function getStatusIcon(status) {
    switch(status) {
        case 'good': return '✅';
        case 'warning': return '⚠️';
        case 'error': return '❌';
        default: return 'ℹ️';
    }
}

// Get score description
function getScoreDescription(score) {
    if (score >= 90) return 'Excellent! Your SEO is well optimized.';
    if (score >= 70) return 'Good! Some improvements can be made.';
    if (score >= 50) return 'Fair. Several areas need optimization.';
    return 'Needs significant improvement.';
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        analyzeSEO,
        performSEOAnalysis,
        calculateOverallScore
    };
}

