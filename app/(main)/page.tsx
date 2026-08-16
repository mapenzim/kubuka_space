import EngageSection from "@/components/home/engage_section";
import FeaturedSolutionsSection from "@/components/home/featured_solutions_section";
import { HeroSection } from "@/components/home/hero_section";
import { IntroSection } from "@/components/home/intro_section";
import OwnerSection from "@/components/home/owner_section";
import PlanSection from "@/components/home/plan_section";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <IntroSection />
      <PlanSection />
      <OwnerSection />
      <EngageSection />
      <FeaturedSolutionsSection />
    </div>
  );
}
