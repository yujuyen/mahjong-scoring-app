import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import SessionPage from './pages/SessionPage';
import NewSessionPage from './pages/NewSessionPage';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>🀄 Mahjong Scoring</h1>
          <nav>
            <Link to="/">Home</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/new-session" element={<NewSessionPage />} />
            <Route path="/session/:id" element={<SessionPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
