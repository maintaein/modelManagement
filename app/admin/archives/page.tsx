import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Manage Archives - Admin",
  description: "Manage your archive portfolio",
};

export default function AdminArchivesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold">Manage Archives</h1>
        <p className="mt-4 text-lg text-gray-600">
          View and manage your archive portfolio
        </p>
      </div>
    </main>
  );
}
