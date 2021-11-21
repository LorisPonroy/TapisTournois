import React from 'react'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import ListTournois from './components/ListsTournois/ListTournois';
function MyRouter() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<></>} />
                <Route exact path="/listTournoi" element={<ListTournois/>} />
            </Routes>
        </Router>
    )
}

export default MyRouter
