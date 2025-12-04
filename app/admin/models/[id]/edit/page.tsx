import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Model ${id} - Admin`,
    description: "Edit model information",
  };
}

export default async function EditModelPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold">Edit Model</h1>
        <p className="mt-4 text-lg text-gray-600">
          Editing model ID: {id}
        </p>
      </div>
    </main>
  );
}
