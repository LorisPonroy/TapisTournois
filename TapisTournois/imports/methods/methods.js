import { Meteor } from 'meteor/meteor';
import Tournament, { Tournaments } from '../classes/Tournament';
import Player, { Players } from '/imports/classes/Player';
import { PokerPlayerState } from '/imports/classes/PlayerState';
import PokerEvent, { PokerEvents } from '/imports/classes/PokerEvent';
import PokerTournament from '/imports/classes/PokerTournament';

export let started_tournaments = {};

export default Meteor.methods({
    "insert/tournament"(title, game) {
        switch (game) {
            case "poker":
                let tournament = new PokerTournament();
                tournament.title = title;
                tournament.createdAt = new Date();
                tournament.save();
                break;

            default:
                break;
        }

    },
    "remove/tournament"(id) {
        Tournaments.remove({ _id: id });
    },
    "insert/player/tournament"(player_id, tournament_id) {
        let player = Player.findOne({ _id: player_id });
        let tournament = Tournament.findOne({ _id: tournament_id });
        let exit = false;
        tournament.playerStates.forEach(state => {
            if (state.player._id == player_id) {
                exit = true;
            }
        });
        if (exit) return;

        switch (tournament._type) {
            case "PokerTournament":
                let ps = new PokerPlayerState();
                ps.player = player;
                ps.status = 0;
                ps.save();
                tournament.playerStates.push(ps);
                tournament.save();
                break;

            default:
                break;
        }
    },
    "remove/player/tournament"(player_id, tournament_id) {
        let tournament = Tournament.findOne({ _id: tournament_id });
        for (let i = 0; i < tournament.playerStates.length; i++) {
            const state = tournament.playerStates[i];
            if (state.player._id == player_id) {
                tournament.playerStates.splice(i, 1);
            }
        }
        tournament.save();
    },
    "insert/event/tournament"(tournament_id, type, duration, smallBlind, bigBlind) {
        let tournament = Tournament.findOne({ _id: tournament_id });

        let event = new PokerEvent();
        event.type = type;
        event.duration = duration;
        event.smallBlind = smallBlind;
        event.bigBlind = bigBlind;
        event.save();

        tournament.events.push(event);
        tournament.save();
    },
    "remove/event/tournament"(id_event, tournament_id) {
        let tournament = Tournament.findOne({ _id: tournament_id });
        for (let i = 0; i < tournament.events.length; i++) {
            const event = tournament.events[i];
            if (event._id == id_event) {
                tournament.events.splice(i, 1);
            }
        }
        tournament.save();
        PokerEvents.remove({ _id: id_event });
    },
    "start/tournament"(id) {
        let tournament = Tournament.findOne({ _id: id });

        if (tournament.isStarted())
            return;

        started_tournaments[tournament._id] = tournament._id;
        tournament.save();

    },
    "stop/tournament"(id) {

        let tournament = Tournament.findOne({ _id: id });
        delete started_tournaments[tournament._id];
        tournament.save();

    },
    "remove/player"(id) {
        Players.remove({ _id: id });
    },
    "poker/checkin"(player_id, tournament_id) {
        let tournament = Tournament.findOne({ _id: tournament_id });

        for (let i = 0; i < tournament.playerStates.length; i++) {
            const ps = tournament.playerStates[i];
            if (ps.player._id == player_id) {
                ps.status = 2;
            }
        }
        tournament.save();
    },
    "poker/checkoff"(player_id, tournament_id) {
        let tournament = Tournament.findOne({ _id: tournament_id });

        for (let i = 0; i < tournament.playerStates.length; i++) {
            const ps = tournament.playerStates[i];
            if (ps.player._id == player_id) {
                ps.status = 0;
                ps.table = -1;
            }
        }
        tournament.save();
    },
    "poker/kill"(player_id, tournament_id) {
        let tournament = Tournament.findOne({ _id: tournament_id });

        for (let i = 0; i < tournament.playerStates.length; i++) {
            const ps = tournament.playerStates[i];
            if (ps.player._id == player_id) {
                ps.status = 1;
                ps.table = -1;
            }
        }
        tournament.save();
    },
    "poker/shuffleTables/byTables"(tournament_id, nbTables) {
        let tournament = Tournament.findOne({ _id: tournament_id });
        console.log(tournament.playerStates);
        let players = tournament.playerStates.filter((ps) => {
            return ps.status == 2;
        });
        players = players.sort(() => Math.random() - 0.5);
        let teamSize = Math.floor(players.length / nbTables) + 1; // calcule la taille de chaque équipe
        let teams = [];
        for (let i = 0; i < nbTables; i++) {
            teams[i] = players.slice(i * teamSize, (i + 1) * teamSize);
            teams[i].forEach(ps => {
                ps.table = i + 1;
            });
        }
        tournament.save();
    },
    "up/event"(id_event, tournament_id) {
        let tournament = Tournament.findOne({ _id: tournament_id });
        for (let i = 1; i < tournament.events.length; i++) {
            const event = tournament.events[i];
            if (event._id == id_event) {
                let temp = tournament.events[i - 1];
                tournament.events[i - 1] = tournament.events[i];
                tournament.events[i] = temp;
            }
        }
        tournament.save();
    },
    "down/event"(id_event, tournament_id) {
        console.log("down");
        let tournament = Tournament.findOne({ _id: tournament_id });
        for (let i = 0; i < tournament.events.length - 1; i++) {
            const event = tournament.events[i];
            if (event._id == id_event) {
                let temp = tournament.events[i + 1];
                tournament.events[i + 1] = tournament.events[i];
                tournament.events[i] = temp;
                break;
            }
        }
        tournament.save();
    },
    "move/player"(tournament_id, player_id, table) {
        console.log("down");
        let tournament = Tournament.findOne({ _id: tournament_id });
        for (let i = 0; i < tournament.playerStates.length; i++) {
            const ps = tournament.playerStates[i];
            if (ps.player._id == player_id) {
                ps.table = table;
            }
        }
        tournament.save();
    },

});
