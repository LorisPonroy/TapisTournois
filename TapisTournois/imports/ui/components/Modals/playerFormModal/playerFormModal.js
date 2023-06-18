import {Template} from "meteor/templating";
import Player from "/imports/classes/Player";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";

import './playerFormModal.html';

Template.playerFormModal.onCreated(()=>{

});

Template.playerFormModal.onRendered(function () {
    $('#playerFormModal').modal('show');
    $('#playerFormModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
});

Template.playerFormModal.events({
    'submit .js-add-player'(event, instance) {
        event.preventDefault();
        let pseudo = event.target.pseudo.value;
        let firstName = event.target.firstname.value;
        let lastName = event.target.lastname.value;
        let email = event.target.email.value === "" ? undefined : event.target.email.value;

        let player = Template.instance().data.player;
        if(!player){
            player = new Player();
        }
        player.pseudo = pseudo;
        player.firstName = firstName;
        player.lastName = lastName;
        player.email = email;
        player.save();

        event.target.pseudo.value = "";
        event.target.firstname.value = "";
        event.target.lastname.value = "";
        event.target.email.value = "";

    },
});

Template.playerFormModal.helpers({

});