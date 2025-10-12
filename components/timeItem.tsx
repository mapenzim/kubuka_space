"use client";

import { ReactNode, useEffect, useState } from "react";

const Large = ({ tx }: Readonly<{tx: ReactNode}>) => <h3 className="text-3xl text-gray-100 font-bold">{tx}</h3>;

const Countdown = () => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    setInterval(() => {
      setTime(Date.now());

    },1000);
  },[time]);

  return <><Large tx={`${new Date(time).getHours()}:`} /> <Large tx={`${new Date(time).getMinutes()}:`} /> <Large tx={new Date(time).getSeconds()} /> </>;
}

export default Countdown;