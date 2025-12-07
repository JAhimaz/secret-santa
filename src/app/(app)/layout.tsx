import { ReactNode } from "react";
import AuthCheck from "@/app/auth/ProtectPage";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  await AuthCheck();
  return <>{children}</>;
}
