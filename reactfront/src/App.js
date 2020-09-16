import React from 'react';
import MainROuter from './MainRouter';
import { BrowserRouter } from 'react-router-dom';
import "core-js/stable";
import "regenerator-runtime/runtime";

const App = () => (
  <BrowserRouter>
    <MainROuter />
  </BrowserRouter>
);

export default App;
