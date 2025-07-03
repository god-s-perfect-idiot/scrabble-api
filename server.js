const express = require('express');
const scrabble = require('scrabble');

const app = express();
const PORT = process.env.PORT || 3000;

// Word validation function using scrabble package
function isWordValid(word) {
    if (!word || typeof word !== 'string') {
        return false;
    }
    
    const cleanWord = word.toLowerCase().trim();
    
    // Get all possible words from the letters of the input word
    const possibleWords = scrabble(cleanWord);
    
    // If scrabble returns a string (error message), no words found
    if (typeof possibleWords === 'string') {
        return false;
    }
    
    // Check if the exact word exists in the possible words array
    return possibleWords.includes(cleanWord);
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
        status: 'ready'
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
    
    try {
        // Clean the word (lowercase, trim)
        const cleanWord = word.toLowerCase().trim();
        
        // Check if word exists in dictionary
        const isValid = isWordValid(cleanWord);
        
        // Return simple boolean response
        res.json({
            word: cleanWord,
            valid: isValid
        });
    } catch (error) {
        console.error('Error checking word:', error);
        res.status(500).json({
            error: 'Error checking word validity'
        });
    }
});

// Alternative endpoint: POST /search
app.post('/search', (req, res) => {
    const { word } = req.body;
    
    if (!word) {
        return res.status(400).json({
            error: 'Word is required in request body'
        });
    }
    
    try {
        // Clean the word (lowercase, trim)
        const cleanWord = word.toLowerCase().trim();
        
        // Check if word exists in dictionary
        const isValid = isWordValid(cleanWord);
        
        // Return simple boolean response
        res.json({
            word: cleanWord,
            valid: isValid
        });
    } catch (error) {
        console.error('Error checking word:', error);
        res.status(500).json({
            error: 'Error checking word validity'
        });
    }
});

// Bonus endpoint: GET /anagrams/:word - returns all anagrams of the word
app.get('/anagrams/:word', (req, res) => {
    const word = req.params.word;
    
    if (!word) {
        return res.status(400).json({
            error: 'Word parameter is required'
        });
    }
    
    try {
        const cleanWord = word.toLowerCase().trim();
        const possibleWords = scrabble(cleanWord);
        
        // If scrabble returns a string (error message), no words found
        if (typeof possibleWords === 'string') {
            res.json({
                word: cleanWord,
                anagrams: [],
                message: possibleWords
            });
        } else {
            // Filter to only include anagrams (same length as input word)
            const anagrams = possibleWords.filter(w => w.length === cleanWord.length && w !== cleanWord);
            
            res.json({
                word: cleanWord,
                anagrams: anagrams,
                count: anagrams.length
            });
        }
    } catch (error) {
        console.error('Error finding anagrams:', error);
        res.status(500).json({
            error: 'Error finding anagrams'
        });
    }
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
            'POST /search': 'Check word validity (POST)',
            'GET /anagrams/:word': 'Get all anagrams of the word'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Scrabble API server running on port ${PORT}`);
    console.log(`API available at: http://localhost:${PORT}`);
    console.log(`Example: http://localhost:${PORT}/search/hello`);
    console.log(`Solver: http://localhost:${PORT}/anagrams/hello`);
}); 