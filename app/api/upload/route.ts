import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// 업로드 디렉토리가 없으면 생성
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// 파일명 생성 (타임스탬프 + 랜덤 문자열)
function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const ext = path.extname(originalName);
  return `${timestamp}-${randomString}${ext}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }

    // 업로드 디렉토리 확인
    await ensureUploadDir();

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // 파일 타입 검증
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}. Allowed types: ${ALLOWED_TYPES.join(', ')}` },
          { status: 400 }
        );
      }

      // 파일 크기 검증
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File too large: ${file.name}. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
          { status: 400 }
        );
      }

      // 파일 저장
      const fileName = generateFileName(file.name);
      const filePath = path.join(UPLOAD_DIR, fileName);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(filePath, buffer);

      // 공개 URL 생성
      const publicUrl = `/uploads/${fileName}`;
      uploadedUrls.push(publicUrl);
    }

    return NextResponse.json(
      {
        message: 'Files uploaded successfully',
        urls: uploadedUrls,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}
