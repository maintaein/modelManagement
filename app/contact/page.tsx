import type { Metadata } from 'next';
import { ModelApplyForm, ModelCastingForm } from '@/components/organisms';

export const metadata: Metadata = {
  title: "Contact - Taylor's Model Management",
  description: "Get in touch with our team",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* 헤더 */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get in touch with our team for bookings, inquiries, or to apply as a model
          </p>
        </div>

        {/* 연락처 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <a
              href="mailto:info@taylorsmodels.com"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              info@taylorsmodels.com
            </a>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Phone</h3>
            <a
              href="tel:+1234567890"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              +1 (234) 567-890
            </a>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Address</h3>
            <p className="text-gray-600">
              123 Fashion Street<br />
              New York, NY 10001
            </p>
          </div>
        </div>

        {/* 폼 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* 모델 지원 폼 */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-2">Apply as a Model</h2>
            <p className="text-gray-600 mb-8">
              Join our roster of international talent
            </p>
            <ModelApplyForm />
          </div>

          {/* 캐스팅 요청 폼 */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-2">Casting Request</h2>
            <p className="text-gray-600 mb-8">
              Book our models for your next project
            </p>
            <ModelCastingForm />
          </div>
        </div>
      </div>
    </main>
  );
}
