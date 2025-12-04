import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Manage Models - Admin",
  description: "Manage your model roster",
};

export default function AdminModelsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold">Manage Models</h1>
        <p className="mt-4 text-lg text-gray-600">
          View and manage your model roster
        </p>
      </div>
    </main>
  );
}
