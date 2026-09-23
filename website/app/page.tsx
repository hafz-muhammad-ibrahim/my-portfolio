import Intro from "@/components/Intro";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import { About, Skills, Contact, Footer } from "@/components/Sections";

export default function Home() {
  return (
    <div className="mx-auto min-h-screen max-w-content px-6 sm:px-10 lg:px-12">
      <div className="lg:grid lg:grid-cols-[minmax(0,42%)_minmax(0,58%)] lg:gap-14">
        <Intro />
        <main className="pt-10 pb-16 lg:py-24">
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Contact />
          <Footer />
        </main>
      </div>
    </div>
  );
}
