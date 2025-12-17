import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const updateCastingSchema = z.object({
  status: z.enum(['PENDING', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
});

// GET /api/castings/[id] - 캐스팅 요청 상세 조회 (관리자 전용)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 인증 확인
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const casting = await prisma.casting.findUnique({
      where: { id },
    });

    if (!casting) {
      return NextResponse.json(
        { error: 'Casting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(casting);
  } catch (error) {
    console.error('Casting fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch casting' },
      { status: 500 }
    );
  }
}

// PATCH /api/castings/[id] - 캐스팅 요청 상태 업데이트 (관리자 전용)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 인증 확인
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateCastingSchema.parse(body);

    const casting = await prisma.casting.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(casting);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    // Prisma P2025 에러: 레코드를 찾을 수 없음
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Casting not found' },
        { status: 404 }
      );
    }

    console.error('Casting update error:', error);
    return NextResponse.json(
      { error: 'Failed to update casting' },
      { status: 500 }
    );
  }
}

// DELETE /api/castings/[id] - 캐스팅 요청 삭제 (관리자 전용)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 인증 확인
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await prisma.casting.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Casting deleted successfully' });
  } catch (error) {
    // Prisma P2025 에러: 레코드를 찾을 수 없음
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Casting not found' },
        { status: 404 }
      );
    }

    console.error('Casting deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete casting' },
      { status: 500 }
    );
  }
}
