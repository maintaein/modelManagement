import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Archive ${id} - Admin`,
    description: "Edit archive information",
  };
}

export default async function EditArchivePage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold">Edit Archive</h1>
        <p className="mt-4 text-lg text-gray-600">
          Editing archive ID: {id}
        </p>
      </div>
    </main>
  );
}
