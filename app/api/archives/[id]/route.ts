import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Zod 스키마: Archive 수정 검증 (모든 필드 optional)
const ArchiveUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  brand: z.string().optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required').optional(),
  modelId: z.string().uuid('Invalid model ID').optional(),
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/archives/[id]
 * 특정 아카이브 조회
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    const archive = await prisma.archive.findUnique({
      where: { id },
      include: {
        model: {
          select: {
            id: true,
            name: true,
            slug: true,
            profileImage: true,
          },
        },
      },
    });

    if (!archive) {
      return NextResponse.json(
        { success: false, error: 'Archive not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: archive,
    });
  } catch (error) {
    console.error('GET /api/archives/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch archive' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/archives/[id]
 * 특정 아카이브 수정
 */
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Zod 검증
    const validatedData = ArchiveUpdateSchema.parse(body);

    // 아카이브 존재 확인
    const existingArchive = await prisma.archive.findUnique({
      where: { id },
    });

    if (!existingArchive) {
      return NextResponse.json(
        { success: false, error: 'Archive not found' },
        { status: 404 }
      );
    }

    // modelId 변경 시 유효성 체크
    if (validatedData.modelId) {
      const model = await prisma.model.findUnique({
        where: { id: validatedData.modelId },
      });

      if (!model) {
        return NextResponse.json(
          { success: false, error: 'Model not found' },
          { status: 404 }
        );
      }
    }

    // 아카이브 수정
    const updatedArchive = await prisma.archive.update({
      where: { id },
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

    return NextResponse.json({
      success: true,
      data: updatedArchive,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('PATCH /api/archives/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update archive' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/archives/[id]
 * 특정 아카이브 삭제
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    // 아카이브 존재 확인
    const existingArchive = await prisma.archive.findUnique({
      where: { id },
    });

    if (!existingArchive) {
      return NextResponse.json(
        { success: false, error: 'Archive not found' },
        { status: 404 }
      );
    }

    // 아카이브 삭제
    await prisma.archive.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Archive deleted successfully',
    });
  } catch (error) {
    console.error('DELETE /api/archives/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete archive' },
      { status: 500 }
    );
  }
}
