import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import {Template} from "meteor/templating";
const { default: Tournament } = require("/imports/classes/Tournament/Tournament");

import './PokerTournamentHome.html';


Template.pokerHomeSubPage.events({
    'click .js-start-tournament'(event, instance) {
        let tournament = Tournament.findOne({_id : FlowRouter.getParam("id")});
        if(tournament.isStarted){
            tournament.stop();
        }else{
            tournament.start();
        }
    },
    'click .js-set-timer'(event, instance) {
        if(confirm("Reset le timer du tournoi ?")){
            let tournament = Tournament.findOne({_id : FlowRouter.getParam("id")});
            tournament.startedDate = new Date();
            tournament.additionalTime = 0;
            tournament.stop();
        }
    },
});

Template.pokerHomeSubPage.onCreated(function() {
    this.tournamentTime = new ReactiveVar("__:__:__");
});

Template.pokerHomeSubPage.onRendered(function() {
    const template = this;
    const updateTimer = () => {
        let tournament = Tournament.findOne({_id : FlowRouter.getParam("id")});
        if(tournament) {
            template.tournamentTime.set(tournament.getFormatedTime());
        }
    };
    // Appelez la fonction pour la première fois
    updateTimer();
    // Mettez à jour le temps restant toutes les secondes
    setInterval(updateTimer, 1000);
});

Template.pokerHomeSubPage.helpers({
    tournament(){
        return Tournament.findOne({_id : FlowRouter.getParam("id")});
    },
    tournamentTime(){
        return Template.instance().tournamentTime.get();
    },
});

