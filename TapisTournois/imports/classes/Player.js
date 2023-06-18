import { Class }
	from 'meteor/jagi:astronomy';

export const Players = new Mongo.Collection('players');

const Player = Class.create({
	name: 'Player',
	collection: Players,
	secured: false,
	fields: {
		pseudo: {
			type: String,
			validators: [{
				type: 'minLength',
				param: 2
			}]
		},
		firstName: {
			type: String,
			validators: [{
				type: 'minLength',
				param: 2
			}]
		},
		lastName: {
			type: String,
			optional: true,
		},
		email: {
			type: String,
			optional: true,
			validators: [{
				type: 'email'
			}]
		},
		mailing: {
			type : Boolean,
			optional: false,
			default: function () {
				return false;
			}
		}
	},
	meteorMethods: {
	}
});

export default Player;