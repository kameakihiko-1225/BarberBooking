import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

// Mock dependencies
jest.mock('@prisma/client');
jest.mock('sharp');
jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
    stat: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
    mkdir: jest.fn()
  }
}));

const mockPrisma = {
  galleryItem: {
    create: jest.fn(),
    findUnique: jest.fn()
  },
  galleryAsset: {
    createMany: jest.fn()
  },
  galleryI18n: {
    createMany: jest.fn()
  },
  $transaction: jest.fn()
} as any;

(PrismaClient as jest.Mock).mockImplementation(() => mockPrisma);

// Mock sharp
const mockSharp = {
  metadata: jest.fn(),
  resize: jest.fn(),
  avif: jest.fn(),
  webp: jest.fn(),
  jpeg: jest.fn(),
  toBuffer: jest.fn(),
  clone: jest.fn()
};

(sharp as any).mockImplementation(() => {
  mockSharp.resize.mockReturnThis();
  mockSharp.avif.mockReturnThis();
  mockSharp.webp.mockReturnThis();
  mockSharp.jpeg.mockReturnThis();
  mockSharp.clone.mockReturnThis();
  return mockSharp;
});

// ETL Pipeline simulation
class GalleryETL {
  private prisma: PrismaClient;
  private supportedFormats = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.heic'];
  private sizes = [320, 640, 1024, 1600];

  constructor() {
    this.prisma = new PrismaClient();
  }

  async processImageFolder(folderPath: string) {
    const files = await fs.readdir(folderPath);
    const imageFiles = files.filter(file => 
      this.supportedFormats.some(ext => 
        file.toLowerCase().endsWith(ext)
      )
    );

    const results = [];
    for (const file of imageFiles) {
      const result = await this.processImage(path.join(folderPath, file));
      results.push(result);
    }

    return results;
  }

  async processImage(imagePath: string) {
    const filename = path.basename(imagePath, path.extname(imagePath));
    const slug = filename.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Generate metadata
    const imageBuffer = await fs.readFile(imagePath);
    const metadata = await sharp(imageBuffer).metadata();
    
    // Generate blur placeholder
    const blurBuffer = await sharp(imageBuffer)
      .resize(20, 20, { fit: 'inside' })
      .blur(2)
      .jpeg({ quality: 20 })
      .toBuffer();
    const blurData = `data:image/jpeg;base64,${blurBuffer.toString('base64')}`;

    // Create gallery item
    const galleryItem = await this.prisma.galleryItem.create({
      data: {
        slug,
        width: metadata.width!,
        height: metadata.height!,
        blurData,
        filename
      }
    });

    // Generate assets for different formats and sizes
    const assets = [];
    for (const format of ['avif', 'webp', 'jpg']) {
      for (const size of this.sizes) {
        const buffer = await this.generateAsset(imageBuffer, format, size);
        const assetPath = `/gallery/${slug}/${format}/${size}w.${format === 'jpg' ? 'jpg' : format}`;
        
        assets.push({
          galleryItemId: galleryItem.id,
          format: format as 'avif' | 'webp' | 'jpg',
          width: size,
          path: assetPath,
          size: buffer.length
        });
      }
    }

    await this.prisma.galleryAsset.createMany({ data: assets });

    // Create i18n entries
    const i18nEntries = [
      {
        galleryItemId: galleryItem.id,
        locale: 'en',
        title: this.generateEnglishTitle(filename),
        alt: this.generateEnglishTitle(filename),
        description: ''
      },
      {
        galleryItemId: galleryItem.id,
        locale: 'pl',
        title: '',
        alt: '',
        description: ''
      },
      {
        galleryItemId: galleryItem.id,
        locale: 'uk',
        title: '',
        alt: '',
        description: ''
      }
    ];

    await this.prisma.galleryI18n.createMany({ data: i18nEntries });

    return {
      galleryItem,
      assets: assets.length,
      i18nEntries: i18nEntries.length
    };
  }

