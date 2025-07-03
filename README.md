# Scrabble Word Validation API

A simple Express.js API that validates if words are valid Scrabble words.

## Features

- Single endpoint: `GET /search/:word`
- Returns simple JSON response with boolean validation
- Loads from a comprehensive Scrabble dictionary (370,000+ words)
- CORS enabled for cross-origin requests
- Error handling and validation

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### GET /search/:word

Check if a word is valid in Scrabble.

**URL Parameters:**
- `word` (required): The word to validate

**Response:**
```json
{
  "word": "hello",
  "valid": true
}
```

**Example:**
```bash
curl http://localhost:3000/search/hello
```

### POST /search

Alternative endpoint using POST request.

**Request Body:**
```json
{
  "word": "hello"
}
```

**Response:**
```json
{
  "word": "hello",
  "valid": true
}
```

### GET /

API information and health check.

**Response:**
```json
{
  "message": "Scrabble Word Validation API",
  "endpoints": {
    "GET /search/:word": "Check if a word is valid in Scrabble"
  },
  "wordCount": 370100
}
```

## Usage Examples

### Valid words:
- `GET /search/hello` → `{"word": "hello", "valid": true}`
- `GET /search/scrabble` → `{"word": "scrabble", "valid": true}`
- `GET /search/qi` → `{"word": "qi", "valid": true}`

### Invalid words:
- `GET /search/xyz` → `{"word": "xyz", "valid": false}`
- `GET /search/notaword` → `{"word": "notaword", "valid": false}`

## Error Responses

### 400 Bad Request
```json
{
  "error": "Word parameter is required"
}
```

### 404 Not Found
```json
{
  "error": "Endpoint not found",
  "availableEndpoints": {
    "GET /": "API information",
    "GET /search/:word": "Check word validity",
    "POST /search": "Check word validity (POST)"
  }
}
```

## Technical Details

- **Framework:** Express.js
- **Port:** 3000 (configurable via PORT environment variable)
- **Dictionary:** 370,000+ Scrabble words loaded from words.json
- **Case-insensitive:** All words are converted to lowercase for comparison
- **CORS:** Enabled for all origins

## License

MIT 