import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <a href="#" className="hover:text-yellow-400">
            CarBid
          </a>
        </div>
        <div className="space-x-4">
          <a
            href="/login"
            className="text-sm md:text-base hover:text-yellow-400 transition"
          >
            Login
          </a>
          <a
            href="/Buyer"
            className="text-sm md:text-base bg-yellow-500 text-gray-800 px-4 py-2 rounded hover:bg-yellow-600 transition"
          >
            View Auctions
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex-grow bg-gray-100 flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          Bid for Your Dream Car
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
          Discover an extensive collection of vehicles, from classic models to
          luxury sports cars. Place your bids and drive away your dream car at
          unbeatable prices!
        </p>
        <div className="mt-8 space-x-4">
          <a
            href="/Buyer"
            className="bg-yellow-500 text-gray-800 px-6 py-3 text-lg rounded-lg hover:bg-yellow-600 transition"
          >
            Start Bidding
          </a>
          <a
            href="/About"x
            className="bg-gray-800 text-white px-6 py-3 text-lg rounded-lg hover:bg-gray-700 transition"
          >
            Learn More
          </a>
        </div>
      </header>

      {/* Features Section */}
      <section
        id="learn-more"
        className="bg-white py-12 px-6 text-center md:text-left"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Why Choose CarBid?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Extensive Selection
            </h3>
            <p className="text-gray-600">
              Access a vast catalog of cars from verified sellers across the
              country.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Transparent Auctions
            </h3>
            <p className="text-gray-600">
              Enjoy a secure and fair bidding process with real-time updates.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Expert Support
            </h3>
            <p className="text-gray-600">
              Our team is here to assist you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; 2024 CarBid. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
