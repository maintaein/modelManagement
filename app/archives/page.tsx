import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: "Archives - Taylor's Model Management",
  description: "Explore our portfolio of past campaigns and editorials",
};

export default async function ArchivesPage() {
  // 아카이브 데이터 조회
  const archives = await prisma.archive.findMany({
    include: {
      model: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* 헤더 */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Archives</h1>
          <p className="text-lg text-gray-600">
            Explore our portfolio of past campaigns and editorials
          </p>
        </div>

        {/* 아카이브 그리드 */}
        {archives.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No archives available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {archives.map((archive) => {
              const archiveImages = Array.isArray(archive.images)
                ? archive.images
                : typeof archive.images === 'string'
                  ? JSON.parse(archive.images as string)
                  : [];
              const coverImage = archiveImages[0] || '/images/placeholder.jpg';

              return (
                <div key={archive.id} className="group">
                  {/* 이미지 */}
                  <div className="relative aspect-[4/5] rounded-lg overflow-hidden mb-4">
                    <Image
                      src={coverImage}
                      alt={archive.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* 정보 */}
                  <div>
                    <h3 className="text-xl font-bold mb-1">{archive.title}</h3>
                    {archive.brand && (
                      <p className="text-gray-600 mb-2">{archive.brand}</p>
                    )}
                    {archive.model && (
                      <Link
                        href={`/models/${archive.model.slug}`}
                        className="text-sm text-gray-900 hover:underline"
                      >
                        {archive.model.name}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
