import { Class }
	from 'meteor/jagi:astronomy';
import { check } from 'meteor/check';
import { PlayerStatus } from './PlayerStatus';
import Player from './Player';
import Menu from "/imports/classes/Buvette/Menu";

export const PlayerStates = new Mongo.Collection('playerstates');

const PlayerState = Class.create({
	name: 'PlayerState',
	collection: PlayerStates,
	typeField: '_type',
	secured : false,
	fields: {
		table: {
			type: Number,
			default: function () {
				return -1;
			}
		},
		player_id: String,
	},
	meteorMethods: {
		player(){
			return Player.findOne({_id: this.player_id});
		}
	}
});

export default PlayerState;

export const PokerPlayerState = PlayerState.inherit({
	name: 'PokerPlayerState',
	collection: PlayerStates,
	typeField: '_type',
	fields: {
		status: {
			type: PlayerStatus
		},
		killedBy_id : {
			type : String,
			optional: true,
		},
	},
	meteorMethods: {
		killedBy(){
			return Player.findOne({_id : this.killedBy_id});
		},
		checkin(table){
			this.status = 2;
			if(table)
				this.table = table;
			else
				this.table = 1;
			this.save();
		},
		checkoff(){
			this.status = 0;
			this.table = -1;
			this.save();
		},
		kill(){
			this.status = 1;
			this.save();
		},
		move(table){
			this.table = table;
			this.save();
		},
		resurrect(){
			this.status = 2;
			this.save();
		}
	}
});

export const ScoreGamePlayerState = PlayerState.inherit({
	name: 'ScoreGamePlayerState',
	collection: PlayerStates,
	typeField: '_type',
	fields: {
		scores: {
			type: [Number],
			default: function () {
				return [];
			}
		}
	}
});