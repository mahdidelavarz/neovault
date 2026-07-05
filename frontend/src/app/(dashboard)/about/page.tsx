"use client";

import PageLayout from "@/features/shared/layout/PageLayout";
import PageHeader from "@/features/shared/ui/PageHeader";
import AboutContent from "@/features/about/components/AboutContent";

export default function AboutPage() {
  return (
    <PageLayout
      top={
        <PageHeader
          title="About"
          subtitle="معرفی، امکانات و خلاصه‌ی امنیت NeoVault"
        />
      }
    >
      <AboutContent />
    </PageLayout>
  );
}
