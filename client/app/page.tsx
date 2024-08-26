import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CloudSunIcon, CopyleftIcon, CurrencyIcon, DiscIcon, GithubIcon, LockIcon, NetworkIcon, TextIcon, TwitterIcon } from "@/lib/icons"

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50">
      <main className="flex-1">
        <HeroSection />
        <FeaturesOverview />
        <TestimonialSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-20 sm:py-32">
      <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2 lg:gap-20">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Decentralized Freelancing Platform
          </h1>
          <p className="text-xl md:text-2xl">
            Empower freelancers and clients with a secure, open-source, and decentralized platform that leverages the
            power of Solana blockchain.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" href="/dashboard" className="w-full sm:w-auto hover:scale-105 transition-transform duration-200 ease-in-out hover:drop-shadow-glow hover:bg-gray-800">Explore</Button>
            <Button size="lg" href="#" className="w-full sm:w-auto  hover:scale-105 transition-transform duration-200 ease-in-out hover:drop-shadow-glow   hover:bg-gray-800 ">Learn More</Button>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="w-full h-full bg-transparent border border-blue-700  shadow-xl rounded-lg  flex items-center justify-center">
          <img className="transition-transform duration-200 ease-in-out hover:scale-110" src="./solanaa-removebg.png"></img>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesOverview() {
  const features = [
    { icon: LockIcon, title: "Secure Transactions", description: "Leverage the power of Solana blockchain for secure and transparent transactions." },
    { icon: CurrencyIcon, title: "Cryptocurrency Payments", description: "Accept payments in Solana and other cryptocurrencies with low fees." },
    { icon: NetworkIcon, title: "Decentralized Platform", description: "Enjoy the benefits of a censorship-resistant decentralized system." },
    { icon: CopyleftIcon, title: "Open-Source", description: "Contribute to the platform's development and ensure transparency." },
  ]

  return (
    <section className="bg-white px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon: Icon, title, description }:{
  icon: React.ElementType
  title: string
  description: string}) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow-md border hover:shadow-lg hover:scale-105 transition-transform ease-in-out duration-200">
      <Icon className="w-12 h-12 text-blue-600 mb-4" />
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function TestimonialSection() {
  return (
    <section className="bg-gray-100 px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">What Our Users Say</h2>
        <blockquote className="text-xl italic text-gray-700">
          "This platform has revolutionized how I work as a freelancer. The security and transparency provided by the blockchain technology give me peace of mind with every transaction."
        </blockquote>
        <p className="mt-4 font-semibold text-gray-800">- Example User, Freelance Designer</p>
      </div>
    </section>
  )
}

function CallToAction() {
  return (
    <section className="bg-blue-600 text-white px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8">Join our platform today and experience the future of freelancing.</p>
        <Button href="/api/auth/signin" size="lg" className="bg-white text-blue-600 hover:bg-gray-100 hover:drop-shadow-glow hover:scale-105 transition-transform ease-in-out duration-200">Sign Up Now</Button>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-white px-4 py-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          {/* <CloudSunIcon className="w-6 h-6" /> */}
          <span className="text-3xl font-bold">Dfiverr</span>
        </div>
        <nav className="flex items-center gap-6">
          {[{icon : TwitterIcon , link : "https://twitter.com/sourxv_me"} , {icon : GithubIcon, link : "https://github.com/soravang81"} , {icon : TextIcon, link : "mailto:souravangral18@gmail.com"}].map((Icon, index) => (
            <Link key={index} href={Icon.link} className="hover:text-blue-400 transition-colors">
              <Icon.icon className="w-5 h-5" />
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

