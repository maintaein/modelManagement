import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { LightboxGallery } from '@/components/molecules/LightboxGallery';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const model = await prisma.model.findUnique({
    where: { slug },
    select: { name: true, bio: true },
  });

  if (!model) {
    return {
      title: 'Model Not Found',
    };
  }

  return {
    title: `${model.name} - Taylor's Model Management`,
    description: model.bio || `View ${model.name}'s profile and portfolio`,
  };
}

export default async function ModelDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // 모델 데이터 조회
  const model = await prisma.model.findUnique({
    where: { slug },
    include: {
      archives: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!model) {
    notFound();
  }

  // 이미지 배열 준비
  const galleryImages = Array.isArray(model.images)
    ? model.images
    : typeof model.images === 'string'
      ? JSON.parse(model.images as string)
      : [];

  const profileImage = galleryImages[0] || '/images/placeholder.jpg';

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* 프로필 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* 프로필 이미지 */}
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
            <Image
              src={profileImage}
              alt={model.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* 모델 정보 */}
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl font-bold mb-4">{model.name}</h1>

            {model.nationality && (
              <p className="text-lg text-gray-600 mb-6">{model.nationality}</p>
            )}

            {/* 신체 정보 */}
            <div className="space-y-3 mb-8">
              {model.height && (
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-medium">Height</span>
                  <span className="text-gray-600">{model.height}</span>
                </div>
              )}
              {model.measurements && (
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="font-medium">Measurements</span>
                  <span className="text-gray-600">{model.measurements}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {model.bio && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{model.bio}</p>
              </div>
            )}

            {/* Instagram */}
            {model.instagram && (
              <a
                href={`https://instagram.com/${model.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                {model.instagram}
              </a>
            )}
          </div>
        </div>

        {/* 갤러리 섹션 */}
        {galleryImages.length > 1 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Portfolio</h2>
            <LightboxGallery images={galleryImages} />
          </div>
        )}

        {/* 아카이브 섹션 */}
        {model.archives.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8">Featured Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {model.archives.map((archive) => {
                const archiveImages = Array.isArray(archive.images)
                  ? archive.images
                  : typeof archive.images === 'string'
                    ? JSON.parse(archive.images as string)
                    : [];
                const coverImage = archiveImages[0] || '/images/placeholder.jpg';

                return (
                  <div key={archive.id} className="group cursor-pointer">
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                      <Image
                        src={coverImage}
                        alt={archive.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-medium text-lg">{archive.title}</h3>
                    {archive.brand && (
                      <p className="text-gray-600">{archive.brand}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
