import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const PincodeLookup = () => {
  const [pincode, setPincode] = useState('');
  const [pincodeData, setPincodeData] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPincodeData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = response.data[0]?.PostOffice || [];
      setPincodeData(data);
      setFilteredData(data); // Initialize filtered data with fetched data
    } catch (error) {
      console.error('Error fetching pincode data:', error.message);
      // Handle error, show message on the screen, etc.
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    setFilterText(searchText);

    // Filter data based on post office name
    const filteredResults = pincodeData.filter(
      (item) => item.Name.toLowerCase().includes(searchText)
    );

    setFilteredData(filteredResults);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pincode.length === 6) {
      fetchPincodeData();
    } else {
      // Show an alert or error message for invalid pincode
      console.error('Invalid pincode. Please enter a 6-digit pincode.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter 6-digit Pincode:
          <input
            type="text"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
        </label>
        <button type="submit">Lookup</button>
      </form>

      {isLoading && <div>Loading...</div>}
      <p>{`Number of pincodes found: ${filteredData.length}`}</p>
      {pincodeData && (
        <>
          <input
            type="text"
            placeholder="Filter by post office name"
            value={filterText}
            onChange={handleFilterChange}
            style={{ display: isLoading ? 'none' : 'block' }}
          />
          
          {filteredData.length === 0 && (
            <div>Couldn’t find the postal data you’re looking for…</div>
          )}

          <div className='data-list'>
           
            
          {filteredData.map((item) => (
          <div className='container' key={item.Name}>
            <p>
              <span className="bold">Post office name:</span> {item.Name}
            </p>
            <p>
              <span className="bold">Branch Type:</span> {item.BranchType}
            </p>
            <p>
              <span className="bold">Delivery Status:</span> {item.DeliveryStatus}
            </p>
            <p>
              <span className="bold">District:</span> {item.District}
            </p>
            <p>
              <span className="bold">State:</span> {item.State}
            </p>
          </div>
        ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PincodeLookup;
