import FadeIn from "~/components/ui/animation/fade";

import { StoreFront } from "~/components/ui/store/front";

export default function Page() {

  return (
    <div className="flex w-full h-full justify-center items-center" >
      <FadeIn delay={0.5} direction="up">
        <StoreFront />
      </FadeIn>
    </div>
  );
}
