# Smart Search AI with DIRECTV Integration

A Next.js application that combines AI-powered movie search with DIRECTV service information. The project showcases intelligent search capabilities using Groq AI and integration with The Movie Database (TMDB) API.

## Features

### 1. AI-Powered Movie Search
- Natural language query processing
- Genre extraction and mapping
- Multi-parameter search support (title, actor, genre, language)
- Similar movie recommendations
- Cast information retrieval

### 2. DIRECTV Service Integration
- Dynamic plan comparison
- Feature highlights
- Pricing information
- Service package details

### 3. Intelligent SEO
- AI-generated meta titles and descriptions
- Dynamic SEO optimization based on content
- Open Graph meta tags for social sharing
- Server-side SEO generation for better security

### 4. Advanced Search Capabilities
- Natural language queries support:
  - "Find me a romantic French movie"
  - "Show me Leonardo DiCaprio's latest thriller"
  - "Telugu comedy movies released in 2023"
  - "Who acted in the movie Pushpa?"
  - "I want to watch something like Interstellar"
  - "Spider-Man movie in Hindi"

## Technology Stack

- **Frontend**: Next.js, React 19, Material-UI
- **AI Integration**: Groq AI (llama3-70b-8192 model)
- **APIs**: TMDB (The Movie Database)
- **Language**: TypeScript
- **Styling**: Material-UI with Emotion

## Project Structure

```
├── pages/
│   ├── api/
│   │   ├── ai.ts           # Movie search API endpoint
│   │   └── generate-seo.ts # SEO generation endpoint
│   └── directv.tsx         # DIRECTV service page
├── utils/
│   └── aiClient.ts         # Groq AI client configuration
├── components/             # React components
├── public/                 # Static assets
└── types/                  # TypeScript type definitions
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd smart-search-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```
   TMDB_API_KEY=your_tmdb_api_key
   GROQ_API_KEY=your_groq_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

### 1. Movie Search API (`/api/ai`)
- Handles natural language movie queries
- Extracts search parameters using AI
- Integrates with TMDB for movie data
- Supports multiple search types:
  - Title search
  - Genre search
  - Actor search
  - Similar movies
  - Movie information

### 2. SEO Generation API (`/api/generate-seo`)
- Generates optimized meta tags
- Uses AI to analyze page content
- Creates SEO-friendly titles and descriptions
- Server-side processing for security

## Environment Variables

- `TMDB_API_KEY`: API key for The Movie Database
- `GROQ_API_KEY`: API key for Groq AI services

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for movie data
- [Groq AI](https://groq.com/) for AI capabilities
- [DIRECTV](https://www.directv.com/) for service information
- [Material-UI](https://mui.com/) for UI components
