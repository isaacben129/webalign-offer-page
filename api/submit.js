const ALLOWED_STAGES = new Set(['Just an idea', 'Some early validation', 'Already building'])

function json(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

function getNotionParent(databaseId) {
  return {
    database_id: String(databaseId),
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' })
  }

  const { fullName, email, idea, stage } = req.body || {}

  if (!fullName || !String(fullName).trim()) return json(res, 400, { error: 'Full name is required.' })
  if (!email || !/^\S+@\S+\.\S+$/.test(String(email))) return json(res, 400, { error: 'Valid email is required.' })
  if (!idea || !String(idea).trim()) return json(res, 400, { error: 'Idea is required.' })
  if (!stage || !ALLOWED_STAGES.has(String(stage))) return json(res, 400, { error: 'Valid stage is required.' })

  const { RESEND_API_KEY, NOTION_TOKEN, NOTION_DATABASE_ID } = process.env

  if (!RESEND_API_KEY || !NOTION_TOKEN || !NOTION_DATABASE_ID) {
    return json(res, 500, { error: 'Server is missing required environment variables.' })
  }

  try {
    const submitTimeIso = new Date().toISOString()

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Web Align Sprint <onboarding@resend.dev>',
        to: ['hello@webalign.studio'],
        subject: `New Sprint Application - ${String(fullName).trim()}`,
        text: [
          `Full name: ${String(fullName).trim()}`,
          `Email: ${String(email).trim()}`,
          `Idea: ${String(idea).trim()}`,
          `Stage: ${String(stage).trim()}`,
          `Submitted at: ${submitTimeIso}`,
        ].join('\n'),
      }),
    })

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text()
      return json(res, 502, { error: `Resend failed: ${resendError}` })
    }

    const notionResponse = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        parent: getNotionParent(NOTION_DATABASE_ID),
        properties: {
          Name: {
            title: [{ text: { content: String(fullName).trim() } }],
          },
          Email: {
            email: String(email).trim(),
          },
          Idea: {
            rich_text: [{ text: { content: String(idea).trim().slice(0, 500) } }],
          },
          Stage: {
            select: { name: String(stage).trim() },
          },
          'Submitted at': {
            date: { start: submitTimeIso },
          },
          Status: {
            select: { name: 'New' },
          },
        },
      }),
    })

    if (!notionResponse.ok) {
      const notionError = await notionResponse.text()
      return json(res, 502, { error: `Notion failed: ${notionError}` })
    }

    return json(res, 200, { success: true })
  } catch (error) {
    return json(res, 500, { error: error.message || 'Server error' })
  }
}

