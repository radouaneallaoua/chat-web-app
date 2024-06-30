import React, { useEffect, useState } from 'react';

function ImageDisplay() {
    const [imagePaths, setImagePaths] = useState([]);

    useEffect(() => {
        // Fetch image paths from the server
        fetch('http://localhost/again/test/images.php?action=display')
            .then(response => response.json())
            .then(data => setImagePaths(data))
            .catch(error => console.error('Error fetching image paths:', error));
    }, []);

    return (
        <div>
            {imagePaths.map((path, index) => (
                <img key={index} src={`http://localhost/uploads/${path}`} alt={`Image ${index}`} />
            ))}
        </div>
    );
}

export default ImageDisplay;
