import { Link } from '@/components/atoms/Link';

export interface FooterProps {
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export function Footer({
  companyName = 'PLATINUM MANAGEMENT',
  email = 'contact@platinum.com',
  phone = '+82-2-1234-5678',
  address = 'Seoul, South Korea',
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* 회사 정보 */}
          <div>
            <h3 className="text-xl font-bold mb-4">{companyName}</h3>
            <p className="text-gray-400 text-sm">{address}</p>
          </div>

          {/* 연락처 */}
          <div>
            <h4 className="text-sm font-semibold mb-4 tracking-wide">CONTACT</h4>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </p>
              <p className="text-gray-400">
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </p>
            </div>
          </div>

          {/* 링크 */}
          <div>
            <h4 className="text-sm font-semibold mb-4 tracking-wide">LINKS</h4>
            <nav className="space-y-2 text-sm">
              <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/models" className="block text-gray-400 hover:text-white transition-colors">
                Models
              </Link>
              <Link href="/archives" className="block text-gray-400 hover:text-white transition-colors">
                Archives
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} {companyName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
