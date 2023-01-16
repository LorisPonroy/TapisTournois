import { FlowRouter } from "meteor/ostrio:flow-router-extra";
const { Players } = require("/imports/classes/Player");
const { PlayerStatus } = require("/imports/classes/PlayerStatus");
const { PokerEventType } = require("/imports/classes/PokerEvent");
const { default: Tournament } = require("/imports/classes/Tournament");

Template.pokerTournament.helpers({
    tournament() {
        return Tournament.findOne({ _id: FlowRouter.getParam('id') });
    },
    allPlayers() {
        return Players.find().fetch();
    },
    getFormatedTime(time) {
        return new Date(time * 1000).toISOString().slice(11, 19);
    },
});

Template.pokerPlayerItem.helpers({
    status(ps) {
        return PlayerStatus.getIdentifier(ps);
    },
    statusIsChecking(ps) {
        return ps === 0;
    }
});

Template.pokerEventItem.helpers({
    getTypeName(typeNumber) {
        return PokerEventType.getIdentifier(typeNumber);
    },
    // return the time elapsed since the beginning of the event if it's the current event else return ✔️ if event is passed, else X
    isCurrentEvent(tournament, event) {
        let total_duration = 0;
        for (let i = 0; i < tournament.events.length; i++) {
            const e = tournament.events[i];
            if (event._id == e._id) {
                if (total_duration < tournament.time && total_duration + event.duration > tournament.time) {
                    return new Date((tournament.time - total_duration) * 1000).toISOString().slice(11, 19);
                } else if (total_duration + event.duration > tournament.time) {
                    return "X";
                } else {
                    return "✔️"
                }
            }
            total_duration += e.duration;
        }
        return "Error";
    },
    getFormatedTime(time) {
        return new Date(time * 1000).toISOString().slice(11, 19);
    },
})