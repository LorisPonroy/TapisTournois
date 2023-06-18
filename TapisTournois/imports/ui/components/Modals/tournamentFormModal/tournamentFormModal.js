import {Template} from "meteor/templating";
import Player from "/imports/classes/Player";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";

import './tournamentFormModal.html';
import Tournament from "/imports/classes/Tournament/Tournament";
import PokerTournament from "/imports/classes/Tournament/PokerTournament";
import ScoreGameTournament from "/imports/classes/Tournament/ScoreGameTournament";

Template.tournamentFormModal.onRendered(function () {
    $('#tournamentFormModal').modal('show');
    $('#tournamentFormModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
});

Template.tournamentFormModal.events({
    'submit .js-add-tournament'(event, instance) {
        event.preventDefault();
        let title = event.target.title.value;
        let tournament = Template.instance().data.tournament;
        if(!tournament){
            switch (event.target.game.value) {
                case "poker":
                    tournament = new PokerTournament();
                    break;
                case "tarot":
                    tournament = new ScoreGameTournament();
                    break;
                default:
                    break;
            }
            tournament.createdAt = new Date();
        }
        tournament.title = title;
        tournament.save();
    },
});