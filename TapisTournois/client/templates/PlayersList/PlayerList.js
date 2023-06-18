import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {ReactiveDict} from "meteor/reactive-dict";
import Player from "/imports/classes/Player";

import './PlayersList.html';

Template.playersList.onCreated(function() {
    this.searchQuery = new ReactiveVar('');
    this.pageNumber = new ReactiveVar(1);
    this.loaded = new ReactiveVar(false);
    const self = this;
    this.autorun(function () {
        const searchQuery = self.searchQuery.get();
        const playerPage = self.pageNumber.get();
        const handle = self.subscribe('players', {
            searchQuery : searchQuery,
            pageNumber : 1  ,
            docsPerPage : 8
        });
        self.loaded.set(handle.ready());
    });
});

Template.playersList.events({
    'keyup #js-filter-players'(event,instance){
        const searchQuery = event.currentTarget.value.trim();
        instance.searchQuery.set(searchQuery);
        /*FlowRouter.setQueryParams({
            searchQuery: event.currentTarget.value.trim(),
        });
        console.log("Coucou, set params");*/
    },
    'click .js-add-player'(){

    }
});

Template.playersList.helpers({
    OpenModalFunction() {
        return function () {
            Blaze.renderWithData(Template.playerFormModal, {player : undefined}, document.body);
        };
    },
    players() {
        return Player.find().fetch();
    },
    pageNumber(){
        return Template.instance().pageNumber;
    },
    playerActions(){
        return [
            {
                name : "Editer",
                style : "background-color:var(--color-edit);color:white",
                action : function(){
                    Blaze.renderWithData(Template.playerFormModal, {player : Template.instance().data.player}, document.body);
                }
            },
            {
                name : "Supprimer",
                style : "background-color:var(--color-warning);color:white",
                action : function(){
                    let conf = confirm("Supprimer le joueur " + Template.instance().data.player.pseudo + " ?");
                    if (conf)
                        Meteor.call("remove/player", Template.instance().data.player._id);
                }
            }
        ]
    }
});