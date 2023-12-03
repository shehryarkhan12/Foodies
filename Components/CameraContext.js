import { createContext } from 'react';

const CameraContext = createContext({
    isCameraVisible: false,
    showCamera: () => {},
    hideCamera: () => {},
});

export default CameraContext;