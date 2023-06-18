import Tournament from "/imports/classes/Tournament/Tournament";
import PokerEvent, {PokerEvents} from "/imports/classes/PokerEvent";

Meteor.methods({
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
            if (event._id === id_event) {
                tournament.events.splice(i, 1);
            }
        }
        tournament.save();
        PokerEvents.remove({ _id: id_event });
    },
    "poker/shuffleTables"(tournament_id, nbTables) {
        let tournament = Tournament.findOne({ _id: tournament_id });
        let players = tournament.playerStates().filter((ps) => {
            return ps.status === 2;
        });
        players = players.sort(() => Math.random() - 0.5);
        let i = 0;
        players.forEach((ps)=>{
            ps.table = (i % nbTables)+1;
            ps.save();
            i++;
        })
        tournament.save();
    },
    "up/event"(id_event, tournament_id) {
        let tournament = Tournament.findOne({ _id: tournament_id });
        for (let i = 1; i < tournament.events.length; i++) {
            const event = tournament.events[i];
            if (event._id === id_event) {
                let temp = tournament.events[i - 1];
                tournament.events[i - 1] = tournament.events[i];
                tournament.events[i] = temp;
            }
        }
        tournament.save();
    },
    "down/event"(id_event, tournament_id) {
        let tournament = Tournament.findOne({ _id: tournament_id });
        for (let i = 0; i < tournament.events.length - 1; i++) {
            const event = tournament.events[i];
            if (event._id === id_event) {
                let temp = tournament.events[i + 1];
                tournament.events[i + 1] = tournament.events[i];
                tournament.events[i] = temp;
                break;
            }
        }
        tournament.save();
    },
    "delete/table"(tournament_id,table_number){
        let tournament = Tournament.findOne({ _id: tournament_id });
        let players = tournament.playerStates().filter((ps) => {
            return ps.status === 2 && ps.table == table_number;
        });
        let tables = [];
        tournament.playerStates().filter((ps) => {
            return ps.status === 2;
        }).forEach((ps)=>{
            tables.push(ps.table);
        });
        let nbTables = [...new Set(tables)].length;
        let t = 0;
        players.forEach((ps)=>{
            ps.table = (t % (nbTables-1))+1;
            ps.save()
            t++;
        })
        tournament.save();
    },
});
