import React, { useState } from 'react';

function Test() {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('image', selectedFile);

        // Use fetch to send the image to the server
        fetch('http://localhost/again/test/images.php?action=add', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.text())
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                console.error('Error uploading image:', error);
            });
    };

    return (
        <div>
            <h2>Image Upload</h2>
            <form method='POST'onSubmit={handleUpload}>
                <input type="file"  accept='image/*' onChange={handleFileChange} />
                <button type="submit" >Upload Image</button>
            </form>
        </div>
    );
}

export default Test;
