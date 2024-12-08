import React from 'react';

const About = () => {
    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
            <div className="max-w-2xl bg-white rounded-lg shadow-lg p-8 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">About Us</h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Welcome to our platform, a one-stop solution for car enthusiasts and buyers alike. 
                    Here, you can bid on a variety of cars, explore detailed listings, and find your 
                    dream vehicle at the best price.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed mt-4">
                    Our mission is to provide a transparent and competitive environment where buyers 
                    and sellers can connect seamlessly. Whether you're looking to bid on a classic 
                    car or sell your vehicle to the highest bidder, we've got you covered!
                </p>
                <p className="text-lg text-gray-600 leading-relaxed mt-4">
                    Thank you for choosing us. Let's drive the future of car trading together.
                </p>
            </div>
        </div>
    );
};

export default About;
