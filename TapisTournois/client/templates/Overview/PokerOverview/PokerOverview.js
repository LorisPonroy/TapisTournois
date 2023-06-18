import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import {Template} from "meteor/templating";
const { default: Tournament } = require("/imports/classes/Tournament/Tournament");

import './PokerOverview.html';
import PokerTournament from "/imports/classes/Tournament/PokerTournament";
import PokerEvent from "/imports/classes/PokerEvent";
import _ from "underscore";
import {Meteor} from "meteor/meteor";
import {PokerPlayerState} from "/imports/classes/PlayerState";

Template.pokerOverview.onCreated(function () {
    this.tournamentTime = new ReactiveVar("--:--:--");
    this.isPause = new ReactiveVar(false);
    this.eventDuration = new ReactiveVar("--:--:--");
    this.nextPauseTime = new ReactiveVar("--:--:--");
    this.currentEvent = new ReactiveVar(null);
    this.intervalId = null;
    console.log(PokerPlayerState.find().fetch());
});
let getEventTimeRemaining = ()=>{
    let tournament = PokerTournament.findOne({ _id: FlowRouter.getParam('id') });
    if(!tournament)
        return null;
    let total_duration = 0;
    let event = null;
    let events = PokerEvent.find({ _id: { $in: tournament.event_ids } }, { sort: { _id: { $in: tournament.event_ids } } }).fetch();
    let tournament_events = tournament.event_ids.map(function (eventId) {
        return _.findWhere(events, {_id: eventId});
    });

    for (let i = 0; i < tournament_events.length; i++) {
        const e = tournament_events[i];
        if (total_duration <= tournament.elapsedTimeInSeconds() && total_duration + e.duration > tournament.elapsedTimeInSeconds()) {
            event = e;
            break;
        }
        total_duration += e.duration;
    }
    if(event)
        return total_duration + event.duration - tournament.elapsedTimeInSeconds();
    else
        return total_duration - tournament.elapsedTimeInSeconds();
}

let nextPause = () => {
    let tournament = PokerTournament.findOne({ _id: FlowRouter.getParam('id') });
    if(!tournament)
        return null;
    let total_duration = 0;
    let event = null;
    let t = 0;
    let b = false;
    let events = PokerEvent.find({ _id: { $in: tournament.event_ids } }, { sort: { _id: { $in: tournament.event_ids } } }).fetch();
    let tournament_events = tournament.event_ids.map(function (eventId) {
        return _.findWhere(events, {_id: eventId});
    });
    for (let i = 0; i < tournament_events.length; i++) {
        const e = tournament_events[i];
        if(b){
            if(e.type === 0){
                break;
            }else{
                t += e.duration;
            }
        }else{
            if (total_duration <= tournament.elapsedTimeInSeconds() && total_duration + e.duration > tournament.elapsedTimeInSeconds()) {
                event = e;
                b = true;
            }else{
                total_duration += e.duration;
            }
        }
    }
    let time_remaining_current_event = (total_duration + event.duration - tournament.elapsedTimeInSeconds());
    return t + time_remaining_current_event;
}

let getCurrentEvent = () => {
    let tournament = PokerTournament.findOne({ _id: FlowRouter.getParam('id') });
    if(!tournament)
        return null;
    let total_duration = 0;
    let events = PokerEvent.find({ _id: { $in: tournament.event_ids } }, { sort: { _id: { $in: tournament.event_ids } } }).fetch();
    let tournament_events = tournament.event_ids.map(function (eventId) {
        return _.findWhere(events, {_id: eventId});
    });
    for (let i = 0; i < tournament_events.length; i++) {
        const e = tournament_events[i];
        if (total_duration <= tournament.elapsedTimeInSeconds() && total_duration + e.duration > tournament.elapsedTimeInSeconds()) {
            return e;
        }
        total_duration += e.duration;
    }
    return null;
}

let getNextSmallBlind = (event) => {
    let tournament = PokerTournament.findOne({ _id: FlowRouter.getParam('id') });
    let b = false;
    let events = PokerEvent.find({ _id: { $in: tournament.event_ids } }, { sort: { _id: { $in: tournament.event_ids } } }).fetch();
    let tournament_events = tournament.event_ids.map(function (eventId) {
        return _.findWhere(events, {_id: eventId});
    });
    for (let i = 0; i < tournament_events.length; i++) {
        const e = tournament_events[i];
        if(b && e.type != 0){
            return e.smallBlind;
        }
        if(e._id === event._id){
            b = true;
        }
    }
    return -1;
}

