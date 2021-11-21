import React from "react";
import logo from '../images/logo.png';
import axios from 'axios'

var id_tournament;
var fisrt_player = ""
var topkiller1 = ""
var topkiller2 = ""
var topkiller3 = ""
var topkiller4 = ""
var topkiller5 = "Tomtom"

const loadatas = () => {
  console.log('HELLO WORLD')
  axios.post('http://localhost:4000/lastTournament').then(answer => {
    console.log('HELLO WORLD')
    fisrt_player = 'loris'
    console.log(answer.data)
  });
}

export default function LastTournament(json_answer) {
    return (
      <div className="bgcr">
        <div className="bgcy"><h2>Le Grand Vainqueur :</h2><p>{fisrt_player}</p></div>
        <div>
          <p>Les 5 joueurs ayant éliminer le plus de monde</p>
          <ul>
            <li>{topkiller1}</li>
            <li>{topkiller2}</li>
            <li>{topkiller3}</li>
            <li>{topkiller4}</li>
            <li>{topkiller5}</li>
          </ul>
        </div>
      </div>
    );
  }