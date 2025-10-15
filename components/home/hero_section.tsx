import CountdownTimer from "../countdown";
import Fading from "../fade";

const HeroSection = () => {
  return (
    <div
      className="relative flex flex-col items-center justify-center w-full min-h-screen"
    >
      <div className="absolute bg-center bg-cover w-full block overflow-hidden">
        <video className="w-full h-screen overflow-hidden z-10 aspect-auto bg-cover object-cover" autoPlay muted loop>
          <source src="/vids/bg-vid.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute flex flex-col w-full max-w-2xl h-full mx-auto mt-32">
        <Fading delay={0.7} direction="down" fullWidth={null} padding={null}>
          <div className="inline-block items-center space-y-5 sm:px-4 text-center justify-center text-slate-400">
          <h1 className="text-5xl">Kubuka Space PBC</h1>
          <p className="text-xs">Scouting the hidden genius. We can give your business or idea some energy to reach the stratosphere.</p>
          </div>
        </Fading>
      </div>
        <CountdownTimer targetDate="2025-10-31T23:59:59" />
    </div>
  );
}

export { HeroSection };