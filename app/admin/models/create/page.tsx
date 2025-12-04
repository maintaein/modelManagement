import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Create Model - Admin",
  description: "Add a new model to your roster",
};

export default function CreateModelPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold">Create New Model</h1>
        <p className="mt-4 text-lg text-gray-600">
          Add a new model to your roster
        </p>
      </div>
    </main>
  );
}
