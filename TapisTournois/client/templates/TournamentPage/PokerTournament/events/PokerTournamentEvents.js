import './PokerTournamentEvents.html';
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import {Template} from "meteor/templating";
import PokerEvent, {PokerEventType} from "/imports/classes/PokerEvent";
import Tournament from "/imports/classes/Tournament/Tournament";

import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';
import PokerTournament from "/imports/classes/Tournament/PokerTournament";

Template.pokerEventsSubPage.onRendered(function () {
    this.$('.pokerEventsContainer').sortable();
})

Template.pokerEventsSubPage.helpers({
    tournament(){
        return PokerTournament.findOne({_id : FlowRouter.getParam("id")});
    },
    events(){
        let tournament = Tournament.findOne({ _id: FlowRouter.getParam("id") });
        let events = PokerEvent.find({ _id: { $in: tournament.event_ids } }, { sort: { _id: { $in: tournament.event_ids } } }).fetch();
        return tournament.event_ids.map(function (eventId) {
            return _.findWhere(events, {_id: eventId});
        });
    },
})

Template.pokerEventsSubPage.events({
    'sortupdate .pokerEventsContainer'(event, template) {
        const eventIds = template.$('.pokerEventsContainer > div').map((index, elem) => $(elem).attr('data-id')).toArray();
        const tournament = PokerTournament.findOne({_id : FlowRouter.getParam("id")});
        tournament.event_ids = eventIds;
        tournament.save();
    },
    'click .js-remove-event-from-tournament'(event, instance) {
        let event_id = event.target.value;
        let tournament = Tournament.findOne( {_id : FlowRouter.getParam("id")});
        tournament.event_ids.splice(tournament.event_ids.indexOf(event_id),1);
        tournament.save();
        let pe = PokerEvent.findOne({_id : event_id});
        pe.remove();

    },
    'click .js-add-event'(){
        Blaze.renderWithData(Template.pokerEventFormModal, {event : undefined}, document.body);
    },
    'click .js-edit-event'(e,instance){
        console.log(e.currentTarget.value);
        let event = PokerEvent.findOne({_id:e.currentTarget.value});
        console.log(event);
        Blaze.renderWithData(Template.pokerEventFormModal, {event : event}, document.body);
    }
});
let isCurrentEvent = (event) => {
    if(!event)
        return;
    let tournament = Tournament.findOne({_id : FlowRouter.getParam("id")});
    let total_duration = 0;
    for (let i = 0; i < tournament.event_ids.length; i++) {
        const e = PokerEvent.findOne({_id : tournament.event_ids[i]});
        if (event._id === e._id) {
            if (total_duration < tournament.elapsedTimeInSeconds() && total_duration + event.duration > tournament.elapsedTimeInSeconds()) {
                return {
                    time : new Date((tournament.elapsedTimeInSeconds() - total_duration) * 1000).toISOString().slice(11, 19),
                    class : "current"
                };
            } else if (total_duration + event.duration > tournament.elapsedTimeInSeconds()) {
                return {
                    class: "notPassed",
                    time : "--:--:--"
                };
            } else {
                return {
                    class: "passed",
                    time : new Date((e.duration) * 1000).toISOString().slice(11, 19),
                };
            }
        }
        total_duration += e.duration;
    }
    return undefined;
}

Template.pokerEventItem.onCreated(function () {
    this.eventTime = new ReactiveVar("__:__:__");
    this.eventClass = new ReactiveVar("notPassed");
    this.intervalId = null;
})
Template.pokerEventItem.onRendered(function () {
    const template = this;
    const updateTimer = () => {
        let event = template.data.event;
        if(event) {
            const ice = isCurrentEvent(event);
            template.eventTime.set(ice["time"]);
            template.eventClass.set(ice["class"]);
        }
    };
    updateTimer();
    this.intervalId = setInterval(updateTimer, 1000);
});

Template.pokerEventItem.helpers({
    getTypeName(typeNumber) {
        return PokerEventType.getIdentifier(typeNumber);
    },
    eventTime(){
        return Template.instance().eventTime.get();
    },
    eventClass(){
        return Template.instance().eventClass.get();
    }
});

Template.pokerEventItem.onDestroyed(function () {
    clearInterval(this.intervalId);
})