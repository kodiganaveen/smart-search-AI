import React, { useState } from 'react'
import {
  Box,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  InputAdornment
} from '@mui/material'
import MicIcon from '@mui/icons-material/Mic'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

const SearchBox: React.FC = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query) return
    setLoading(true)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVoiceInput = () => {
    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.lang = 'en-US'
    recognition.start()

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setQuery(transcript)
      setTimeout(() => {
        handleSearch()
      }, 500)
    }

    recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event)
    }
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setLoading(false)
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={2}>
        <TextField
          fullWidth
          label="Search or say something..."
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {query && (
                  <IconButton onClick={handleClear} aria-label="clear">
                    <ClearIcon />
                  </IconButton>
                )}
                <IconButton onClick={handleSearch} aria-label="search">
                  <SearchIcon />
                </IconButton>
                <IconButton onClick={handleVoiceInput} aria-label="voice search">
                  <MicIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      <Box mt={2}>
        {loading ? (
          <CircularProgress />
        ) : (
          results.map((movie: any, idx) => (
            <Box key={idx} mb={2} p={2} border={1} borderRadius={2}>
              <Typography variant="h6">{movie.title}</Typography>
              <Typography variant="body2">{movie.overview}</Typography>
              {movie.poster && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster}`}
                  alt={movie.title}
                  style={{ marginTop: '10px' }}
                />
              )}
            </Box>
          ))
        )}
      </Box>
    </Box>
  )
}

export default SearchBox