import { Container, Typography } from '@mui/material'
import SearchBox from '../components/SearchBox'

export default function Home() {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" mt={5} mb={3}>Smart Search with AI</Typography>
      <SearchBox />
    </Container>
  )
}