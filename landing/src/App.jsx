import { Navbar }       from './components/Navbar.jsx';
import { Hero }         from './components/Hero.jsx';
import { PainSection }  from './components/PainSection.jsx';
import { HowItWorks }   from './components/HowItWorks.jsx';
import { Features }     from './components/Features.jsx';
import { ProgressLog }  from './components/ProgressLog.jsx';
import { Pricing }      from './components/Pricing.jsx';
import { CtaBanner }    from './components/CtaBanner.jsx';
import { Footer }       from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PainSection />
        <HowItWorks />
        <Features />
        <ProgressLog />
        <Pricing />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
