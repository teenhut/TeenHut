"use client";

import { useParams } from "next/navigation";
import HypeFeed from "@/components/feed/HypeFeed";

export default function SingleHypePage() {
  const { id } = useParams();

  return (
    <main>
      <HypeFeed initialHypeId={id as string} />
    </main>
  );
}
