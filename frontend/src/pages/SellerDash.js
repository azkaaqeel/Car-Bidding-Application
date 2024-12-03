import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SellerDash = () => {
    const [cars, setCars] = useState([])
    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = () => {
        axios
            .get("http://localhost:5000/api/cars")
            .then((response) => setCars(response.data))
            .catch((error) => console.error(error));

    }

    // const fetchCars_byID = async () => {
    //     try {
    //       const response = await axios.get(`http://localhost:5000/api/cars/seller/${sellerId}`);
    //       setCars(response.data);
    //     } catch (err) {
    //       if (err.response && err.response.status === 404) {
    //         setError('No cars found for this seller');
    //       } else {
    //         setError('Failed to fetch cars');
    //       }
    //     }
    //   };
  
    return (
        <div>
            <h1>Car Listings</h1>
            <div className="car-tiles-container">
                {cars.map(car => (
                    <Link to={`/car/${car.car_id}`} key={car.car_id} className="car-tile">
                        <div className="car-tile-content">
                            <img src={car.image_path || 'default-car-image.jpg'} alt={car.make} className="car-image" />
                            <h3>{car.make} {car.model}</h3>
                            <p>{car.year} | {car.mileage} miles</p>
                            <p>${car.price}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SellerDash