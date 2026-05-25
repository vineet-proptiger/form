'use client'
// import { useState } from 'react'
// import dynamic from 'next/dynamic'

import LeadForm from '../../components/LeadForm'

// import Navbar from '../../components/Navbar'
// import Hero from '../../components/Hero'
// const Overview = dynamic(() => import('../../components/Overview'), { ssr: true })
// const Highlights = dynamic(() => import('../../components/Highlights'), { ssr: true })
// const Amenities = dynamic(() => import('../../components/Amenities'), { ssr: true })
// const Pricing = dynamic(() => import('../../components/Pricing'), { ssr: true })
// const Location = dynamic(() => import('../../components/Location'), { ssr: true })
// const MasterPlan = dynamic(() => import('../../components/MasterPlan'), { ssr: true })
// const AboutDeveloper = dynamic(() => import('../../components/AboutDeveloper'), { ssr: true })
// const Footer = dynamic(() => import('../../components/Footer'), { ssr: true })
// const Gallery = dynamic(() => import('../../components/Gallery'), { ssr: false })
// const EnquireModal = dynamic(() => import('../../components/EnquireModal'), { ssr: false })
// const AosInit = dynamic(() => import('../../components/AosInit'), { ssr: false })

export default function Home() {
  // const [isOpen, setIsOpen] = useState(false)

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* <Navbar setIsOpen={setIsOpen} /> */}
      {/* <Hero setIsOpen={setIsOpen} /> */}
      {/* <Overview setIsOpen={setIsOpen} /> */}
      {/* <Highlights setIsOpen={setIsOpen} /> */}
      {/* <Gallery setIsOpen={setIsOpen} /> */}
      {/* <Amenities setIsOpen={setIsOpen} /> */}
      {/* <Pricing setIsOpen={setIsOpen} /> */}
      {/* <Location /> */}
      {/* <MasterPlan setIsOpen={setIsOpen} /> */}
      {/* <AboutDeveloper setIsOpen={setIsOpen} /> */}
      {/* <Footer /> */}
      {/* <EnquireModal isOpen={isOpen} setIsOpen={setIsOpen} /> */}

      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-center mb-2" style={{ fontFamily: 'var(--font-jost), Montserrat, sans-serif' }}>
          Enquire Now
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <span style={{
            display: 'block', width: '36px', height: '3px',
            background: 'linear-gradient(90deg, var(--color-gold), var(--color-gold-light))',
            borderRadius: '2px',
          }} />
        </div>
        <LeadForm formName="Main Form" btnText="Submit Details" />
      </div>

      {/* Floating Vertical Enquire Tab — commented out */}
      {/* <button onClick={() => setIsOpen(true)} className="hidden lg:flex btn-floating-tab !py-3 !px-3 shadow-lg" ... >
        Enquire Now
      </button> */}

      {/* Mobile Sticky Bottom Bar — commented out */}
      {/* <div className="sticky-bottom-bar"> */}
        {/* Contact */}
        {/* <a href="tel:+919718344024" className="flex-1 flex items-center justify-center !py-2 !px-0 text-white transition-all" style={{ background: '#111827' }}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
          </svg>
        </a> */}
        {/* Enquire button */}
        {/* <button onClick={() => setIsOpen(true)} className="flex-1 flex items-center justify-center btn-gold !py-2 !px-0 !rounded-none"> ... </button> */}
        {/* WhatsApp */}
        {/* <a href="https://wa.me/919718344024?text=Hi%20I%20am%20interested%20in%20Mirania%20Evara%2C%20Kolkata" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center py-2 !px-0 text-white transition-all hover:bg-white hover:text-[#25D366] hover:border hover:border-[#25D366]" style={{ background: '#25D366' }}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"> ... </svg>
        </a> */}
      {/* </div> */}
    </main>
  )
}
