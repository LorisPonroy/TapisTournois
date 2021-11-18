import React from "react";
import logo from '../logo.png';

export default function LastTournament() {
    return (
      <div className="bgcr">
        <div className="bgcy"><h2>Le Grand Vainqueur :</h2><p>Joueur</p></div>
        <div>
          <p>Les 5 joueurs ayant éliminer le plus de monde</p>
          <ul>
            <li>Joueur 1</li>
            <li>Joueur 2</li>
            <li>Joueur 3</li>
            <li>Joueur 4</li>
            <li>Joueur 5</li>
          </ul>
        </div>
        <img src={logo}></img>
      </div>
    );
  }