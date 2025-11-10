import EngageSection from "@/components/home/engage_section";
import { HeroSection } from "@/components/home/hero_section";
import { IntroSection } from "@/components/home/intro_section";
import MessageSection from "@/components/home/message_section";
import OwnerSection from "@/components/home/owner_section";
import PlanSection from "@/components/home/plan_section";

export default async function Page() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <IntroSection />
      <PlanSection />
      <OwnerSection />
      <EngageSection />
      <MessageSection />
    </div>
  );
}
