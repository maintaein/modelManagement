import { GET as getArchives, POST as createArchive } from '@/app/api/archives/route';
import { GET as getArchive, PATCH as updateArchive, DELETE as deleteArchive } from '@/app/api/archives/[id]/route';
import { prisma } from '@/lib/prisma';
import { Category } from '@prisma/client';
import { NextRequest } from 'next/server';

// 테스트용 헬퍼 함수: Request 객체를 NextRequest로 변환
function createNextRequest(url: string, options?: RequestInit): NextRequest {
  // signal이 null인 경우 undefined로 변환하여 NextRequest와 호환되도록 처리
  const nextOptions = options ? {
    ...options,
    signal: options.signal ?? undefined,
  } : undefined;

  return new NextRequest(url, nextOptions);
}

// 테스트용 타입: params Promise를 위한 타입
type RouteContext = {
  params: Promise<{ id: string }>;
};

// API 응답 타입 정의
interface ArchiveData {
  id: string;
  title: string;
  brand: string | null;
  images: string[];
  modelId: string;
}

describe('Archives API Integration Tests', () => {
  let testModel: { id: string; name: string; slug: string };

  beforeAll(async () => {
    // 테스트 시작 전 데이터 초기화
    await prisma.archive.deleteMany();
    await prisma.model.deleteMany();
  });

  beforeEach(async () => {
    // 각 테스트 전 데이터 초기화
    await prisma.archive.deleteMany();
    await prisma.model.deleteMany();

    // 테스트용 모델 생성
    testModel = await prisma.model.create({
      data: {
        name: 'Test Model',
        slug: 'test-model',
        category: Category.ALL,
      },
    });
  });

  describe('GET /api/archives', () => {
    it('아카이브 목록을 반환한다', async () => {
      // Given: 3개의 아카이브 생성
      await prisma.archive.createMany({
        data: [
          { title: 'Archive 1', images: ['url1'], modelId: testModel.id },
          { title: 'Archive 2', images: ['url2'], modelId: testModel.id, brand: 'Brand A' },
          { title: 'Archive 3', images: ['url3'], modelId: testModel.id },
        ],
      });

      // When
      const request = createNextRequest('http://localhost:3000/api/archives');
      const response = await getArchives(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(3);
      expect(data.pagination.total).toBe(3);
      expect(data.data[0].model).toBeDefined();
      expect(data.data[0].model.name).toBe('Test Model');
    });

    it('modelId 필터링이 작동한다', async () => {
      // Given: 두 개의 모델과 각각의 아카이브
      const model2 = await prisma.model.create({
        data: { name: 'Test Model 2', slug: 'test-model-2', category: Category.ALL },
      });

      await prisma.archive.createMany({
        data: [
          { title: 'Archive 1', images: ['url1'], modelId: testModel.id },
          { title: 'Archive 2', images: ['url2'], modelId: testModel.id },
          { title: 'Archive 3', images: ['url3'], modelId: model2.id },
        ],
      });

      // When: testModel의 아카이브만 조회
      const request = createNextRequest(`http://localhost:3000/api/archives?modelId=${testModel.id}`);
      const response = await getArchives(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(2);
      expect(data.data.every((a: ArchiveData) => a.modelId === testModel.id)).toBe(true);
    });

    it('페이지네이션이 작동한다', async () => {
      // Given: 5개 아카이브 생성
      await prisma.archive.createMany({
        data: Array.from({ length: 5 }, (_, i) => ({
          title: `Archive ${i}`,
          images: [`url${i}`],
          modelId: testModel.id,
        })),
      });

      // When: modelId로 필터링하여 조회
      const request = createNextRequest(`http://localhost:3000/api/archives?modelId=${testModel.id}&limit=10`);
      const response = await getArchives(request);
      const data = await response.json();

      // Then: 이 모델의 아카이브만 조회되어야 함
      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(5);
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.total).toBe(5);
      expect(data.data.every((a: ArchiveData) => a.modelId === testModel.id)).toBe(true);
    });
  });

  describe('POST /api/archives', () => {
    it('새 아카이브를 생성한다', async () => {
      // Given
      const payload = {
        title: 'Test Archive',
        brand: 'Test Brand',
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        modelId: testModel.id,
      };

      // When
      const request = createNextRequest('http://localhost:3000/api/archives', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const response = await createArchive(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe('Test Archive');
      expect(data.data.brand).toBe('Test Brand');
      expect(data.data.images).toHaveLength(2);
      expect(data.data.model.name).toBe('Test Model');

      // DB 확인
      const created = await prisma.archive.findUnique({ where: { id: data.data.id } });
      expect(created).toBeTruthy();
      expect(created?.title).toBe('Test Archive');
    });

    it('필수 필드가 없으면 400 에러를 반환한다', async () => {
      // Given: title 필드 누락
      const payload = {
        images: ['https://example.com/image1.jpg'],
        modelId: testModel.id,
      };

      // When
      const request = createNextRequest('http://localhost:3000/api/archives', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const response = await createArchive(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
    });

    it('존재하지 않는 modelId는 404 에러를 반환한다', async () => {
      // Given
      const payload = {
        title: 'Test Archive',
        images: ['https://example.com/image1.jpg'],
        modelId: '00000000-0000-0000-0000-000000000000',
      };

      // When
      const request = createNextRequest('http://localhost:3000/api/archives', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const response = await createArchive(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Model not found');
    });

    it('images 배열이 비어있으면 400 에러를 반환한다', async () => {
      // Given
      const payload = {
        title: 'Test Archive',
        images: [],
        modelId: testModel.id,
      };

      // When
      const request = createNextRequest('http://localhost:3000/api/archives', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const response = await createArchive(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe('GET /api/archives/[id]', () => {
    it('특정 아카이브를 조회한다', async () => {
      // Given
      const archive = await prisma.archive.create({
        data: {
          title: 'Test Archive',
          images: ['https://example.com/image1.jpg'],
          modelId: testModel.id,
        },
      });

      // When
      const request = createNextRequest(`http://localhost:3000/api/archives/${archive.id}`);
      const context: RouteContext = { params: Promise.resolve({ id: archive.id }) };
      const response = await getArchive(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.id).toBe(archive.id);
      expect(data.data.title).toBe('Test Archive');
      expect(data.data.model).toBeDefined();
      expect(data.data.model.name).toBe('Test Model');
    });

    it('존재하지 않는 아카이브는 404 에러를 반환한다', async () => {
      // When
      const request = createNextRequest('http://localhost:3000/api/archives/non-existent-id');
      const context: RouteContext = { params: Promise.resolve({ id: 'non-existent-id' }) };
      const response = await getArchive(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Archive not found');
    });
  });

  describe('PATCH /api/archives/[id]', () => {
    it('아카이브 정보를 수정한다', async () => {
      // Given
      const archive = await prisma.archive.create({
        data: {
          title: 'Original Title',
          images: ['https://example.com/image1.jpg'],
          modelId: testModel.id,
        },
      });

      // When
      const payload = { title: 'Updated Title', brand: 'New Brand' };
      const request = createNextRequest(`http://localhost:3000/api/archives/${archive.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      const context: RouteContext = { params: Promise.resolve({ id: archive.id }) };
      const response = await updateArchive(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe('Updated Title');
      expect(data.data.brand).toBe('New Brand');

      // DB 확인
      const updated = await prisma.archive.findUnique({ where: { id: archive.id } });
      expect(updated?.title).toBe('Updated Title');
    });

    it('존재하지 않는 아카이브는 404 에러를 반환한다', async () => {
      // When
      const payload = { title: 'Updated Title' };
      const request = createNextRequest('http://localhost:3000/api/archives/non-existent-id', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      const context: RouteContext = { params: Promise.resolve({ id: 'non-existent-id' }) };
      const response = await updateArchive(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });

    it('존재하지 않는 modelId로 변경 시 404 에러를 반환한다', async () => {
      // Given
      const archive = await prisma.archive.create({
        data: {
          title: 'Test Archive',
          images: ['https://example.com/image1.jpg'],
          modelId: testModel.id,
        },
      });

      // When: 존재하지 않는 modelId로 변경
      const payload = { modelId: '00000000-0000-0000-0000-000000000000' };
      const request = createNextRequest(`http://localhost:3000/api/archives/${archive.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      const context: RouteContext = { params: Promise.resolve({ id: archive.id }) };
      const response = await updateArchive(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Model not found');
    });
  });

  describe('DELETE /api/archives/[id]', () => {
    it('아카이브를 삭제한다', async () => {
      // Given
      const archive = await prisma.archive.create({
        data: {
          title: 'Test Archive',
          images: ['https://example.com/image1.jpg'],
          modelId: testModel.id,
        },
      });

      // When
      const request = createNextRequest(`http://localhost:3000/api/archives/${archive.id}`, {
        method: 'DELETE',
      });
      const context: RouteContext = { params: Promise.resolve({ id: archive.id }) };
      const response = await deleteArchive(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      // DB 확인: 삭제됨
      const deleted = await prisma.archive.findUnique({ where: { id: archive.id } });
      expect(deleted).toBeNull();
    });

    it('존재하지 않는 아카이브는 404 에러를 반환한다', async () => {
      // When
      const request = createNextRequest('http://localhost:3000/api/archives/non-existent-id', {
        method: 'DELETE',
      });
      const context: RouteContext = { params: Promise.resolve({ id: 'non-existent-id' }) };
      const response = await deleteArchive(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Archive not found');
    });
  });
});
