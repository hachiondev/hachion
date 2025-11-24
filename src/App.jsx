import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import EnrollNow from './pages/EnrollNow';
import './App.css';

function App() {
  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/enroll-now" element={<EnrollNow />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
