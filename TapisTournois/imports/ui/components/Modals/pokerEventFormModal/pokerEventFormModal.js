import {Template} from "meteor/templating";
import Player from "/imports/classes/Player";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";

import './pokerEventFormModal.html';
import PokerEvent from "/imports/classes/PokerEvent";
import Tournament from "/imports/classes/Tournament/Tournament";

Template.pokerEventFormModal.onCreated(()=>{

});

Template.pokerEventFormModal.onRendered(function () {
    $('#pokerEventFormModal').modal('show');
    $('#pokerEventFormModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
});

Template.pokerEventFormModal.events({
    'submit .js-event-player'(e, instance) {
        e.preventDefault();
        let type = Number(e.target.type.value);
        let smallBlind = Number(e.target.smallBlind.value);
        let bigBlind = Number(e.target.bigBlind.value);
        let duration = Number(e.target.duration.value) * 60;

        let event = Template.instance().data.event;
        if(!event){
            event = new PokerEvent();
        }
        event.type = type;
        event.smallBlind = smallBlind;
        event.bigBlind = bigBlind;
        event.duration = duration;
        const _id = event.save();
        const tournament = Tournament.findOne({_id : FlowRouter.getParam('id')});
        tournament.event_ids.push(_id);
        tournament.save();
        console.log(tournament.event_ids);
    },
});