// Client and server.
import { started_tournaments } from '../../methods/Poker';
import PlayerState, {PokerPlayerState} from '../PlayerState';
import Tournament from './Tournament';
import PokerEvent from "/imports/classes/PokerEvent";

const PokerTournament = Tournament.inherit({
    name: 'PokerTournament',
    secured: false,
    typeField: '_type',
    fields: {
        event_ids: {
            type: [String],
            default: function () {
                return [];
            }
        },
        additionalTime: {
            type: Number,
            default: function () {
                return 0;
            }

        },
        startedDate : {
            type : Date,
            default : function (){
                return new Date();
            }
        },
        isStarted : {
            type : Boolean,
            default : function (){
                return false;
            }
        },
        startingPauseDate : {
            type : Date,
            default : function(){
                return new Date();
            }
        }
    },
    helpers: {
        getFormatedTime() {
            let additionalTime = this.additionalTime;
            if(!this.isStarted){
                additionalTime += (new Date()) - this.startingPauseDate;
            }
            let ms = Math.floor(((new Date()) - this.startedDate - additionalTime));
            return new Date(ms).toISOString().slice(11, 19);
        },
        elapsedTimeInSeconds(){
            let additionalTime = this.additionalTime;
            if(!this.isStarted && this.startingPauseDate){
                additionalTime += (new Date()) - this.startingPauseDate;
            }
            let ms = Math.floor(((new Date()) - this.startedDate - additionalTime));
            return Math.floor(ms / 1000);
        }
    },
    meteorMethods: {
        start(){
            if(!this.isStarted){
                this.additionalTime += Math.floor(((new Date()) - this.startingPauseDate));
            }
            this.isStarted = true;
            this.save();
        },
        stop(){
            this.isStarted = false;
            this.startingPauseDate = new Date();
            this.save();
        },
        playerStates(){
            return PokerPlayerState.find({_id : {"$in" : this.playerState_ids}}).fetch();
        },
        events(){
            return PokerEvent.find({_id : {$in : this.event_ids}}).fetch();
        }
    }
});

export default PokerTournament;