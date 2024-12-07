import React from 'react'

const ViewSellers = () => {
    const fetchCars = () => {
        axios
            .get('http://localhost:5000/api/cars/${user_id}')
            .then((response) => setCars(response.data))
            .catch((error) => console.error('Error fetching cars:', error));
    };






  return (
    <div>ViewSellers</div>
  )
}

export default ViewSellers