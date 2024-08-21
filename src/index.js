import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './front_end/App';
import Log from './front_end/Log';
import reportWebVitals from './front_end/reportWebVitals';

function Main() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleLogin = (name) => {
    setUserId(name);
    setIsLoggedIn(true);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <Log onLogin={handleLogin} />
      ) : (
        <div>
          <App userId={userId} />
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);


reportWebVitals();
