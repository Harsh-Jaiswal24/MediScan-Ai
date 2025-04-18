import React from 'react'
import Nav from './components/Nav'
import Router from './utils/Router'
import Footer from './components/Footer'
import Home from './components/Home'

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <div className="flex-grow">
        <Router />
      </div>
      <Footer />
    </div>
  )
}

export default App
