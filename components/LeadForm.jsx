'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { PROJECT_ID, PROJECT_NAME, API_ENDPOINT, SHEET_NAME, SECRET_KEY, CITY_DISPLAY } from '../lib/config'
import { buildTrackingFields } from '../lib/formMeta'

const GOLD = 'var(--color-gold)'
const F_SANS = 'var(--font-sans), Open Sans, sans-serif'

const inputClass = 'form-input mb-3 shadow-sm'
const F_JOST = 'var(--font-jost), Montserrat, sans-serif'

const CITIES = ['Ahmedabad','Bangalore','Chennai','Gurgaon','Hyderabad','Indore','Jaipur','Kolkata','Lucknow','Mumbai','Noida','Pune']

const LeadForm = ({ formName = 'Hero Form', btnText = 'Submit Details' }) => {
  const [formData, setFormData] = useState({ projectId: '', projectName: '', sheetName: '', city: '', cityId: '', fullname: '', email: '' })
  const [phone, setPhone] = useState('91')
  const [dialCode, setDialCode] = useState('91')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [cityOpen, setCityOpen] = useState(false)

  useEffect(() => {
    if (!cityOpen) return
    const close = (e) => { if (!e.target.closest('[data-city-dd]')) setCityOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [cityOpen])

  useEffect(() => {
    if (!success) return
    const t = setTimeout(() => {
      setSuccess(false)
      setFormData({ projectId: formData.projectId, projectName: formData.projectName, sheetName: formData.sheetName, city: '', cityId: '', fullname: '', email: '' })
      setPhone('91')
      setDialCode('91')
    }, 4000)
    return () => clearTimeout(t)
  }, [success])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.sheetName) {
      setError('Please select a city.')
      return
    }
    const localNumber = phone.slice(dialCode.length)
    if (!localNumber || localNumber.length < 6) {
      setError('Please enter a valid mobile number.')
      return
    }
    setError(''); setLoading(true)
    const tracking = buildTrackingFields()
    const payload = new FormData()
    payload.append('fullname', formData.fullname)
    payload.append('email', formData.email)
    payload.append('phone', phone.slice(dialCode.length))
    payload.append('country_code', `+${dialCode}`)
    payload.append('projectId', formData.projectId || PROJECT_ID)
    payload.append('projectName', formData.projectName || PROJECT_NAME)
    payload.append('form_name', formName)
    payload.append('sheet_name', formData.sheetName || SHEET_NAME)
    payload.append('secret', SECRET_KEY)
    // payload.append('city', formData.city || CITY_DISPLAY)
    payload.append('city', formData.sheetName)
    // payload.append('city_id', formData.cityId)
    Object.entries(tracking).forEach(([k, v]) => payload.append(k, v))
    try {
      const res = await fetch(API_ENDPOINT, { method: 'POST', body: payload })
      const data = await res.json()
      if (data.status) {
        setSuccess(true)
        if (typeof window !== 'undefined') {
          window.dataLayer = window.dataLayer || []
          const nameParts = formData.fullname.trim().split(' ')
          window.dataLayer.push({
            event: 'lead_submit_success', form_name: formName,
            user_data: {
              email: formData.email.trim() || undefined, phone: `+${phone}`,
              first_name: nameParts[0] || '', last_name: nameParts.slice(1).join(' ') || ''
            }
          })
        }
      } else { setError(data.msg || 'Submission failed. Please try again.') }
    } catch { setError('Network error. Please check your connection and try again.') }
    finally { setLoading(false) }
  }

  if (success) return (
    <div className="text-center py-6">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--color-gold-bg)' }}>
        <svg className="w-8 h-8" style={{ color: 'var(--color-gold-dark)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: F_SANS }}>Thank You!</h4>
      <p className="text-gray-500 text-sm" style={{ fontFamily: F_SANS }}>Our team will contact you shortly.</p>
    </div>
  )

  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1">
      <input type="text" name="projectId" required placeholder="Project ID" value={formData.projectId} onChange={handleChange}
        className={inputClass} style={{ fontFamily: F_SANS }} />
      <input type="text" name="projectName" required placeholder="Project Name" value={formData.projectName} onChange={handleChange}
        className={inputClass} style={{ fontFamily: F_SANS }} />
      <div className="relative mb-3" data-city-dd>
        <button type="button" onClick={() => setCityOpen(o => !o)}
          className="form-input shadow-sm w-full flex items-center justify-between"
          style={{ fontFamily: F_SANS, color: formData.sheetName ? 'var(--color-text-mid)' : '#9ca3af' }}>
          <span>{formData.sheetName || 'Select City'}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: 'transform 0.2s', transform: cityOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {cityOpen && (
          <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-44 overflow-y-auto" data-city-dd>
            {CITIES.map(city => (
              <div key={city} onMouseDown={() => { setFormData(f => ({ ...f, sheetName: city })); setCityOpen(false) }}
                className="px-4 py-2 cursor-pointer hover:bg-gray-50 text-sm"
                style={{ fontFamily: F_SANS, color: '#374151', background: formData.sheetName === city ? '#f0f4fa' : '' }}>
                {city}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* <input type="text" name="city" required placeholder="City (e.g. Kolkata)" value={formData.city} onChange={handleChange}
        className={inputClass} style={{ fontFamily: F_SANS }} /> */}
      {/* <input type="text" name="cityId" required placeholder="City ID (e.g. 1 for Kolkata)" value={formData.cityId} onChange={handleChange}
        className={inputClass} style={{ fontFamily: F_SANS }} /> */}
      <input type="text" name="fullname" required placeholder="Enter full name" value={formData.fullname} onChange={handleChange}
        className={inputClass} style={{ fontFamily: F_SANS }} />
      <input type="email" name="email" placeholder="Email Id (optional)" value={formData.email} onChange={handleChange}
        className={inputClass} style={{ fontFamily: F_SANS }} />
      <div className="mb-3">
        <PhoneInput
          country={'in'}
          value={phone}
          onChange={(value, data) => { setPhone(value); setDialCode(data.dialCode) }}
          placeholder="Enter mobile number"
          inputStyle={{ width: '100%', fontFamily: F_SANS, height: '42px', borderColor: '#d1d5db', borderRadius: '6px' }}
          buttonStyle={{ borderColor: '#d1d5db', borderRadius: '6px 0 0 6px', background: '#f9fafb' }}
          dropdownStyle={{ fontFamily: F_SANS }}
          enableSearch
          searchPlaceholder="Search country..."
        />
      </div>

      {error && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: F_SANS }}>{error}</p>}

      {/* <div className="flex items-start gap-2 mt-3">
        <input type="checkbox" id="privacy-lead" required defaultChecked className="mt-0.5 shrink-0" style={{ accentColor: GOLD }} />
        <label htmlFor="privacy-lead" className="text-xs text-gray-500 leading-relaxed cursor-pointer" style={{ fontFamily: F_SANS }}>
          I agree to receive updates as per the <Link href="/privacy-policy" className="underline hover:text-[var(--color-gold)]" title="Read our Privacy Policy">Privacy Policy</Link>
        </label>
      </div> */}

      <button type="submit" disabled={loading}
        className="btn-gold mt-4 w-full sm:w-4/5 mx-auto"
        style={{ padding: '14px', display: 'flex' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
        {loading ? 'Submitting...' : btnText}
      </button>
    </form>
  )
}

export default LeadForm


