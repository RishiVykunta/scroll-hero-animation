'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const containerRef = useRef(null)
  const trackRef = useRef(null)
  const progressRef = useRef(null)
  const eyebrowRef = useRef(null)
  const titleCharsRef = useRef([])
  const taglineRef = useRef(null)
  const cardsRef = useRef([])
  const carRef = useRef(null)
  
  // Clear refs on each render to prevent StrictMode duplicates interfering with GSAP staggers
  titleCharsRef.current = []
  cardsRef.current = []
  const bgTextRef = useRef(null)
  const speedLinesRef = useRef(null)
  const outroRef = useRef(null)

  // Helper to collect title refs
  const addToTitleRefs = (el) => {
    if (el && !titleCharsRef.current.includes(el)) {
      titleCharsRef.current.push(el)
    }
  }

  // Helper to collect card refs
  const addToCardsRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el)
    }
  }

  useEffect(() => {
    // Prevent browser from forcing a scroll jump on "Back"
    if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)

    // Force a fresh reload if the user hits the "Back" arrow and returns via BFCache
    const handlePageShow = (event) => {
      if (event.persisted) {
        window.location.reload()
      }
    }
    window.addEventListener('pageshow', handlePageShow)

    const ctx = gsap.context(() => {
      // 1. Initial Load Animation Sequence
      const tl = gsap.timeline()
      
      tl.to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      })
      .to(titleCharsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        stagger: 0.05
      }, '-=0.4')
      .to(taglineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.4')
      .to(cardsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1
      }, '-=0.6')

      // 2. Scroll Animations with Scrubs
      
      // Top Progress Bar
      gsap.to(progressRef.current, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: trackRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      })

      // Background Text Parallax (drifts slowly left to right)
      gsap.to(bgTextRef.current, {
        x: '20%',
        ease: 'none',
        scrollTrigger: {
          trigger: trackRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.4
        }
      })

      // The Car Journey
      const carTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: trackRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.4 // Buttery deceleration
        }
      })

      // Hide content seamlessly using its parent wrapper to completely bypass GSAP collision
      carTimeline
        .to(".content-layer", {
          opacity: 0,
          y: -100,
          duration: 0.8
        }, 0.5)
        .to(speedLinesRef.current, {
          opacity: 1,
          duration: 1
        }, 0)
        
        // Enter custom SVG sports car from left
        .to(carRef.current, {
          opacity: 1,
          x: '50vw',
          yPercent: -50,
          xPercent: -50,
          scale: 1,
          rotation: -5,
          duration: 2
        }, 0.5)
        
        // Speed lines intense effect
        .to(speedLinesRef.current, {
          x: '-100%',
          ease: 'none',
          duration: 4
        }, 0)
        
        // Car exits right
        .to(carRef.current, {
          x: '150vw',
          yPercent: -50,
          xPercent: 0,
          scale: 1.5,
          rotation: 10,
          opacity: 0,
          duration: 2
        }, 2.5)

      // Final Burst: ITZFIZZ background fades into a blur at the very end
      gsap.to(bgTextRef.current, {
        opacity: 0,
        filter: 'blur(20px)',
        scrollTrigger: {
          trigger: trackRef.current,
          start: '80% center',
          end: 'bottom bottom',
          scrub: 1.4
        }
      })

      // CTA Outro Reveal (Creative Burst)
      gsap.fromTo(outroRef.current, 
        { autoAlpha: 0, scale: 0.5, y: 150, rotateX: 45 },
        {
          autoAlpha: 1,
          pointerEvents: 'auto',
          scale: 1,
          y: 0,
          rotateX: 0,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: trackRef.current,
            start: '75% center',
            end: '90% center',
            scrub: 1.4
          }
        }
      )

    }, containerRef)

    return () => {
      window.removeEventListener('pageshow', handlePageShow)
      ctx.revert() // cleans up everything properly 
      ScrollTrigger.killAll()
    }
  }, [])

  const titleWord = "ITZFIZZ"
  
  return (
    <div ref={containerRef} className="hero-container">
      <div ref={progressRef} className="progress-bar"></div>
      
      <div ref={trackRef} className="scroll-track">
        <div className="sticky-viewport">
          
          <div className="bg-text-container">
            <h1 ref={bgTextRef} className="bg-text">ITZFIZZ</h1>
          </div>
          
          <div ref={speedLinesRef} className="speed-lines"></div>

          <div className="content-layer">
            <div 
              ref={eyebrowRef} 
              className="eyebrow"
              style={{ transform: 'translateY(20px)' }}
            >
              NEXT-GENERATION PERFORMANCE STUDIO
            </div>
            
            <h1 className="main-title">
              <div style={{ display: 'flex', gap: 'clamp(0.2rem, 1vw, 1.5rem)', justifyContent: 'center', width: '100%' }}>
                {Array.from("WELCOME").map((char, i) => (
                  <span key={`w-${i}`} ref={addToTitleRefs} className="char">{char}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 'clamp(0.2rem, 1vw, 1.5rem)', justifyContent: 'center', width: '100%', marginTop: 'clamp(-0.5rem, -1vw, -1rem)' }}>
                {Array.from(titleWord).map((char, i) => (
                  <span key={`f-${i}`} ref={addToTitleRefs} className="char">{char}</span>
                ))}
              </div>
            </h1>
            
            <p 
              ref={taglineRef} 
              className="tagline"
              style={{ transform: 'translateY(20px)' }}
            >
              Where precision engineering meets relentless innovation
            </p>

            <div className="stats-grid">
              {[
                { value: "95%", label: "EFFICIENCY" },
                { value: "2x", label: "GROWTH" },
                { value: "140+", label: "PROJECTS" },
                { value: "0.3s", label: "AVG LOAD" }
              ].map((stat, i) => (
                <div key={i} ref={addToCardsRefs} className="stat-card">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div ref={carRef} className="car-container">
            <svg className="car-svg" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
              {/* Custom SVG Sports Car */}
              <defs>
                <linearGradient id="carBody" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#b91c1c" />
                </linearGradient>
                <linearGradient id="window" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#93c5fd" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Car Shadow */}
              <ellipse cx="400" cy="240" rx="350" ry="20" fill="rgba(0,0,0,0.6)" filter="blur(10px)"/>
              
              {/* Body Back */}
              <path d="M 100 200 L 700 200 C 750 200 780 170 780 150 C 780 120 700 110 650 100 L 550 50 C 500 30 350 30 250 50 L 150 100 C 80 120 20 150 20 180 C 20 200 50 200 100 200 Z" fill="url(#carBody)"/>
              
              {/* Windows */}
              <path d="M 280 60 C 350 40 450 40 520 60 L 600 100 C 600 100 300 110 200 100 L 280 60 Z" fill="url(#window)" opacity="0.8"/>
              
              {/* Details & Lines */}
              <path d="M 50 150 L 750 150" stroke="rgba(255,255,255,0.2)" strokeWidth="4" fill="none"/>
              <path d="M 680 160 L 750 160" stroke="#facc15" strokeWidth="8" fill="none" strokeLinecap="round" filter="url(#glow)"/> {/* Headlight glow */}
              <path d="M 40 160 L 80 160" stroke="#f87171" strokeWidth="10" fill="none" strokeLinecap="round" filter="url(#glow)"/> {/* Taillight glow */}
              
              {/* Wheels */}
              <circle cx="200" cy="200" r="45" fill="#1f2937"/>
              <circle cx="200" cy="200" r="30" fill="#374151" stroke="#9ca3af" strokeWidth="4"/>
              <circle cx="200" cy="200" r="10" fill="#f3f4f6"/>
              
              <circle cx="600" cy="200" r="45" fill="#1f2937"/>
              <circle cx="600" cy="200" r="30" fill="#374151" stroke="#9ca3af" strokeWidth="4"/>
              <circle cx="600" cy="200" r="10" fill="#f3f4f6"/>
              
              {/* Wheel Spokes */}
              {Array.from({length: 6}).map((_, i) => (
                <g key={`spoke1-${i}`} transform={`rotate(${i * 60} 200 200)`}>
                  <line x1="200" y1="170" x2="200" y2="190" stroke="#9ca3af" strokeWidth="6" strokeLinecap="round"/>
                </g>
              ))}
              {Array.from({length: 6}).map((_, i) => (
                <g key={`spoke2-${i}`} transform={`rotate(${i * 60} 600 200)`}>
                  <line x1="600" y1="170" x2="600" y2="190" stroke="#9ca3af" strokeWidth="6" strokeLinecap="round"/>
                </g>
              ))}
            </svg>
          </div>

          <div className="outro-section" style={{ perspective: '1000px' }}>
            <div ref={outroRef} className="outro-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(145deg, rgba(22, 22, 22, 0.95), rgba(12, 12, 12, 0.98))', padding: '5rem 3rem', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)', boxShadow: '0 30px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)', width: 'min(90vw, 800px)', margin: '0 auto' }}>
              
              <div style={{ color: 'var(--accent)', fontSize: '0.75rem', letterSpacing: '0.3em', fontWeight: '700', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
                End of the line
              </div>
              
              <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '800', lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: '0 0 1.5rem 0' }}>
                Ready to accelerate?
              </h2>
              
              <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '480px', lineHeight: 1.6, margin: '0 0 3rem 0' }}>
                The journey doesn't end here. Step into the next generation of high-performance architecture.
              </p>
              
              <a 
                href="https://itzfizz.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button"
                style={{ display: 'inline-block', textDecoration: 'none' }}
              >
                Ignite Engine
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
