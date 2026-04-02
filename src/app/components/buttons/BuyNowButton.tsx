"use client";

import { useRouter } from "next/navigation";

interface BuyNowButtonProps {
  catalogId: string;
  className?: string;
  children: React.ReactNode;
}

function BuyNowButton({ catalogId, className, children }: BuyNowButtonProps) {
  const router = useRouter();

  async function handleBuyNow(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault(); // If needed
    // Revalidate path before navigating.  We always want to revalidate for buy now.
    const response = await fetch("/api/revalidate-path", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        path: "/buy-now/[catalogId]",
        type: "page",
      }),
    });
    const { data } = await response.json();
    console.log(`handleBuyNow -> data:\n${JSON.stringify(data, null, "\t")}`);
    router.push(`/buy-now/${catalogId}`);
  }
  return (
    <button className={className} onClick={async (e) => await handleBuyNow(e)}>
      {children}
    </button>
  );
}

export default BuyNowButton;
