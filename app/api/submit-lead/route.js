// ═══════════════════════════════════════════════════════════════
//  SUBMIT LEAD API ROUTE — Next.js
//  PHP submit-lead.php ka exact replacement
//  POST /api/submit-lead
// ═══════════════════════════════════════════════════════════════

/* ─── CONFIG ─────────────────────────────────────────────────── */
import { SHEET_WEBHOOK, PROPTIGER_URL, CITY_ID, CITY_SLUG } from '../../../lib/config'
/* ────────────────────────────────────────────────────────────── */

function clean(v) {
  return (v ?? '').toString().trim().replace(/<[^>]*>/g, '')
}

function getUserIP(request) {
  const loopback = new Set(['::1', '127.0.0.1', '::ffff:127.0.0.1'])
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const ip = forwarded.split(',')[0].trim()
    if (ip && !loopback.has(ip)) return ip
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp && !loopback.has(realIp)) return realIp
  return ''
}

export async function POST(request) {
  try {
    /* ── Parse form data ── */
    const formData = await request.formData()
    const get = (key) => clean(formData.get(key) || '')

    /* ── Honeypot check ── */
    if (get('website') !== '') {
      return Response.json({ status: false })
    }

    /* ── Required fields ── */
    let phone = get('phone').replace(/\D/g, '')
    if (phone.length > 10) phone = phone.slice(-10)
    const email = get('email')

    if (phone.length > 0 && phone.length < 10) {
      return Response.json({ status: false, msg: 'Invalid phone number' })
    }

    if (phone === '' && email === '') {
      return Response.json({ status: false })
    }

    const projectId = get('projectId')
    if (projectId === '') {
      return Response.json({ status: false })
    }

    /* ── User data ── */
    const fullName = get('fullname')
    const projectName = get('projectName')
    const nameParts = fullName.trim().split(/\s+/)
    const firstName = nameParts[0] || ''
    const lastName = nameParts[1] || firstName

    /* ── Tracking ── */
    const utmSource = get('utm_source') || 'Microsite'
    const utmMedium = get('utm_medium') || 'organic'
    const utmCampaign = get('utm_campaign')
    const utmTerm = get('utm_term')
    const utmContent = get('utm_content')
    const campaignName = get('campaign_name')

    const gclid = get('gclid')
    const gbraid = get('gbraid')
    const wbraid = get('wbraid')

    const landingPage = get('SourceURL') || get('landing_page')
    const userIP = getUserIP(request) || get('ip_address')

    const comments = get('comments')

    /* ── 1. Google Sheet ── */
    const sheetPayload = new URLSearchParams({
      secret: get('secret'),

      ProjectID: projectId,
      ProjectName: projectName,

      FullName: `${firstName} ${lastName}`.trim(),
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      Mobile: phone,
      Comments: comments,

      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_term: utmTerm,
      utm_content: utmContent,

      gclid,
      gbraid,
      wbraid,

      SourceURL: landingPage,
      landing_page: landingPage,

      Device: get('device'),
      Referrer: get('referrer'),
      IpAddress: userIP,
      FormName: get('form_name'),
      ProjectCity: get('city'),
      sheet_name: get('sheet_name'),
    })

    fetch(SHEET_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: sheetPayload.toString(),
    })
      .then(r => console.log('[Sheet] status:', r.status))
      .catch(e => console.error('[Sheet] error:', e.message))

    /* ── 2. Proptiger CRM ── */
    const ptUrl = `${PROPTIGER_URL}?utm_source=${encodeURIComponent(utmSource)}&utm_medium=${encodeURIComponent(utmMedium)}&utm_campaign=${encodeURIComponent(utmCampaign)}&utm_term=${encodeURIComponent(utmTerm)}&utm_content=${encodeURIComponent(utmContent)}&gclid=${encodeURIComponent(gclid)}&gbraid=${encodeURIComponent(gbraid)}&wbraid=${encodeURIComponent(wbraid)}&campaign_name=${encodeURIComponent(campaignName)}&sourceDomain=Microsite`

    const ptPayload = {
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      countryId: '1',
      source: utmSource,

      projectId,
      projectName,

      // cityId: get('city_id') || CITY_ID,
      cityName: get('city').toLowerCase() || CITY_SLUG,

      gaMedium: utmMedium,
      campaign: utmCampaign,
      addgroup: get('adgroup_name'),

      utm_term: utmTerm,
      utm_content: utmContent,

      gclid,
      gbraid,
      wbraid,

      query: comments || 'Please arrange a callback',
      device: get('device'),
      userIP,

      sendOtp: false,
      isTemp: false,
    }

    const ptBodyStr = JSON.stringify(ptPayload)
    console.log('[CRM] payload:', ptBodyStr)

    let ptStatus = null
    let ptBody = null
    try {
      const ptRes = await fetch(ptUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Microsite',
        },
        body: ptBodyStr,
      })
      ptStatus = ptRes.status
      ptBody = await ptRes.text()
      console.log('[CRM] status:', ptStatus, '| body:', ptBody)
    } catch (e) {
      console.error('[CRM] fetch error:', e.message)
    }

    return Response.json({
      status: true,
      crm: ptStatus,
    })

  } catch (err) {
    console.error('submit-lead error:', err)
    return Response.json({ status: false, msg: 'Server error' }, { status: 500 })
  }
}
