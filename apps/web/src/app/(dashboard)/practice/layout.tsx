import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice - VocaBuddy",
  description: "Practice your vocabulary with different learning modes",
};

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 overflow-y-auto bg-background">
      {children}
    </main>
  );
}
