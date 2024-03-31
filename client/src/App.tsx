import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {
  console.log('App component');
  useEffect(() => {
    axios.get('http://192.168.1.245:3001/api/v1/hello')
      .then(response => {
        console.log('Videos', response.data);
      })
      .catch(error => {
        console.error('Error fetching videos', error);
      });
  }
  , []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Reactaaa
        </a>
      </header>
    </div>
  );
}

export default App;
