"use client"
import { useState, useRef, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, useScroll, useTransform, useSpring, useAnimation } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { GlobeIcon, CodeIcon, PaletteIcon, MessageCircleIcon, DollarSignIcon, ShieldIcon, Mail } from 'lucide-react'
import { ReactNode } from 'react'
import { Navbar } from '@/components/navbar'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AuroraBackground } from '@/components/aurorabg'
import { FlipWords } from '@/components/flipword'

export default function DfiverrLanding() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-600 to-black text-white overflow-x-hidden">
      {/* <Navbar session={session} /> */}
      <main className="">
        <HeroSection />
        <FeaturesSection />
        <CallToActionSection />
        <Footer />
      </main>
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
    <div className="relative">
      <AuroraBackground >
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative z-10 flex flex-col gap-4 items-center justify-center px-4 min-h-screen"
      >
        <div className="text-center py-10 flex flex-col gap-2">
          <div className="inline-block mb-4">
            <span className="text-3xl md:text-7xl font-bold text-indigo-100 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.5)]">
              Revolutionize Your Freelancing with Solana
            </span>
          </div>
          <div className="inline-block">
              <div className="text-xl md:text-4xl font-normal flex gap-1 items-end justify-center text-violet-00 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.3)]">
                <FlipWords words={["Fast", "Secure", "Decentralized"]} className='text-blue-800 font-medium'></FlipWords><span className='text-white'> Freelance Marketplace</span>           
              </div>
          </div>
        </div>

        <motion.div 
          className="space-x-4 z-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >          
          <button 
            onClick={() => router.push("/dashboard")}
            className="inline-flex h-12 animate-shimmer items-center justify-center rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white hover:scale-105 transition-all duration-500 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            Explore Gigs
          </button>        
          <button 
            onClick={() => router.push("/seller_dashboard")}
            className="inline-flex h-12 animate-shimmer items-center justify-center rounded-lg border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white hover:scale-105 transition-all duration-500 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            Post a Job
          </button>    
        </motion.div>
      </motion.div>
      </AuroraBackground >

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
    { icon: GlobeIcon, title: "Global Talent Pool", description: "Access a worldwide network of skilled professionals" },
    { icon: CodeIcon, title: "Smart Contracts", description: "Secure and transparent agreements powered by Solana" },
    { icon: PaletteIcon, title: "Creative Freedom", description: "Unleash your potential in a decentralized marketplace" },
    { icon: MessageCircleIcon, title: "Secure Communication", description: "End-to-end encrypted messaging for your privacy" },
    { icon: DollarSignIcon, title: "Fast Payments", description: "Lightning-fast transactions using Solana" },
    { icon: ShieldIcon, title: "Escrow Services", description: "Secure fund management for project milestones" },
  ]

  return (
    <section className="py-20 px-4 bg-black bg-opacity-50 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <motion.h2 
          className="text-5xl font-bold mb-12 text-center bg-clip-text text-gray-300"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Key Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900 to-black opacity-50" />
    </section>
  )
}

function FeatureCard({ feature, index }: { feature: { icon: React.ElementType; title: string; description: string }, index: number }) {
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
      <Card className="bg-purple-900 bg-opacity-50 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-xl h-full border-purple-500 hover:border-pink-500 transition-all duration-300 transform hover:scale-105">
        <feature.icon className="w-12 h-12 mb-4 text-purple-400" />
        <h3 className="text-xl font-semibold mb-2 text-purple-200">{feature.title}</h3>
        <p className="text-purple-300">{feature.description}</p>
      </Card>
    </motion.div>
  )
}

function CallToActionSection() {
  const [email, setEmail] = useState('')
  const controls = useAnimation()
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      <div className="container mx-auto text-center relative z-10">
        <motion.h2 
          className="text-5xl font-bold mb-6 bg-clip-text text-gray-300 bg-gradient-to-r from-purple-400 to-pink-600"
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
            <Button size="lg" className="transition-all text-lg duration-300 px-10 transform hover:scale-105"
              onClick={() => window.location.href = ("/login")}
            >
              Signin
            </Button>
          </div>
        </motion.div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900 to-black opacity-50" />
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-black bg-opacity-80 py-8 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <motion.div 
          className="text-3xl font-bold mb-4 md:mb-0 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
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
          <SocialIcon href="https://twitter.com/sourxv_me" Icon={TwitterIcon} />
          <SocialIcon href="https://github.com/soravang81" Icon={GithubIcon} />
          <SocialIcon href="mailto:souravangral18@gmail.com" Icon={MailIcon} />
        </div>
      </div>
      <div className="text-center mt-8 text-sm text-purple-400">
        © 2023 Dfiverr. All rights reserved.
      </div>
    </footer>
  )
}

function FooterLink({ href, children }: { href: string, children: ReactNode }) {
  return (
    <a 
      href={href} 
      className="text-purple-300 hover:text-pink-400 transition-colors duration-300"
    >
      {children}
    </a>
  )
}

function SocialIcon({ href, Icon }: { href: string, Icon: React.ElementType }) {
  return (
    <a 
      href={href} 
      className="text-purple-300 hover:text-pink-400 transition-colors duration-300"
    >
      <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
        <Icon className="w-6 h-6" />
      </motion.div>
    </a>
  )
}
function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}
function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

function DiscordIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6h-5v8l-3-3-3 3v-8H2v15h16z" />
      <path d="M22 3h-5v15h5z" />
    </svg>
  )
}