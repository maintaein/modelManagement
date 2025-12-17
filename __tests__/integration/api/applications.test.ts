import { GET as getApplications, POST as createApplication } from '@/app/api/applications/route';
import { GET as getApplication, PATCH as updateApplication, DELETE as deleteApplication } from '@/app/api/applications/[id]/route';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';

// NextAuth 모킹
jest.mock('next-auth');
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

// 테스트용 헬퍼 함수: NextRequest 생성
function createNextRequest(url: string, options?: RequestInit): NextRequest {
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

describe('Applications API Integration Tests', () => {
  beforeAll(async () => {
    // 테스트 시작 전 데이터 초기화
    await prisma.application.deleteMany();
  });

  beforeEach(async () => {
    // 각 테스트 전 데이터 초기화
    await prisma.application.deleteMany();
    // NextAuth 모킹 초기화
    mockGetServerSession.mockReset();
  });

  describe('POST /api/applications', () => {
    it('모델 지원서를 제출한다', async () => {
      // Given
      const payload = {
        name: 'Test Applicant',
        email: 'test@example.com',
        phone: '010-1234-5678',
        age: 25,
        height: '175cm',
        weight: '60kg',
        instagram: '@testuser',
        portfolio: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
        message: 'I would like to apply as a model',
      };

      // When
      const request = createNextRequest('http://localhost:3000/api/applications', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const response = await createApplication(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(201);
      expect(data.name).toBe('Test Applicant');
      expect(data.email).toBe('test@example.com');
      expect(data.status).toBe('PENDING');
      expect(data.portfolio).toHaveLength(2);

      // DB 확인
      const created = await prisma.application.findUnique({ where: { id: data.id } });
      expect(created).toBeTruthy();
      expect(created?.name).toBe('Test Applicant');
    });

    it('필수 필드가 없으면 400 에러를 반환한다', async () => {
      // Given: email 필드 누락
      const payload = {
        name: 'Test Applicant',
        phone: '010-1234-5678',
        age: 25,
        height: '175cm',
        weight: '60kg',
      };

      // When
      const request = createNextRequest('http://localhost:3000/api/applications', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const response = await createApplication(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.details).toBeDefined();
    });

    it('잘못된 이메일 형식은 400 에러를 반환한다', async () => {
      // Given
      const payload = {
        name: 'Test Applicant',
        email: 'invalid-email',
        phone: '010-1234-5678',
        age: 25,
        height: '175cm',
        weight: '60kg',
      };

      // When
      const request = createNextRequest('http://localhost:3000/api/applications', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const response = await createApplication(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });

    it('음수 나이는 400 에러를 반환한다', async () => {
      // Given
      const payload = {
        name: 'Test Applicant',
        email: 'test@example.com',
        phone: '010-1234-5678',
        age: -5,
        height: '175cm',
        weight: '60kg',
      };

      // When
      const request = createNextRequest('http://localhost:3000/api/applications', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const response = await createApplication(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });

    it('선택 필드 없이도 지원서를 제출할 수 있다', async () => {
      // Given: 필수 필드만
      const payload = {
        name: 'Test Applicant',
        email: 'test@example.com',
        phone: '010-1234-5678',
        age: 25,
        height: '175cm',
        weight: '60kg',
      };

      // When
      const request = createNextRequest('http://localhost:3000/api/applications', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const response = await createApplication(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(201);
      expect(data.instagram).toBeNull();
      expect(data.message).toBeNull();
      expect(data.portfolio).toEqual([]);
    });
  });

  describe('GET /api/applications', () => {
    it('인증 없이 접근 시 401 에러를 반환한다', async () => {
      // Given: 세션 없음
      mockGetServerSession.mockResolvedValue(null);

      // When
      const request = createNextRequest('http://localhost:3000/api/applications');
      const response = await getApplications(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('관리자는 지원서 목록을 조회할 수 있다', async () => {
      // Given: 세션 있음
      mockGetServerSession.mockResolvedValue({
        user: { email: 'admin@example.com' },
        expires: '2025-12-31',
      });

      // 3개의 지원서 생성
      await prisma.application.createMany({
        data: [
          { name: 'Applicant A', email: 'a@example.com', phone: '010-1111-1111', age: 20, height: '170cm', weight: '55kg' },
          { name: 'Applicant B', email: 'b@example.com', phone: '010-2222-2222', age: 22, height: '175cm', weight: '60kg' },
          { name: 'Applicant C', email: 'c@example.com', phone: '010-3333-3333', age: 25, height: '180cm', weight: '65kg' },
        ],
      });

      // When
      const request = createNextRequest('http://localhost:3000/api/applications');
      const response = await getApplications(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.applications).toHaveLength(3);
      expect(data.pagination.total).toBe(3);
    });

    it('status 필터링이 작동한다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue({
        user: { email: 'admin@example.com' },
        expires: '2025-12-31',
      });

      // 다양한 상태의 지원서 생성
      await prisma.application.createMany({
        data: [
          { name: 'Applicant A', email: 'a@example.com', phone: '010-1111-1111', age: 20, height: '170cm', weight: '55kg', status: 'PENDING' },
          { name: 'Applicant B', email: 'b@example.com', phone: '010-2222-2222', age: 22, height: '175cm', weight: '60kg', status: 'REVIEWED' },
          { name: 'Applicant C', email: 'c@example.com', phone: '010-3333-3333', age: 25, height: '180cm', weight: '65kg', status: 'REVIEWED' },
        ],
      });

      // When: REVIEWED 상태만 조회
      const request = createNextRequest('http://localhost:3000/api/applications?status=REVIEWED');
      const response = await getApplications(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.applications).toHaveLength(2);
      expect(data.applications.every((a: { status: string }) => a.status === 'REVIEWED')).toBe(true);
    });

    it('페이지네이션이 작동한다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue({
        user: { email: 'admin@example.com' },
        expires: '2025-12-31',
      });

      // 5개 지원서 생성
      await prisma.application.createMany({
        data: Array.from({ length: 5 }, (_, i) => ({
          name: `Applicant ${i}`,
          email: `test${i}@example.com`,
          phone: `010-0000-000${i}`,
          age: 20 + i,
          height: '175cm',
          weight: '60kg',
        })),
      });

      // When: 페이지 2, 한 페이지당 2개
      const request = createNextRequest('http://localhost:3000/api/applications?page=2&limit=2');
      const response = await getApplications(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.applications).toHaveLength(2);
      expect(data.pagination.page).toBe(2);
      expect(data.pagination.total).toBe(5);
      expect(data.pagination.totalPages).toBe(3);
    });
  });

  describe('GET /api/applications/[id]', () => {
    it('인증 없이 접근 시 401 에러를 반환한다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue(null);

      // When
      const request = createNextRequest('http://localhost:3000/api/applications/test-id');
      const context: RouteContext = { params: Promise.resolve({ id: 'test-id' }) };
      const response = await getApplication(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('관리자는 특정 지원서를 조회할 수 있다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue({
        user: { email: 'admin@example.com' },
        expires: '2025-12-31',
      });

      const application = await prisma.application.create({
        data: {
          name: 'Test Applicant',
          email: 'test@example.com',
          phone: '010-1234-5678',
          age: 25,
          height: '175cm',
          weight: '60kg',
        },
      });

      // When
      const request = createNextRequest(`http://localhost:3000/api/applications/${application.id}`);
      const context: RouteContext = { params: Promise.resolve({ id: application.id }) };
      const response = await getApplication(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.id).toBe(application.id);
      expect(data.name).toBe('Test Applicant');
    });

    it('존재하지 않는 지원서는 404 에러를 반환한다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue({
        user: { email: 'admin@example.com' },
        expires: '2025-12-31',
      });

      // When
      const request = createNextRequest('http://localhost:3000/api/applications/non-existent-id');
      const context: RouteContext = { params: Promise.resolve({ id: 'non-existent-id' }) };
      const response = await getApplication(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(404);
      expect(data.error).toBe('Application not found');
    });
  });

  describe('PATCH /api/applications/[id]', () => {
    it('관리자는 지원서 상태를 업데이트할 수 있다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue({
        user: { email: 'admin@example.com' },
        expires: '2025-12-31',
      });

      const application = await prisma.application.create({
        data: {
          name: 'Test Applicant',
          email: 'test@example.com',
          phone: '010-1234-5678',
          age: 25,
          height: '175cm',
          weight: '60kg',
          status: 'PENDING',
        },
      });

      // When
      const payload = { status: 'ACCEPTED' };
      const request = createNextRequest(`http://localhost:3000/api/applications/${application.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      const context: RouteContext = { params: Promise.resolve({ id: application.id }) };
      const response = await updateApplication(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.status).toBe('ACCEPTED');

      // DB 확인
      const updated = await prisma.application.findUnique({ where: { id: application.id } });
      expect(updated?.status).toBe('ACCEPTED');
    });

    it('잘못된 status 값은 400 에러를 반환한다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue({
        user: { email: 'admin@example.com' },
        expires: '2025-12-31',
      });

      const application = await prisma.application.create({
        data: {
          name: 'Test Applicant',
          email: 'test@example.com',
          phone: '010-1234-5678',
          age: 25,
          height: '175cm',
          weight: '60kg',
        },
      });

      // When: 잘못된 status
      const payload = { status: 'INVALID_STATUS' };
      const request = createNextRequest(`http://localhost:3000/api/applications/${application.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      const context: RouteContext = { params: Promise.resolve({ id: application.id }) };
      const response = await updateApplication(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });

    it('인증 없이 접근 시 401 에러를 반환한다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue(null);

      // When
      const payload = { status: 'ACCEPTED' };
      const request = createNextRequest('http://localhost:3000/api/applications/test-id', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      const context: RouteContext = { params: Promise.resolve({ id: 'test-id' }) };
      const response = await updateApplication(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('DELETE /api/applications/[id]', () => {
    it('관리자는 지원서를 삭제할 수 있다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue({
        user: { email: 'admin@example.com' },
        expires: '2025-12-31',
      });

      const application = await prisma.application.create({
        data: {
          name: 'Test Applicant',
          email: 'test@example.com',
          phone: '010-1234-5678',
          age: 25,
          height: '175cm',
          weight: '60kg',
        },
      });

      // When
      const request = createNextRequest(`http://localhost:3000/api/applications/${application.id}`, {
        method: 'DELETE',
      });
      const context: RouteContext = { params: Promise.resolve({ id: application.id }) };
      const response = await deleteApplication(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.message).toBe('Application deleted successfully');

      // DB 확인: 삭제됨
      const deleted = await prisma.application.findUnique({ where: { id: application.id } });
      expect(deleted).toBeNull();
    });

    it('존재하지 않는 지원서는 404 에러를 반환한다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue({
        user: { email: 'admin@example.com' },
        expires: '2025-12-31',
      });

      // When
      const request = createNextRequest('http://localhost:3000/api/applications/non-existent-id', {
        method: 'DELETE',
      });
      const context: RouteContext = { params: Promise.resolve({ id: 'non-existent-id' }) };
      const response = await deleteApplication(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(404);
      expect(data.error).toBe('Application not found');
    });

    it('인증 없이 접근 시 401 에러를 반환한다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue(null);

      // When
      const request = createNextRequest('http://localhost:3000/api/applications/test-id', {
        method: 'DELETE',
      });
      const context: RouteContext = { params: Promise.resolve({ id: 'test-id' }) };
      const response = await deleteApplication(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });
});
