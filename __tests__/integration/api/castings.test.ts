import { GET as getCastings, POST as createCasting } from '@/app/api/castings/route';
import { GET as getCasting, PATCH as updateCasting, DELETE as deleteCasting } from '@/app/api/castings/[id]/route';
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

describe('Castings API Integration Tests', () => {
  beforeAll(async () => {
    // 테스트 시작 전 데이터 초기화
    await prisma.casting.deleteMany();
  });

  beforeEach(async () => {
    // 각 테스트 전 데이터 초기화
    await prisma.casting.deleteMany();
    // NextAuth 모킹 초기화
    mockGetServerSession.mockReset();
  });

  describe('POST /api/castings', () => {
    it('캐스팅 요청을 제출한다', async () => {
      // Given
      const payload = {
        company: 'Test Company',
        contactName: 'John Doe',
        email: 'john@example.com',
        phone: '010-1234-5678',
        projectType: 'COMMERCIAL',
        description: 'We need models for our new product campaign',
        budget: '5,000,000 KRW',
        shootDate: new Date('2025-12-25').toISOString(),
      };

      // When
      const request = createNextRequest('http://localhost:3000/api/castings', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const response = await createCasting(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(201);
      expect(data.company).toBe('Test Company');
      expect(data.contactName).toBe('John Doe');
      expect(data.projectType).toBe('COMMERCIAL');
      expect(data.status).toBe('PENDING');

      // DB 확인
      const created = await prisma.casting.findUnique({ where: { id: data.id } });
      expect(created).toBeTruthy();
      expect(created?.company).toBe('Test Company');
    });

    it('필수 필드가 없으면 400 에러를 반환한다', async () => {
      // Given: email 필드 누락
      const payload = {
        company: 'Test Company',
        contactName: 'John Doe',
        phone: '010-1234-5678',
        projectType: 'COMMERCIAL',
        description: 'Test description',
      };

      // When
      const request = createNextRequest('http://localhost:3000/api/castings', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const response = await createCasting(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
      expect(data.details).toBeDefined();
    });

    it('잘못된 이메일 형식은 400 에러를 반환한다', async () => {
      // Given
      const payload = {
        company: 'Test Company',
        contactName: 'John Doe',
        email: 'invalid-email',
        phone: '010-1234-5678',
        projectType: 'COMMERCIAL',
        description: 'Test description',
      };

      // When
      const request = createNextRequest('http://localhost:3000/api/castings', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const response = await createCasting(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });

    it('선택 필드 없이도 캐스팅 요청을 제출할 수 있다', async () => {
      // Given: 필수 필드만
      const payload = {
        company: 'Test Company',
        contactName: 'John Doe',
        email: 'john@example.com',
        phone: '010-1234-5678',
        projectType: 'COMMERCIAL',
        description: 'Test description',
      };

      // When
      const request = createNextRequest('http://localhost:3000/api/castings', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const response = await createCasting(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(201);
      expect(data.budget).toBeNull();
      expect(data.shootDate).toBeNull();
    });

    it('잘못된 날짜 형식은 400 에러를 반환한다', async () => {
      // Given
      const payload = {
        company: 'Test Company',
        contactName: 'John Doe',
        email: 'john@example.com',
        phone: '010-1234-5678',
        projectType: 'COMMERCIAL',
        description: 'Test description',
        shootDate: 'invalid-date',
      };

      // When
      const request = createNextRequest('http://localhost:3000/api/castings', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const response = await createCasting(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });
  });

  describe('GET /api/castings', () => {
    it('인증 없이 접근 시 401 에러를 반환한다', async () => {
      // Given: 세션 없음
      mockGetServerSession.mockResolvedValue(null);

      // When
      const request = createNextRequest('http://localhost:3000/api/castings');
      const response = await getCastings(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('관리자는 캐스팅 요청 목록을 조회할 수 있다', async () => {
      // Given: 세션 있음
      mockGetServerSession.mockResolvedValue({
        user: { email: 'admin@example.com' },
        expires: '2025-12-31',
      });

      // 3개의 캐스팅 요청 생성
      await prisma.casting.createMany({
        data: [
          { company: 'Company A', contactName: 'Contact A', email: 'a@example.com', phone: '010-1111-1111', projectType: 'COMMERCIAL', description: 'Description A' },
          { company: 'Company B', contactName: 'Contact B', email: 'b@example.com', phone: '010-2222-2222', projectType: 'EDITORIAL', description: 'Description B' },
          { company: 'Company C', contactName: 'Contact C', email: 'c@example.com', phone: '010-3333-3333', projectType: 'RUNWAY', description: 'Description C' },
        ],
      });

      // When
      const request = createNextRequest('http://localhost:3000/api/castings');
      const response = await getCastings(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.castings).toHaveLength(3);
      expect(data.pagination.total).toBe(3);
    });

    it('status 필터링이 작동한다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue({
        user: { email: 'admin@example.com' },
        expires: '2025-12-31',
      });

      // 다양한 상태의 캐스팅 요청 생성
      await prisma.casting.createMany({
        data: [
          { company: 'Company A', contactName: 'Contact A', email: 'a@example.com', phone: '010-1111-1111', projectType: 'COMMERCIAL', description: 'Description A', status: 'PENDING' },
          { company: 'Company B', contactName: 'Contact B', email: 'b@example.com', phone: '010-2222-2222', projectType: 'EDITORIAL', description: 'Description B', status: 'CONTACTED' },
          { company: 'Company C', contactName: 'Contact C', email: 'c@example.com', phone: '010-3333-3333', projectType: 'RUNWAY', description: 'Description C', status: 'CONTACTED' },
        ],
      });

      // When: CONTACTED 상태만 조회
      const request = createNextRequest('http://localhost:3000/api/castings?status=CONTACTED');
      const response = await getCastings(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.castings).toHaveLength(2);
      expect(data.castings.every((c: { status: string }) => c.status === 'CONTACTED')).toBe(true);
    });

    it('페이지네이션이 작동한다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue({
        user: { email: 'admin@example.com' },
        expires: '2025-12-31',
      });

      // 5개 캐스팅 요청 생성
      await prisma.casting.createMany({
        data: Array.from({ length: 5 }, (_, i) => ({
          company: `Company ${i}`,
          contactName: `Contact ${i}`,
          email: `test${i}@example.com`,
          phone: `010-0000-000${i}`,
          projectType: 'COMMERCIAL',
          description: `Description ${i}`,
        })),
      });

      // When: 페이지 2, 한 페이지당 2개
      const request = createNextRequest('http://localhost:3000/api/castings?page=2&limit=2');
      const response = await getCastings(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.castings).toHaveLength(2);
      expect(data.pagination.page).toBe(2);
      expect(data.pagination.total).toBe(5);
      expect(data.pagination.totalPages).toBe(3);
    });
  });

  describe('GET /api/castings/[id]', () => {
    it('인증 없이 접근 시 401 에러를 반환한다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue(null);

      // When
      const request = createNextRequest('http://localhost:3000/api/castings/test-id');
      const context: RouteContext = { params: Promise.resolve({ id: 'test-id' }) };
      const response = await getCasting(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('관리자는 특정 캐스팅 요청을 조회할 수 있다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue({
        user: { email: 'admin@example.com' },
        expires: '2025-12-31',
      });

      const casting = await prisma.casting.create({
        data: {
          company: 'Test Company',
          contactName: 'John Doe',
          email: 'john@example.com',
          phone: '010-1234-5678',
          projectType: 'COMMERCIAL',
          description: 'Test description',
        },
      });

      // When
      const request = createNextRequest(`http://localhost:3000/api/castings/${casting.id}`);
      const context: RouteContext = { params: Promise.resolve({ id: casting.id }) };
      const response = await getCasting(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.id).toBe(casting.id);
      expect(data.company).toBe('Test Company');
    });

    it('존재하지 않는 캐스팅 요청은 404 에러를 반환한다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue({
        user: { email: 'admin@example.com' },
        expires: '2025-12-31',
      });

      // When
      const request = createNextRequest('http://localhost:3000/api/castings/non-existent-id');
      const context: RouteContext = { params: Promise.resolve({ id: 'non-existent-id' }) };
      const response = await getCasting(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(404);
      expect(data.error).toBe('Casting not found');
    });
  });

  describe('PATCH /api/castings/[id]', () => {
    it('관리자는 캐스팅 요청 상태를 업데이트할 수 있다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue({
        user: { email: 'admin@example.com' },
        expires: '2025-12-31',
      });

      const casting = await prisma.casting.create({
        data: {
          company: 'Test Company',
          contactName: 'John Doe',
          email: 'john@example.com',
          phone: '010-1234-5678',
          projectType: 'COMMERCIAL',
          description: 'Test description',
          status: 'PENDING',
        },
      });

      // When
      const payload = { status: 'IN_PROGRESS' };
      const request = createNextRequest(`http://localhost:3000/api/castings/${casting.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      const context: RouteContext = { params: Promise.resolve({ id: casting.id }) };
      const response = await updateCasting(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.status).toBe('IN_PROGRESS');

      // DB 확인
      const updated = await prisma.casting.findUnique({ where: { id: casting.id } });
      expect(updated?.status).toBe('IN_PROGRESS');
    });

    it('잘못된 status 값은 400 에러를 반환한다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue({
        user: { email: 'admin@example.com' },
        expires: '2025-12-31',
      });

      const casting = await prisma.casting.create({
        data: {
          company: 'Test Company',
          contactName: 'John Doe',
          email: 'john@example.com',
          phone: '010-1234-5678',
          projectType: 'COMMERCIAL',
          description: 'Test description',
        },
      });

      // When: 잘못된 status
      const payload = { status: 'INVALID_STATUS' };
      const request = createNextRequest(`http://localhost:3000/api/castings/${casting.id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      const context: RouteContext = { params: Promise.resolve({ id: casting.id }) };
      const response = await updateCasting(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation failed');
    });

    it('인증 없이 접근 시 401 에러를 반환한다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue(null);

      // When
      const payload = { status: 'COMPLETED' };
      const request = createNextRequest('http://localhost:3000/api/castings/test-id', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      const context: RouteContext = { params: Promise.resolve({ id: 'test-id' }) };
      const response = await updateCasting(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('존재하지 않는 캐스팅은 404 에러를 반환한다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue({
        user: { email: 'admin@example.com' },
        expires: '2025-12-31',
      });

      // When
      const payload = { status: 'COMPLETED' };
      const request = createNextRequest('http://localhost:3000/api/castings/non-existent-id', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      const context: RouteContext = { params: Promise.resolve({ id: 'non-existent-id' }) };
      const response = await updateCasting(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(404);
      expect(data.error).toBe('Casting not found');
    });
  });

  describe('DELETE /api/castings/[id]', () => {
    it('관리자는 캐스팅 요청을 삭제할 수 있다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue({
        user: { email: 'admin@example.com' },
        expires: '2025-12-31',
      });

      const casting = await prisma.casting.create({
        data: {
          company: 'Test Company',
          contactName: 'John Doe',
          email: 'john@example.com',
          phone: '010-1234-5678',
          projectType: 'COMMERCIAL',
          description: 'Test description',
        },
      });

      // When
      const request = createNextRequest(`http://localhost:3000/api/castings/${casting.id}`, {
        method: 'DELETE',
      });
      const context: RouteContext = { params: Promise.resolve({ id: casting.id }) };
      const response = await deleteCasting(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(200);
      expect(data.message).toBe('Casting deleted successfully');

      // DB 확인: 삭제됨
      const deleted = await prisma.casting.findUnique({ where: { id: casting.id } });
      expect(deleted).toBeNull();
    });

    it('존재하지 않는 캐스팅은 404 에러를 반환한다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue({
        user: { email: 'admin@example.com' },
        expires: '2025-12-31',
      });

      // When
      const request = createNextRequest('http://localhost:3000/api/castings/non-existent-id', {
        method: 'DELETE',
      });
      const context: RouteContext = { params: Promise.resolve({ id: 'non-existent-id' }) };
      const response = await deleteCasting(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(404);
      expect(data.error).toBe('Casting not found');
    });

    it('인증 없이 접근 시 401 에러를 반환한다', async () => {
      // Given
      mockGetServerSession.mockResolvedValue(null);

      // When
      const request = createNextRequest('http://localhost:3000/api/castings/test-id', {
        method: 'DELETE',
      });
      const context: RouteContext = { params: Promise.resolve({ id: 'test-id' }) };
      const response = await deleteCasting(request, context);
      const data = await response.json();

      // Then
      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });
});
