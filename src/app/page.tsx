import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Stats } from "@/components/sections/stats";
import { ClassShowcase } from "@/components/sections/class-showcase";
import { PricingPreview } from "@/components/sections/pricing-preview";
import { Testimonials } from "@/components/sections/testimonials";
import { TransformationsPreview } from "@/components/sections/transformations-preview";
import { TrainerGrid } from "@/components/sections/trainer-grid";
import { CTABanner } from "@/components/sections/cta-banner";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { GymJsonLd } from "@/components/shared/json-ld";

export default function Home() {
  return (
    <>
      <GymJsonLd />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <ClassShowcase />
        <PricingPreview />
        <TransformationsPreview />
        <Testimonials />
        <TrainerGrid />
        <CTABanner />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
