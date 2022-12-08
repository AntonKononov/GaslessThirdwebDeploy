import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import PagesRoutes from "./routes";
import Header from "./components/Header";

const App = () => {
  return (
    <Router>
      <Header />
      <PagesRoutes />
    </Router>
  );
};

export default App;
