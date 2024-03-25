import React from 'react';
import './App.css';

function App() {
  const handleLogin = () => {
    // Implement your login logic here
    console.log("Login button clicked!");
  };

  return (
      <div className="App">
        <header className="App-header">
          <button onClick={handleLogin} className="App-link">
            Click to Login
          </button>
        </header>
      </div>
  );
}

export default App;
