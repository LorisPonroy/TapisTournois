import React from 'react'
import logo from '../../logo.png'
import './theme.css'
function NavBar() {

    const [isAdmin, setIsAdmin] = React.useState(false)



    const renderButton = () => {
        return (
            isAdmin ?
                <>
                    <button><p>Liste des tournois</p></button>
                    <button><p>Quitter</p></button>

                </> :
                <>
                    <button><p>Historique des tournois</p></button>
                    <button><p>Espace admin</p></button>
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
