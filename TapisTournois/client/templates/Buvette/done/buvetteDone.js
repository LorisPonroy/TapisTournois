import './buvetteDone.html';
import {Template} from "meteor/templating";
import Order from "/imports/classes/Buvette/Order";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import Tournament from "/imports/classes/Tournament/Tournament";

Template.buvetteDoneSubPage.events({
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
})

Template.buvetteDoneSubPage.helpers({
    tournament(){
        return Tournament.findOne({_id : FlowRouter.getParam("id")});
    },
    ordersDone(){
        return Order.find({tournament_Id : FlowRouter.getParam('id'), $or : [{status : 1}]}).fetch();
    },
    ordersLivred(){
        return Order.find({tournament_Id : FlowRouter.getParam('id'), $or : [{status : 2}]}).fetch();
    },
    orderIsNotLivred(order){
        return order.status !== 2;
    },
});