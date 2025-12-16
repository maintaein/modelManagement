import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Zod 스키마
const castingSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  projectType: z.string().min(1, 'Project type is required'),
  description: z.string().min(1, 'Description is required'),
  budget: z.string().optional(),
  shootDate: z.string().datetime().optional(),
});

// POST /api/castings - 캐스팅 요청 접수
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = castingSchema.parse(body);

    const casting = await prisma.casting.create({
      data: {
        ...validatedData,
        shootDate: validatedData.shootDate ? new Date(validatedData.shootDate) : null,
      },
    });

    return NextResponse.json(casting, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Casting creation error:', error);
    return NextResponse.json(
      { error: 'Failed to submit casting request' },
      { status: 500 }
    );
  }
}

// GET /api/castings - 캐스팅 요청 목록 조회 (관리자 전용)
export async function GET(request: NextRequest) {
  try {
    // 관리자 인증 확인
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // 필터 조건 구성
    const where: {
      status?: string;
    } = {};

    if (status) {
      where.status = status;
    }

    const [castings, total] = await Promise.all([
      prisma.casting.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.casting.count({ where }),
    ]);

    return NextResponse.json({
      castings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Castings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch castings' },
      { status: 500 }
    );
  }
}
