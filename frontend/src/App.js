import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    // Convert FileList to array and set to state
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    // Ensure exactly 4 files are selected
    if (selectedFiles.length !== 4) {
      alert('Please upload exactly 4 videos.');
      return;
    }

    const formData = new FormData();
    // Append all selected files to FormData
    selectedFiles.forEach(file => formData.append('videos', file));

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
      console.log(response);
      setLoading(false);
    } catch (error) {
      console.error('Error uploading files:', error);
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Smart Traffic Management System</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          multiple 
          accept="video/*" 
          onChange={handleFileChange} 
        />
        <button type="submit">Upload Videos</button>
      </form>
      {loading && <p>Loading...</p>}
      {result && !result.error && (
        <div>
          <h2>Optimal Green Times:</h2>
          <p>North: {result.north} seconds</p>
          <p>South: {result.south} seconds</p>
          <p>West: {result.west} seconds</p>
          <p>East: {result.east} seconds</p>
        </div>
      )}
      {result && result.error && (
        <div>
          <h2>Error:</h2>
          <p>{result.error}</p>
        </div>
      )}
    </div>
  );
}

export default App;
