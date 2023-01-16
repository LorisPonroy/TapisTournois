import { Class }
	from 'meteor/jagi:astronomy';
import { Enum } from 'meteor/jagi:astronomy';

export const PokerEvents = new Mongo.Collection('pokerevents');

export const PokerEventType = Enum.create({
	name: 'PokerEventType',
	identifiers: ['PAUSE', 'INCR']
});

const PokerEvent = Class.create({
	name: 'PokerEvent',
	collection: PokerEvents,
	secured: false,
	fields: {
		type: {
			type: PokerEventType,
		},
		smallBlind: {
			type: Number,
			default: function () {
				return 0;
			}
		},
		bigBlind: {
			type: Number,
			default: function () {
				return 0;
			}
		},
		duration: {
			type: Number,
			default: function () {
				return 1200;
			}

		},
	},
	meteorMethods: {

	}
});

export default PokerEvent;