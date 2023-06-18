import {Template} from "meteor/templating";
import {Meteor} from "meteor/meteor";
import Order, {OrderPaymentType, Orders} from "/imports/classes/Buvette/Order";
import Tournament, {Tournaments} from "/imports/classes/Tournament/Tournament";
import Menu, {Menus} from "/imports/classes/Buvette/Menu";
import {FlowRouter} from "meteor/ostrio:flow-router-extra";
import Chart from 'chart.js/auto';
import {ReactiveDict} from "meteor/reactive-dict";

import './Buvette.html';

let HTMLpaymentSelect = (order) => {
    let html = `<select class="js-payed-order" data-value="${order._id}">`;
    OrderPaymentType.getValues().forEach((v)=>{
        if(v === order.payment)
            html+= `<option value="${v}" selected>${OrderPaymentType.getIdentifier(v)}</option>`;
        else
            html+= `<option value="${v}">${OrderPaymentType.getIdentifier(v)}</option>`;
    });
    html += `</select>`;
    return html;
}

Template.buvette.onCreated(function() {
    Template.instance.state = new ReactiveDict();
    Template.instance.state.setDefault({
        filter: ""
    });
});

Template.buvette.events({
    'keyup .js-filter-players'(event,instance){
        if(event && event.currentTarget) {
            Template.instance.state.set('filter',event.currentTarget.value);
        }else {
            console.log("error");
        }
    },
    "click .js-add-order"(){
        let menu_id = document.getElementById("modalSelectMenu").value;
        let ps_id = document.getElementById("modalSelectPlayer").value;
        let payment = Number(document.getElementById("modalPaymentSelect").value);
        let comment = document.getElementById("modalInputComment").value;

    },
    "click .js-payed-order"(e){
        let order = Order.findOne({_id : e.currentTarget.dataset.value});
        order.payment = Number(e.currentTarget.value);
        order.save();
    }
});

Template.buvette.created = function (){
    Template.instance.state = new ReactiveDict();
    Template.instance.state.setDefault({
        filter: ""
    });
}

Template.buvette.helpers({
    tournament() {
        return Tournament.findOne({ _id: FlowRouter.getParam('id') });
    },
    modalPlayers(){
        if(!FlowRouter.getParam('id'))
            return []
        let tournament = Tournament.findOne({_id : FlowRouter.getParam('id')});
        if(tournament)
            return tournament.playerStates().filter((ps) => {
                let f = Template.instance.state.get("filter").toLowerCase();
                let p = ps.player();
                return  p.pseudo.toLowerCase().includes(f) ||
                    p.firstName.toLowerCase().includes(f) ||
                    p.lastName.toLowerCase().includes(f) ||
                    (p.email && p.email.toLowerCase().includes(f))
            });
        return [];
    },
});

Template.buvetteStatsSubPage.onRendered(function() {
    document.getElementById("buvette-stats-button").onclick = () =>{
        let tournament = Tournament.findOne({_id : FlowRouter.getParam('id')});
        let orders = Order.find({tournament_Id : FlowRouter.getParam('id')}).fetch();


        let nbVentesChart = new Chart(
            document.getElementById("nbVentesChart"),
            {
            type: 'doughnut',
            data: {
                labels: tournament.menu().map((m)=>{return m.title}),
                datasets: [{
                    label: 'Nombre de ventes',
                    data: tournament.menu().map((m)=>{
                        return orders.filter((order)=>{return order.menu().title === m.title}).length;
                    }),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            }
        });

        let recettesChart = new Chart(
            document.getElementById("recettesChart"),
            {
                type: 'doughnut',
                data: {
                    labels: tournament.menu().map((m)=>{return m.title}),
                    datasets: [{
                        label: 'Recette en €',
                        data: tournament.menu().map((m)=>{
                            return orders.filter((order)=>{return order.menu().title === m.title}).length * m.price;
                        }),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                }
            });
    };
});