  private async generateAsset(buffer: Buffer, format: string, width: number): Promise<Buffer> {
    let processor = sharp(buffer).resize(width, undefined, { 
      fit: 'inside',
      withoutEnlargement: true 
    });

    switch (format) {
      case 'avif':
        return processor.avif({ quality: 80 }).toBuffer();
      case 'webp':
        return processor.webp({ quality: 85 }).toBuffer();
      case 'jpg':
        return processor.jpeg({ quality: 90 }).toBuffer();
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private generateEnglishTitle(filename: string): string {
    return filename
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}

describe('Gallery ETL Pipeline', () => {
  let etl: GalleryETL;

  beforeEach(() => {
    etl = new GalleryETL();
    jest.clearAllMocks();

    // Setup default mock responses
    mockSharp.metadata.mockResolvedValue({
      width: 1600,
      height: 1200,
      format: 'jpeg'
    });

    mockSharp.toBuffer.mockResolvedValue(Buffer.from('fake-image-data'));
    
    mockPrisma.galleryItem.create.mockResolvedValue({
      id: 'test-id-123',
      slug: 'test-image',
      width: 1600,
      height: 1200,
      blurData: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...',
      filename: 'test-image.jpg'
    });

    mockPrisma.galleryAsset.createMany.mockResolvedValue({ count: 12 });
    mockPrisma.galleryI18n.createMany.mockResolvedValue({ count: 3 });
  });

  describe('processImageFolder', () => {
    it('should process all supported image formats in a folder', async () => {
      const mockFiles = [
        'image1.jpg',
        'image2.png', 
        'image3.webp',
        'document.txt', // Should be ignored
        'image4.JPEG'   // Should handle case insensitivity
      ];

      (fs.readdir as jest.Mock).mockResolvedValue(mockFiles);
      (fs.readFile as jest.Mock).mockResolvedValue(Buffer.from('fake-image'));

      const results = await etl.processImageFolder('/temp/images');

      expect(fs.readdir).toHaveBeenCalledWith('/temp/images');
      expect(results).toHaveLength(4); // Only image files
      expect(mockPrisma.galleryItem.create).toHaveBeenCalledTimes(4);
    });

    it('should handle empty folders gracefully', async () => {
      (fs.readdir as jest.Mock).mockResolvedValue([]);

      const results = await etl.processImageFolder('/empty/folder');

      expect(results).toHaveLength(0);
      expect(mockPrisma.galleryItem.create).not.toHaveBeenCalled();
    });
  });

  describe('processImage', () => {
    beforeEach(() => {
      (fs.readFile as jest.Mock).mockResolvedValue(Buffer.from('fake-image-data'));
    });

    it('should create GalleryItem with correct metadata', async () => {
      const result = await etl.processImage('/temp/test-image.jpg');

      expect(mockPrisma.galleryItem.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          slug: 'test-image',
          width: 1600,
          height: 1200,
          filename: 'test-image',
          blurData: expect.stringContaining('data:image/jpeg;base64,')
        })
      });

      expect(result.galleryItem.slug).toBe('test-image');
    });

    it('should create all required GalleryAssets', async () => {
      await etl.processImage('/temp/sample.jpg');

      expect(mockPrisma.galleryAsset.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({
            format: 'avif',
            width: 320,
            path: '/gallery/sample/avif/320w.avif'
          }),
          expect.objectContaining({
            format: 'webp', 
            width: 640,
            path: '/gallery/sample/webp/640w.webp'
          }),
          expect.objectContaining({
            format: 'jpg',
            width: 1600,
            path: '/gallery/sample/jpg/1600w.jpg'
          })
        ])
      });

      const createCall = mockPrisma.galleryAsset.createMany.mock.calls[0][0];
      expect(createCall.data).toHaveLength(12); // 3 formats × 4 sizes
    });

