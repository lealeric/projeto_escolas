import React from 'react';
import MapComponent from '../components/MapComponent';

const Home = () => {
    return (
        <div>
            <h1>Mapa de Escolas</h1>
            <p>Localização das escolas cadastradas.</p>
            <MapComponent />
        </div>
    );
};

export default Home;
