import React from 'react'
import logo from '../../logo.png'
import './theme.css'
import axios from 'axios'
function NavBar() {

    const [isAdmin, setIsAdmin] = React.useState(false)

    const redirecTo = (someUrl) => {
        window.location.href = someUrl;
    }

    const logme = () => {
        let pass = window.prompt("Send your password ...")
        if(pass){
            /**
             * Send request
             */
            axios.post('http://localhost:4000/connection',{password : pass})
                .then(setIsAdmin(true))
        } 

    }

    const renderButton = () => {
        return (
            isAdmin ?
                <>
                    <button onClick={() => redirecTo("/ListeTournoi")}><p>Liste des tournois</p></button>
                    <button><p>Quitter</p></button>

                </> :
                <>
                    <button onClick={() => redirecTo("/ListeTournoi")}><p>Historique des tournois</p></button>
                    <button onClick={() => logme()}><p>Espace admin</p></button>
                </>

        )

    }


    const checkIsLogged  = () => {
        axios.get("http://localhost:4000/islogged").then(response => console.log('Is logged response : ',response))
    }

    return (
        <div className="backNav">
            <img id='LogoTapis' src={logo} />
            <h1>Tapis tournois</h1>

            <div className="grpButtonNavBar">
                {renderButton()}
            </div>

            <button onClick={() => checkIsLogged()}>isLogged</button>

        </div>
    )
}

export default NavBar
