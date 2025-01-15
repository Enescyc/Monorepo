# VocaBuddy Scripts

This directory contains utility scripts for VocaBuddy.

## Add Daily Words Script

The `add-daily-words.ts` script adds 50 common daily life words to a specified user's vocabulary. The words are in English with Spanish translations.

### Prerequisites

1. Node.js and npm installed
2. VocaBuddy API running locally on port 3000
3. Valid user credentials

### Installation

1. Install dependencies:
```bash
npm install axios
```

### Usage

1. Configure the script:
   - Update `API_URL` if your API is running on a different port
   - Update `USER_ID` with the target user's ID
   - Update login credentials if needed

2. Run the script:
```bash
# From the project root
npx ts-node scripts/add-daily-words.ts
```

### Word Categories

The script adds words from the following categories:
- Food & Drinks
- Home & Furniture
- Time & Calendar
- Family & Relationships
- Daily Activities
- Technology
- Clothing
- Transportation
- Emotions
- Weather

### Error Handling

The script includes comprehensive error handling:
- Login failures
- Word addition failures
- Network errors
- API errors

If any error occurs:
1. The error will be logged with details
2. The script will exit with status code 1

### Rate Limiting

The script includes a 100ms delay between word additions to prevent rate limiting.

### Example Output

```
Starting word addition process...
Logging in...
Successfully logged in
Adding words...
Adding word: breakfast
Adding word: lunch
...
Successfully added all words!
``` 