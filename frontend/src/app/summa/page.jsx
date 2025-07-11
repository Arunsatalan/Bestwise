
'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ImageUpload() {
  const [image, setImage] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleUpload = async () => {
    if (!image) {
      alert('Please select an image first!');
      return;
    }
    const formData = new FormData();
    formData.append('file', image);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload/single`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadedUrl(res.data.data.url);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="p-4">
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleUpload} className="mt-2 bg-blue-500 px-4 py-2 text-white rounded">
        Upload
      </button>

      {uploadedUrl && (
        <div className="mt-4">
          <p>Uploaded Image:</p>
          <img src={uploadedUrl} alt="Uploaded" width={300} />
        </div>
      )}
    </div>
  );
}
