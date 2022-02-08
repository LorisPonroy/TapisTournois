import React from 'react'
import logo from '../../images/logo.png'
import '../../index.css'
import axios from 'axios'
function NavBar() {

    const [isAdmin, setIsAdmin] = React.useState(false)

    const logme = () => {
        let pass = window.prompt("Send your password ...")
        if(pass){
            /**
             * Send request
             */
            console.log('Requete AUTH')
            axios.post('http://localhost:4000/connection',{password : pass}).then(answer => {
                console.log(answer.data)
                setIsAdmin(answer.data)
            });
        } 

    }

    const logout = () => {
        setIsAdmin(false)
    }

    const renderButton = () => {
        return (
            isAdmin ?
                <>
                    <button><p>Liste des tournois</p></button>
                    <button onClick={() => logout()}><p>Quitter</p></button>

                </> :
                <>
                    <button><p>Historique des tournois</p></button>
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
