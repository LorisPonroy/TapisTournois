import './buvetteTodo.html';
import {Template} from "meteor/templating";
import Order from "/imports/classes/Buvette/Order";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import Tournament from "/imports/classes/Tournament/Tournament";

Template.buvetteTodoSubPage.events({
    "click .js-open-add-order-modal"(){
        Blaze.renderWithData(Template.buvetteOrderFormModal, {menu : undefined}, document.body);
    },
    "click .js-order-prepared"(e){
        let order = Order.findOne({_id : e.currentTarget.value});
        order.status = 1;
        order.save();
    },
    "click .js-delete-order"(e){
        if(confirm("Remove order ?")){
            let order = Order.findOne({_id : e.currentTarget.value});
            order.remove();
        }
    },
})

Template.buvetteTodoSubPage.helpers({
    tournament(){
        return Tournament.findOne({_id : FlowRouter.getParam("id")});
    },
    ordersTodo() {
        return Order.find({tournament_Id : FlowRouter.getParam('id'), status : 0}).fetch();
    },
    HTMLpaymentSelect(order){
        return HTMLpaymentSelect(order);
    }
});