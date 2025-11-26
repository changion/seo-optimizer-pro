const axios = require('axios');

// AI API Configuration
const AI_PROVIDER = process.env.AI_PROVIDER || 'openai'; // 'openai' or 'anthropic'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// Simple in-memory cache (in production, use Redis)
const cache = new Map();

/**
 * Generate AI-optimized titles
 */
async function generateTitles(options) {
    const {
        currentTitle = '',
        targetKeyword = '',
        pageContent = '',
        pageUrl = '',
        tone = 'professional',
        count = 3
    } = options;

    // Check cache
    const cacheKey = `title_${JSON.stringify(options)}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }

    try {
        const prompt = buildTitlePrompt({
            currentTitle,
            targetKeyword,
            pageContent,
            pageUrl,
            tone,
            count
        });

        const aiResponse = await callAI(prompt);
        const generatedTitles = parseAIResponse(aiResponse, 'title');

        // Calculate scores for each title
        const scoredTitles = generatedTitles.map(title => {
            return {
                text: title.title || title,
                reasoning: title.reasoning || '',
                characterCount: (title.title || title).length,
                seoScore: calculateSEOScore(title.title || title, 'title', targetKeyword),
                keywordDensity: calculateKeywordDensity(title.title || title, targetKeyword),
                readabilityScore: calculateReadability(title.title || title),
                includesKeyword: targetKeyword ? (title.title || title).toLowerCase().includes(targetKeyword.toLowerCase()) : true,
                includesCTA: false, // Titles don't need CTA
                recommendations: generateRecommendations(title.title || title, 'title', targetKeyword)
            };
        });

        const result = {
            type: 'title',
            generated: scoredTitles,
            metadata: {
                model: AI_PROVIDER === 'openai' ? 'gpt-4' : 'claude-3',
                timestamp: new Date().toISOString(),
                cost: 0.03, // Estimated cost
                cached: false
            }
        };

        // Cache result (24 hours)
        cache.set(cacheKey, result);
        setTimeout(() => cache.delete(cacheKey), 24 * 60 * 60 * 1000);

        return result;
    } catch (error) {
        console.error('Error generating titles:', error);
        throw new Error(`Failed to generate titles: ${error.message}`);
    }
}

/**
 * Generate AI-optimized descriptions
 */
async function generateDescriptions(options) {
    const {
        currentDescription = '',
        targetKeyword = '',
        pageContent = '',
        pageUrl = '',
        tone = 'professional',
        count = 3
    } = options;

    // Check cache
    const cacheKey = `description_${JSON.stringify(options)}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }

    try {
        const prompt = buildDescriptionPrompt({
            currentDescription,
            targetKeyword,
            pageContent,
            pageUrl,
            tone,
            count
        });

        const aiResponse = await callAI(prompt);
        const generatedDescriptions = parseAIResponse(aiResponse, 'description');

        // Calculate scores for each description
        const scoredDescriptions = generatedDescriptions.map(desc => {
            return {
                text: desc.description || desc,
                reasoning: desc.reasoning || '',
                characterCount: (desc.description || desc).length,
                seoScore: calculateSEOScore(desc.description || desc, 'description', targetKeyword),
                keywordDensity: calculateKeywordDensity(desc.description || desc, targetKeyword),
                readabilityScore: calculateReadability(desc.description || desc),
                includesKeyword: targetKeyword ? (desc.description || desc).toLowerCase().includes(targetKeyword.toLowerCase()) : true,
                includesCTA: checkForCTA(desc.description || desc),
                recommendations: generateRecommendations(desc.description || desc, 'description', targetKeyword)
            };
        });

        const result = {
            type: 'description',
            generated: scoredDescriptions,
            metadata: {
                model: AI_PROVIDER === 'openai' ? 'gpt-4' : 'claude-3',
                timestamp: new Date().toISOString(),
                cost: 0.03, // Estimated cost
                cached: false
            }
        };

        // Cache result (24 hours)
        cache.set(cacheKey, result);
        setTimeout(() => cache.delete(cacheKey), 24 * 60 * 60 * 1000);

        return result;
    } catch (error) {
        console.error('Error generating descriptions:', error);
        throw new Error(`Failed to generate descriptions: ${error.message}`);
    }
}

