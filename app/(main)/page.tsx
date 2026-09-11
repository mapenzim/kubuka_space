import EngageSection from "@/components/home/engage_section";
import FeaturedSolutionsSection from "@/components/home/featured_solutions_section";
import { HeroSection } from "@/components/home/hero_section";
import { IntroSection } from "@/components/home/intro_section";
import OwnerSection from "@/components/home/owner_section";
import PlanSection from "@/components/home/plan_section";

// The homepage is public and can be served from Vercel's edge cache. Featured
// products refresh in the background every five minutes; the store itself
// remains dynamic and continues to show live stock.
export const revalidate = 300;

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
