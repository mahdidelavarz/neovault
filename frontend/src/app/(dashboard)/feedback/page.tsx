"use client";

import PageLayout from "@/features/shared/layout/PageLayout";
import PageHeader from "@/features/shared/ui/PageHeader";
import FeedbackForm from "@/features/feedback/components/FeedbackForm";

export default function FeedbackPage() {
  return (
    <PageLayout
      top={
        <PageHeader
          title="Feedback"
          subtitle="Found a bug or have an idea? Let us know."
        />
      }
    >
      <FeedbackForm />
    </PageLayout>
  );
}
