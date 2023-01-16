import { FlowRouter } from "meteor/ostrio:flow-router-extra";
const { default: Tournament } = require("/imports/classes/Tournament");

Template.pokerOverview.helpers({
    tournament() {
        return Tournament.findOne({ _id: FlowRouter.getParam('id') });
    },
    getFormatedTime(time) {
        return new Date(time * 1000).toISOString().slice(11, 19);
    },
    tables(playerStates) {
        let tables = []
        for (let i = playerStates.length - 1; i >= 0; i--) {
            const ps = playerStates[i];

            if (!tables.includes(ps.table)) {
                tables.push(ps.table);
            }
        }

        return tables;
    },
    table_players(playerStates, table) {
        let associations = {};
        for (let i = 0; i < playerStates.length; i++) {
            const ps = playerStates[i];
            if (associations[ps.table]) {
                associations[ps.table].push(ps.player.pseudo);
            } else {
                associations[ps.table] = [ps.player.pseudo];
            }
        }

        return associations[table];
    },
    getCurrentEvent(tournament) {
        let total_duration = 0;
        for (let i = 0; i < tournament.events.length; i++) {
            const e = tournament.events[i];
            if (total_duration <= tournament.time && total_duration + e.duration > tournament.time) {
                return e;
            }
            total_duration += e.duration;
        }
        return null;
    },
    getSmallBlind(event) {
        return event.smallBlind;
    },
    getBigBlind(event) {
        return event.bigBlind;
    },
    getEventTimeRemaining(tournament) {
        let total_duration = 0;
        let event = null;
        for (let i = 0; i < tournament.events.length; i++) {
            const e = tournament.events[i];
            if (total_duration <= tournament.time && total_duration + e.duration > tournament.time) {
                event = e;
                break;
            }
            total_duration += e.duration;
        }

        return new Date((total_duration + event.duration - tournament.time) * 1000).toISOString().slice(11, 19);
    },
    isPause(tournament) {
        let total_duration = 0;
        for (let i = 0; i < tournament.events.length; i++) {
            const e = tournament.events[i];
            if (total_duration <= tournament.time && total_duration + e.duration > tournament.time) {
                return e.type == 0;
            }
            total_duration += e.duration;
        }
        return false;
    }
});