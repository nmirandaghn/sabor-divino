import { Link } from 'react-router-dom';

const featuredDishes = [
  {
    id: 1,
    name: 'Filete a la Parrilla',
    description: 'Premium grilled beef tenderloin with chimichurri sauce and roasted vegetables.',
    image: '/images/dish-1.svg',
    price: '$32.99',
  },
  {
    id: 2,
    name: 'Sopa de Mariscos',
    description: 'Traditional seafood soup with shrimp, mussels, and fresh herbs.',
    image: '/images/dish-2.svg',
    price: '$18.99',
  },
  {
    id: 3,
    name: 'Ensalada Mediterránea',
    description: 'Fresh mixed greens with feta cheese, olives, and citrus vinaigrette.',
    image: '/images/dish-3.svg',
    price: '$14.99',
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero-bg.svg')" }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Welcome to <span className="text-secondary-400">Sabor Divino</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Experience authentic flavors and warm hospitality in every dish we serve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/reservations"
              className="inline-block bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Reserve a Table
            </Link>
            <Link
              to="/menu"
              className="inline-block bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-800 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              View Our Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Dishes Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-800 mb-4">
              Featured Dishes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our chef&apos;s specially curated selection of signature dishes that capture
              the essence of our culinary tradition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDishes.map((dish) => (
              <article
                key={dish.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-primary-800">{dish.name}</h3>
                    <span className="text-secondary-600 font-bold">{dish.price}</span>
                  </div>
                  <p className="text-gray-600">{dish.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/menu"
              className="inline-block bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Explore Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready for an Unforgettable Dining Experience?
          </h2>
          <p className="text-lg text-primary-100 mb-8">
            Join us for a memorable meal. Reserve your table today and let us take care of the rest.
          </p>
          <Link
            to="/reservations"
            className="inline-block bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-4 px-10 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            Make a Reservation
          </Link>
        </div>
      </section>
    </div>
  );
}
