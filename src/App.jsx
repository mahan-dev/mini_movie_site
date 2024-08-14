import React from 'react';
import { BrowserRouter as Router , Route, Routes } from 'react-router-dom';
import MovieApiContext from './context/MovieApiContext';
import Home from './components/Home';

const App = () => {
  return (
    <>
    <Router>

    <MovieApiContext>

      <Routes>
        <Route path='/'  element={<Home />}  />

      </Routes>

    </MovieApiContext>
    </Router>
    </>
  );
};

export default App;