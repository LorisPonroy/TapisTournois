import {Class, Enum}
    from 'meteor/jagi:astronomy';
import { check } from 'meteor/check';
import Menu from "/imports/classes/Buvette/Menu";
import PlayerState, {PokerPlayerState} from "/imports/classes/PlayerState";

export const OrderPaymentType = Enum.create({
    name: 'OrderPaymentType',
    identifiers: {
        'NOT PAYED' : -1,
        'OTHER' : 0,
        'CASH' : 1,
        'CREDITS' : 2,
        'LYDIA' : 3
    }
});

export const OrderStatus = Enum.create({
    name: 'OrderStatus',
    identifiers: ['PENDING', 'PREPARED', 'DELIVERED']
});

export const Orders = new Mongo.Collection('orders');

const Order = Class.create({
    name: 'Order',
    collection: Orders,
    typeField: '_type',
    secured: false,
    fields: {
        menu_id : String,
        playerState_id : {
          type : String
        },
        tournament_Id : String,
        status : {
            type : OrderStatus,
            default : function(){
                return 0;
            }
        },
        quantity : {
            type : Number,
            default : function(){
                return 1;
            }
        },
        comment : String,
        payment : OrderPaymentType,
        createdAt: Date,
    },
    meteorMethods: {
        menu(){
            return Menu.findOne({_id : this.menu_id});
        },
        playerState(){
            return PlayerState.findOne({_id : this.playerState_id});
        }
    }
});

export default Order;