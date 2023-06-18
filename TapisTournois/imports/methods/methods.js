import { Meteor } from 'meteor/meteor';

import {} from "./Poker";
import {} from "./Buvette/Menu";
import {} from "./Buvette/Order";

import ScoreGameTournament from '../classes/Tournament/ScoreGameTournament';
import Tournament, { Tournaments } from '../classes/Tournament/Tournament';
import Player, { Players } from '/imports/classes/Player';
import {PokerPlayerState, ScoreGamePlayerState} from '/imports/classes/PlayerState';
import PokerEvent, { PokerEvents } from '/imports/classes/PokerEvent';
import PokerTournament from '/imports/classes/Tournament/PokerTournament';
import _ from "underscore";


Meteor.methods({
    "insert/tournament"(title, game) {
        switch (game) {
            case "poker":
                let pokTournament = new PokerTournament();
                pokTournament.title = title;
                pokTournament.createdAt = new Date();
                pokTournament.save();
                break;

            case "tarot":
                let tarTournament = new ScoreGameTournament();
                tarTournament.title = title;
                tarTournament.createdAt = new Date();
                tarTournament.save();
                break;

            default:
                break;
        }

    },
    "remove/tournament"(id) {
        Tournaments.remove({ _id: id });
    },
    "insert/player/tournament"(player_id, tournament_id) {
        let tournament = Tournament.findOne({ _id: tournament_id });
        if(tournament.playerState_ids.filter((id)=>{
            return id === player_id;
        }).length > 0){
            return;
        }
        switch (tournament._type) {
            case "PokerTournament":
                let ps = new PokerPlayerState();
                ps.player_id = player_id;
                ps.status = 0;
                ps.save();
                tournament.playerState_ids.push(ps._id);
                tournament.save();
                break;
            case "ScoreGameTournament":
                let gsps = new ScoreGamePlayerState();
                gsps.player_id = player_id;
                gsps.save();
                tournament.playerState_ids.push(gsps._id);
                tournament.save();
            default:
                break;
        }
    },
    "remove/player/tournament"(player_id, tournament_id) {
        let tournament = Tournament.findOne({ _id: tournament_id });
        for (let i = 0; i < tournament.playerStates.length; i++) {
            const state = tournament.playerStates[i];
            if (state.player._id === player_id) {
                tournament.playerStates.splice(i, 1);
            }
        }
        tournament.save();
    },
    "remove/player"(id) {
        Players.remove({ _id: id });
    },
    "playersNotInTournament"(tournament_id){
        const tournament = Tournament.findOne({_id:tournament_id});
        const players_in_tournament_ids = tournament.playerStates().map((ps)=>{return ps.player_id});
        return _.pluck(
            Player.find({_id : {$nin : players_in_tournament_ids}}).fetch(),
            '_id'
        );
    },

});