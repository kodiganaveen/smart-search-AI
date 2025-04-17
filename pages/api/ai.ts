import type { NextApiRequest, NextApiResponse } from 'next'
import { groqClient } from '../../utils/aiClient'
import axios from 'axios'

const TMDB_API_KEY = process.env.TMDB_API_KEY

const genreMap: Record<string, number> = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  science: 878,
  thriller: 53,
  war: 10752,
  western: 37
}

const languageMap: Record<string, string> = {
  hindi: 'hi',
  english: 'en',
  telugu: 'te',
  tamil: 'ta',
  malayalam: 'ml',
  kannada: 'kn',
  bengali: 'bn',
  marathi: 'mr',
  french: 'fr',
  spanish: 'es',
  german: 'de',
  italian: 'it',
  japanese: 'ja',
  korean: 'ko',
  chinese: 'zh'
}

interface SearchParams {
  type: 'title' | 'genre' | 'actor' | 'similar' | 'info' | 'language'
  title?: string
  genre?: string
  actor?: string
  year?: string
  language?: string
  similarTo?: string
  infoType?: 'cast' | 'details'
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.body

  try {
    // First, use AI to understand the query intent and extract parameters
    const aiResponse = await groqClient.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [
        {
          role: 'system',
          content: `Analyze the movie search query and extract relevant parameters. Respond in JSON format with the following structure:
          {
            "type": "title|genre|actor|similar|info|language",
            "title": "movie title if specified",
            "genre": "genre if specified",
            "actor": "actor name if specified",
            "year": "year if specified",
            "language": "language if specified",
            "similarTo": "movie title for similar movies",
            "infoType": "cast|details if asking for specific info"
          }
          Examples:
          - "Find me a romantic French movie" -> {"type": "genre", "genre": "romance", "language": "fr"}
          - "Show me Leonardo DiCaprio's latest thriller" -> {"type": "actor", "actor": "Leonardo DiCaprio", "genre": "thriller"}
          - "Telugu comedy movies released in 2023" -> {"type": "genre", "genre": "comedy", "language": "te", "year": "2023"}
          - "Who acted in the movie Pushpa?" -> {"type": "info", "title": "Pushpa", "infoType": "cast"}
          - "I want to watch something like Interstellar" -> {"type": "similar", "similarTo": "Interstellar"}
          - "Spider-Man movie in Hindi" -> {"type": "title", "title": "Spider-Man", "language": "hi"}`
        },
        { role: 'user', content: query }
      ],
      temperature: 0.2
    })

    const aiText = aiResponse.choices[0].message.content || ''
    console.log('AI Response:', aiText)

    let searchParams: SearchParams = {
      type: 'title'
    }

    try {
      // Extract JSON from the response, handling cases where there might be additional notes
      const jsonMatch = aiText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        searchParams = {
          ...searchParams,
          ...parsed
        }
      } else {
        console.error('No valid JSON found in AI response:', aiText)
        // Default to a title search with the original query
        searchParams = {
          type: 'title',
          title: query
        }
      }
    } catch (err) {
      console.error('Failed to parse AI response:', aiText)
      // Default to a title search with the original query
      searchParams = {
        type: 'title',
        title: query
      }
    }

    // Construct TMDB API URL based on search parameters
    let tmdbUrl: string = ''
    let fallbackUrl: string | null = null

    switch (searchParams.type) {
      case 'title':
        if (searchParams.title) {
          // For Marvel or DC searches, add the company name to improve results
          const searchQuery = searchParams.title.toLowerCase().includes('marvel') 
            ? 'Marvel Studios' 
            : searchParams.title.toLowerCase().includes('dc') 
              ? 'DC Comics' 
              : searchParams.title
          
          tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchQuery)}`
          if (searchParams.language) {
            tmdbUrl += `&language=${languageMap[searchParams.language.toLowerCase()] || 'en'}`
          }
          if (searchParams.year) {
            tmdbUrl += `&year=${searchParams.year}`
          }
        }
        break

      case 'genre':
        const genreId = searchParams.genre ? genreMap[searchParams.genre.toLowerCase()] : undefined
        tmdbUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}`
        if (genreId) {
          tmdbUrl += `&with_genres=${genreId}`
        }
        if (searchParams.language) {
          tmdbUrl += `&with_original_language=${languageMap[searchParams.language.toLowerCase()] || 'en'}`
        }
        if (searchParams.year) {
          tmdbUrl += `&year=${searchParams.year}`
        }
        break

      case 'actor':
        if (searchParams.actor) {
          // First get actor ID
          const actorSearchUrl = `https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchParams.actor)}`
          const actorResponse = await axios.get(actorSearchUrl)
          const actorId = actorResponse.data.results[0]?.id

          if (actorId) {
            tmdbUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_cast=${actorId}`
            if (searchParams.genre) {
              const genreId = genreMap[searchParams.genre.toLowerCase()]
              if (genreId) {
                tmdbUrl += `&with_genres=${genreId}`
              }
            }
          }
        }
        break

      case 'similar':
        if (searchParams.similarTo) {
          // First get movie ID
          const movieSearchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchParams.similarTo)}`
          const movieResponse = await axios.get(movieSearchUrl)
          const movieId = movieResponse.data.results[0]?.id

          if (movieId) {
            tmdbUrl = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`
          }
        }
        break

      case 'info':
        if (searchParams.title && searchParams.infoType === 'cast') {
          // First get movie ID
          const movieSearchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchParams.title)}`
          const movieResponse = await axios.get(movieSearchUrl)
          const movieId = movieResponse.data.results[0]?.id

          if (movieId) {
            tmdbUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`
          }
        }
        break

      case 'language':
        // Handle language-only searches by defaulting to popular movies in that language
        if (searchParams.language) {
          tmdbUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_original_language=${languageMap[searchParams.language.toLowerCase()] || 'en'}`
        }
        break

      default:
        // Default to popular movies if no valid search type
        tmdbUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}`
    }

    // Add common parameters if URL is constructed
    if (tmdbUrl && !tmdbUrl.includes('credits')) {
      tmdbUrl += '&sort_by=popularity.desc'
    }

    // Execute the search only if we have a valid URL
    if (!tmdbUrl) {
      res.status(400).json({ error: 'Invalid search parameters' })
      return
    }

    const movieResponse = await axios.get(tmdbUrl)
    let results = []

    if (searchParams.type === 'info' && searchParams.infoType === 'cast') {
      // Handle cast information
      results = movieResponse.data.cast.map((actor: any) => ({
        name: actor.name,
        character: actor.character,
        profile_path: actor.profile_path
      }))
    } else {
      // Handle movie results
      results = movieResponse.data.results.map((movie: any) => ({
        title: movie.title,
        overview: movie.overview,
        poster: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        original_language: movie.original_language
      }))
    }

    // If no results found and we have a fallback, try that
    if (results.length === 0 && fallbackUrl) {
      const fallbackResponse = await axios.get(fallbackUrl)
      results = fallbackResponse.data.results.map((movie: any) => ({
        title: movie.title,
        overview: movie.overview,
        poster: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        original_language: movie.original_language
      }))
    }

    res.status(200).json({ 
      results,
      searchParams // Include the parsed parameters for debugging
    })
  } catch (error) {
    console.error('AI or TMDb Error:', error)
    res.status(500).json({ error: 'Failed to fetch data.' })
  }
}