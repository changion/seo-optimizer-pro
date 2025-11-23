const axios = require('axios');
const cheerio = require('cheerio');
const validator = require('validator');

// Request timeout (30 seconds)
const REQUEST_TIMEOUT = 30000;

// User agent to avoid blocking
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/**
 * Main SEO analysis function
 */
async function analyzeWebsite(url) {
    try {
        // Fetch website content
        const html = await fetchWebsite(url);
        
        // Parse HTML
        const $ = cheerio.load(html);
        
        // Perform all analyses
        const analysis = {
            url: url,
            domain: new URL(url).hostname,
            timestamp: new Date().toISOString(),
            overallScore: 0,
            onPage: analyzeOnPageSEO($, url),
            content: analyzeContent($),
            technical: analyzeTechnicalSEO($, url),
            keywords: extractKeywords($, url),
            recommendations: []
        };
    
        // Calculate overall score
        analysis.overallScore = calculateOverallScore(analysis);
    
        // Generate recommendations
        analysis.recommendations = generateRecommendations(analysis);
    
        return analysis;
    } catch (error) {
        throw new Error(`Failed to analyze website: ${error.message}`);
    }
}

/**
 * Fetch website HTML content
 */
async function fetchWebsite(url) {
    try {
        const response = await axios.get(url, {
            timeout: REQUEST_TIMEOUT,
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            maxRedirects: 5,
            validateStatus: function (status) {
                return status >= 200 && status < 400; // Accept 2xx and 3xx
            }
        });
        
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout');
        }
        throw error;
    }
}

/**
 * Analyze on-page SEO elements
 */
function analyzeOnPageSEO($, url) {
    const checks = [];
    
    // Title tag
    const title = $('title').text().trim();
    const titleLength = title.length;
    checks.push({
        status: title ? (titleLength >= 30 && titleLength <= 60 ? 'good' : 'warning') : 'error',
        title: 'Title Tag',
        description: title 
            ? `Title tag is ${titleLength} characters. Recommended: 50-60 characters.`
            : 'Title tag is missing. This is critical for SEO.',
        value: title || 'Missing'
    });
    
    // Meta description
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const metaLength = metaDescription.length;
    checks.push({
        status: metaDescription 
            ? (metaLength >= 120 && metaLength <= 160 ? 'good' : 'warning')
            : 'error',
        title: 'Meta Description',
        description: metaDescription
            ? `Meta description is ${metaLength} characters. Recommended: 150-160 characters.`
            : 'Meta description is missing. Add one to improve click-through rates.',
        value: metaDescription || 'Missing'
    });
    
    // H1 tag
    const h1Tags = $('h1');
    const h1Count = h1Tags.length;
    const h1Text = h1Tags.first().text().trim();
    checks.push({
        status: h1Count === 1 ? 'good' : h1Count === 0 ? 'error' : 'warning',
        title: 'H1 Heading',
        description: h1Count === 0
            ? 'H1 tag is missing. Each page should have exactly one H1 tag.'
            : h1Count > 1
            ? `Found ${h1Count} H1 tags. Should have exactly one.`
            : 'H1 tag is present and properly structured.',
        value: h1Text || 'Missing'
    });
    
    // Image alt text
    const images = $('img');
    const totalImages = images.length;
    const imagesWithAlt = images.filter((i, el) => $(el).attr('alt')).length;
    const altPercentage = totalImages > 0 ? Math.round((imagesWithAlt / totalImages) * 100) : 100;
    checks.push({
        status: altPercentage === 100 ? 'good' : altPercentage >= 80 ? 'warning' : 'error',
        title: 'Image Alt Text',
        description: totalImages === 0
            ? 'No images found on the page.'
            : `${imagesWithAlt} of ${totalImages} images have alt text (${altPercentage}%). All images should have descriptive alt text.`,
        value: `${imagesWithAlt}/${totalImages} images`
    });
    
    // Internal links (basic check)
    const links = $('a[href]');
    const internalLinks = links.filter((i, el) => {
        const href = $(el).attr('href');
        return href && (href.startsWith('/') || href.includes(new URL(url).hostname));
    }).length;
    checks.push({
        status: internalLinks > 0 ? 'good' : 'warning',
        title: 'Internal Linking',
        description: internalLinks > 0
            ? `Found ${internalLinks} internal links. Good internal linking structure.`
            : 'No internal links found. Internal links help distribute page authority.',
        value: `${internalLinks} internal links`
    });
    
    return checks;
}

/**
 * Analyze content
 */
