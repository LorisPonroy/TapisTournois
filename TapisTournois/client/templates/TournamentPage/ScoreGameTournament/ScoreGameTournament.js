import './ScoreGameTournament.html';

import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import ScoreGameTournament from "/imports/classes/Tournament/ScoreGameTournament";
import {Meteor} from "meteor/meteor";
import {Template} from "meteor/templating";
import {ScoreGamePlayerState} from "/imports/classes/PlayerState";
import Tournament from "/imports/classes/Tournament/Tournament";

Template.scoreGameTournament.events({
   "click .js-add-score"(event,instance){
        let score = Number(prompt("Score à ajouter"));
        let playerState = ScoreGamePlayerState.findOne({_id : event.target.dataset.id});
        playerState.scores.push(score);
        playerState.save();
   },
    "click .js-change-table"(event,instance){
       let table = Number(prompt("nouvelle table"));
        let playerState = ScoreGamePlayerState.findOne({_id : event.target.dataset.id});
        playerState.table = table;
        playerState.save();
    }
});

Template.scoreGameTournament.helpers({
    tournament(){
        return ScoreGameTournament.findOne({_id : FlowRouter.getParam("id")});
    },
    OpenModalFunction(){
        return function () {
            Meteor.call("playersNotInTournament",FlowRouter.getParam("id"),function(error, players_ids){
                Blaze.renderWithData(Template.playerSelectorModal, {
                    inArray : players_ids,
                    ninArray : [],
                    actions : [{
                        name : "Inscrire",
                        style : "background-color:green;color:white",
                        action : function(){
                            Meteor.call("insert/player/tournament",Template.instance().data.player._id,FlowRouter.getParam("id"));
                            $('#playerSelectModal').modal('hide');
                        }
                    }]
                }, document.body);
            });
        }
    }
});

Template.tarotPlayerItem.helpers({
    scoreSomme(playerState){
        return playerState.scores.reduce((partialSum, a) => partialSum + a, 0);
    },
})