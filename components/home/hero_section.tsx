import Image from "next/image";
import DeferredHeroVideo from "./deferred_hero_video";

const HeroSection = () => {
  return (
    <div
      className="relative flex flex-col items-center justify-center w-full min-h-screen"
    >
      {/** Background */}
      <div className="absolute inset-0 overflow-hidden bg-indigo-500 dark:bg-gray-900">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        <DeferredHeroVideo />
        <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-2xl flex-col justify-start px-4 pt-64 text-white">
        <div className="space-y-3 text-center drop-shadow-lg">
          <h1 className="text-3xl md:text-[62px]">
            Kubuka Space PBC
          </h1>
          <p className="text-[10px] md:text-xs">
            Unlocking Hidden Potential to Accelerate Business Growth.
          </p>
        </div>
      </div>
    </div>
  );
}

export { HeroSection };
