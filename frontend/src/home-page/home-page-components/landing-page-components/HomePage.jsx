import FAQ from "./FAQ";
import Features from "./Features";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import LatestArticles from "./LatestArticles";
import Testimonials from './Testimonials';


function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <LatestArticles allarticles={false}/>
      <Testimonials />
      <FAQ />
    </>
  );
}

export default HomePage;
