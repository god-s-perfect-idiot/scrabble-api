# Scrabble Word Validation API

A simple Express.js API that validates if words are valid Scrabble words using the `scrabble` package.

## Features

- Single endpoint: `GET /search/:word`
- Returns simple JSON response with boolean validation
- Uses the `scrabble` package for word validation
- Bonus anagrams endpoint: `GET /anagrams/:word` to find all anagrams of a word
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

### GET /anagrams/:word

Get all anagrams of the given word.

**URL Parameters:**
- `word` (required): The word to find anagrams for

**Response:**
```json
{
  "word": "listen",
  "anagrams": ["silent", "tinsel"],
  "count": 2
}
```

**Example:**
```bash
curl http://localhost:3000/anagrams/listen
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
  "status": "ready"
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

### Anagrams examples:
- `GET /anagrams/listen` → Returns all anagrams of "listen"
- `GET /anagrams/hello` → Returns all anagrams of "hello"

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
    "POST /search": "Check word validity (POST)",
    "GET /anagrams/:word": "Get all anagrams of the word"
  }
}
```

## Technical Details

- **Framework:** Express.js
- **Port:** 3000 (configurable via PORT environment variable)
- **Dictionary:** Uses `scrabble` package for word validation
- **Case-insensitive:** All words are converted to lowercase for comparison
- **CORS:** Enabled for all origins
- **Word validation:** Checks if a word can be made from its own letters using the scrabble solver
- **Anagrams:** Filters results to only include words of the same length as the input word

## How it works

The API uses the `scrabble` package which returns all possible words that can be made from a given set of letters. To validate a word:

1. Take the letters of the input word
2. Use the scrabble solver to find all possible words from those letters
3. Check if the exact input word exists in the results

For anagrams:
1. Take the letters of the input word
2. Use the scrabble solver to find all possible words from those letters
3. Filter to only include words of the same length as the input word (excluding the input word itself)

This approach ensures that only valid English words are accepted, as the `scrabble` package uses a comprehensive English dictionary.

## License

MIT 