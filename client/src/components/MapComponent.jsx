import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Tooltip as LeafletTooltip } from 'react-leaflet';
import { Button, Tooltip, Grid } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import AddEscola from '../dialogs/addEscola';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click: (e) => {
            onMapClick(e.latlng);
        },
    });
    return null;
};

const MapComponent = () => {
    const [escolas, setEscolas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clickedPosition, setClickedPosition] = useState(null);
    const [openAddEscola, setOpenAddEscola] = useState(false);
    const [selectedEscola, setSelectedEscola] = useState(null);
    const [escolaProxima, setEscolaProxima] = useState(null);

    const fetchEscolas = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/escolas/');
            if (!response.ok) {
                throw new Error('Falha ao buscar dados das escolas');
            }
            const data = await response.json();
            setEscolas(data);
        } catch (err) {
            console.error("Erro ao carregar escolas:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEscolas();
    }, []);

    const handleMapClick = (latlng) => {
        setClickedPosition(latlng);
    };

    const handleEditarEscola = (id) => {
        const escolaToEdit = escolas.find(e => e.id_escola === id);
        if (escolaToEdit) {
            setSelectedEscola(escolaToEdit);
            setOpenAddEscola(true);
        }
    };

    const handleRemoverEscola = async (id) => {
        try {
            const response = await fetch('http://localhost:8000/api/escolas/' + id, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Falha ao remover escola');
            }
            console.log('Escola removida com sucesso');
            fetchEscolas();
        } catch (err) {
            console.error("Erro ao remover escola:", err);
            setError(err.message);
        }
    };

    const handleAddSchool = () => {
        setSelectedEscola(null);
        setOpenAddEscola(true);
    };

    const handleFindNearest = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/escolas/mais_proxima/?latitude=' + clickedPosition.lat + '&longitude=' + clickedPosition.lng);
            if (!response.ok) {
                throw new Error('Falha ao buscar dados das escolas');
            }
            const data = await response.json();
            console.log(data);
            setEscolaProxima(data);
        } catch (err) {
            console.error("Erro ao carregar escolas:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
        // setClickedPosition(null); // Keep the marker
    };

    if (loading) return <div>Carregando mapa...</div>;
    if (error) return <div>Erro: {error}</div>;


    const defaultCenter = [-12.793889, -47.882778];
    const center = defaultCenter;

    return (
        <div style={{ height: '500px', width: '200%', marginTop: '20px', marginLeft: '-50%' }}>
            <MapContainer center={center} zoom={4} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onMapClick={handleMapClick} />

                <AddEscola
                    open={openAddEscola}
                    onClose={() => {
                        setOpenAddEscola(false);
                        setClickedPosition(null);
                        setSelectedEscola(null);
                    }}
                    latitude={clickedPosition?.lat ? String(clickedPosition.lat).substring(0, 10) : ''}
                    longitude={clickedPosition?.lng ? String(clickedPosition.lng).substring(0, 11) : ''}
                    onSuccess={fetchEscolas}
                    escola={selectedEscola}
                />

                {clickedPosition && !openAddEscola && (
                    <Marker position={clickedPosition} color="red">
                        <Popup onClose={() => setClickedPosition(null)}>
                            <Grid container spacing={5}>
                                <Grid size={4}>
                                    <Button variant="contained" size="small" onClick={handleAddSchool}>
                                        Adicionar Escola
                                    </Button>
                                </Grid>
                                <Grid size={8}>
                                    <Button variant="outlined" size="small" onClick={handleFindNearest}>
                                        Encontrar escola mais próxima
                                    </Button>
                                </Grid>
                            </Grid>
                        </Popup>
                    </Marker>
                )}



                {escolas.map((escola) => (
                    <Marker
                        key={escola.id_escola}
                        position={[escola.latitude, escola.longitude]}
                        color={escola.tipo_escola === 'Publica' ? 'blue' : '#ff0000'}
                    >
                        {escolaProxima && escolaProxima.escola.id_escola === escola.id_escola && (
                            <LeafletTooltip permanent direction="top" offset={[0, -20]}>
                                Distância: {escolaProxima.distancia} km
                            </LeafletTooltip>
                        )}
                        <Popup>
                            <strong>{escola.nome}</strong><br />
                            Tipo: {escola.tipo_escola}<br />
                            Alunos: {escola.num_alunos}<br />
                            Código INEP: {escola.codigo_inep}
                            <br />
                            <Grid container spacing={5}>
                                <Grid size={4}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        sx={{ marginTop: 1 }}
                                        onClick={() => handleEditarEscola(escola.id_escola)}
                                    >
                                        <Tooltip
                                            title="Editar Escola"
                                            placement="bottom"
                                            arrow
                                        >
                                            <Edit fontSize="small" />
                                        </Tooltip>
                                    </Button>
                                </Grid>
                                <Grid size={4}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        sx={{ marginTop: 1 }}
                                        onClick={() => handleRemoverEscola(escola.id_escola)}
                                    >
                                        <Tooltip
                                            title="Remover Escola"
                                            placement="bottom"
                                            arrow
                                        >
                                            <Delete fontSize="small" />
                                        </Tooltip>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