function analyzeContent($) {
    const checks = [];
    
    // Get main content (body text)
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const wordCount = bodyText.split(/\s+/).filter(word => word.length > 0).length;
    const charCount = bodyText.length;
    
    // Content length
    checks.push({
        status: wordCount >= 300 ? 'good' : wordCount >= 200 ? 'warning' : 'error',
        title: 'Content Length',
        description: wordCount >= 300
            ? `Content has ${wordCount} words. Good length for SEO.`
            : `Content has only ${wordCount} words. Recommended: at least 300 words for better SEO.`,
        value: `${wordCount} words`
    });
    
    // Keyword density (simplified - would need target keyword)
    checks.push({
        status: 'warning',
        title: 'Keyword Density',
        description: 'Target keyword should appear 1-2% of the time naturally. Provide a target keyword for specific analysis.',
        value: 'Analysis needed'
    });
    
    // Readability (basic check - paragraph structure)
    const paragraphs = $('p').length;
    const headings = $('h1, h2, h3, h4, h5, h6').length;
    checks.push({
        status: paragraphs > 0 && headings > 0 ? 'good' : 'warning',
        title: 'Content Readability',
        description: paragraphs > 0 && headings > 0
            ? `Content is well-structured with ${paragraphs} paragraphs and ${headings} headings.`
            : 'Content structure could be improved with more paragraphs and headings.',
        value: `${paragraphs} paragraphs, ${headings} headings`
    });
    
    // Content freshness (check for dates)
    const hasDate = $('time, [datetime], .date, .published').length > 0;
    checks.push({
        status: hasDate ? 'good' : 'warning',
        title: 'Content Freshness',
        description: hasDate
            ? 'Content includes date information. Regular updates improve SEO.'
            : 'Consider adding publication/update dates. Fresh content ranks better.',
        value: hasDate ? 'Date found' : 'No date found'
    });
    
    return checks;
}

/**
 * Analyze technical SEO
 */
function analyzeTechnicalSEO($, url) {
    const checks = [];
    const urlObj = new URL(url);
    
    // HTTPS
    const isHTTPS = urlObj.protocol === 'https:';
    checks.push({
        status: isHTTPS ? 'good' : 'error',
        title: 'HTTPS/SSL Certificate',
        description: isHTTPS
            ? 'Website uses secure HTTPS connection. Essential for SEO and security.'
            : 'Website should use HTTPS. Google favors secure websites.',
        value: isHTTPS ? 'Secure' : 'Not secure'
    });
    
    // Mobile-friendly (check viewport meta tag)
    const viewport = $('meta[name="viewport"]').attr('content');
    const isMobileFriendly = !!viewport;
    checks.push({
        status: isMobileFriendly ? 'good' : 'warning',
        title: 'Mobile-Friendly',
        description: isMobileFriendly
            ? 'Viewport meta tag is present. Website is likely mobile-responsive.'
            : 'Viewport meta tag is missing. Ensure website is mobile-friendly.',
        value: isMobileFriendly ? 'Responsive' : 'Check needed'
    });
    
    // Canonical URL
    const canonical = $('link[rel="canonical"]').attr('href');
    checks.push({
        status: canonical ? 'good' : 'warning',
        title: 'Canonical URL',
        description: canonical
            ? 'Canonical URL is set. Helps prevent duplicate content issues.'
            : 'Consider adding a canonical URL tag to avoid duplicate content.',
        value: canonical ? 'Present' : 'Missing'
    });
    
    // Open Graph tags
    const ogTags = $('meta[property^="og:"]').length;
    checks.push({
        status: ogTags > 0 ? 'good' : 'warning',
        title: 'Open Graph Tags',
        description: ogTags > 0
            ? `Found ${ogTags} Open Graph tags. Good for social media sharing.`
            : 'Open Graph tags are missing. Add them for better social media previews.',
        value: ogTags > 0 ? `${ogTags} tags` : 'Missing'
    });
    
    // Robots meta tag
    const robotsMeta = $('meta[name="robots"]').attr('content');
    checks.push({
        status: robotsMeta && robotsMeta.includes('noindex') ? 'warning' : 'good',
        title: 'Robots Meta Tag',
        description: robotsMeta && robotsMeta.includes('noindex')
            ? 'Robots meta tag contains "noindex". This prevents search engines from indexing the page.'
            : 'Robots meta tag is properly configured.',
        value: robotsMeta || 'Not set'
    });
    
    // Structured data (Schema.org)
    const structuredData = $('script[type="application/ld+json"]').length;
    checks.push({
        status: structuredData > 0 ? 'good' : 'warning',
        title: 'Structured Data',
        description: structuredData > 0
            ? `Found ${structuredData} structured data blocks. Helps search engines understand content.`
            : 'Consider adding structured data (Schema.org) for rich snippets.',
        value: structuredData > 0 ? `${structuredData} blocks` : 'Missing'
    });
    
    return checks;
}

/**
 * Extract keywords from content
 */
