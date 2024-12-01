import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/cars')
            .then(response => setCars(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Available Cars</h1>
            <ul>
                {cars.map(car => (
                    <li key={car.id}>{car.make} {car.model}</li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