/**
 * Generate both titles and descriptions
 */
async function generateBoth(options) {
    const [titlesResult, descriptionsResult] = await Promise.all([
        generateTitles(options),
        generateDescriptions(options)
    ]);

    return {
        type: 'both',
        titles: titlesResult.generated,
        descriptions: descriptionsResult.generated,
        metadata: {
            ...titlesResult.metadata,
            cost: titlesResult.metadata.cost + descriptionsResult.metadata.cost
        }
    };
}

/**
 * Build prompt for title generation
 */
function buildTitlePrompt(options) {
    const { currentTitle, targetKeyword, pageContent, pageUrl, tone, count } = options;
    
    return `You are an SEO expert. Generate ${count} optimized title tags for a webpage.

Current title: ${currentTitle || 'Not provided'}
Target keyword: ${targetKeyword || 'Not specified'}
Page content summary: ${pageContent || 'Not provided'}
Page URL: ${pageUrl || 'Not provided'}

Requirements:
1. Length: 50-60 characters (strict)
2. Include target keyword naturally (if provided)
3. Compelling and click-worthy
4. Follow SEO best practices
5. Tone: ${tone}

Return ONLY a valid JSON array with this exact format (no markdown, no code blocks):
[
  {
    "title": "generated title here",
    "reasoning": "brief explanation why this works"
  }
]`;
}

/**
 * Build prompt for description generation
 */
function buildDescriptionPrompt(options) {
    const { currentDescription, targetKeyword, pageContent, pageUrl, tone, count } = options;
    
    return `You are an SEO expert. Generate ${count} optimized meta descriptions for a webpage.

Current description: ${currentDescription || 'Not provided'}
Target keyword: ${targetKeyword || 'Not specified'}
Page content summary: ${pageContent || 'Not provided'}
Page URL: ${pageUrl || 'Not provided'}

Requirements:
1. Length: 120-160 characters (strict)
2. Include target keyword naturally (if provided)
3. Include a call-to-action (CTA)
4. Compelling and click-worthy
5. Follow SEO best practices
6. Tone: ${tone}

Return ONLY a valid JSON array with this exact format (no markdown, no code blocks):
[
  {
    "description": "generated description here",
    "reasoning": "brief explanation why this works"
  }
]`;
}

/**
 * Call AI API (OpenAI or Anthropic)
 */
async function callAI(prompt) {
    if (AI_PROVIDER === 'openai') {
        return await callOpenAI(prompt);
    } else if (AI_PROVIDER === 'anthropic') {
        return await callAnthropic(prompt);
    } else {
        throw new Error('Invalid AI provider. Use "openai" or "anthropic"');
    }
}

/**
 * Call OpenAI API
 */
async function callOpenAI(prompt) {
    if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY environment variable.');
    }

    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an SEO expert. Always return valid JSON only, no markdown formatting.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI API Error:', error.response?.data || error.message);
        throw new Error(`OpenAI API error: ${error.response?.data?.error?.message || error.message}`);
    }
}

/**
 * Call Anthropic API
 */
