import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} - Taylor's Model Management`,
    description: `View ${slug}'s profile and portfolio`,
  };
}

export default async function ModelDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold">Model: {slug}</h1>
        <p className="mt-4 text-lg text-gray-600">
          Model profile and portfolio will be displayed here
        </p>
      </div>
    </main>
  );
}
