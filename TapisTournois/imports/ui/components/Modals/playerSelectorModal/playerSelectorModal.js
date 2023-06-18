import {Template} from "meteor/templating";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";

import './playerSelectorModal.html';
import Player from "/imports/classes/Player";
import Tournament from "/imports/classes/Tournament/Tournament";

Template.playerSelectorModal.onCreated(function(){
    this.searchQuery = new ReactiveVar('');
    let self = this;
    this.autorun(() => {
        const searchQuery = self.searchQuery.get();
        self.subscribe('players', {
            searchQuery: searchQuery,
            notInTournamentId : FlowRouter.getParam("id"),
        });
    });
});

Template.playerSelectorModal.onRendered(function () {
    let modal = $('#playerSelectModal');
    modal.modal('show');
    const self = this;
    modal.on('hidden.bs.modal', function () {
        Blaze.remove(self.view);
    });
});

Template.playerSelectorModal.events({
    'submit .js-select-player'(event, instance) {
        event.preventDefault();
    },
    'keyup #js-filter-players'(event,instance){
        const searchQuery = event.currentTarget.value.trim();
        instance.searchQuery.set(searchQuery);
    }
});

Template.playerSelectorModal.helpers({
    playerActions(){
        return Template.instance().data.actions;
    },
    players(){
        const inArray = Template.instance().data.inArray;
        const ninArray = Template.instance().data.ninArray;
        if(inArray.length>0 && ninArray.length>0){
            return Player.find({
                _id : {$and : {
                        $in : inArray,
                        $nin : ninArray
                    }},}).fetch();
        }else if(inArray.length>0){
            return Player.find({_id : {$in : inArray}}).fetch();
        }else if(ninArray.length>0){
            return Player.find({_id : {$nin : ninArray}}).fetch();
        }else{
            return Player.find().fetch();
        }
    }
});

Template.playerSelectorModal.onDestroyed(function () {
    console.log("destroyed");
})