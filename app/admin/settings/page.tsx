import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Settings - Admin",
  description: "Manage your account settings",
};

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="mt-4 text-lg text-gray-600">
          Manage your account and application settings
        </p>
      </div>
    </main>
  );
}
