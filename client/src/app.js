import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/layout";
import Home from "./pages/home";
import Profile from "./pages/profile";
import React from "react";
import New from "./pages/new";
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/new" element={<New />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
