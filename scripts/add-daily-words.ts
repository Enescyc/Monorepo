import axios, { AxiosError } from 'axios';
import { a } from 'node_modules/@tanstack/react-query-devtools/build/modern/ReactQueryDevtools-Cn7cKi7o';

// Update API URL to match NestJS configuration
const API_URL = 'http://localhost:3001';


// Daily life words with translations (English to Spanish)
const dailyWords = [
  { word: 'breakfast', translation: 'desayuno', category: 'food', difficulty: 'easy' },
  { word: 'lunch', translation: 'almuerzo', category: 'food', difficulty: 'easy' },
  { word: 'dinner', translation: 'cena', category: 'food', difficulty: 'easy' },
  { word: 'coffee', translation: 'café', category: 'food', difficulty: 'easy' },
  { word: 'water', translation: 'agua', category: 'food', difficulty: 'easy' },
  
  { word: 'house', translation: 'casa', category: 'home', difficulty: 'easy' },
  { word: 'bedroom', translation: 'dormitorio', category: 'home', difficulty: 'easy' },
  { word: 'kitchen', translation: 'cocina', category: 'home', difficulty: 'easy' },
  { word: 'bathroom', translation: 'baño', category: 'home', difficulty: 'easy' },
  { word: 'living room', translation: 'sala de estar', category: 'home', difficulty: 'easy' },
  
  { word: 'morning', translation: 'mañana', category: 'time', difficulty: 'easy' },
  { word: 'afternoon', translation: 'tarde', category: 'time', difficulty: 'easy' },
  { word: 'evening', translation: 'noche', category: 'time', difficulty: 'easy' },
  { word: 'today', translation: 'hoy', category: 'time', difficulty: 'easy' },
  { word: 'tomorrow', translation: 'mañana', category: 'time', difficulty: 'easy' },
  
  { word: 'family', translation: 'familia', category: 'relationships', difficulty: 'easy' },
  { word: 'friend', translation: 'amigo', category: 'relationships', difficulty: 'easy' },
  { word: 'mother', translation: 'madre', category: 'relationships', difficulty: 'easy' },
  { word: 'father', translation: 'padre', category: 'relationships', difficulty: 'easy' },
  { word: 'sister', translation: 'hermana', category: 'relationships', difficulty: 'easy' },
  
  { word: 'work', translation: 'trabajo', category: 'activities', difficulty: 'easy' },
  { word: 'study', translation: 'estudiar', category: 'activities', difficulty: 'easy' },
  { word: 'sleep', translation: 'dormir', category: 'activities', difficulty: 'easy' },
  { word: 'eat', translation: 'comer', category: 'activities', difficulty: 'easy' },
  { word: 'drink', translation: 'beber', category: 'activities', difficulty: 'easy' },
  
  { word: 'phone', translation: 'teléfono', category: 'technology', difficulty: 'easy' },
  { word: 'computer', translation: 'computadora', category: 'technology', difficulty: 'easy' },
  { word: 'internet', translation: 'internet', category: 'technology', difficulty: 'easy' },
  { word: 'email', translation: 'correo electrónico', category: 'technology', difficulty: 'easy' },
  { word: 'message', translation: 'mensaje', category: 'technology', difficulty: 'easy' },
  
  { word: 'clothes', translation: 'ropa', category: 'clothing', difficulty: 'easy' },
  { word: 'shoes', translation: 'zapatos', category: 'clothing', difficulty: 'easy' },
  { word: 'shirt', translation: 'camisa', category: 'clothing', difficulty: 'easy' },
  { word: 'pants', translation: 'pantalones', category: 'clothing', difficulty: 'easy' },
  { word: 'jacket', translation: 'chaqueta', category: 'clothing', difficulty: 'easy' },
  
  { word: 'bus', translation: 'autobús', category: 'transportation', difficulty: 'easy' },
  { word: 'car', translation: 'coche', category: 'transportation', difficulty: 'easy' },
  { word: 'train', translation: 'tren', category: 'transportation', difficulty: 'easy' },
  { word: 'bicycle', translation: 'bicicleta', category: 'transportation', difficulty: 'easy' },
  { word: 'walk', translation: 'caminar', category: 'transportation', difficulty: 'easy' },
  
  { word: 'happy', translation: 'feliz', category: 'emotions', difficulty: 'easy' },
  { word: 'sad', translation: 'triste', category: 'emotions', difficulty: 'easy' },
  { word: 'tired', translation: 'cansado', category: 'emotions', difficulty: 'easy' },
  { word: 'hungry', translation: 'hambriento', category: 'emotions', difficulty: 'easy' },
  { word: 'thirsty', translation: 'sediento', category: 'emotions', difficulty: 'easy' },
  
  { word: 'weather', translation: 'clima', category: 'weather', difficulty: 'easy' },
  { word: 'rain', translation: 'lluvia', category: 'weather', difficulty: 'easy' },
  { word: 'sun', translation: 'sol', category: 'weather', difficulty: 'easy' },
  { word: 'cold', translation: 'frío', category: 'weather', difficulty: 'easy' },
  { word: 'hot', translation: 'caliente', category: 'weather', difficulty: 'easy' },
];

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}



interface CreateWordDto {
  word: string;
  userId:string,
  nativeLanguage:string,
  targetLanguages:any[],
  learningStyle:string,
  difficulty:any,
  appLanguage:string,

}

async function login(): Promise<string> {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
      email: 'enes.cyclones@gmail.com',
      password: '123456',
    });
    return response.data.access_token;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Login failed:', error.response?.data || error.message);
    } else {
      console.error('Login failed:', error);
    }
    throw error;
  }
}

async function addWord(word: typeof dailyWords[0], token: string) {
  try {
    const wordData: CreateWordDto = {
      word: word.word,
      difficulty: "B2",
      userId: '5eb96018-a3b4-45fc-992d-c7be5447ce20',
      nativeLanguage: 'English',
      targetLanguages: [{ name: 'English', native: false , code: 'en' , startedAt: new Date(), lastStudied: new Date(), proficiency: "B2"}],
      learningStyle: "reading",
      appLanguage: 'English',
    };

    const response = axios.post(
      `${API_URL}/words`,
      wordData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(`Failed to add word ${word.word}:`, error.response?.data || error.message);
    } else {
      console.error(`Failed to add word ${word.word}:`, error);
    }
    throw error;
  }
}

async function main() {
  try {
    console.log('Starting word addition process...');
    
    // Login to get token
    console.log('Logging in...');
    const token = await login();
    console.log('Successfully logged in');

    // Add words sequentially
    console.log('Adding words...');
    let successCount = 0;
    let failureCount = 0;

    for (const word of dailyWords) {
      try {
        console.log(`Adding word: ${word.word}`);
        await addWord(word, token);
        successCount++;
        console.log(`✓ Successfully added: ${word.word}`);
        // Add a small delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        failureCount++;
        console.error(`✗ Failed to add: ${word.word}`);
        continue; // Continue with next word even if one fails
      }
    }

    console.log('\nProcess completed!');
    console.log(`Successfully added: ${successCount} words`);
    console.log(`Failed to add: ${failureCount} words`);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Script failed:', error.response?.data || error.message);
    } else {
      console.error('Script failed:', error);
    }
    process.exit(1);
  }
}

// Run the script
main(); 