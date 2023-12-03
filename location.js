//import MapView, { Marker } from 'react-native-maps';


const LocationDisplay = () => {
    const [location, setLocation] = useState(null);

    useEffect(() => {
        getCurrentLocation((loc) => setLocation(loc));
    }, []);

    if (!location) return null;

    return (
        <MapView
            style={{ flex: 1 }}
            initialRegion={{
                ...location,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
        >
            <Marker coordinate={location} />
        </MapView>
    );
};