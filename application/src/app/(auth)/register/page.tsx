import { ClientWrapper } from "@/components/features/layout/client-wrapper";
import { RegisterPageContent } from "@/components/features/auth/register-page-content";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return (
    <ClientWrapper>
      <RegisterPageContent />
    </ClientWrapper>
  );
}