    it('should create GalleryI18n entries for all locales', async () => {
      await etl.processImage('/temp/beautiful-haircut.jpg');

      expect(mockPrisma.galleryI18n.createMany).toHaveBeenCalledWith({
        data: [
          expect.objectContaining({
            locale: 'en',
            title: 'Beautiful Haircut',
            alt: 'Beautiful Haircut'
          }),
          expect.objectContaining({
            locale: 'pl',
            title: '',
            alt: ''
          }),
          expect.objectContaining({
            locale: 'uk', 
            title: '',
            alt: ''
          })
        ]
      });
    });

    it('should generate proper slugs from filenames', async () => {
      const testCases = [
        ['Complex_Image-Name 123.jpg', 'complex-image-name-123'],
        ['IMG_2024_01_15.png', 'img-2024-01-15'],
        ['Special@Characters#.webp', 'special-characters']
      ];

      for (const [filename, expectedSlug] of testCases) {
        mockPrisma.galleryItem.create.mockClear();
        await etl.processImage(`/temp/${filename}`);
        
        expect(mockPrisma.galleryItem.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            slug: expectedSlug
          })
        });
      }
    });

    it('should generate English titles from filenames', async () => {
      const testCases = [
        ['hair-cutting-session.jpg', 'Hair Cutting Session'],
        ['student_work_2024.png', 'Student Work 2024'],
        ['BEFORE_AFTER_comparison.webp', 'Before After Comparison']
      ];

      for (const [filename, expectedTitle] of testCases) {
        mockPrisma.galleryI18n.createMany.mockClear();
        await etl.processImage(`/temp/${filename}`);
        
        const i18nCall = mockPrisma.galleryI18n.createMany.mock.calls[0][0];
        const enEntry = i18nCall.data.find((entry: any) => entry.locale === 'en');
        expect(enEntry.title).toBe(expectedTitle);
        expect(enEntry.alt).toBe(expectedTitle);
      }
    });

    it('should return processing summary', async () => {
      const result = await etl.processImage('/temp/test.jpg');

      expect(result).toEqual({
        galleryItem: expect.objectContaining({
          id: 'test-id-123',
          slug: 'test'
        }),
        assets: 12, // 3 formats × 4 sizes
        i18nEntries: 3 // en, pl, uk
      });
    });
  });

  describe('image processing', () => {
    it('should generate blur placeholder data', async () => {
      const blurBuffer = Buffer.from('blur-data');
      mockSharp.toBuffer
        .mockResolvedValueOnce(blurBuffer) // For blur
        .mockResolvedValue(Buffer.from('asset-data')); // For assets

      await etl.processImage('/temp/test.jpg');

      // Verify blur processing pipeline
      expect(mockSharp.resize).toHaveBeenCalledWith(20, 20, { fit: 'inside' });
      expect(mockSharp.blur).toHaveBeenCalledWith(2);
      expect(mockSharp.jpeg).toHaveBeenCalledWith({ quality: 20 });
    });

    it('should process all formats with correct quality settings', async () => {
      mockSharp.toBuffer.mockResolvedValue(Buffer.from('processed-image'));
      
      await etl.processImage('/temp/test.jpg');

      // Should call sharp for each format and size combination
      expect(mockSharp.avif).toHaveBeenCalledWith({ quality: 80 });
      expect(mockSharp.webp).toHaveBeenCalledWith({ quality: 85 });
      expect(mockSharp.jpeg).toHaveBeenCalledWith({ quality: 90 });
    });
  });

  describe('error handling', () => {
    it('should handle image processing errors', async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));

      await expect(etl.processImage('/invalid/path.jpg'))
        .rejects.toThrow('File not found');
    });

    it('should handle database errors', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue(Buffer.from('valid-image'));
      mockPrisma.galleryItem.create.mockRejectedValue(new Error('Database error'));

      await expect(etl.processImage('/temp/test.jpg'))
        .rejects.toThrow('Database error');
    });
  });
});