let getNextBigBlind = (event) => {
    let tournament = PokerTournament.findOne({ _id: FlowRouter.getParam('id') });
    let b = false;
    let events = PokerEvent.find({ _id: { $in: tournament.event_ids } }, { sort: { _id: { $in: tournament.event_ids } } }).fetch();
    let tournament_events = tournament.event_ids.map(function (eventId) {
        return _.findWhere(events, {_id: eventId});
    });
    for (let i = 0; i < tournament_events.length; i++) {
        const e = tournament_events[i];
        if(b && e.type != 0){
            return e.bigBlind;
        }
        if(e._id === event._id){
            b = true;
        }
    }
    return -1;
}

let isPause= () => {
    let tournament = PokerTournament.findOne({ _id: FlowRouter.getParam('id') });
    if(!tournament)
        return null;
    let total_duration = 0;
    let events = PokerEvent.find({ _id: { $in: tournament.event_ids } }, { sort: { _id: { $in: tournament.event_ids } } }).fetch();
    let tournament_events = tournament.event_ids.map(function (eventId) {
        return _.findWhere(events, {_id: eventId});
    });
    for (let i = 0; i < tournament_events.length; i++) {
        const e = tournament_events[i];
        if (total_duration <= tournament.elapsedTimeInSeconds() && total_duration + e.duration > tournament.elapsedTimeInSeconds()) {
            return e.type == 0;
        }
        total_duration += e.duration;
    }
    return false;
}
Template.pokerOverview.helpers({
    tournament() {
        return PokerTournament.findOne({ _id: FlowRouter.getParam('id') });
    },
    tables(playerStates) {
        if(!playerStates)
            return null;
        let tables = []
        for (let i = playerStates.length - 1; i >= 0; i--) {
            const ps = playerStates[i];

            if (!tables.includes(ps.table) && ps.status === 2) {
                tables.push(ps.table);
            }
        }
        tables.sort();
        return tables;
    },
    table_players(playerStates, table) {
        if(!playerStates || !table)
            return null;
        let associations = {};
        for (let i = 0; i < playerStates.length; i++) {
            const ps = playerStates[i];
            if(ps.status !== 2){
                continue;
            }
            if (associations[ps.table]) {
                associations[ps.table].push(ps.player.pseudo);
            } else {
                associations[ps.table] = [ps.player.pseudo];
            }
        }
        return associations[table];
    },
    getCurrentEvent(){
        return Template.instance().currentEvent.get();
    },
    getSmallBlind() {
        const event = Template.instance().currentEvent.get();
        if(!event)
            return -1;
        return event.smallBlind;
    },
    getBigBlind() {
        const event = Template.instance().currentEvent.get();
        if(!event)
            return -1;
        return event.bigBlind;
    },
    getNextSmallBlind() {
        const event = Template.instance().currentEvent.get();
        if(!event)
            return -1;
        return getNextSmallBlind(event);
    },
    getNextBigBlind() {
        const event = Template.instance().currentEvent.get();
        if(!event)
            return -1;
        return getNextBigBlind(event);
    },
    eventTime(){
        return Template.instance().eventDuration.get();
    },
    tournamentTime() {
        return Template.instance().tournamentTime.get();
    },
    getEventTimeRemaining() {
        return Template.instance().eventDuration.get();
    },
    isPause(){
        return Template.instance().isPause.get();
    },
    nextPauseTime(){
        return Template.instance().nextPauseTime.get();
    },
    averageStack(playerStates){
        let nbJoueurs = playerStates.filter((ps) => ps.status != 0).length;
        let joueursEnVie = playerStates.filter((ps) => ps.status == 2).length;
        return Math.round((1500 * nbJoueurs) / joueursEnVie);
    },
    totalPot(playerStates){
        return 1500 * playerStates.filter((ps) => ps.status != 0).length;
    },
    totalPlayerNumber(playerStates){
        return playerStates.filter((ps) => ps.status != 0).length;
    },
    livingPlayerNumber(playerStates){
        return playerStates.filter((ps) => ps.status == 2).length;
    }

});

Template.pokerOverview.onRendered(function() {
    const template = this;
    const updateTimer = () => {
        let tournament = Tournament.findOne({_id : FlowRouter.getParam("id")});
        template.tournamentTime.set(tournament.getFormatedTime());
        template.eventDuration.set(new Date(getEventTimeRemaining() * 1000).toISOString().slice(11, 19));
        template.isPause.set(isPause());
        template.nextPauseTime.set(new Date(nextPause() * 1000).toISOString().slice(11, 19));
        template.currentEvent.set(getCurrentEvent());
    };
    updateTimer();
    this.intervalId = (setInterval(updateTimer, 1000));
});

Template.pokerOverview.onDestroyed(function () {
    clearInterval(this.intervalId);
})