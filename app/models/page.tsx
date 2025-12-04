import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Models - Taylor's Model Management",
  description: "Browse our international talent roster",
};

export default function ModelsPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold">Models</h1>
        <p className="mt-4 text-lg text-gray-600">
          Browse our international talent roster
        </p>
      </div>
    </main>
  );
}
