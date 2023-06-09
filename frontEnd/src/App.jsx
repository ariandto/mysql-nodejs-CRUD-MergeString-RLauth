import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Home';
import Create from './Create';
import OrderKeyParsing from './OrderKeyParsing';
import FormLogin from './FormLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormLogin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/order-key-parsing" element={<OrderKeyParsing />} />
      </Routes>
    </Router>
  );
}

export default App;
