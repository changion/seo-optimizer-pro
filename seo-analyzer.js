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
const API_BASE_URL = (() => {
    // 优先使用配置文件
    if (window.API_CONFIG?.apiBaseUrl) {
        console.log('Using API config from config.js:', window.API_CONFIG.apiBaseUrl);
        return window.API_CONFIG.apiBaseUrl;
    }
    
    // 自动检测环境（fallback）
    const hostname = window.location.hostname;
    console.log('API_CONFIG not found, detecting environment. Hostname:', hostname);
    
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('localhost')) {
        return 'http://localhost:3000/api';
    }
    
    // 生产环境默认值（应该通过config.js配置）
    console.warn('Using fallback production API URL. Please configure config.js');
    return 'https://seo-optimizer-pro.onrender.com/api';
})();

console.log('Final API_BASE_URL:', API_BASE_URL);

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
        console.error('API_BASE_URL:', API_BASE_URL);
        console.error('Current hostname:', window.location.hostname);
        // If API is not available, show helpful error message
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            const isProd = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
            const errorMsg = isProd 
                ? `Unable to connect to SEO analysis service. Please check if the backend API is running at ${API_BASE_URL}`
                : 'Unable to connect to SEO analysis service. Please make sure the backend server is running on http://localhost:3000';
            throw new Error(errorMsg);
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
        
        // Add generate button for Title and Meta Description
        let generateButton = '';
        if (containerId === 'onPageChecks' && (check.title === 'Title Tag' || check.title === 'Meta Description')) {
            const type = check.title === 'Title Tag' ? 'title' : 'description';
            const currentValue = check.value !== 'Missing' ? check.value : '';
            generateButton = `<button class="generate-btn" onclick="generateAIContent('${type}', '${escapeHtml(currentValue)}', '${escapeHtml(analysis.keywords[0] || '')}')">Generate AI Version</button>`;
        }
        
        item.innerHTML = `
            <div class="check-icon status-${check.status}">${icon}</div>
            <div class="check-content">
                <div class="check-title">${check.title}</div>
                <div class="check-description">${check.description}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="color: var(--text-light); font-size: 0.9rem;">${check.value}</div>
                ${generateButton}
            </div>
        `;
        container.appendChild(item);
    });
}

// Store current analysis data for AI generation
let currentAnalysis = null;

