import { parseModelImages, parseMeasurements, getFirstImageOrPlaceholder } from '@/lib/utils/model-parsers';

describe('parseModelImages', () => {
  it('should return array as-is when input is already an array', () => {
    const input = ['/image1.jpg', '/image2.jpg'];
    const result = parseModelImages(input);
    expect(result).toEqual(input);
  });

  it('should parse JSON string to array', () => {
    const input = '["/image1.jpg","/image2.jpg"]';
    const result = parseModelImages(input);
    expect(result).toEqual(['/image1.jpg', '/image2.jpg']);
  });

  it('should return empty array for invalid JSON string', () => {
    const input = 'invalid json';
    const result = parseModelImages(input);
    expect(result).toEqual([]);
  });

  it('should return empty array for null', () => {
    const result = parseModelImages(null);
    expect(result).toEqual([]);
  });

  it('should return empty array for undefined', () => {
    const result = parseModelImages(undefined);
    expect(result).toEqual([]);
  });

  it('should return empty array for object (non-array)', () => {
    const input = { url: '/image.jpg' };
    const result = parseModelImages(input);
    expect(result).toEqual([]);
  });

  it('should return empty array when JSON parses to non-array', () => {
    const input = '{"url":"/image.jpg"}';
    const result = parseModelImages(input);
    expect(result).toEqual([]);
  });
});

describe('parseMeasurements', () => {
  it('should extract bust, waist, hip from standard format', () => {
    const input = 'B:34 W:24 H:34';
    const result = parseMeasurements(input);
    expect(result).toEqual({
      bust: '34',
      waist: '24',
      hip: '34',
    });
  });

  it('should handle measurements without spaces', () => {
    const input = 'B:36W:26H:36';
    const result = parseMeasurements(input);
    expect(result).toEqual({
      bust: '36',
      waist: '26',
      hip: '36',
    });
  });

  it('should handle partial measurements (only bust)', () => {
    const input = 'B:32';
    const result = parseMeasurements(input);
    expect(result).toEqual({
      bust: '32',
      waist: undefined,
      hip: undefined,
    });
  });

  it('should handle partial measurements (bust and waist)', () => {
    const input = 'B:34 W:25';
    const result = parseMeasurements(input);
    expect(result).toEqual({
      bust: '34',
      waist: '25',
      hip: undefined,
    });
  });

  it('should handle measurements in different order', () => {
    const input = 'H:35 B:33 W:25';
    const result = parseMeasurements(input);
    expect(result).toEqual({
      bust: '33',
      waist: '25',
      hip: '35',
    });
  });

  it('should return all undefined for null input', () => {
    const result = parseMeasurements(null);
    expect(result).toEqual({
      bust: undefined,
      waist: undefined,
      hip: undefined,
    });
  });

  it('should return all undefined for empty string', () => {
    const result = parseMeasurements('');
    expect(result).toEqual({
      bust: undefined,
      waist: undefined,
      hip: undefined,
    });
  });

  it('should return all undefined for invalid format', () => {
    const input = 'invalid measurements';
    const result = parseMeasurements(input);
    expect(result).toEqual({
      bust: undefined,
      waist: undefined,
      hip: undefined,
    });
  });

  it('should handle three-digit measurements', () => {
    const input = 'B:100 W:90 H:105';
    const result = parseMeasurements(input);
    expect(result).toEqual({
      bust: '100',
      waist: '90',
      hip: '105',
    });
  });
});

describe('getFirstImageOrPlaceholder', () => {
  it('should return first image when array is not empty', () => {
    const images = ['/image1.jpg', '/image2.jpg'];
    const result = getFirstImageOrPlaceholder(images);
    expect(result).toBe('/image1.jpg');
  });

  it('should return default placeholder when array is empty', () => {
    const images: string[] = [];
    const result = getFirstImageOrPlaceholder(images);
    expect(result).toBe('/images/placeholder.jpg');
  });

  it('should return custom placeholder when provided', () => {
    const images: string[] = [];
    const result = getFirstImageOrPlaceholder(images, '/custom-placeholder.jpg');
    expect(result).toBe('/custom-placeholder.jpg');
  });

  it('should return first image even when custom placeholder is provided', () => {
    const images = ['/image.jpg'];
    const result = getFirstImageOrPlaceholder(images, '/custom-placeholder.jpg');
    expect(result).toBe('/image.jpg');
  });
});
