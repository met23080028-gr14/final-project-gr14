"use client";

import dynamic from "next/dynamic";

const DemandChart = dynamic(() => import("./DemandChart"), { ssr: false });

export default function DemandChartLazy() {
  return <DemandChart />;
}
