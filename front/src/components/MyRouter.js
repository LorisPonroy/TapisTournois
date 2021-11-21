import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
function MyRouter() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<></>} />
            </Routes>
        </Router>
    )
}

export default MyRouter
