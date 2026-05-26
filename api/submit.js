const ALLOWED_STAGES = new Set(['Just an idea', 'Some early validation', 'Already building'])
const ALLOWED_FORM_TYPES = new Set(['launch_sprint', 'custom_web'])

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

  const {
    fullName,
    email,
    idea,
    stage,
    formType,
    trigger,
    company,
    currentSite,
    projectType,
    timeline,
    budget,
    goals,
  } = req.body || {}

  const normalizedFormType = ALLOWED_FORM_TYPES.has(String(formType)) ? String(formType) : 'launch_sprint'

  if (!fullName || !String(fullName).trim()) return json(res, 400, { error: 'Full name is required.' })
  if (!email || !/^\S+@\S+\.\S+$/.test(String(email))) return json(res, 400, { error: 'Valid email is required.' })

  if (normalizedFormType === 'custom_web') {
    if (!company || !String(company).trim()) return json(res, 400, { error: 'Company or project name is required.' })
    if (!projectType || !String(projectType).trim()) return json(res, 400, { error: 'Project type is required.' })
    if (!timeline || !String(timeline).trim()) return json(res, 400, { error: 'Timeline is required.' })
    if (!budget || !String(budget).trim()) return json(res, 400, { error: 'Budget range is required.' })
    if (!goals || !String(goals).trim()) return json(res, 400, { error: 'Project goals are required.' })
  } else {
    if (!idea || !String(idea).trim()) return json(res, 400, { error: 'Idea is required.' })
    if (!stage || !ALLOWED_STAGES.has(String(stage))) return json(res, 400, { error: 'Valid stage is required.' })
  }

  const { RESEND_API_KEY, NOTION_TOKEN, NOTION_DATABASE_ID } = process.env

  if (!RESEND_API_KEY || !NOTION_TOKEN || !NOTION_DATABASE_ID) {
    return json(res, 500, { error: 'Server is missing required environment variables.' })
  }

  try {
    const submitTimeIso = new Date().toISOString()
    const safeFullName = String(fullName).trim()
    const safeEmail = String(email).trim()
    const safeTrigger = String(trigger || 'unknown')

    const launchIdeaText = String(idea || '').trim()
    const launchStageText = String(stage || '').trim()
    const customCompanyText = String(company || '').trim()
    const customSiteText = String(currentSite || '').trim()
    const customProjectTypeText = String(projectType || '').trim()
    const customTimelineText = String(timeline || '').trim()
    const customBudgetText = String(budget || '').trim()
    const customGoalsText = String(goals || '').trim()

    const notionIdeaText = normalizedFormType === 'custom_web'
      ? [
          'Form type: Custom Web Design Quote',
          `Company / project: ${customCompanyText}`,
          `Current website: ${customSiteText || 'N/A'}`,
          `Project type: ${customProjectTypeText}`,
          `Timeline: ${customTimelineText}`,
          `Budget: ${customBudgetText}`,
          `Goals: ${customGoalsText}`,
          `Trigger: ${safeTrigger}`,
        ].join('\n')
      : [
          'Form type: Launch Sprint Application',
          `Idea: ${launchIdeaText}`,
          `Stage: ${launchStageText}`,
          `Trigger: ${safeTrigger}`,
        ].join('\n')

    const notionStageName = normalizedFormType === 'custom_web' ? 'Already building' : launchStageText

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Web Align Sprint <hello@launch.webalign.studio>',
        to: ['hello@webalign.studio'],
        subject: normalizedFormType === 'custom_web'
          ? `New Custom Web Quote Request - ${safeFullName}`
          : `New Launch Sprint Application - ${safeFullName}`,
        text: normalizedFormType === 'custom_web'
          ? [
              'Form type: Custom Web Design Quote',
              `Full name: ${safeFullName}`,
              `Email: ${safeEmail}`,
              `Company / project: ${customCompanyText}`,
              `Current website: ${customSiteText || 'N/A'}`,
              `Project type: ${customProjectTypeText}`,
              `Timeline: ${customTimelineText}`,
              `Budget: ${customBudgetText}`,
              `Goals: ${customGoalsText}`,
              `Trigger: ${safeTrigger}`,
              `Submitted at: ${submitTimeIso}`,
            ].join('\n')
          : [
              'Form type: Launch Sprint Application',
              `Full name: ${safeFullName}`,
              `Email: ${safeEmail}`,
              `Idea: ${launchIdeaText}`,
              `Stage: ${launchStageText}`,
              `Trigger: ${safeTrigger}`,
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
            title: [{ text: { content: safeFullName } }],
          },
          Email: {
            email: safeEmail,
          },
          Idea: {
            rich_text: [{ text: { content: notionIdeaText.slice(0, 1900) } }],
          },
          Stage: {
            select: { name: notionStageName },
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

