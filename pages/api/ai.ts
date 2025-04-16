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
            'Extract the genre from the user query and respond ONLY in JSON like this: { "genre": "comedy", "type": "movie" }'
        },
        { role: 'user', content: query }
      ],
      temperature: 0.2
    })

    const aiText = aiResponse.choices[0].message.content || ''
    console.log('AI Response:', aiText)

    let genre = 'action' 
    try {
      const parsed = JSON.parse(aiText)
      if (parsed.genre) {
        genre = parsed.genre.toLowerCase()
      }
    } catch (err) {
      console.error('Failed to parse AI response:', aiText)
    }

    const genreId = genreMap[genre] || 28
    console.log('Final Genre:', genre, '| Genre ID:', genreId)

    const tmdbUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`
    const movieResponse = await axios.get(tmdbUrl)

    const results = movieResponse.data.results.map((movie: any) => ({
      title: movie.title,
      overview: movie.overview,
      poster: movie.poster_path
    }))

    res.status(200).json({ results })
  } catch (error) {
    console.error('AI or TMDb Error:', error)
    res.status(500).json({ error: 'Failed to fetch data.' })
  }
}