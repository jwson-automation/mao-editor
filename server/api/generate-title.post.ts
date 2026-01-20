import OpenAI from 'openai'

export default defineEventHandler(async (event) => {
  const { content } = await readBody(event)

  if (!content || typeof content !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'Content is required'
    })
  }

  // Read API key from Nuxt runtime config
  const config = useRuntimeConfig()
  const apiKey = config.openaiApiKey

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'OpenAI API key not configured'
    })
  }

  const openai = new OpenAI({
    apiKey
  })

  try {
    console.log('OpenAI API Key exists:', !!apiKey)
    console.log('API Key prefix:', apiKey?.substring(0, 10))
    console.log('API Key suffix:', apiKey?.substring(apiKey.length - 10))

    // Remove {{ }} markers from text to extract plain text only
    const plainText = content.replace(/\{\{([^}]+)\}\}/g, '$1')

    // Use only first 500 characters (save tokens)
    const textSample = plainText.slice(0, 500)

    console.log('Calling OpenAI API with text sample:', textSample.substring(0, 100))

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an assistant that generates short and appropriate titles based on text content. Generate the title in the SAME LANGUAGE as the input text. Keep titles within 10 characters.'
        },
        {
          role: 'user',
          content: `Generate a title within 10 characters for the following text. Use the same language as the text:\n\n${textSample}`
        }
      ],
      max_tokens: 20,
      temperature: 0.7
    })

    const title = completion.choices[0]?.message?.content?.trim() || '새 문서'

    console.log('Generated title:', title)

    return {
      title
    }
  } catch (error) {
    console.error('Error generating title:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Failed to generate title'
    })
  }
})
