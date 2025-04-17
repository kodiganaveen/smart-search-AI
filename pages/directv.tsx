import { useEffect, useState } from 'react'
import Head from 'next/head'
import axios from 'axios'
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material'

interface SeoData {
  title: string
  description: string
}

interface DirectvContent {
  title: string
  description: string
  image: string
  features: string[]
  plans: {
    name: string
    price: string
    features: string[]
  }[]
}

const directvContent: DirectvContent = {
  title: "DIRECTV - The Best in Live TV and On-Demand Entertainment",
  description: "Experience the best in live TV and on-demand entertainment with DIRECTV. Get access to thousands of channels, premium networks, and exclusive sports content.",
  image: "https://www.directv.com/images/directv-logo.png",
  features: [
    "Over 330+ channels",
    "4K Ultra HD content",
    "Unlimited DVR storage",
    "Stream on multiple devices",
    "Premium networks included",
    "Exclusive sports coverage"
  ],
  plans: [
    {
      name: "ENTERTAINMENT",
      price: "$64.99/mo.",
      features: [
        "160+ channels",
        "Unlimited DVR",
        "Stream on 3 devices"
      ]
    },
    {
      name: "CHOICE",
      price: "$84.99/mo.",
      features: [
        "185+ channels",
        "Regional sports networks",
        "Stream on 5 devices"
      ]
    },
    {
      name: "ULTIMATE",
      price: "$104.99/mo.",
      features: [
        "250+ channels",
        "Premium movie channels",
        "Stream on 10 devices"
      ]
    }
  ]
}

export default function DirectvPage() {
  const [seoData, setSeoData] = useState<SeoData>({
    title: "DIRECTV - TV Service Provider",
    description: "Get the best TV experience with DIRECTV. Watch live TV, sports, and movies on any device."
  })

  useEffect(() => {
    const generateSeoMeta = async () => {
      try {
        const response = await axios.post('/api/generate-seo', {
          content: directvContent
        })
        setSeoData(response.data)
      } catch (error) {
        console.error('Error generating SEO meta:', error)
      }
    }

    generateSeoMeta()
  }, [])

  return (
    <>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={directvContent.image} />
      </Head>

      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom align="center">
            {directvContent.title}
          </Typography>
          
          <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
            {directvContent.description}
          </Typography>

          <Box sx={{ my: 4 }}>
            <Grid container spacing={4}>
              {directvContent.features.map((feature, index) => (
                <Grid key={index} item xs={12} sm={6} md={4} component="div">
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {feature}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ mt: 6 }}>
            Choose Your Plan
          </Typography>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            {directvContent.plans.map((plan, index) => (
              <Grid key={index} item xs={12} md={4} component="div">
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {plan.name}
                    </Typography>
                    <Typography variant="h4" component="div" gutterBottom color="primary">
                      {plan.price}
                    </Typography>
                    <Box component="ul" sx={{ pl: 2 }}>
                      {plan.features.map((feature, idx) => (
                        <Typography component="li" key={idx} sx={{ mb: 1 }}>
                          {feature}
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2 }}>
                    <Button variant="contained" fullWidth>
                      Select Plan
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  )
} 