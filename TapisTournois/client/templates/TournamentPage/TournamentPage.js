import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import Tournament from "/imports/classes/Tournament/Tournament";
import PokerTournament from "/imports/classes/Tournament/PokerTournament";
import ScoreGameTournament from "/imports/classes/Tournament/ScoreGameTournament";

import './TournamentPage.html';

Template.tournament.helpers({
    tournament() {
        return Tournament.findOne({ _id: FlowRouter.getParam('id') });
    },
    tournamentIsPoker() {
        return Tournament.findOne({ _id: FlowRouter.getParam('id') }) instanceof PokerTournament;
    },
    tournamentIsTarot() {
        return Tournament.findOne({ _id: FlowRouter.getParam('id') }) instanceof ScoreGameTournament;
    }
});