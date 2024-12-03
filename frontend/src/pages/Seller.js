import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SellerPage = () => {
    const [message, setMessage] = useState('');

    const addCar = async (e) => {
        e.preventDefault();

        // Collect data from the form
        const carData = {
            make: document.getElementById('make').value,
            model: document.getElementById('model').value,
            year: parseInt(document.getElementById('year').value),
            mileage: parseInt(document.getElementById('mileage').value),
            color: document.getElementById('color').value,
            price: parseInt(document.getElementById('price').value),
            description: document.getElementById('description').value,
            seller_id: 1, // Replace this with the actual seller_id (from authentication, if implemented)
            image_path: document.getElementById('image_path').value
        };
        console.log(document.getElementById('image_path').value);
        try {
            //   Send data to the backend API
            const response = await fetch('http://localhost:5000/api/cars', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(carData),
            });

            if (response.ok) {
                alert('Car added successfully!');
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    };

    return (
        <>
        <nav className='navbar'><Link to='/SellerDash'>View All Listings</Link></nav>
            <div>
                <h1>Add a New Car</h1>
                <form onSubmit={addCar}>

                    <label>Picture:</label>
                    <input type='file' id='image_path'></input>

                    {/* Make */}
                    <label htmlFor="make">Make:</label>
                    <input type="text" id="make" name="make" maxLength="50" required />


                    {/* Model */}
                    <label htmlFor="model">Model:</label>
                    <input type="text" id="model" name="model" maxLength="50" required />

                    {/* Year */}
                    <label htmlFor="year">Year:</label>
                    <input type="number" id="year" name="year" min="1900" max="2099" required />

                    {/* Mileage */}
                    <label htmlFor="mileage">Mileage (in km):</label>
                    <input type="number" id="mileage" name="mileage" min="0" required />

                    {/* Color */}
                    <label htmlFor="color">Color:</label>
                    <input type="text" id="color" name="color" maxLength="30" required />

                    {/* Price */}
                    <label htmlFor="price">Price ($):</label>
                    <input type="number" id="price" name="price" min="0" required />

                    {/* Description */}
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        maxLength="500"
                        placeholder="Enter a detailed description of the car..."
                        required
                    ></textarea>

                    {/* Submit Button */}
                    <button type="submit">Add Car</button>
                </form>
                <p>{message}</p>
            </div>
        </>
    );
};

export default SellerPage;
