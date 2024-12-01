import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Admin = () => {
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
    const handleDelete = (carId) => {
        // // Send a DELETE request to the backend
        axios.delete(`http://localhost:5000/api/cars/${carId}`).then(function (response) {
            console.log(response.data)
            fetchCars()
        })
        .catch((error)=>{
            console.log(error);
        })

    };



    return (
        <div>
            <h1>Available Cars</h1>
            <div className='listings'>
                {
                    cars.map(car => (
                        <ul>
                            <a key={car.id} className='car' >
                                <h1>{car.make}</h1>
                                <h2>{car.model}</h2>
                                <button onClick={() => handleDelete(car.car_id)}>Delete</button>


                            </a>

                        </ul>
                    ))
                }
            </div>
        </div>
    );
}


export default Admin