const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Load words dictionary
let wordsDictionary = {};

try {
    const wordsData = fs.readFileSync(path.join(__dirname, 'words.json'), 'utf8');
    wordsDictionary = JSON.parse(wordsData);
    console.log(`Loaded ${Object.keys(wordsDictionary).length} words`);
} catch (error) {
    console.error('Error loading words dictionary:', error);
    process.exit(1);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers for cross-origin requests
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Scrabble Word Validation API',
        endpoints: {
            'GET /search/:word': 'Check if a word is valid in Scrabble'
        },
        wordCount: Object.keys(wordsDictionary).length
    });
});

// Main API endpoint: GET /search/:word
app.get('/search/:word', (req, res) => {
    const word = req.params.word;
    
    if (!word) {
        return res.status(400).json({
            error: 'Word parameter is required'
        });
    }
    
    // Clean the word (lowercase, trim)
    const cleanWord = word.toLowerCase().trim();
    
    // Check if word exists in dictionary
    const isValid = wordsDictionary.hasOwnProperty(cleanWord);
    
    // Return simple boolean response
    res.json({
        word: cleanWord,
        valid: isValid
    });
});

// Alternative endpoint: POST /search
app.post('/search', (req, res) => {
    const { word } = req.body;
    
    if (!word) {
        return res.status(400).json({
            error: 'Word is required in request body'
        });
    }
    
    // Clean the word (lowercase, trim)
    const cleanWord = word.toLowerCase().trim();
    
    // Check if word exists in dictionary
    const isValid = wordsDictionary.hasOwnProperty(cleanWord);
    
    // Return simple boolean response
    res.json({
        word: cleanWord,
        valid: isValid
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        availableEndpoints: {
            'GET /': 'API information',
            'GET /search/:word': 'Check word validity',
            'POST /search': 'Check word validity (POST)'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Scrabble API server running on port ${PORT}`);
    console.log(`API available at: http://localhost:${PORT}`);
    console.log(`Example: http://localhost:${PORT}/search/hello`);
}); 