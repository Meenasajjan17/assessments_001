import React from "react";
import "./styles/App.css";
import Header from "./components/Header";
import Rewards from "./components/Rewards";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Header />
      <div className='container-fluid'>
        <Rewards />
      </div>
      <Footer />
    </>
  );
}

export default App;
