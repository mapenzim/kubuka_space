"use client";

import Image from "next/image";
import { useLinkStatus } from "next/link";

const Loading = ({ size = 20, className }: { size: number, className: string } ) => {
  const { pending } = useLinkStatus();

  return pending ? <Image
    alt="loading image"
    src={'/svgs/loading.svg'}
    width={size}
    height={size}
    className={`animate-spin ${
      className ? className : ''
    }`}
  /> : null;

}

export default Loading;