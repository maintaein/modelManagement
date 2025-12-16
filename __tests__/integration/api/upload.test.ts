import { POST as uploadFiles } from '@/app/api/upload/route';
import { NextRequest } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// 테스트용 헬퍼 함수: FormData를 포함한 NextRequest 생성
function createNextRequest(url: string, formData: FormData): NextRequest {
  return new NextRequest(url, {
    method: 'POST',
    body: formData,
  });
}

// 테스트용 파일 생성 헬퍼
function createTestFile(name: string, size: number, type: string): File {
  const buffer = Buffer.alloc(size);
  const blob = new Blob([buffer], { type });
  return new File([blob], name, { type });
}

describe('Upload API Integration Tests', () => {
  const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
  const uploadedFiles: string[] = [];

  afterEach(async () => {
    // 테스트 후 업로드된 파일 삭제
    for (const file of uploadedFiles) {
      const filePath = path.join(UPLOAD_DIR, file);
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    }
    uploadedFiles.length = 0;
  });

  describe('POST /api/upload', () => {
    it('이미지 파일을 업로드한다', async () => {
      // Given
      const formData = new FormData();
      const file = createTestFile('test.jpg', 1024, 'image/jpeg');
      formData.append('files', file);

      // When
      const request = createNextRequest('http://localhost:3000/api/upload', formData);
      const response = await uploadFiles(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(201);
      expect(data.message).toBe('Files uploaded successfully');
      expect(data.urls).toHaveLength(1);
      expect(data.urls[0]).toMatch(/^\/uploads\/.+\.jpg$/);

      // 파일이 실제로 저장되었는지 확인
      const fileName = data.urls[0].replace('/uploads/', '');
      uploadedFiles.push(fileName);
      const filePath = path.join(UPLOAD_DIR, fileName);
      expect(existsSync(filePath)).toBe(true);
    });

    it('여러 이미지 파일을 한 번에 업로드한다', async () => {
      // Given
      const formData = new FormData();
      const file1 = createTestFile('test1.jpg', 1024, 'image/jpeg');
      const file2 = createTestFile('test2.png', 2048, 'image/png');
      const file3 = createTestFile('test3.webp', 512, 'image/webp');
      formData.append('files', file1);
      formData.append('files', file2);
      formData.append('files', file3);

      // When
      const request = createNextRequest('http://localhost:3000/api/upload', formData);
      const response = await uploadFiles(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(201);
      expect(data.urls).toHaveLength(3);

      // 모든 파일이 실제로 저장되었는지 확인
      for (const url of data.urls) {
        const fileName = url.replace('/uploads/', '');
        uploadedFiles.push(fileName);
        const filePath = path.join(UPLOAD_DIR, fileName);
        expect(existsSync(filePath)).toBe(true);
      }
    });

    it('파일이 없으면 400 에러를 반환한다', async () => {
      // Given: 빈 FormData
      const formData = new FormData();

      // When
      const request = createNextRequest('http://localhost:3000/api/upload', formData);
      const response = await uploadFiles(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(400);
      expect(data.error).toBe('No files uploaded');
    });

    it('허용되지 않는 파일 타입은 400 에러를 반환한다', async () => {
      // Given: PDF 파일
      const formData = new FormData();
      const file = createTestFile('test.pdf', 1024, 'application/pdf');
      formData.append('files', file);

      // When
      const request = createNextRequest('http://localhost:3000/api/upload', formData);
      const response = await uploadFiles(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(400);
      expect(data.error).toMatch(/Invalid file type/);
    });

    it('파일 크기가 10MB를 초과하면 400 에러를 반환한다', async () => {
      // Given: 11MB 파일
      const formData = new FormData();
      const largeFile = createTestFile('large.jpg', 11 * 1024 * 1024, 'image/jpeg');
      formData.append('files', largeFile);

      // When
      const request = createNextRequest('http://localhost:3000/api/upload', formData);
      const response = await uploadFiles(request);
      const data = await response.json();

      // Then
      expect(response.status).toBe(400);
      expect(data.error).toMatch(/File too large/);
    });

    it('허용된 이미지 타입들을 모두 업로드할 수 있다', async () => {
      const allowedTypes = [
        { name: 'test.jpg', type: 'image/jpeg' },
        { name: 'test.png', type: 'image/png' },
        { name: 'test.webp', type: 'image/webp' },
        { name: 'test.gif', type: 'image/gif' },
      ];

      for (const fileType of allowedTypes) {
        // Given
        const formData = new FormData();
        const file = createTestFile(fileType.name, 1024, fileType.type);
        formData.append('files', file);

        // When
        const request = createNextRequest('http://localhost:3000/api/upload', formData);
        const response = await uploadFiles(request);
        const data = await response.json();

        // Then
        expect(response.status).toBe(201);
        expect(data.urls).toHaveLength(1);

        // 파일 정리를 위해 추가
        const fileName = data.urls[0].replace('/uploads/', '');
        uploadedFiles.push(fileName);
      }
    });

    it('업로드된 파일명은 중복되지 않는다', async () => {
      // Given: 같은 이름의 파일 2개
      const formData1 = new FormData();
      const file1 = createTestFile('test.jpg', 1024, 'image/jpeg');
      formData1.append('files', file1);

      const formData2 = new FormData();
      const file2 = createTestFile('test.jpg', 1024, 'image/jpeg');
      formData2.append('files', file2);

      // When: 2번 업로드
      const request1 = createNextRequest('http://localhost:3000/api/upload', formData1);
      const response1 = await uploadFiles(request1);
      const data1 = await response1.json();

      const request2 = createNextRequest('http://localhost:3000/api/upload', formData2);
      const response2 = await uploadFiles(request2);
      const data2 = await response2.json();

      // Then: 파일명이 서로 달라야 함
      expect(data1.urls[0]).not.toBe(data2.urls[0]);

      // 파일 정리
      uploadedFiles.push(data1.urls[0].replace('/uploads/', ''));
      uploadedFiles.push(data2.urls[0].replace('/uploads/', ''));
    });

    it('일부 파일만 유효하지 않으면 전체가 실패한다', async () => {
      // Given: 유효한 파일 1개 + 유효하지 않은 파일 1개
      const formData = new FormData();
      const validFile = createTestFile('valid.jpg', 1024, 'image/jpeg');
      const invalidFile = createTestFile('invalid.pdf', 1024, 'application/pdf');
      formData.append('files', validFile);
      formData.append('files', invalidFile);

      // When
      const request = createNextRequest('http://localhost:3000/api/upload', formData);
      const response = await uploadFiles(request);
      const data = await response.json();

      // Then: 전체 업로드가 실패해야 함
      expect(response.status).toBe(400);
      expect(data.error).toMatch(/Invalid file type/);
    });
  });
});
