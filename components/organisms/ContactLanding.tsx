import { Link } from '@/components/atoms/Link';

export interface ContactCard {
  title: string;
  description: string;
  buttonText: string;
  href: string;
  icon?: string;
}

export interface ContactLandingProps {
  cards?: ContactCard[];
}

const DEFAULT_CARDS: ContactCard[] = [
  {
    title: 'MODEL APPLICATION',
    description: 'Join our agency and start your modeling career',
    buttonText: 'Apply Now',
    href: '/contact/apply',
    icon: '📝',
  },
  {
    title: 'CASTING INQUIRY',
    description: 'Book our models for your next project',
    buttonText: 'Contact Us',
    href: '/contact/casting',
    icon: '📸',
  },
  {
    title: 'GENERAL CONTACT',
    description: 'Get in touch with our team',
    buttonText: 'Send Message',
    href: '/contact/general',
    icon: '✉️',
  },
];

export function ContactLanding({ cards = DEFAULT_CARDS }: ContactLandingProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">GET IN TOUCH</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you want to join us, book our models, or just say hello
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              {card.icon && (
                <div className="text-4xl mb-4" aria-hidden="true">
                  {card.icon}
                </div>
              )}
              <h3 className="text-xl font-bold mb-3">{card.title}</h3>
              <p className="text-gray-600 mb-6 flex-1">{card.description}</p>
              <Link
                href={card.href}
                className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors text-center"
              >
                {card.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
