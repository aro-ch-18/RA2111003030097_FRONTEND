// src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    Alphabets: false,
    Numbers: false,
    'Highest alphabet': false,
  });

  const handleSubmit = async () => {
    try {
      // Validate JSON format
      const parsedData = JSON.parse(input);
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        setError('Invalid JSON format');
        return;
      }

      // Call the API
      const result = await axios.post('https://restapi-production-21c8.up.railway.app/bfhl', parsedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setResponse(result.data);
      setError('');
    } catch (err) {
      console.error('API Error:', err);  // Log detailed error
      setError('Invalid JSON format or API error');
      setResponse(null);
    }
  };

  const handleFilterChange = (event) => {
    const { value, checked } = event.target;
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [value]: checked,
    }));
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    const { numbers, alphabets, highest_alphabet } = response;
    const filteredData = [];

    if (selectedFilters.Numbers) {
      filteredData.push(<p key="numbers">Numbers: {numbers.join(', ')}</p>);
    }
    if (selectedFilters.Alphabets) {
      filteredData.push(<p key="alphabets">Alphabets: {alphabets.join(', ')}</p>);
    }
    if (selectedFilters['Highest alphabet']) {
      filteredData.push(<p key="highest_alphabet">Highest Alphabet: {highest_alphabet}</p>);
    }

    return (
      <div className="mt-4">
        <h2 className="text-lg font-bold">Filtered Response:</h2>
        {filteredData}
      </div>
    );
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">API INPUT</h1>

      <div className="mb-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          rows="6"
          placeholder='Enter JSON input here (e.g., {"data": ["A","C","z"]})'
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {response && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Select Filters</h3>
          <div className="space-y-2">
            {Object.keys(selectedFilters).map((filter) => (
              <div key={filter} className="flex items-center">
                <input
                  type="checkbox"
                  id={filter}
                  value={filter}
                  checked={selectedFilters[filter]}
                  onChange={handleFilterChange}
                  className="mr-2"
                />
                <label htmlFor={filter}>{filter}</label>
              </div>
            ))}
          </div>

          {renderFilteredResponse()}
        </div>
      )}
    </div>
  );
}

export default App;
