import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Hook to get URL params
import axios from 'axios';
import Login from "./LoginPage"

const CarDetails = () => {
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const getCookie = (name) => {
        const cookies = document.cookie.split('; ');
        const cookie = cookies.find((c) => c.startsWith(`${name}=`));
        return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
    };



    useEffect(() => {
        // Restore values from cookies
        const storedUserId = getCookie('userId');
        const storedUserRole = getCookie('userRole');

        if (storedUserId && storedUserRole) {
            setUserId(storedUserId);
            setUserRole(storedUserRole);
        }
    }, []);

    const { car_id } = useParams(); // Get car_id from URL params
    const [car, setCar] = useState(null); // Initially set to null
    const [loading, setLoading] = useState(true); // Loading state


    const placebid =async (e) => {
        const bidamt=document.getElementById('bid').value
        const carData = {userId,bidamt,car_id};
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
            console.log(err)
        }
    }


    useEffect(() => {
        // Fetch the car details
        axios.get(`http://localhost:5000/api/cars/${car_id}`)
            .then(response => {
                setCar(response.data); // Update the car state with the fetched data
                setLoading(false); // Set loading to false
            })
            .catch(error => {
                console.error('Error fetching car details:', error);
                setLoading(false); // Stop loading even if there's an error
            });
    }, [car_id]);

    if (loading) {
        // Show loading message while data is being fetched
        return <p>Loading car details...</p>;
    }
    // console.log(car)
    if (!car) {
        // Show error message if car data is null after fetching
        return <p>Car details could not be loaded.</p>;
    }

    // Render car details when data is available
    return (
        <div>
            <h1>{car.make} {car.model} Details</h1>
            <div className="top">
                <div className="car-detail">
                    <img src={car.image_path || 'default-car-image.jpg'} alt={car.make} className="car-detail-image" />
                    <h2>{car.year} | {car.mileage} miles</h2>
                    <p><strong>Price:</strong> ${car.price}</p>
                    <p><strong>Description:</strong> {car.description}</p>
                    <p><strong>Seller ID:</strong> {car.seller_id}</p>
                </div>
                <div className="place_bid">
                    <input type="number" id='bid' />
                    <button onClick={() => placebid()}>Place Bid</button>

                </div>

            </div>
            <div className="bid_history">

            </div>

        </div>
    );
}

export default CarDetails;
