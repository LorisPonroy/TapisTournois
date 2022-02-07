import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import MyRouter from './components/MyRouter';
import NavBar from './components/NavBar/NavBar';
import LastTournament from './components/LastTournament';

ReactDOM.render(
  <React.StrictMode>
    <NavBar/>
    <MyRouter />
    <LastTournament/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
