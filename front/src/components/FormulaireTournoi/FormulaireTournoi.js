import React from 'react'

function FormulaireTournoi() {

    const [listUser, setListUser] = React.useState([])
    const [newUserName, setNewUserName] = React.useState({name:""})

    const renderListJoueur = () => {
        return listUser.map((user, index) => {
            return <li key={index}>{user.name}
            <button onClick={() => setListUser(listUser.filter(auser => auser.tempId != user.tempId))}>X</button></li>
        })
    }
    return (
        <div className="formulaireTournoi">
            <input type={"number"} placeholder={"Nombre de table"} />
            <input type={"number"} placeholder={"Stack de départ"} />
            <button>submit</button>

            <input type="text"
                value={newUserName.name}
                onChange={e => setNewUserName({name:e.target.value, tempId:new Date()})}
                placeholder="nom joueur" />

            <button onClick={() => {setListUser([...listUser, {name: newUserName.name,tempId : newUserName.tempId}]); setNewUserName({name:"",tempId:new Date()})}}>Ajouter joueur</button>
            <ul>
                {renderListJoueur()}
            </ul>

        </div>
    )
}

export default FormulaireTournoi
