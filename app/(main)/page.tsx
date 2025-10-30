import { auth } from "@/auth";
import EngageSection from "@/components/home/engage_section";
import { HeroSection } from "@/components/home/hero_section";
import { IntroSection } from "@/components/home/intro_section";
import MessageForm from "@/components/home/message_form";
import OwnerSection from "@/components/home/owner_section";
import PlanSection from "@/components/home/plan_section";

export default async function Page() {
  const session = await auth();

  return (
    <div className="flex flex-col">
      <HeroSection />
      <IntroSection />
      <PlanSection />
      <OwnerSection />
      <EngageSection />
      <MessageForm />
    </div>
  );
}
