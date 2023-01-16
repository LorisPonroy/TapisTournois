import { Class }
	from 'meteor/jagi:astronomy';
import { check } from 'meteor/check';

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
			validators: [{
				type: 'minLength',
				param: 2
			}]
		},
		email: {
			type: String,
			optional: true,
			validators: [{
				type: 'email'
			}]
		},
	},
	meteorMethods: {
		create() {
			return this.save();
		}
	}
});

export default Player;