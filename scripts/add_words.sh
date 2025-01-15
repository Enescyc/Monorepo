#!/bin/bash

# API Configuration
API_URL="http://localhost:3001"
EMAIL="enes.cyclones@gmail.com"
PASSWORD="123456"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Login and get token
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

# Extract token and user ID
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
USER_ID=$(echo $LOGIN_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}Login failed${NC}"
    exit 1
fi

echo -e "${GREEN}Successfully logged in${NC}"

# Function to add a word
add_word() {
    local WORD=$1
    local TRANSLATION=$2
    local CATEGORY=$3

    WORD_DATA="{
        \"word\": \"$WORD\",
        \"userId\": \"$USER_ID\",
        \"nativeLanguage\": \"ENGLISH\",
        \"targetLanguages\": [{
            \"name\": \"Spanish\",
            \"native\": false,
            \"code\": \"es\",
            \"startedAt\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",
            \"lastStudied\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",
            \"proficiency\": \"B2\"
        }],
        \"learningStyle\": \"READING\",
        \"difficulty\": \"HARD\",
        \"appLanguage\": \"ENGLISH\"
    }"

    RESPONSE=$(curl -s -X POST "$API_URL/words" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "$WORD_DATA")

    if [[ $RESPONSE == *"id"* ]]; then
        echo -e "${GREEN}✓ Successfully added: $WORD${NC}"
        return 0
    else
        echo -e "${RED}✗ Failed to add: $WORD${NC}"
        echo "Error: $RESPONSE"
        return 1
    fi
}

# Counter for statistics
SUCCESS_COUNT=0
FAILURE_COUNT=0

# Add words
echo "Adding words..."

# Advanced words array
declare -a WORDS=(
    "ambition|ambición|personality"
    "resilience|resiliencia|personality"
    "integrity|integridad|personality"
    "empathy|empatía|personality"
    "diligence|diligencia|personality"
    "philosophy|filosofía|academics"
    "hypothesis|hipótesis|academics"
    "paradigm|paradigma|academics"
    "quantum|cuántico|academics"
    "synthesis|síntesis|academics"
    "metamorphosis|metamorfosis|science"
    "photosynthesis|fotosíntesis|science"
    "ecosystem|ecosistema|science"
    "biodiversity|biodiversidad|science"
    "thermodynamics|termodinámica|science"
    "algorithm|algoritmo|technology"
    "encryption|encriptación|technology"
    "blockchain|cadena de bloques|technology"
    "artificial intelligence|inteligencia artificial|technology"
    "nanotechnology|nanotecnología|technology"
)

# Process each word
for WORD_INFO in "${WORDS[@]}"; do
    IFS="|" read -r WORD TRANSLATION CATEGORY <<< "$WORD_INFO"
    echo "Adding word: $WORD"
    if add_word "$WORD" "$TRANSLATION" "$CATEGORY"; then
        ((SUCCESS_COUNT++))
    else
        ((FAILURE_COUNT++))
    fi
    # Add delay to prevent rate limiting
    sleep 0.1
done

# Print summary
echo -e "\nProcess completed!"
echo -e "Successfully added: ${GREEN}$SUCCESS_COUNT${NC} words"
echo -e "Failed to add: ${RED}$FAILURE_COUNT${NC} words" 