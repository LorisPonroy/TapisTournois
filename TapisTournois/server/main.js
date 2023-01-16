import { Meteor } from 'meteor/meteor';
import { started_tournaments } from "../imports/methods/methods"
import { PokerEvents } from '/imports/classes/PokerEvent';
import Tournament, { Tournaments } from '/imports/classes/Tournament';

Meteor.startup(() => {
    Meteor.setInterval(() => {
        for (const id in started_tournaments) {
            let tournament = Tournament.findOne({ _id: id });
            tournament.time = tournament.time + 1;
            tournament.save();
        }
    }, 1000);
});