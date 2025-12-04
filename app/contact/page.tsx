import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact - Taylor's Model Management",
  description: "Get in touch with our team",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="mt-4 text-lg text-gray-600">
          Get in touch with our team for bookings and inquiries
        </p>
      </div>
    </main>
  );
}
