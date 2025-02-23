import { google } from '@ai-sdk/google'
import { streamText } from 'ai'

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    
    const initialMessages = messages.slice(0, -1)
    const currentMessage = messages[messages.length - 1]
    
    let parsedContent;
    let imageUrl = null
    
    try {
      parsedContent = JSON.parse(currentMessage.content)
      imageUrl = parsedContent.image // Now directly using the URL
    } catch  {

      parsedContent = { text: currentMessage.content }
    }

    const messageContent = [
      ...initialMessages,
      {
        role: 'user',
        content: [
          { type: 'text', text: parsedContent.text || parsedContent }
        ]
      }
    ]

    if (imageUrl) {
      messageContent[messageContent.length - 1].content.push({
        type: 'image',
        image: imageUrl
      })
    }

    const result = streamText({
      model: google('gemini-1.5-flash'),
      messages: messageContent
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Error processing request:', error)
    
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }), 
      { status: 500 }
    )
  }
}