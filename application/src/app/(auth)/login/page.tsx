import { ClientWrapper } from "@/components/features/layout/client-wrapper";
import { LoginPageContent } from "@/components/features/auth/login-page-content";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <ClientWrapper>
      <LoginPageContent />
    </ClientWrapper>
  );
}
