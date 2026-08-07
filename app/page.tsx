import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { StatisticsSection } from "@/components/landing/statistics-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { ProductShowcase } from "@/components/landing/product-showcase"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Testimonials } from "@/components/landing/testimonials"
import { Faq } from "@/components/landing/faq"
import { Cta } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"
import { AnimatedBackground } from "@/components/landing/animated-background"

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col">
      <AnimatedBackground />
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <StatisticsSection />
        <FeaturesSection />
        <ProductShowcase />
        <HowItWorks />
        <Testimonials />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}
