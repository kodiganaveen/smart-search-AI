import type { NextApiRequest, NextApiResponse } from 'next'
import { groqClient } from '../../utils/aiClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { content } = req.body

    const aiResponse = await groqClient.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [
        {
          role: 'system',
          content: `Generate SEO meta title and description for a DIRECTV service page. Use the following content to create optimized meta tags:
          Title: ${content.title}
          Description: ${content.description}
          Features: ${content.features.join(', ')}
          Plans: ${content.plans.map((p: any) => p.name).join(', ')}
          
          Respond in JSON format:
          {
            "title": "optimized meta title",
            "description": "optimized meta description"
          }`
        }
      ],
      temperature: 0.7
    })

    const aiText = aiResponse.choices[0].message.content || ''
    const jsonMatch = aiText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      res.status(200).json(parsed)
    } else {
      res.status(500).json({ error: 'Failed to generate SEO meta tags' })
    }
  } catch (error) {
    console.error('Error generating SEO meta:', error)
    res.status(500).json({ error: 'Failed to generate SEO meta tags' })
  }
} 