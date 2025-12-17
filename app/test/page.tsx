'use client';

import { useState } from 'react';
import { Image, Link, Divider, H1, H2, H3, Text } from '@/components/atoms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SplitText from '@/components/bits/SplitText';
import AnimatedContent from '@/components/bits/AnimatedContent';
import AnimatedList from '@/components/bits/AnimatedList';
import Carousel from '@/components/bits/Carousel';
import FadeContent from '@/components/bits/FadeContent';
import { SegmentControl, ModelCard, LightboxGallery, ImageUploader } from '@/components/molecules';
import {
  Header,
  Footer,
  ContactLanding,
  ModelCarousel,
  ModelGrid,
  HeroVideo,
  AboutPreview
} from '@/components/organisms';

/**
 * 전체 컴포넌트 테스트 페이지
 */
export default function ComponentsTestPage() {
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [segmentValue, setSegmentValue] = useState<string>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center">
          <H1>컴포넌트 테스트 페이지</H1>
          <Text size="large" className="mt-4 text-gray-600">
            Atoms, UI, Bits, Molecules, Organisms 컴포넌트 전체 시각화
          </Text>
        </div>

        <Divider />

        <Tabs defaultValue="atoms" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="atoms">Atoms</TabsTrigger>
            <TabsTrigger value="ui">shadcn UI</TabsTrigger>
            <TabsTrigger value="bits">React Bits</TabsTrigger>
            <TabsTrigger value="molecules">Molecules</TabsTrigger>
            <TabsTrigger value="organisms">Organisms</TabsTrigger>
          </TabsList>

          {/* Atoms 탭 */}
          <TabsContent value="atoms" className="space-y-12 mt-8">
            <section>
              <H2 className="mb-6">Typography</H2>
              <div className="space-y-6">
                <div>
                  <Text size="small" weight="semibold" className="text-gray-500 mb-2">Heading 1</Text>
                  <H1>TAYLOR&apos;S MODEL</H1>
                </div>
                <div>
                  <Text size="small" weight="semibold" className="text-gray-500 mb-2">Heading 2</Text>
                  <H2>모델 매니지먼트 에이전시</H2>
                </div>
                <div>
                  <Text size="small" weight="semibold" className="text-gray-500 mb-2">Heading 3</Text>
                  <H3>최고의 모델들과 함께합니다</H3>
                </div>
                <div>
                  <Text size="small" weight="semibold" className="text-gray-500 mb-2">Text Sizes</Text>
                  <div className="space-y-2">
                    <Text size="large">Large text size</Text>
                    <Text size="base">Base text size (default)</Text>
                    <Text size="small">Small text size</Text>
                    <Text size="caption">Caption text size</Text>
                  </div>
                </div>
                <div>
                  <Text size="small" weight="semibold" className="text-gray-500 mb-2">Font Weights</Text>
                  <div className="space-y-2">
                    <Text weight="light">Light (300)</Text>
                    <Text weight="regular">Regular (400)</Text>
                    <Text weight="medium">Medium (500)</Text>
                    <Text weight="semibold">Semibold (600)</Text>
                    <Text weight="bold">Bold (700)</Text>
                    <Text weight="black">Black (900)</Text>
                  </div>
                </div>
              </div>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">Link</H2>
              <div className="space-y-4">
                <Link href="/" className="text-blue-600 underline block">Internal Link (Home)</Link>
                <Link href="https://github.com" target="_blank" className="text-blue-600 underline block">External Link (GitHub)</Link>
                <Link href="/models" className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800">Styled Link Button</Link>
              </div>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">Image</H2>
              <div className="relative w-64 h-64 bg-gray-100 rounded">
                <Image src="/placeholder.jpg" alt="Placeholder image" fill className="object-cover rounded" />
              </div>
              <Text size="small" className="mt-2 text-gray-600">Next.js Image 래퍼 (alt 필수)</Text>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">Divider</H2>
              <div className="space-y-8">
                <div><Text size="small" className="mb-2">Default</Text><Divider /></div>
                <div><Text size="small" className="mb-2">Dashed</Text><Divider variant="dashed" /></div>
                <div><Text size="small" className="mb-2">Dotted</Text><Divider variant="dotted" /></div>
              </div>
            </section>
          </TabsContent>

          {/* shadcn UI 탭 */}
          <TabsContent value="ui" className="space-y-12 mt-8">
            <section>
              <H2 className="mb-6">Buttons</H2>
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button size="sm">Small</Button>
                <Button size="lg">Large</Button>
                <Button disabled>Disabled</Button>
              </div>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">Form Elements</H2>
              <div className="space-y-6 max-w-md">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Your message..." className="mt-2" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
              </div>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">Badges</H2>
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">Avatar</H2>
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">Card</H2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <Card>
                  <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card description goes here</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Text size="small">This is the card content area.</Text>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Another Card</CardTitle>
                    <CardDescription>With some content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Action</Button>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">Skeleton</H2>
              <div className="space-y-4 max-w-md">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </section>
          </TabsContent>

          {/* React Bits 탭 */}
          <TabsContent value="bits" className="space-y-12 mt-8">
            <section>
              <H2 className="mb-6">SplitText</H2>
              <div className="bg-gray-50 p-8 rounded">
                <SplitText
                  text="TAYLOR'S MODEL AGENCY"
                  className="text-4xl font-bold"
                  splitType="chars"
                  delay={50}
                  tag="h2"
                  onLetterAnimationComplete={() => {}}
                />
              </div>
              <Text size="small" className="mt-2 text-gray-600">문자 단위 애니메이션 (스크롤 시 활성화)</Text>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">AnimatedList</H2>
              <div className="bg-gray-50 p-8 rounded max-w-md">
                <AnimatedList
                  items={['Model 1', 'Model 2', 'Model 3', 'Model 4', 'Model 5', 'Model 6', 'Model 7', 'Model 8']}
                  onItemSelect={(item: string, index: number) => setSelectedItem(`${item} (index: ${index})`)}
                  showGradients={true}
                  enableArrowNavigation={true}
                />
                {selectedItem && (
                  <Text size="small" className="mt-4 text-gray-600">Selected: {selectedItem}</Text>
                )}
              </div>
              <Text size="small" className="mt-2 text-gray-600">키보드 화살표 또는 마우스로 선택 가능</Text>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">FadeContent</H2>
              <div className="bg-gray-50 p-8 rounded">
                <FadeContent
                  container={null}
                  style={{}}
                  onComplete={() => {}}
                  onDisappearanceComplete={() => {}}
                >
                  <H3>Fade In Content</H3>
                  <Text className="mt-4">이 콘텐츠는 페이드 인 효과와 함께 나타납니다.</Text>
                </FadeContent>
              </div>
              <Text size="small" className="mt-2 text-gray-600">스크롤 시 페이드 인</Text>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">AnimatedContent</H2>
              <div className="bg-gray-50 p-8 rounded">
                <AnimatedContent
                  container={null}
                  onComplete={() => {}}
                  onDisappearanceComplete={() => {}}
                >
                  <H3>Animated Content</H3>
                  <Text className="mt-4">스크롤 시 애니메이션 효과가 적용됩니다.</Text>
                </AnimatedContent>
              </div>
              <Text size="small" className="mt-2 text-gray-600">스크롤 시 슬라이드 업 애니메이션</Text>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">Carousel</H2>
              <div className="bg-gray-50 p-8 rounded">
                <Carousel
                  items={[
                    { title: 'Slide 1', description: 'First slide content', id: 1, icon: <div className="w-12 h-12 bg-blue-500 rounded" /> },
                    { title: 'Slide 2', description: 'Second slide content', id: 2, icon: <div className="w-12 h-12 bg-green-500 rounded" /> },
                    { title: 'Slide 3', description: 'Third slide content', id: 3, icon: <div className="w-12 h-12 bg-purple-500 rounded" /> },
                  ]}
                  baseWidth={300}
                  autoplay={true}
                  autoplayDelay={3000}
                />
              </div>
              <Text size="small" className="mt-2 text-gray-600">자동 슬라이드 캐러셀 (드래그 가능)</Text>
            </section>
          </TabsContent>

          {/* Molecules 탭 */}
          <TabsContent value="molecules" className="space-y-12 mt-8">
            <section>
              <H2 className="mb-6">SegmentOption 타입</H2>
              <div className="bg-gray-50 p-8 rounded">
                <Text size="small" className="text-gray-600">
                  SegmentOption은 SegmentControl의 옵션을 정의하는 타입입니다.
                </Text>
                <pre className="mt-4 p-4 bg-white rounded border text-xs">
{`type SegmentOption = {
  value: string;
  label: string;
  disabled?: boolean;
}`}
                </pre>
              </div>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">GalleryImage 타입</H2>
              <div className="bg-gray-50 p-8 rounded">
                <Text size="small" className="text-gray-600">
                  GalleryImage는 LightboxGallery에서 사용하는 이미지 타입입니다.
                </Text>
                <pre className="mt-4 p-4 bg-white rounded border text-xs">
{`type GalleryImage = {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}`}
                </pre>
              </div>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">SegmentControl</H2>
              <div className="bg-gray-50 p-8 rounded space-y-6">
                <div>
                  <Text size="small" className="mb-3 text-gray-600">Default Size</Text>
                  <SegmentControl
                    options={[
                      { value: 'all', label: '전체' },
                      { value: 'female', label: '여성' },
                      { value: 'male', label: '남성' },
                    ]}
                    value={segmentValue}
                    onChange={setSegmentValue}
                  />
                </div>
                <div>
                  <Text size="small" className="mb-3 text-gray-600">Small Size</Text>
                  <SegmentControl
                    options={[
                      { value: 'grid', label: 'Grid' },
                      { value: 'list', label: 'List' },
                    ]}
                    size="sm"
                    defaultValue="grid"
                  />
                </div>
                <div>
                  <Text size="small" className="mb-3 text-gray-600">Large & Full Width</Text>
                  <SegmentControl
                    options={[
                      { value: 'models', label: 'Models' },
                      { value: 'about', label: 'About' },
                      { value: 'contact', label: 'Contact' },
                    ]}
                    size="lg"
                    fullWidth
                    defaultValue="models"
                  />
                </div>
              </div>
              <Text size="small" className="mt-2 text-gray-600">탭 형태의 세그먼트 컨트롤</Text>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">ModelCard</H2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ModelCard
                  id="1"
                  name="KAMI"
                  imageUrl="/placeholder.jpg"
                  activity="10.31 - 01.16"
                  height="178"
                  bust="30"
                  waist="23.5"
                  hip="35.5"
                  shoes="255"
                  hair="BROWN"
                  eyes="BROWN"
                  featured
                  overlayColor="bg-gradient-to-br from-pink-600 to-pink-800"
                  onClick={(id) => console.log('Clicked model:', id)}
                />
                <ModelCard
                  id="2"
                  name="AMIR"
                  imageUrl="/placeholder.jpg"
                  activity="11.05 - 02.20"
                  height="185"
                  bust="95"
                  waist="75"
                  hip="95"
                  shoes="280"
                  hair="BLACK"
                  eyes="DARK BROWN"
                  overlayColor="bg-gradient-to-br from-blue-600 to-blue-800"
                  onClick={(id) => console.log('Clicked model:', id)}
                />
                <ModelCard
                  id="3"
                  name="MONIKA"
                  imageUrl="/placeholder.jpg"
                  activity="10.31 - 01.16"
                  height="178"
                  bust="30"
                  waist="23.5"
                  hip="35.5"
                  shoes="255"
                  hair="BROWN"
                  eyes="BROWN"
                  overlayColor="bg-gradient-to-br from-red-600 to-red-800"
                  onClick={(id) => console.log('Clicked model:', id)}
                />
              </div>
              <Text size="small" className="mt-4 text-gray-600">모델 정보 카드 (호버 시 상세 정보 표시)</Text>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">LightboxGallery</H2>
              <div className="bg-gray-50 p-8 rounded">
                <Button onClick={() => setLightboxOpen(true)}>
                  갤러리 열기
                </Button>
                {lightboxOpen && (
                  <LightboxGallery
                    images={[
                      { id: '1', url: '/placeholder.jpg', alt: 'Model photo 1', caption: 'Professional photoshoot' },
                      { id: '2', url: '/placeholder.jpg', alt: 'Model photo 2', caption: 'Fashion editorial' },
                      { id: '3', url: '/placeholder.jpg', alt: 'Model photo 3', caption: 'Commercial work' },
                    ]}
                    initialIndex={0}
                    onClose={() => setLightboxOpen(false)}
                  />
                )}
              </div>
              <Text size="small" className="mt-2 text-gray-600">전체 화면 이미지 갤러리 (ESC, 화살표 키 지원)</Text>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">ImageUploader</H2>
              <div className="bg-gray-50 p-8 rounded">
                <ImageUploader
                  onUpload={(files) => {
                    setUploadedFiles(files);
                    console.log('Uploaded files:', files);
                  }}
                  onRemove={(id) => console.log('Removed file:', id)}
                  maxFiles={5}
                  multiple
                />
                {uploadedFiles.length > 0 && (
                  <Text size="small" className="mt-4 text-gray-600">
                    업로드된 파일: {uploadedFiles.length}개
                  </Text>
                )}
              </div>
              <Text size="small" className="mt-2 text-gray-600">드래그 앤 드롭 이미지 업로더</Text>
            </section>
          </TabsContent>

          {/* Organisms 탭 */}
          <TabsContent value="organisms" className="space-y-12 mt-8">
            <section>
              <H2 className="mb-6">Header</H2>
              <div className="bg-gray-50 p-4 rounded">
                <Header />
              </div>
              <Text size="small" className="mt-2 text-gray-600">메인 네비게이션 헤더</Text>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">Footer</H2>
              <div className="bg-gray-50 p-4 rounded">
                <Footer />
              </div>
              <Text size="small" className="mt-2 text-gray-600">푸터 컴포넌트</Text>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">HeroVideo</H2>
              <div className="bg-gray-50 p-4 rounded">
                <HeroVideo
                  videoSrc="https://cdn.pixabay.com/video/2022/10/25/136513-764001516_large.mp4"
                  title="PLATINUM MANAGEMENT"
                  subtitle="Where Excellence Meets Opportunity"
                />
              </div>
              <Text size="small" className="mt-2 text-gray-600">메인 히어로 비디오 섹션</Text>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">AboutPreview</H2>
              <div className="bg-gray-50 p-4 rounded">
                <AboutPreview
                  slides={[
                    {
                      id: '1',
                      title: 'LEADING MODEL AGENCY',
                      description: 'We discover and develop the world\'s most promising models',
                    },
                    {
                      id: '2',
                      title: 'GLOBAL NETWORK',
                      description: 'Connected with top fashion brands worldwide',
                    },
                    {
                      id: '3',
                      title: 'PROFESSIONAL DEVELOPMENT',
                      description: 'Comprehensive training and career support',
                    },
                  ]}
                />
              </div>
              <Text size="small" className="mt-2 text-gray-600">About 섹션 프리뷰</Text>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">ModelCarousel</H2>
              <div className="bg-gray-50 p-4 rounded">
                <ModelCarousel
                  models={[
                    {
                      id: '1',
                      name: 'KAMI',
                      imageUrl: '/images/models/model1.png',
                      category: 'Fashion',
                    },
                    {
                      id: '2',
                      name: 'AMIR',
                      imageUrl: '/images/models/model2.png',
                      category: 'Commercial',
                    },
                    {
                      id: '3',
                      name: 'MONIKA',
                      imageUrl: '/images/models/model1.png',
                      category: 'Editorial',
                    },
                    {
                      id: '4',
                      name: 'Kimmi',
                      imageUrl: '/images/models/model2.png',
                      category: 'Editorial',
                    },
                  ]}
                />
              </div>
              <Text size="small" className="mt-2 text-gray-600">모델 캐러셀 (자동 슬라이드)</Text>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">ModelGrid</H2>
              <div className="bg-gray-50 p-4 rounded">
                <ModelGrid
                  models={[
                    {
                      id: '1',
                      name: 'KAMI',
                      imageUrl: '/images/models/model1.png',
                      height: '178',
                      category: 'Fashion',
                    },
                    {
                      id: '2',
                      name: 'AMIR',
                      imageUrl: '/images/models/model2.png',
                      height: '185',
                      category: 'Commercial',
                    },
                    {
                      id: '3',
                      name: 'MONIKA',
                      imageUrl: '/images/models/model1.png',
                      height: '175',
                      category: 'Editorial',
                    },
                    {
                      id: '4',
                      name: 'Kimmi',
                      imageUrl: '/images/models/model2.png',
                      height: '175',
                      category: 'Editorial',
                    },
                  ]}
                />
              </div>
              <Text size="small" className="mt-2 text-gray-600">모델 그리드 레이아웃</Text>
            </section>

            <Divider />

            <section>
              <H2 className="mb-6">ContactLanding</H2>
              <div className="bg-gray-50 p-4 rounded">
                <ContactLanding />
              </div>
              <Text size="small" className="mt-2 text-gray-600">연락처 랜딩 섹션</Text>
            </section>
          </TabsContent>
        </Tabs>

        <Divider spacing="lg" />

        <section className="bg-gray-50 p-6 rounded">
          <H3 className="mb-4">테스트 안내</H3>
          <div className="space-y-2">
            <Text size="small">• <strong>Atoms</strong>: 커스텀 기본 컴포넌트 (Image, Link, Typography, Divider)</Text>
            <Text size="small">• <strong>shadcn UI</strong>: 재사용 가능한 UI 컴포넌트 (Button, Input, Card 등)</Text>
            <Text size="small">• <strong>React Bits</strong>: 애니메이션 컴포넌트 (SplitText, AnimatedList, Carousel 등)</Text>
            <Text size="small">• <strong>Molecules</strong>: 복합 컴포넌트 (SegmentControl, ModelCard, LightboxGallery, ImageUploader + 타입)</Text>
            <Text size="small">• <strong>Organisms</strong>: 페이지 섹션 컴포넌트 (Header, Footer, ModelCarousel, ModelGrid 등)</Text>
            <Text size="small" className="mt-4 text-gray-600">브라우저 창 크기를 조절하여 반응형 디자인을 확인하세요.</Text>
          </div>
        </section>
      </div>
    </div>
  );
}
