import { SiteNav } from "@/components/SiteNav";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { SampleRound } from "@/components/SampleRound";
import { WhyNow } from "@/components/WhyNow";
import { FinalCTA } from "@/components/FinalCTA";
import { SiteFooter } from "@/components/SiteFooter";

export default function Page() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <HowItWorks />
        <SampleRound />
        <WhyNow />
        <FinalCTA />
      </main>
      <SiteFooter />
    </>
  );
}
