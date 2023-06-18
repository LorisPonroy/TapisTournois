import {Template} from "meteor/templating";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";

import './buvetteOrderFormModal.html';
import Menu from "/imports/classes/Buvette/Menu";
import Tournament from "/imports/classes/Tournament/Tournament";
import Order from "/imports/classes/Buvette/Order";
import PlayerState from "/imports/classes/PlayerState";
import Player from "/imports/classes/Player";
import _ from "underscore";

Template.buvetteOrderFormModal.onCreated(function () {
   this.searchQuery = new ReactiveVar("");
   const self = this;
   this.autorun(()=>{
       self.subscribe('PlayerAndPlayerStates',{
           tournamentId : FlowRouter.getParam("id"),
           searchQuery : self.searchQuery.get()
       });
   })
});
Template.buvetteOrderFormModal.onRendered(function () {
    const modal = $('#orderFormModal');
    modal.modal('show');
    const self = this;
    modal.on('hidden.bs.modal', function () {
        Blaze.remove(self.view);
    });
});

Template.buvetteOrderFormModal.events({
    'submit .js-form-event'(event, instance) {
        event.preventDefault();
        let menuId = event.target.modalSelectMenu.value;
        let quantity = Number(event.target.modalQuantityInput.value);
        let playerState_id = event.target.modalSelectPlayer.value;
        let comment = event.target.modalInputComment.value;
        let payment = Number(event.target.modalPaymentSelect.value);

        let order = Template.instance().data.order;
        if(!order){
            order = new Order();
            order.createdAt = new Date();
        }
        order.menu_id = menuId;
        order.payment = payment;
        order.comment = comment;
        order.quantity = quantity;
        order.playerState_id = playerState_id;
        order.tournament_Id = FlowRouter.getParam('id');
        order.save();
    },
    "keyup .js-filter-players"(event,instance){
        Template.instance().searchQuery.set(event.target.value);
    }
});

Template.buvetteOrderFormModal.helpers({
    tournament(){
        return Tournament.findOne({_id : FlowRouter.getParam("id")});
    },
    playerStates(){
        const ids = Tournament.findOne({_id:FlowRouter.getParam("id")}).playerState_ids;
        const searchQuery = Template.instance().searchQuery.get();
        const playersCursor = Player.find({
            $or: [
                { pseudo: { $regex: searchQuery, $options: 'i' } },
                { firstName: { $regex: searchQuery, $options: 'i' } },
            ]});
        const playerIds = _.pluck(playersCursor.fetch(), '_id');

        return PlayerState.find({
            _id : {$in:ids},
            player_id : {$in:playerIds}
        }).fetch();
    }
});

Template.buvetteOrderFormModal.onDestroyed(function () {
    console.log("destroyed");
});