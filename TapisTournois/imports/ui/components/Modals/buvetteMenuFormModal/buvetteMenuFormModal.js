import {Template} from "meteor/templating";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";

import './buvetteMenuFormModal.html';
import Menu from "/imports/classes/Buvette/Menu";
import Tournament from "/imports/classes/Tournament/Tournament";
Template.buvetteMenuFormModal.onRendered(function () {
    $('#menuFormModal').modal('show');
    $('#menuFormModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
});

Template.buvetteMenuFormModal.events({
    'submit .js-form-event'(event, instance) {
        event.preventDefault();
        let title = event.target.title.value;
        let price = Number(event.target.price.value);
        let tournament = Tournament.findOne({_id : FlowRouter.getParam('id')});
        Meteor.call('addMenu',title,price,tournament._id);
        /*let m = Template.instance().data.menu;
        if(!m){
            m = new Menu();
        }
        m.title = title;
        m.price = price;
        m.createdAt = new Date();
        m.save();
        tournament.menu_ids.push(m._id);
        tournament.save();*/
    },
});