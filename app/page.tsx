import type { Metadata } from 'next';
import { HeroVideo, AboutPreview, ModelCarousel, ContactLanding } from '@/components/organisms';
import type { CarouselModel } from '@/components/organisms/ModelCarousel';
import { prisma } from '@/lib/prisma';
import { parseModelImages, getFirstImageOrPlaceholder } from '@/lib/utils/model-parsers';

export const metadata: Metadata = {
  title: "Home - Taylor's Model Management",
  description: "Welcome to Taylor's Model Management - Representing international talent",
};

export default async function Home() {
  // 최근 모델 데이터 조회 (캐러셀용)
  const rawModels = await prisma.model.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 6,
  });

  // 이미지 배열 파싱
  const carouselModels: CarouselModel[] = rawModels.map((model) => {
    const images = parseModelImages(model.images);

    return {
      id: model.id,
      name: model.name,
      imageUrl: getFirstImageOrPlaceholder(images),
      category: model.category || undefined,
    };
  });

  return (
    <main className="min-h-screen">
      <HeroVideo
        videoSrc="/videos/hero.mp4"
        title="TAYLOR'S MODEL MANAGEMENT"
        subtitle="Representing International Talent"
      />
      <AboutPreview
        slides={[
          {
            id: '1',
            title: 'LEADING MODEL AGENCY',
            description: "We discover and develop the world's most promising models",
          },
          {
            id: '2',
            title: 'GLOBAL NETWORK',
            description: 'Connected with top fashion brands worldwide',
          },
          {
            id: '3',
            title: 'PROFESSIONAL MANAGEMENT',
            description: "Dedicated support for every model's career",
          },
        ]}
      />
      <ModelCarousel models={carouselModels} />
      <ContactLanding />
    </main>
  );
}
