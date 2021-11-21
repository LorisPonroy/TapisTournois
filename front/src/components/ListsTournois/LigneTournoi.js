import React from 'react'
import './theme.css'
import trophee from '../../images/trophee.png'

function LigneTournoi(props) {
    return (
        <div className="lineContainer">
            <img className="imgTrophee" src={trophee}/>
            <p>Bobby du 53</p>
            <p>{props.data.name}</p>
            <p>{new Date(props.data.start_date).toString().substring(0, 15)
            }</p>
        </div>
    )
}

export default LigneTournoi
