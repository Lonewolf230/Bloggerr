import React, { useState, useEffect, useRef } from 'react';
import {  ScanCommand } from '@aws-sdk/lib-dynamodb';
import './Search.css'; // Import the CSS file
import { docClient } from '../../dynamoDBconfig';
import { Link } from 'react-router-dom';
import { useAuth } from '../misc/AuthContext';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const {currentUser}=useAuth()

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounce function to prevent excessive API calls
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.length >= 1) {
        fetchUsernames(searchTerm);
        setShowDropdown(true);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Fetch usernames from DynamoDB
  const fetchUsernames = async (term) => {
    setIsLoading(true);
    
    try {
      // Since username is the partition key, we can use QueryCommand directly
      // with a begins_with condition on the key
      const command = new ScanCommand({
        TableName: 'users', // Your table name
        FilterExpression: 'begins_with(username, :searchTerm)',
        ExpressionAttributeValues: {
          ':searchTerm': term
        },
        Limit: 10 // Limit results to improve performance
      });
      const response = await docClient.send(command);
      setResults(response.Items || []);
    } catch (error) {
      console.error('Error fetching usernames:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (username) => {
    setSearchTerm(username);
    setShowDropdown(false);
    // Additional action when a username is selected
    console.log('Selected username:', username);
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-input-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length > 0 && setShowDropdown(true)}
          placeholder="Search usernames..."
          className="search-input"
        />
        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
      </div>
      
      {/* Dropdown with results */}
      {showDropdown && (
        <div className={`search-dropdown ${results.length > 0 ? 'has-results' : ''}`}>
          {results.length > 0 ? (
            results.map((user) => (
                <Link 
                 to={currentUser.username===user.username?
                    `/profile`:`/otherProfile/${user.username}`}
                 key={user.username}
                 className='user-suggestion'>
                    <div 
                    onClick={() => handleSelect(user.username)}
                    className="search-result-item"
                    >
                        {user.username}
                    </div>
                </Link>
            ))
          ) : (
            <div className="no-results">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;