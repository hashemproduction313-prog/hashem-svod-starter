"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

export default function PaymentRedirect() {
  const router = useRouter();
  const search = useSearchParams();

  useEffect(() => {
    const q = search.toString(); // conserve ?plan=...&email=...
    router.replace(`/subscribe/welcome${q ? `?${q}` : ""}`);
  }, [router, search]);

  return null; // redirection immédiate, pas d'UI
}
