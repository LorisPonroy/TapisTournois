import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import Player from "/imports/classes/Player";
import PokerTournament from "/imports/classes/PokerTournament";
const { default: Tournament } = require("/imports/classes/Tournament");

Template.Layout.helpers({

});

Template.tournamentsList.helpers({
    tournaments() {
        return PokerTournament.find().fetch();
    }
});