// Update displayResults to store analysis
function displayResults(analysis) {
    currentAnalysis = analysis; // Store for AI generation
    
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

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

// Generate AI Content
async function generateAIContent(type, currentValue, targetKeyword) {
    try {
        // Show modal with loading state
        showAIModal(type, true);
        
        // Prepare request data
        const requestData = {
            type: type,
            targetKeyword: targetKeyword || '',
            pageUrl: currentAnalysis?.url || '',
            count: 3,
            tone: 'professional'
        };
        
        if (type === 'title') {
            requestData.currentTitle = currentValue;
        } else if (type === 'description') {
            requestData.currentDescription = currentValue;
        }
        
        // Add page content summary if available
        if (currentAnalysis?.content) {
            const contentCheck = currentAnalysis.content.find(c => c.title === 'Content Length');
            if (contentCheck) {
                requestData.pageContent = `Page has ${contentCheck.value}`;
            }
        }
        
        // Call API
        const API_BASE_URL = (() => {
            if (window.API_CONFIG?.apiBaseUrl) {
                return window.API_CONFIG.apiBaseUrl;
            }
            const hostname = window.location.hostname;
            if (hostname === 'localhost' || hostname === '127.0.0.1') {
                return 'http://localhost:3000/api';
            }
            return 'https://seo-optimizer-pro.onrender.com/api';
        })();
        
        const response = await fetch(`${API_BASE_URL}/generate-title-description`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate content');
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
            // Display results
            displayAIGeneratedContent(result.data, type);
        } else {
            throw new Error(result.error || 'Failed to generate content');
        }
        
    } catch (error) {
        console.error('AI Generation Error:', error);
        showAIError(error.message);
    }
}

// Show AI Modal
function showAIModal(type, isLoading = false) {
    const modal = document.getElementById('aiModal');
    const title = document.getElementById('aiModalTitle');
    const body = document.getElementById('aiModalBody');
    
    title.textContent = isLoading 
        ? `Generating AI ${type === 'title' ? 'Titles' : 'Descriptions'}...`
        : `AI Generated ${type === 'title' ? 'Titles' : 'Descriptions'}`;
    
    if (isLoading) {
        body.innerHTML = `
            <div class="ai-loading">
                <div class="ai-loading-spinner"></div>
                <p>AI is generating optimized versions...</p>
            </div>
        `;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close AI Modal
function closeAIModal() {
    const modal = document.getElementById('aiModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Display AI Generated Content
function displayAIGeneratedContent(data, type) {
    const body = document.getElementById('aiModalBody');
    const title = document.getElementById('aiModalTitle');
    
    title.textContent = `AI Generated ${type === 'title' ? 'Titles' : 'Descriptions'}`;
    
    if (!data.generated || data.generated.length === 0) {
        body.innerHTML = '<p>No content generated. Please try again.</p>';
        return;
    }
    
    let html = '';
    data.generated.forEach((item, index) => {
        const lengthStatus = type === 'title' 
            ? (item.characterCount >= 50 && item.characterCount <= 60 ? 'good' : 'warning')
            : (item.characterCount >= 120 && item.characterCount <= 160 ? 'good' : 'warning');
        
        html += `
            <div class="ai-version-card">
                <div class="ai-version-header">
                    <div class="ai-version-text">${escapeHtml(item.text)}</div>
                    <button class="ai-version-copy" onclick="copyAIContent(this, '${escapeHtml(item.text)}')">Copy</button>
                </div>
                <div class="ai-version-stats">
                    <div class="ai-stat-item">
                        <span class="ai-stat-label">📊 SEO Score:</span>
                        <span class="ai-stat-value ${item.seoScore >= 80 ? 'good' : item.seoScore >= 60 ? 'warning' : ''}">${item.seoScore}/100</span>
                    </div>
                    <div class="ai-stat-item">
                        <span class="ai-stat-label">📏 Length:</span>
                        <span class="ai-stat-value ${lengthStatus}">${item.characterCount} chars</span>
                    </div>
                    ${item.keywordDensity > 0 ? `
                    <div class="ai-stat-item">
                        <span class="ai-stat-label">🎯 Keyword:</span>
                        <span class="ai-stat-value ${item.includesKeyword ? 'good' : 'warning'}">${item.includesKeyword ? 'Included' : 'Missing'}</span>
                    </div>
                    ` : ''}
                    <div class="ai-stat-item">
                        <span class="ai-stat-label">📖 Readability:</span>
                        <span class="ai-stat-value ${item.readabilityScore >= 70 ? 'good' : 'warning'}">${item.readabilityScore}/100</span>
                    </div>
                </div>
                ${item.reasoning ? `
                <div class="ai-reasoning">
                    <div class="ai-reasoning-title">💡 Why this works:</div>
                    <div class="ai-reasoning-text">${escapeHtml(item.reasoning)}</div>
                </div>
                ` : ''}
            </div>
        `;
    });
    
    body.innerHTML = html;
}

// Copy AI Content to Clipboard
async function copyAIContent(button, text) {
    try {
        await navigator.clipboard.writeText(text);
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    } catch (error) {
        console.error('Failed to copy:', error);
        alert('Failed to copy to clipboard. Please select and copy manually.');
    }
}

// Show AI Error
function showAIError(message) {
    const body = document.getElementById('aiModalBody');
    body.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <p style="color: #ef4444; margin-bottom: 1rem;">❌ Error: ${escapeHtml(message)}</p>
            <button class="btn btn-primary" onclick="closeAIModal()">Close</button>
        </div>
    `;
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('aiModal');
    if (event.target === modal) {
        closeAIModal();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        analyzeSEO,
        performSEOAnalysis,
        calculateOverallScore,
        generateAIContent
    };
}

