import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { FeaturedSpaces } from "@/components/sections/featured-spaces";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Testimonials } from "@/components/sections/testimonials";
import { Footer } from "@/components/sections/footer";
import { SearchProvider } from "@/components/search-context";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* A busca do hero filtra a grade e preenche o modal de reserva. */}
        <SearchProvider>
          <Hero />
          <FeaturedSpaces />
        </SearchProvider>
        <HowItWorks />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
