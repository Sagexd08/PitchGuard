'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const ParticleBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let particles = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticle = () => {
      const hue = Math.random() * 120 + 180 
      const saturation = Math.random() * 30 + 60 
      const lightness = Math.random() * 40 + 40 

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 3 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        originalSize: Math.random() * 3 + 0.5,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        trail: []
      }
    }

    const initParticles = () => {
      particles = []
      const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100)
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle())
      }
    }

    const updateParticles = () => {
      const time = Date.now() * 0.001

      particles.forEach(particle => {
        
        particle.trail.push({ x: particle.x, y: particle.y, opacity: particle.opacity })
        if (particle.trail.length > 8) particle.trail.shift()

        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const distanceToCenter = Math.sqrt((particle.x - centerX) ** 2 + (particle.y - centerY) ** 2)
        const pullStrength = 0.0001

        particle.vx += (centerX - particle.x) * pullStrength
        particle.vy += (centerY - particle.y) * pullStrength

        particle.vx += Math.sin(time + particle.x * 0.01) * 0.02
        particle.vy += Math.cos(time + particle.y * 0.01) * 0.02

        particle.x += particle.vx
        particle.y += particle.vy
        particle.vx *= 0.99
        particle.vy *= 0.99

        if (particle.x < -50) particle.x = canvas.width + 50
        if (particle.x > canvas.width + 50) particle.x = -50
        if (particle.y < -50) particle.y = canvas.height + 50
        if (particle.y > canvas.height + 50) particle.y = -50

        const pulsePhase = time * particle.pulseSpeed + particle.x * 0.01 + particle.y * 0.01
        particle.size = particle.originalSize * (1 + Math.sin(pulsePhase) * 0.3)
        particle.opacity = 0.3 + Math.sin(pulsePhase * 0.7) * 0.3

        const hueShift = Math.sin(time * 0.5 + particle.x * 0.001) * 20
        const baseHue = 220 + hueShift
        particle.color = `hsl(${baseHue}, 70%, ${60 + Math.sin(pulsePhase) * 20}%)`
      })
    }

    const drawParticles = () => {
      
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      )
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)')
      gradient.addColorStop(0.5, 'rgba(30, 41, 59, 0.9)')
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0.98)')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.trail.forEach((trailPoint, index) => {
          const trailOpacity = (index / particle.trail.length) * particle.opacity * 0.3
          ctx.save()
          ctx.globalAlpha = trailOpacity
          ctx.fillStyle = particle.color
          ctx.beginPath()
          ctx.arc(trailPoint.x, trailPoint.y, particle.size * 0.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        })
      })

      particles.forEach(particle => {
        
        ctx.save()
        ctx.globalAlpha = particle.opacity * 0.3
        ctx.fillStyle = particle.color
        ctx.shadowColor = particle.color
        ctx.shadowBlur = particle.size * 4
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = particle.color
        ctx.shadowColor = particle.color
        ctx.shadowBlur = particle.size
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            const connectionStrength = (1 - distance / 150)
            const avgOpacity = (particle.opacity + otherParticle.opacity) / 2

            ctx.save()
            ctx.globalAlpha = connectionStrength * avgOpacity * 0.15

            const lineGradient = ctx.createLinearGradient(
              particle.x, particle.y, otherParticle.x, otherParticle.y
            )
            lineGradient.addColorStop(0, particle.color)
            lineGradient.addColorStop(1, otherParticle.color)

            ctx.strokeStyle = lineGradient
            ctx.lineWidth = connectionStrength * 2
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
            ctx.restore()
          }
        })
      })
    }

    const animate = () => {
      updateParticles()
      drawParticles()
      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initParticles()
    animate()

    const handleResize = () => {
      resizeCanvas()
      initParticles()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.6 }}
      />
      
      {}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              i % 3 === 0 ? 'bg-blue-400/30' :
              i % 3 === 1 ? 'bg-purple-400/30' : 'bg-cyan-400/30'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
            }}
            animate={{
              y: [0, -50 - Math.random() * 30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.1, 0.9, 0.1],
              scale: [0.5, 1.8, 0.5],
              rotate: [0, 360],
            }}
            transition={{
              duration: 6 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
          />
        ))}

        {}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              width: `${40 + Math.random() * 60}px`,
              height: `${40 + Math.random() * 60}px`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              opacity: [0.05, 0.2, 0.05],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95" />
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-purple-900/20 via-transparent to-transparent" />

        {}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.15, 0.05],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </>
  )
}

export default ParticleBackground
