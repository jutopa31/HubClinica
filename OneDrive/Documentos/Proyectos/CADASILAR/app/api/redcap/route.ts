import { NextRequest, NextResponse } from 'next/server'

const redcapUrl = process.env.NEXT_PUBLIC_REDCAP_URL
const apiToken = process.env.REDCAP_API_TOKEN

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const recordId = searchParams.get('recordId')

  if (!redcapUrl || !apiToken || redcapUrl === 'your_redcap_url' || apiToken === 'your_redcap_api_token') {
    return NextResponse.json({ error: 'REDCap not configured' }, { status: 400 })
  }

  try {
    const formData = new FormData()
    formData.append('token', apiToken)
    formData.append('format', 'json')
    formData.append('returnFormat', 'json')

    switch (action) {
      case 'records':
        formData.append('content', 'record')
        formData.append('action', 'export')
        formData.append('type', 'flat')
        formData.append('rawOrLabel', 'raw')
        formData.append('rawOrLabelHeaders', 'raw')
        formData.append('exportCheckboxLabel', 'false')
        formData.append('exportSurveyFields', 'false')
        formData.append('exportDataAccessGroups', 'false')
        
        if (recordId) {
          formData.append('records[0]', recordId)
        }
        break

      case 'metadata':
        formData.append('content', 'metadata')
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const response = await fetch(`${redcapUrl}/api/`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`REDCap API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('REDCap API error:', error)
    return NextResponse.json({ error: 'Failed to fetch from REDCap' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!redcapUrl || !apiToken || redcapUrl === 'your_redcap_url' || apiToken === 'your_redcap_api_token') {
    return NextResponse.json({ error: 'REDCap not configured' }, { status: 400 })
  }

  try {
    const body = await request.json()
    
    const formData = new FormData()
    formData.append('token', apiToken)
    formData.append('content', 'record')
    formData.append('action', 'import')
    formData.append('format', 'json')
    formData.append('type', 'flat')
    formData.append('overwriteBehavior', 'normal')
    formData.append('forceAutoNumber', 'false')
    formData.append('data', JSON.stringify([body]))
    formData.append('returnContent', 'count')
    formData.append('returnFormat', 'json')

    const response = await fetch(`${redcapUrl}/api/`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`REDCap API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('REDCap save error:', error)
    return NextResponse.json({ error: 'Failed to save to REDCap' }, { status: 500 })
  }
}