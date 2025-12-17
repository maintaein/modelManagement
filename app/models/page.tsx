import type { Metadata } from 'next';
import { ModelGrid } from '@/components/organisms';
import type { GridModel } from '@/components/organisms/ModelGrid';
import { prisma } from '@/lib/prisma';
import { parseModelImages, parseMeasurements, getFirstImageOrPlaceholder } from '@/lib/utils/model-parsers';

export const metadata: Metadata = {
  title: "Models - Taylor's Model Management",
  description: "Browse our international talent roster",
};

export default async function ModelsPage() {
  // 모든 모델 조회
  const rawModels = await prisma.model.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  // GridModel 타입으로 변환
  const gridModels: GridModel[] = rawModels.map((model) => {
    const images = parseModelImages(model.images);
    const { bust, waist, hip } = parseMeasurements(model.measurements);

    return {
      id: model.id,
      name: model.name,
      imageUrl: getFirstImageOrPlaceholder(images),
      height: model.height || undefined,
      bust,
      waist,
      hip,
      category: model.category || undefined,
      featured: false, // 스키마에 featured 필드가 없으므로 기본값 사용
    };
  });

  return (
    <main className="min-h-screen bg-white">
      <ModelGrid models={gridModels} />
    </main>
  );
}
