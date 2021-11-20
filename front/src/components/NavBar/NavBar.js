import React from 'react'
import logo from '../../logo.png'
import './theme.css'
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


    return (
        <div className="backNav">
            <img id='LogoTapis' src={logo} />
            <h1>Tapis tournois</h1>

            <div className="grpButtonNavBar">
                {renderButton()}

            </div>

        </div>
    )
}

export default NavBar
