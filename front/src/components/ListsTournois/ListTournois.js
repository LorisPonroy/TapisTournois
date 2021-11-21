import axios from 'axios'
import React from 'react'
import LigneTournoi from './LigneTournoi'

function ListTournois() {

    const [ListTournois,setListTournois] = React.useState([])
    const [requestLaunch,setRequestLaunch] = React.useState(false)
    React.useEffect(() => {
        if(!requestLaunch){
            setRequestLaunch(true)
            axios.get('http://localhost:4000/historique').then(response => {
            console.log("Response : ",response.data)   
            let res = []
            for(let i = 0 ; i < 40 ; i++){
                res.push(response.data[0])
            } 
            setListTournois(res)})
        }

    })

    const renderListTournois = () => {
        return ListTournois.map((tournoi,index) => {
            return <LigneTournoi key={index} data={tournoi}/>
        })
    }

    return (
        <div className='ListLigneContainer'>
            {renderListTournois()}
        </div>
    )
}

export default ListTournois
