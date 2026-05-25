import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function Harita({ soforId }: { soforId: string }) {
    const [konum, setKonum] = useState<[number, number] | null>(null);
    const [socket, setSocket] = useState<any>(null);

    useEffect(() => {
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);
        const veliId = localStorage.getItem('veliId');
        if (veliId) newSocket.emit('register', { role: 'VELI', id: veliId });
        newSocket.on('konum_guncelleme', (data: any) => {
            if (data.soforId === soforId) setKonum([data.enlem, data.boylam]);
        });
        return () => { newSocket.disconnect(); };
    }, [soforId]);

    useEffect(() => {
        fetch(`http://localhost:5000/api/konum/sofor/${soforId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data && data.enlem) setKonum([data.enlem, data.boylam]);
            })
            .catch(console.error);
    }, [soforId]);

    const defaultCenter: [number, number] = [41.0082, 28.9784];
    return (
        <MapContainer center={konum || defaultCenter} zoom={13} style={{ height: '500px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
            {konum && <Marker position={konum}><Popup>Servis aracı</Popup></Marker>}
        </MapContainer>
    );
}
export default Harita;