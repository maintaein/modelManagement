import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Archives - Taylor's Model Management",
  description: "Explore our portfolio of past campaigns and editorials",
};

export default function ArchivesPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold">Archives</h1>
        <p className="mt-4 text-lg text-gray-600">
          Explore our portfolio of past campaigns and editorials
        </p>
      </div>
    </main>
  );
}
