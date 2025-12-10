import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';
import { z } from 'zod';

// Zod 스키마: Model 생성/수정 검증
const ModelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  category: z.nativeEnum(Category),
  nationality: z.string().optional(),
  profileImage: z.string().url().optional().or(z.literal('')),
  images: z.array(z.string().url()).optional(),
  bio: z.string().optional(),
  height: z.string().optional(),
  measurements: z.string().optional(),
  instagram: z.string().optional(),
});

/**
 * GET /api/models
 * 모델 목록 조회 (필터링, 페이지네이션 지원)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // 필터 조건
    const where = category && category !== 'ALL'
      ? { category: category as Category }
      : {};

    // 모델 조회
    const [models, total] = await Promise.all([
      prisma.model.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.model.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: models,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/models error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/models
 * 새 모델 생성
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Zod 검증
    const validatedData = ModelSchema.parse(body);

    // slug 중복 체크
    const existingModel = await prisma.model.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingModel) {
      return NextResponse.json(
        { success: false, error: 'Slug already exists' },
        { status: 409 }
      );
    }

    // 모델 생성
    const model = await prisma.model.create({
      data: {
        ...validatedData,
        images: validatedData.images || [],
      },
    });

    return NextResponse.json(
      { success: true, data: model },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('POST /api/models error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create model' },
      { status: 500 }
    );
  }
}
