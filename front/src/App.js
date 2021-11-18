import logo from './logo.png';
import './App.css';
import LastTournament from './components/LastTournament'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Bienvenu sur l'app de TAPIS :D
        </p>
      </header>
      <LastTournament/>
    </div>
  );
}

export default App;
