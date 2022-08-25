// React
import {createRoot} from 'react-dom/client'
import {
  HashRouter,
  Routes,
  Route} from "react-router-dom";
import React from "react";

// Components
import App from './components/App'

// Routes
import Settings from "./routes/settings";

// entry index.html is managed by webpack via HtmlWebpackPlugin

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <HashRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='settings' element={<Settings />} />
    </Routes>
  </HashRouter>
);
