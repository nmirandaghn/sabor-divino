import { Link } from 'react-router-dom';

const quickLinks = [
  { to: '/menu', label: 'Our Menu' },
  { to: '/reservations', label: 'Reservations' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

const hours = [
  { day: 'Mon - Thu', time: '11:00 AM - 10:00 PM' },
  { day: 'Fri - Sat', time: '11:00 AM - 11:00 PM' },
  { day: 'Sunday', time: '12:00 PM - 9:00 PM' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Description */}
          <div>
            <h3 className="text-2xl font-bold text-secondary-400 mb-4">Sabor Divino</h3>
            <p className="text-primary-200 mb-4">
              Experience authentic flavors and warm hospitality at our family-owned restaurant.
            </p>
            <p className="text-primary-300 text-sm">
              123 Culinary Street<br />
              Foodville, FL 12345
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-secondary-400 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-primary-200 hover:text-secondary-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-semibold text-secondary-400 mb-4">Hours</h4>
            <ul className="space-y-2">
              {hours.map((item) => (
                <li key={item.day} className="text-primary-200">
                  <span className="font-medium">{item.day}:</span>{' '}
                  <span className="text-primary-300">{item.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-primary-300 text-sm">
              Phone: (555) 123-4567
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-700 mt-8 pt-8 text-center text-primary-300 text-sm">
          <p>&copy; {currentYear} Sabor Divino. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
