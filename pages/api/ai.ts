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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.body

  try {
    const aiResponse = await groqClient.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [
        {
          role: 'system',
          content:
            'Analyze the user query and respond in JSON format. If the query contains a specific movie title, respond with { "type": "title", "title": "movie title" }. If the query is about a genre, respond with { "type": "genre", "genre": "genre name" }. If both are present, prioritize the title search.'
        },
        { role: 'user', content: query }
      ],
      temperature: 0.2
    })

    const aiText = aiResponse.choices[0].message.content || ''
    console.log('AI Response:', aiText)

    let searchType = 'genre'
    let searchValue = 'action'
    let title = ''

    try {
      const parsed = JSON.parse(aiText)
      if (parsed.type === 'title' && parsed.title) {
        searchType = 'title'
        title = parsed.title
      } else if (parsed.type === 'genre' && parsed.genre) {
        searchValue = parsed.genre.toLowerCase()
      }
    } catch (err) {
      console.error('Failed to parse AI response:', aiText)
    }

    let tmdbUrl: string
    if (searchType === 'title') {
      // Search by title
      tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&sort_by=popularity.desc`
    } else {
      // Search by genre
      const genreId = genreMap[searchValue] || 28
      console.log('Final Genre:', searchValue, '| Genre ID:', genreId)
      tmdbUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`
    }

    const movieResponse = await axios.get(tmdbUrl)
    const results = movieResponse.data.results.map((movie: any) => ({
      title: movie.title,
      overview: movie.overview,
      poster: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average
    }))

    res.status(200).json({ results })
  } catch (error) {
    console.error('AI or TMDb Error:', error)
    res.status(500).json({ error: 'Failed to fetch data.' })
  }
}