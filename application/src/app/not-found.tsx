import { ClientWrapper } from "@/components/features/layout/client-wrapper";
import { NotFoundContent } from "@/components/features/error/not-found-content";

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <ClientWrapper>
      <NotFoundContent />
    </ClientWrapper>
  );
}
