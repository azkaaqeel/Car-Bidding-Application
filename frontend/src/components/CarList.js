import React, { useEffect, useState } from "react";
import axios from "axios";

const CarList = () => {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/cars")
            .then(response => setCars(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Available Cars</h1>
            <ul>
                {cars.map(car => (
                    <li key={car.car_id}>
                        {car.make} {car.model} - ${car.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CarList;
