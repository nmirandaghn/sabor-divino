import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "../components/ui";

const categoryLabels = {
  appetizers: "Appetizers",
  main: "Main Courses",
  desserts: "Desserts",
  beverages: "Beverages",
};

const categoryOrder = ["appetizers", "main", "desserts", "beverages"];

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
        const response = await fetch(`/api/menu`);

        if (!response.ok) {
          throw new Error("Failed to fetch menu");
        }

        const result = await response.json();
        setMenuItems(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Group menu items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Get available categories in the correct order
  const availableCategories = categoryOrder.filter(
    (cat) => groupedItems[cat] && groupedItems[cat].length > 0,
  );

  const scrollToCategory = (category) => {
    setActiveCategory(category);
    const element = document.getElementById(`category-${category}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Our <span className="text-secondary-400">Menu</span>
          </h1>
          <p className="text-lg text-primary-100">
            Authentic flavors crafted with passion and tradition
          </p>
        </div>
      </section>

      {/* Category Navigation */}
      {!isLoading && !error && availableCategories.length > 0 && (
        <nav className="sticky top-0 z-10 bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center space-x-2 sm:space-x-4 py-4 overflow-x-auto">
              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => scrollToCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 whitespace-nowrap ${
                    activeCategory === category
                      ? "bg-primary-700 text-white"
                      : "bg-primary-100 text-primary-700 hover:bg-primary-200"
                  }`}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Menu Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-primary-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Spinner size="lg" />
              <p className="mt-4 text-gray-600">Loading menu...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <svg
                  className="w-12 h-12 text-red-500 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Unable to load menu
                </h3>
                <p className="text-red-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 text-red-700 hover:text-red-800 font-medium underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {!isLoading && !error && menuItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-600">
                No menu items available at the moment.
              </p>
            </div>
          )}

          {!isLoading && !error && menuItems.length > 0 && (
            <div className="space-y-16">
              {availableCategories.map((category) => (
                <div
                  key={category}
                  id={`category-${category}`}
                  className="scroll-mt-20"
                >
                  <h2 className="text-3xl font-bold text-primary-800 mb-8 text-center">
                    {categoryLabels[category]}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedItems[category].map((item) => (
                      <article
                        key={item.id}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                      >
                        <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/images/dish-placeholder.svg";
                            }}
                          />
                        </div>
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-primary-800">
                              {item.name}
                            </h3>
                            <span className="text-secondary-600 font-bold text-lg">
                              ${Number(item.price).toFixed(2)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {item.description}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Taste the Difference?
          </h2>
          <p className="text-lg text-primary-100 mb-8">
            Book your table today and enjoy an unforgettable dining experience.
          </p>
          <Link
            to="/reservations"
            className="inline-block bg-secondary-500 hover:bg-secondary-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Reserve a Table
          </Link>
        </div>
      </section>
    </div>
  );
}