function extractKeywords($, url) {
    const keywords = [];
    
    // Extract from title
    const title = $('title').text().toLowerCase();
    const titleWords = title.split(/\s+/).filter(word => word.length > 3);
    keywords.push(...titleWords.slice(0, 3));
    
    // Extract from H1
    const h1 = $('h1').first().text().toLowerCase();
    const h1Words = h1.split(/\s+/).filter(word => word.length > 3);
    keywords.push(...h1Words.slice(0, 2));
    
    // Extract from meta keywords (if present)
    const metaKeywords = $('meta[name="keywords"]').attr('content');
    if (metaKeywords) {
        keywords.push(...metaKeywords.split(',').map(k => k.trim().toLowerCase()).slice(0, 5));
    }
    
    // Extract from URL
    const urlParts = new URL(url).pathname.split('/').filter(p => p && p.length > 2);
    keywords.push(...urlParts.slice(0, 3));
    
    // Remove duplicates and common words
    const commonWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'];
    const uniqueKeywords = [...new Set(keywords)]
        .filter(word => word.length > 2 && !commonWords.includes(word))
        .slice(0, 10);
    
    return uniqueKeywords;
}

/**
 * Calculate overall SEO score (0-100)
 */
function calculateOverallScore(analysis) {
    let score = 0;
    let maxScore = 0;
    
    // On-page SEO (40 points)
    analysis.onPage.forEach(check => {
        maxScore += 8; // 5 checks * 8 points each = 40
        if (check.status === 'good') score += 8;
        else if (check.status === 'warning') score += 4;
        else if (check.status === 'error') score += 0;
    });
    
    // Content (30 points)
    analysis.content.forEach(check => {
        maxScore += 7.5; // 4 checks * 7.5 points each = 30
        if (check.status === 'good') score += 7.5;
        else if (check.status === 'warning') score += 3.75;
        else if (check.status === 'error') score += 0;
    });
    
    // Technical SEO (30 points)
    analysis.technical.forEach(check => {
        maxScore += 5; // 6 checks * 5 points each = 30
        if (check.status === 'good') score += 5;
        else if (check.status === 'warning') score += 2.5;
        else if (check.status === 'error') score += 0;
    });
    
    // Normalize to 0-100
    const normalizedScore = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    
    return Math.min(100, Math.max(0, normalizedScore));
}

/**
 * Generate recommendations based on analysis
 */
function generateRecommendations(analysis) {
    const recommendations = [];
    
    // Check title tag
    const titleCheck = analysis.onPage.find(c => c.title === 'Title Tag');
    if (titleCheck && titleCheck.status !== 'good') {
        recommendations.push({
            priority: 'high',
            title: 'Optimize Title Tag',
            description: titleCheck.description
        });
    }
    
    // Check meta description
    const metaCheck = analysis.onPage.find(c => c.title === 'Meta Description');
    if (metaCheck && metaCheck.status !== 'good') {
        recommendations.push({
            priority: 'high',
            title: 'Add/Optimize Meta Description',
            description: metaCheck.description
        });
    }
    
    // Check HTTPS
    const httpsCheck = analysis.technical.find(c => c.title === 'HTTPS/SSL Certificate');
    if (httpsCheck && httpsCheck.status !== 'good') {
        recommendations.push({
            priority: 'high',
            title: 'Enable HTTPS',
            description: 'Install an SSL certificate and redirect HTTP to HTTPS. This is critical for SEO and security.'
        });
    }
    
    // Check content length
    const contentCheck = analysis.content.find(c => c.title === 'Content Length');
    if (contentCheck && contentCheck.status !== 'good') {
        recommendations.push({
            priority: 'medium',
            title: 'Increase Content Length',
            description: contentCheck.description
        });
    }
    
    // Check image alt text
    const altCheck = analysis.onPage.find(c => c.title === 'Image Alt Text');
    if (altCheck && altCheck.status !== 'good') {
        recommendations.push({
            priority: 'medium',
            title: 'Add Image Alt Text',
            description: 'Ensure all images have descriptive alt text for accessibility and SEO.'
        });
    }
    
    // Check mobile-friendly
    const mobileCheck = analysis.technical.find(c => c.title === 'Mobile-Friendly');
    if (mobileCheck && mobileCheck.status !== 'good') {
        recommendations.push({
            priority: 'high',
            title: 'Improve Mobile Responsiveness',
            description: 'Ensure your website is fully responsive and mobile-friendly. Google uses mobile-first indexing.'
        });
    }
    
    // Check structured data
    const schemaCheck = analysis.technical.find(c => c.title === 'Structured Data');
    if (schemaCheck && schemaCheck.status !== 'good') {
        recommendations.push({
            priority: 'low',
            title: 'Add Structured Data',
            description: 'Implement Schema.org structured data to help search engines understand your content and enable rich snippets.'
        });
    }
    
    return recommendations;
}

module.exports = {
    analyzeWebsite
};

