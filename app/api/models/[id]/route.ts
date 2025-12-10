import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';
import { z } from 'zod';

// Zod 스키마: Model 수정 검증 (모든 필드 optional)
const ModelUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens').optional(),
  category: z.nativeEnum(Category).optional(),
  nationality: z.string().optional(),
  profileImage: z.string().url().optional().or(z.literal('')),
  images: z.array(z.string().url()).optional(),
  bio: z.string().optional(),
  height: z.string().optional(),
  measurements: z.string().optional(),
  instagram: z.string().optional(),
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/models/[id]
 * 특정 모델 조회
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const model = await prisma.model.findUnique({
      where: { id },
      include: {
        archives: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!model) {
      return NextResponse.json(
        { success: false, error: 'Model not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: model,
    });
  } catch (error) {
    console.error('GET /api/models/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch model' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/models/[id]
 * 특정 모델 수정
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Zod 검증
    const validatedData = ModelUpdateSchema.parse(body);

    // 모델 존재 확인
    const existingModel = await prisma.model.findUnique({
      where: { id },
    });

    if (!existingModel) {
      return NextResponse.json(
        { success: false, error: 'Model not found' },
        { status: 404 }
      );
    }

    // slug 변경 시 중복 체크
    if (validatedData.slug && validatedData.slug !== existingModel.slug) {
      const slugExists = await prisma.model.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Slug already exists' },
          { status: 409 }
        );
      }
    }

    // 모델 수정
    const updatedModel = await prisma.model.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      data: updatedModel,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('PATCH /api/models/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update model' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/models/[id]
 * 특정 모델 삭제 (관련 아카이브도 Cascade 삭제)
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    // 모델 존재 확인
    const existingModel = await prisma.model.findUnique({
      where: { id },
    });

    if (!existingModel) {
      return NextResponse.json(
        { success: false, error: 'Model not found' },
        { status: 404 }
      );
    }

    // 모델 삭제 (관련 아카이브는 onDelete: Cascade로 자동 삭제)
    await prisma.model.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Model deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/models/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete model' },
      { status: 500 }
    );
  }
}
