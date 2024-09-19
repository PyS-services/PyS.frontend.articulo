// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
// import ImportarListaIveco from './components/ImportarListaIveco'; // Eliminado para lazy loading
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Lazy load del componente ImportarListaIveco
const ImportarListaIveco = lazy(() => import('./components/ImportarListaIveco'));

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className="container-fluid">
          <div className="row">
            {/* SideBar ocupa toda la altura pero colapsa en pantallas pequeñas */}
            <div className="col-12 col-md-3 col-lg-2 bg-dark">
              <SideBar />
            </div>
            {/* Contenido principal */}
            <div className="col-12 col-md-9 col-lg-10 p-3">
              <Routes>
                <Route path="/" element={<h1>Bienvenido a Piasentin y Soto</h1>} />
                <Route
                  path="/importar"
                  element={
                    <Suspense fallback={<div>Cargando...</div>}>
                      <ImportarListaIveco />
                    </Suspense>
                  }
                />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
