import { GET as getModels, POST as createModel } from '@/app/api/models/route';
import { GET as getModel, PATCH as updateModel, DELETE as deleteModel } from '@/app/api/models/[id]/route';
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

describe('Models API Integration Tests', () => {
  beforeAll(async () => {
    // 테스트 시작 전 데이터 초기화
    await prisma.archive.deleteMany();
    await prisma.model.deleteMany();
  });

  beforeEach(async () => {
    // 각 테스트 전 데이터 초기화
    await prisma.archive.deleteMany();
    await prisma.model.deleteMany();
  });

  describe('GET /api/models', () => {
    it('모델 목록을 반환한다', async () => {
      // Given: 3개의 모델 생성
      await prisma.model.createMany({
        data: [
          { name: 'Model A', slug: 'test-model-a', category: Category.ALL },
          { name: 'Model B', slug: 'test-model-b', category: Category.INTOWN },
          { name: 'Model C', slug: 'test-model-c', category: Category.UPCOMING },
        ],
      });

      // When
      const request = createNextRequest('http://localhost:3000/api/models');
      const response = await getModels(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(3);
      expect(data.pagination.total).toBe(3);
    });

    it('카테고리 필터링이 작동한다', async () => {
      // Given
      await prisma.model.createMany({
        data: [
          { name: 'Model A', slug: 'test-model-a', category: Category.ALL },
          { name: 'Model B', slug: 'test-model-b', category: Category.INTOWN },
          { name: 'Model C', slug: 'test-model-c', category: Category.INTOWN },
        ],
      });

      // When: INTOWN 카테고리만 조회
      const request = createNextRequest('http://localhost:3000/api/models?category=INTOWN');
      const response = await getModels(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(2);
      expect(data.data.every((m: { category: string }) => m.category === 'INTOWN')).toBe(true);
    });

    it('페이지네이션이 작동한다', async () => {
      // Given: 5개 모델 생성
      await prisma.model.createMany({
        data: Array.from({ length: 5 }, (_, i) => ({
          name: `Model ${i}`,
          slug: `test-model-${i}`,
          category: Category.ALL,
        })),
      });

      // When: 페이지 2, 한 페이지당 2개
      const request = createNextRequest('http://localhost:3000/api/models?page=2&limit=2');
      const response = await getModels(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(2);
      expect(data.pagination.page).toBe(2);
      expect(data.pagination.total).toBe(5);
      expect(data.pagination.totalPages).toBe(3);
    });
  });

  describe('POST /api/models', () => {
    it('새 모델을 생성한다', async () => {
      // Given
      const payload = {
        name: 'Test Model',
        slug: 'test-model',
        category: 'ALL',
        height: '178',
        bio: 'Test bio',
      };

      // When
      const request = createNextRequest('http://localhost:3000/api/models', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const response = await createModel(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('Test Model');
      expect(data.data.slug).toBe('test-model');

      // DB 확인
      const created = await prisma.model.findUnique({ where: { slug: 'test-model' } });
      expect(created).toBeTruthy();
      expect(created?.name).toBe('Test Model');
    });

    it('필수 필드가 없으면 400 에러를 반환한다', async () => {
      // Given: name 필드 누락
      const payload = {
        slug: 'test-model',
        category: 'ALL',
      };

      // When
      const request = createNextRequest('http://localhost:3000/api/models', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const response = await createModel(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
    });

    it('중복된 slug는 409 에러를 반환한다', async () => {
      // Given: 이미 존재하는 모델
      await prisma.model.create({
        data: { name: 'Existing Model', slug: 'test-model', category: Category.ALL },
      });

      // When: 같은 slug로 생성 시도
      const payload = {
        name: 'New Model',
        slug: 'test-model',
        category: 'ALL',
      };

      const request = createNextRequest('http://localhost:3000/api/models', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const response = await createModel(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Slug already exists');
    });

    it('잘못된 category는 400 에러를 반환한다', async () => {
      // Given
      const payload = {
        name: 'Test Model',
        slug: 'test-model',
        category: 'INVALID_CATEGORY',
      };

      // When
      const request = createNextRequest('http://localhost:3000/api/models', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const response = await createModel(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });
  });

  describe('GET /api/models/[id]', () => {
    it('특정 모델을 조회한다', async () => {
      // Given
      const model = await prisma.model.create({
        data: { name: 'Test Model', slug: 'test-model', category: Category.ALL },
      });

      // When
      const request = createNextRequest(`http://localhost:3000/api/models/${model.id}`);
      const context: RouteContext = { params: Promise.resolve({ id: model.id }) };
      const response = await getModel(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.id).toBe(model.id);
      expect(data.data.name).toBe('Test Model');
    });

    it('존재하지 않는 모델은 404 에러를 반환한다', async () => {
      // When
      const request = createNextRequest('http://localhost:3000/api/models/non-existent-id');
      const context: RouteContext = { params: Promise.resolve({ id: 'non-existent-id' }) };
      const response = await getModel(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Model not found');
    });

    it('관련 아카이브를 포함하여 조회한다', async () => {
      // Given: 모델 + 아카이브 2개
      const model = await prisma.model.create({
        data: { name: 'Test Model', slug: 'test-model', category: Category.ALL },
      });

      await prisma.archive.createMany({
        data: [
          { title: 'Archive 1', images: ['url1'], modelId: model.id },
          { title: 'Archive 2', images: ['url2'], modelId: model.id },
        ],
      });

      // When
      const request = createNextRequest(`http://localhost:3000/api/models/${model.id}`);
      const context: RouteContext = { params: Promise.resolve({ id: model.id }) };
      const response = await getModel(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.data.archives).toHaveLength(2);
    });
  });

  describe('PATCH /api/models/[id]', () => {
    it('모델 정보를 수정한다', async () => {
      // Given
      const model = await prisma.model.create({
        data: { name: 'Original Name', slug: 'test-model', category: Category.ALL },
      });

      // When
      const payload = { name: 'Updated Name', height: '180' };
      const request = createNextRequest(`http://localhost:3000/api/models/${model.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      const context: RouteContext = { params: Promise.resolve({ id: model.id }) };
      const response = await updateModel(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('Updated Name');
      expect(data.data.height).toBe('180');
      expect(data.data.slug).toBe('test-model'); // 변경되지 않음

      // DB 확인
      const updated = await prisma.model.findUnique({ where: { id: model.id } });
      expect(updated?.name).toBe('Updated Name');
    });

    it('존재하지 않는 모델은 404 에러를 반환한다', async () => {
      // When
      const payload = { name: 'Updated Name' };
      const request = createNextRequest('http://localhost:3000/api/models/non-existent-id', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      const context: RouteContext = { params: Promise.resolve({ id: 'non-existent-id' }) };
      const response = await updateModel(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
    });

    it('중복된 slug로 변경 시 409 에러를 반환한다', async () => {
      // Given: 2개의 모델
      const model1 = await prisma.model.create({
        data: { name: 'Model 1', slug: 'test-model-1', category: Category.ALL },
      });
      await prisma.model.create({
        data: { name: 'Model 2', slug: 'test-model-2', category: Category.ALL },
      });

      // When: model-1을 model-2로 변경 시도
      const payload = { slug: 'test-model-2' };
      const request = createNextRequest(`http://localhost:3000/api/models/${model1.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      const context: RouteContext = { params: Promise.resolve({ id: model1.id }) };
      const response = await updateModel(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Slug already exists');
    });
  });

  describe('DELETE /api/models/[id]', () => {
    it('모델을 삭제한다', async () => {
      // Given
      const model = await prisma.model.create({
        data: { name: 'Test Model', slug: 'test-model', category: Category.ALL },
      });

      // When
      const request = createNextRequest(`http://localhost:3000/api/models/${model.id}`, {
        method: 'DELETE',
      });
      const context: RouteContext = { params: Promise.resolve({ id: model.id }) };
      const response = await deleteModel(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      // DB 확인: 삭제됨
      const deleted = await prisma.model.findUnique({ where: { id: model.id } });
      expect(deleted).toBeNull();
    });

    it('모델 삭제 시 관련 아카이브도 Cascade 삭제된다', async () => {
      // Given: 모델 + 아카이브
      const model = await prisma.model.create({
        data: { name: 'Test Model', slug: 'test-model', category: Category.ALL },
      });

      const archive = await prisma.archive.create({
        data: { title: 'Archive 1', images: ['url1'], modelId: model.id },
      });

      // When: 모델 삭제
      const request = createNextRequest(`http://localhost:3000/api/models/${model.id}`, {
        method: 'DELETE',
      });
      const context: RouteContext = { params: Promise.resolve({ id: model.id }) };
      await deleteModel(request, context);

      // Then: 아카이브도 삭제됨
      const deletedArchive = await prisma.archive.findUnique({ where: { id: archive.id } });
      expect(deletedArchive).toBeNull();
    });

    it('존재하지 않는 모델은 404 에러를 반환한다', async () => {
      // When
      const request = createNextRequest('http://localhost:3000/api/models/non-existent-id', {
        method: 'DELETE',
      });
      const context: RouteContext = { params: Promise.resolve({ id: 'non-existent-id' }) };
      const response = await deleteModel(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Model not found');
    });
  });
});
