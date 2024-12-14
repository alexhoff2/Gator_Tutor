import { ClientWrapper } from "@/components/features/layout/client-wrapper";
import { CreateTutorPageContent } from "@/components/features/tutors/create-tutor-page-content";

export const dynamic = 'force-dynamic';

export default function CreateTutorPostPage() {
  return (
    <ClientWrapper>
      <CreateTutorPageContent />
    </ClientWrapper>
  );
}
