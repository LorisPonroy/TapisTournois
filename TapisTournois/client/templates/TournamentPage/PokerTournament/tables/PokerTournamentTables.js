import './PokerTournamentTables.html';
import {Template} from "meteor/templating";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import PokerTournament from "/imports/classes/Tournament/PokerTournament";
import {Meteor} from "meteor/meteor";
import PlayerState from "/imports/classes/PlayerState";
import _ from "underscore";
Template.pokerTablesSubPage.onCreated(function() {
    this.pageNumber = new ReactiveVar(1);
    this.loaded = new ReactiveVar(true);
});

Template.pokerTablesSubPage.events({
    'click .js-shuffle-tables'(event, instance) {
        let tournament_id = FlowRouter.getParam("id");
        let nbTables = prompt("Nombre de tables ?",1);
        Meteor.call("poker/shuffleTables", tournament_id, nbTables);
    }
});

Template.pokerTablePlayerItem.events({
    'click .js-move-player'(event, instance) {
        const table = Number(prompt("Entrer le numéro de table"));
        if(table>0){
            instance.data.playerState.move(table);
        }
    },
});

Template.pokerTable.events({
    'click .js-delete-table'(event,instance){
        let table_number = event.target.value;
        let tournament_id = FlowRouter.getParam("id");
        Meteor.call("delete/table", tournament_id, table_number);
    }
})

Template.pokerTablesSubPage.helpers({
    tablePage(){
        return Template.instance().pageNumber;
    },
    tournament(){
        return PokerTournament.findOne({_id : FlowRouter.getParam("id")});
    },
    loaded(){
        return Template.instance().loaded.get();
    },
    allTablesNums() {
        let tournament_id = FlowRouter.getParam("id");
        let tournament = PokerTournament.findOne({_id : tournament_id});
        if(!tournament)
            return [];
        let res = [];
        tournament.playerStates().forEach(p => {
            if(p.status === 2 && !res.includes(p.table))
                res.push(p.table);
        });
        return res.sort();
    }
});

Template.pokerTable.helpers({
    playerOfTable(tableNumber){
        let tournament = PokerTournament.findOne({_id : FlowRouter.getParam("id")});
        let res = [];
        tournament.playerStates().forEach(p => {
            if(p.table === tableNumber && p.status === 2)
                res.push(p);
        });
        return res;
    }
});