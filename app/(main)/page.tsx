import { auth } from "@/auth";
import { HeroSection } from "@/components/home/hero_section";

export default async function Page() {
  const session = await auth();

  return (
    <div className="flex flex-col">
      <HeroSection />
    </div>
  );
}
