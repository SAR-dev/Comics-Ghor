import React from 'react';
import MainROuter from './MainRouter';
import { BrowserRouter } from 'react-router-dom';

const App = () => (
  <BrowserRouter>
    <MainROuter />
  </BrowserRouter>
);

export default App;
