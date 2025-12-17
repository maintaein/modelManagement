import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Zod 스키마: Archive 생성/수정 검증
const ArchiveSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  brand: z.string().optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  modelId: z.string().uuid('Invalid model ID'),
});

/**
 * GET /api/archives
 * 아카이브 목록 조회 (필터링, 페이지네이션 지원)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const modelId = searchParams.get('modelId');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // 필터 조건
    const where = modelId ? { modelId } : {};

    // 아카이브 조회
    const [archives, total] = await Promise.all([
      prisma.archive.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          model: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
      prisma.archive.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: archives,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/archives error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch archives' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/archives
 * 새 아카이브 생성
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Zod 검증
    const validatedData = ArchiveSchema.parse(body);

    // modelId 유효성 체크
    const model = await prisma.model.findUnique({
      where: { id: validatedData.modelId },
    });

    if (!model) {
      return NextResponse.json(
        { success: false, error: 'Model not found' },
        { status: 404 }
      );
    }

    // 아카이브 생성
    const archive = await prisma.archive.create({
      data: validatedData,
      include: {
        model: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, data: archive },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('POST /api/archives error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create archive' },
      { status: 500 }
    );
  }
}
