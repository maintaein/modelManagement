import type { Metadata } from 'next';
import { SessionProvider } from '@/providers';

export const metadata: Metadata = {
  title: "Admin - Taylor's Model Management",
  description: "Admin dashboard for managing models and content",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
