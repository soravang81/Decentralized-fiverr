"use client"

import { useState, useRef, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, useScroll, useTransform, useSpring, useAnimation } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Globe, Code, Palette, MessageCircle, DollarSign, Shield, Mail, Twitter, Github } from 'lucide-react'
import { ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AuroraBackground } from '@/components/aurorabg'
import { FlipWords } from '@/components/flipword'

export default function DfiverrLanding() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen w-full text-white overflow-x-hidden">
      <div className="relative">
        <AuroraBackground>
          <ScrollArea className="h-screen w-full">
            <motion.div
              initial={{ opacity: 0.0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="relative z-10 flex flex-col gap-4 items-center justify-center px-4"
            >
              <HeroSection />
              <FeaturesSection />
              <CallToActionSection />
              <Footer />
            </motion.div>
          </ScrollArea>
        </AuroraBackground>
      </div>
      <ParticlesBackground />
    </div>
  )
}

function HeroSection() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const router = useRouter()

  return (
    <div className="text-center py-10 flex-col gap-2 h-screen flex items-center justify-center border-b">
      <div className="inline-block mb-4">
        <h1 className="text-3xl md:text-7xl font-bold text-indigo-100 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.5)]">
          Revolutionize Your Freelancing with Solana
        </h1>
      </div>
      <div className="inline-block">
        <div className="text-xl md:text-4xl font-normal flex gap-1 items-end justify-center text-violet-100 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.3)]">
          <FlipWords words={["Fast", "Secure", "Decentralized"]} className='text-blue-800 font-medium' />
          <span className='text-white'> Freelance Marketplace</span>           
        </div>
      </div>
      <motion.div 
        className="space-x-4 z-20 mt-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >          
        <Button 
          onClick={() => router.push("/dashboard")}
          className="inline-flex h-12 animate-shimmer items-center justify-center rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white hover:scale-105 transition-all duration-500 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          Explore Gigs
        </Button>        
        <Button 
          onClick={() => router.push("/seller_dashboard")}
          className="inline-flex h-12 animate-shimmer items-center justify-center rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white hover:scale-105 transition-all duration-500 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          Post a Job
        </Button>    
      </motion.div>
    </div>
  )
}

function ParticlesBackground() {
  return (
    <div className="absolute inset-0 z-0">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-purple-300 opacity-0"
          style={{
            width: Math.random() * 5 + 1,
            height: Math.random() * 5 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            opacity: [0.2, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

function FeaturesSection() {
  const features = [
    { icon: Globe, title: "Global Talent Pool", description: "Access a worldwide network of skilled professionals" },
    { icon: Code, title: "Smart Contracts", description: "Secure and transparent agreements powered by Solana" },
    { icon: Palette, title: "Creative Freedom", description: "Unleash your potential in a decentralized marketplace" },
    { icon: MessageCircle, title: "Secure Communication", description: "End-to-end encrypted messaging for your privacy" },
    { icon: DollarSign, title: "Fast Payments", description: "Lightning-fast transactions using Solana" },
    { icon: Shield, title: "Escrow Services", description: "Secure fund management for project milestones" },
  ]

  return (
    <section className="py-20 px-4 relative overflow-hidden border-b">
      <div className="container mx-auto relative z-10 flex flex-col items-center justify-center gap-16">
        <motion.h2 
          className="text-5xl font-bold mb-12 text-center text-gray-300"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Key Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureCard({ feature, index }: { feature: Feature, index: number }) {
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } }
      }}
    >
      <Card className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-xl h-full border-purple-800 hover:border-orange-300 transition-all duration-300 transform hover:scale-105">
        <feature.icon className="w-12 h-12 mb-4 text-purple-400" />
        <h3 className="text-xl font-semibold mb-2 text-purple-200">{feature.title}</h3>
        <p className="text-foreground">{feature.description}</p>
      </Card>
    </motion.div>
  )
}

function CallToActionSection() {
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })
  const router = useRouter()

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  return (
    <section className="py-20 px-4 overflow-hidden">
      <div className="container mx-auto text-center relative z-10 flex flex-col items-center justify-center gap-8">
        <motion.h2 
          className="text-5xl font-bold mb-6 text-gray-300"
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
          }}
        >
          Join the Dfiverr Revolution
        </motion.h2>
        <motion.p 
          className="text-xl mb-8 text-purple-200"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
          }}
        >
          Be part of the future of work. Sign up now and start your decentralized freelancing journey.
        </motion.p>
        <motion.div 
          className="max-w-md mx-auto"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } }
          }}
        >
          <div className="flex items-center justify-center">
            <Button 
              size="lg" 
              className="transition-all text-lg duration-300 px-10 transform hover:scale-105"
              onClick={() => router.push("/login")}
            >
              Sign In
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="w-screen py-8 px-4 border-t">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <motion.div 
          className="text-3xl font-bold mb-4 md:mb-0 text-foreground"
          whileHover={{ scale: 1.05 }}
        >
          Dfiverr
        </motion.div>
        <nav className="flex space-x-4 mb-4 md:mb-0">
          <FooterLink href="#">About</FooterLink>
          <FooterLink href="#">Terms</FooterLink>
          <FooterLink href="#">Privacy</FooterLink>
          <FooterLink href="mailto:souravangral18@gmail.com">Contact</FooterLink>
        </nav>
        <div className="flex space-x-4">
          <SocialIcon href="https://twitter.com/sourxv_me" Icon={Twitter} />
          <SocialIcon href="https://github.com/soravang81" Icon={Github} />
          <SocialIcon href="mailto:souravangral18@gmail.com" Icon={Mail} />
        </div>
      </div>
      <div className="text-center mt-8 text-sm text-foreground">
        © 2023 Dfiverr. All rights reserved.
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string, children: ReactNode }) {
  return (
    <a 
      href={href} 
      className="text-foreground hover:text-purple-500 transition-colors duration-300"
    >
      {children}
    </a>
  )
}

function SocialIcon({ href, Icon }: { href: string, Icon: React.ElementType }) {
  return (
    <a 
      href={href} 
      target="_blank"
      rel="noopener noreferrer"
      className="text-foreground hover:text-purple-500 transition-colors duration-300"
    >
      <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
        <Icon className="w-6 h-6" />
      </motion.div>
    </a>
  )
}