import { Class }
	from 'meteor/jagi:astronomy';
import { check } from 'meteor/check';
import { PlayerStatus } from './PlayerStatus';
import Player from './Player';

export const PlayerStates = new Mongo.Collection('playerstates');

export const PlayerState = Class.create({
	name: 'PlayerState',
	collection: PlayerStates,
	typeField: '_type',
	fields: {
		table: {
			type: Number,
			default: function () {
				return -1;
			}
		},
		player: Player
	}
});

export const PokerPlayerState = PlayerState.inherit({
	name: 'PokerPlayerState',
	collection: PlayerStates,
	typeField: '_type',
	fields: {
		status: {
			type: PlayerStatus
		}
	}
});

export const TarotPlayerState = PlayerState.inherit({
	name: 'TarotPlayerState',
	collection: PlayerStates,
	typeField: '_type',
	fields: {
		score: {
			type: Number,
			default: function () {
				return 0;
			}
		}
	}
});