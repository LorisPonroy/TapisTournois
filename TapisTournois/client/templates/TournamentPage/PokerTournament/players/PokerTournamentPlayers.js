import {Template} from "meteor/templating";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import _ from 'underscore';
import PokerTournament from "/imports/classes/Tournament/PokerTournament";
import Player from "/imports/classes/Player";

import './PokerTournamentPlayers.html';
import {Meteor} from "meteor/meteor";
import Tournament from "/imports/classes/Tournament/Tournament";
import PlayerState from "/imports/classes/PlayerState";



Template.pokerPlayersSubPage.events({
    'keyup #js-filter-players'(event,instance){
        const searchQuery = event.currentTarget.value.trim();
        instance.searchQuery.set(searchQuery);
    },
    'click .js-register-player'(){

    }
});
Template.pokerPlayersSubPage.onCreated(function() {
    this.searchQuery = new ReactiveVar('');
    this.loaded = new ReactiveVar(true);
    this.pageNumber = new ReactiveVar(1);
});

Template.pokerPlayersSubPage.helpers({
    tournament(){
        return PokerTournament.findOne({_id : FlowRouter.getParam("id")});
    },
    notLoaded(){
        return !Template.instance().loaded.get();
    },
    notInTournamentPlayers(){
        let tournament_id = FlowRouter.getParam("id");
        let tournament = PokerTournament.findOne({_id : tournament_id});
        if(!tournament)
            return [];
        let res = [];
        tournament.playerStates().forEach(p => {
            res.push(p.player()._id);
        });
        return Player.find({_id : {$nin : res}}).fetch();
    },
    actionsForChekinPlayers(){
        return [
            {
                name : "Check In",
                style : "background-color:var(--color-success);color:white",
                action : function(){
                    Template.instance().data.pokerPS.checkin();
                }
            }
        ]
    },
    actionsForPlayingPlayers(){
        return [
            {
                name : "Changer de table",
                style : "background-color:var(--color-edit);color:white",
                action : function(){
                    let table = Number(prompt('Numero de table ?'));
                    Template.instance().data.pokerPS.move(table);
                }
            },
            {
                name : "Tuer",
                style : "background-color:var(--color-warning);color:white",
                action : function(){
                    Template.instance().data.pokerPS.kill();
                }
            },
        ]
    },
    actionsForDeadPlayers(){
        return [
            {
                name : "Réssusiter",
                style : "background-color:var(--color-warning);color:white",
                action : function(){
                    Template.instance().data.pokerPS.resurrect();
                }
            },
            {
                name : "Supprimer",
                style : "background-color:var(--color-warning);color:white",
                action : function(){
                    if(confirm("Supprimer totalement le joueur du tournoi ?")){
                        let ps = Template.instance().data.pokerPS;
                        let tournament = Tournament.findOne({_id : FlowRouter.getParam("id")});
                        tournament.playerState_ids.splice(tournament.playerState_ids.indexOf(ps._id),1);
                        tournament.save();
                        ps.remove();
                    }
                }
            },
        ]
    },
    players(){
        return PlayerState.find({}).fetch();
    },
    statusIsEgals(ps,status){
        return ps.status === status;
    },
    pageNumber(){
        return Template.instance().pageNumber;
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