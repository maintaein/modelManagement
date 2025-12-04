import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Home - Taylor's Model Management",
  description: "Welcome to Taylor's Model Management - Representing international talent",
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold">Taylor&apos;s Model Management</h1>
        <p className="mt-4 text-lg text-gray-600">
          Professional model management agency representing international talent
        </p>
      </div>
    </main>
  );
}
