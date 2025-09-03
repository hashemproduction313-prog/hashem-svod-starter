export const dynamic = "force-dynamic";
// OU (alternative équivalente)
// export const revalidate = 0;

import type { ReactNode } from "react";

/** Layout minimal pour le segment /auth */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

// Force TypeScript à traiter ce fichier comme un "module" (fix Vercel "is not a module")
export {};
