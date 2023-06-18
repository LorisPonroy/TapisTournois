import {Template} from "meteor/templating";
import Tournament, {Tournaments} from "/imports/classes/Tournament/Tournament";
import Order, {OrderPaymentType} from "/imports/classes/Buvette/Order";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import Menu from "/imports/classes/Buvette/Menu";
import {Meteor} from "meteor/meteor";

import  './Service.html';

Template.service.events({
    "click .js-order-livred"(e){
        let order = Order.findOne({_id : e.currentTarget.value});
        order.status = 2;
        order.save();
    },
    "click .js-delete-order"(e){
        if(confirm("Remove order ?")){
            let order = Order.findOne({_id : e.currentTarget.value});
            order.remove();
        }
    },
    "click .js-open-add-order-modal"(){

    },
})

Template.service.helpers({
    tournament(){
        return Tournament.findOne({_id : FlowRouter.getParam("id")});
    },
    ordersDone(){
        return Order.find({tournament_Id : FlowRouter.getParam('id'), $or : [{status : 1}]}).fetch();
    },
    OpenModalFunction(){
        return function (){
            Blaze.renderWithData(Template.buvetteOrderFormModal, {menu : undefined}, document.body);
        }
    }
});