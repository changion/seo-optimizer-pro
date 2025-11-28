const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const seoAnalyzer = require('./services/seoAnalyzer');
const aiContentGenerator = require('./services/aiContentGenerator');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:8080';

// Middleware
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'SEO Optimizer Pro API is running',
        timestamp: new Date().toISOString()
    });
});

// SEO Analysis endpoint
app.post('/api/analyze-seo', async (req, res) => {
    try {
        const { url } = req.body;

        // Validate URL
        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'URL is required'
            });
        }

        // Validate URL format
        let validUrl;
        try {
            // Add https:// if protocol is missing
            const urlWithProtocol = url.startsWith('http://') || url.startsWith('https://') 
                ? url 
                : `https://${url}`;
            
            validUrl = new URL(urlWithProtocol);
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: 'Invalid URL format'
            });
        }

        // Security check: Only allow http and https protocols
        if (!['http:', 'https:'].includes(validUrl.protocol)) {
            return res.status(400).json({
                success: false,
                error: 'Only HTTP and HTTPS URLs are allowed'
            });
        }

        console.log(`Analyzing SEO for: ${validUrl.href}`);

        // Perform SEO analysis
        const analysis = await seoAnalyzer.analyzeWebsite(validUrl.href);

        res.json({
            success: true,
            data: analysis
        });

    } catch (error) {
        console.error('SEO Analysis Error:', error);
        
        // Handle specific error types
        if (error.message.includes('timeout')) {
            return res.status(408).json({
                success: false,
                error: 'Request timeout. The website took too long to respond.'
            });
        }
        
        if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
            return res.status(404).json({
                success: false,
                error: 'Website not found. Please check the URL.'
            });
        }

        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                success: false,
                error: 'Unable to connect to the website. It may be down or blocking requests.'
            });
        }

        res.status(500).json({
            success: false,
            error: error.message || 'An error occurred while analyzing the website'
        });
    }
});

// AI Content Generation endpoint
app.post('/api/generate-title-description', async (req, res) => {
    try {
        const {
            type,
            currentTitle,
            currentDescription,
            targetKeyword,
            pageContent,
            pageUrl,
            tone,
            count
        } = req.body;

        // Validate type
        if (!type || !['title', 'description', 'both'].includes(type)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid type. Must be "title", "description", or "both"'
            });
        }

        // Validate count
        const validCount = Math.min(Math.max(parseInt(count) || 3, 3), 5);

        // Prepare options
        const options = {
            currentTitle: currentTitle || '',
            currentDescription: currentDescription || '',
            targetKeyword: targetKeyword || '',
            pageContent: pageContent || '',
            pageUrl: pageUrl || '',
            tone: tone || 'professional',
            count: validCount
        };

        console.log(`Generating AI content: type=${type}, count=${validCount}`);

        let result;
        if (type === 'title') {
            result = await aiContentGenerator.generateTitles(options);
        } else if (type === 'description') {
            result = await aiContentGenerator.generateDescriptions(options);
        } else {
            result = await aiContentGenerator.generateBoth(options);
        }

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('AI Content Generation Error:', error);
        
        // Handle specific error types
        if (error.message.includes('API key')) {
            return res.status(500).json({
                success: false,
                error: 'AI service not configured. Please set API key in environment variables.',
                code: 'AI_CONFIG_ERROR'
            });
        }
        
        if (error.message.includes('timeout')) {
            return res.status(408).json({
                success: false,
                error: 'AI service timeout. Please try again.',
                code: 'AI_TIMEOUT'
            });
        }

        res.status(500).json({
            success: false,
            error: error.message || 'An error occurred while generating content',
            code: 'AI_API_ERROR'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 SEO Optimizer Pro API server running on port ${PORT}`);
    console.log(`📡 CORS enabled for: ${CORS_ORIGIN}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