async function callAnthropic(prompt) {
    if (!ANTHROPIC_API_KEY) {
        throw new Error('Anthropic API key not configured. Set ANTHROPIC_API_KEY environment variable.');
    }

    try {
        const response = await axios.post(
            ANTHROPIC_API_URL,
            {
                model: 'claude-3-opus-20240229',
                max_tokens: 1000,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    'x-api-key': ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01',
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        return response.data.content[0].text;
    } catch (error) {
        console.error('Anthropic API Error:', error.response?.data || error.message);
        throw new Error(`Anthropic API error: ${error.response?.data?.error?.message || error.message}`);
    }
}

/**
 * Parse AI response (extract JSON from response)
 */
function parseAIResponse(response, type) {
    try {
        // Remove markdown code blocks if present
        let cleaned = response.trim();
        if (cleaned.startsWith('```json')) {
            cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/```\n?/g, '');
        }

        const parsed = JSON.parse(cleaned);
        
        if (!Array.isArray(parsed)) {
            throw new Error('AI response is not an array');
        }

        return parsed;
    } catch (error) {
        console.error('Error parsing AI response:', error);
        console.error('Raw response:', response);
        
        // Fallback: try to extract titles/descriptions from text
        const lines = response.split('\n').filter(line => line.trim());
        return lines.slice(0, 5).map((line, index) => ({
            [type]: line.replace(/^\d+\.\s*/, '').replace(/["']/g, '').trim(),
            reasoning: `Generated version ${index + 1}`
        }));
    }
}

/**
 * Calculate SEO score (0-100)
 */
function calculateSEOScore(text, type, targetKeyword) {
    let score = 0;
    
    // Length score (40 points)
    const idealLength = type === 'title' ? 55 : 140;
    const lengthDiff = Math.abs(text.length - idealLength);
    const lengthScore = Math.max(0, 40 - (lengthDiff * 2));
    score += lengthScore;
    
    // Keyword score (30 points)
    if (targetKeyword) {
        const keywordIncluded = text.toLowerCase().includes(targetKeyword.toLowerCase());
        score += keywordIncluded ? 30 : 0;
    } else {
        score += 15; // Base score if no keyword
    }
    
    // Readability score (20 points)
    const readabilityScore = calculateReadability(text);
    score += readabilityScore * 0.2;
    
    // CTA score (10 points, only for descriptions)
    if (type === 'description') {
        const hasCTA = checkForCTA(text);
        score += hasCTA ? 10 : 0;
    } else {
        score += 5; // Title doesn't need CTA
    }
    
    return Math.min(100, Math.round(score));
}

/**
 * Calculate keyword density
 */
function calculateKeywordDensity(text, keyword) {
    if (!keyword) return 0;
    
    const words = text.toLowerCase().split(/\s+/);
    const keywordLower = keyword.toLowerCase();
    const keywordCount = words.filter(w => w.includes(keywordLower)).length;
    return keywordCount > 0 ? ((keywordCount / words.length) * 100).toFixed(2) : 0;
}

/**
 * Calculate readability score (simplified Flesch Reading Ease)
 */
function calculateReadability(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const syllables = words.reduce((count, word) => {
        return count + estimateSyllables(word);
    }, 0);
    
    if (sentences.length === 0 || words.length === 0) return 50;
    
    const avgSentenceLength = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;
    
    const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
    return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Estimate syllables in a word
 */
function estimateSyllables(word) {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    return word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
               .replace(/^y/, '')
               .match(/[aeiouy]{1,2}/g)?.length || 1;
}

/**
 * Check for CTA in text
 */
function checkForCTA(text) {
    const ctaWords = ['learn', 'discover', 'get', 'start', 'try', 'buy', 'shop', 'explore', 'find', 'view', 'see', 'read'];
    const lowerText = text.toLowerCase();
    return ctaWords.some(word => lowerText.includes(word));
}

/**
 * Generate recommendations
 */
function generateRecommendations(text, type, targetKeyword) {
    const recommendations = [];
    
    const idealLength = type === 'title' ? 55 : 140;
    const currentLength = text.length;
    
    if (currentLength < idealLength - 10) {
        recommendations.push(`Consider adding ${idealLength - currentLength} more characters for better SEO`);
    } else if (currentLength > idealLength + 10) {
        recommendations.push(`Consider reducing by ${currentLength - idealLength} characters for optimal length`);
    }
    
    if (targetKeyword && !text.toLowerCase().includes(targetKeyword.toLowerCase())) {
        recommendations.push(`Include the target keyword "${targetKeyword}" naturally`);
    }
    
    if (type === 'description' && !checkForCTA(text)) {
        recommendations.push('Add a call-to-action to encourage clicks');
    }
    
    return recommendations;
}

module.exports = {
    generateTitles,
    generateDescriptions,
    generateBoth
};

