import { Class }
	from 'meteor/jagi:astronomy';
import { check } from 'meteor/check';

export const Tournaments = new Mongo.Collection('tournaments');

const Tournament = Class.create({
	name: 'Tournament',
	collection: Tournaments,
	typeField: '_type',
	secured: false,
	fields: {
		title: {
			type: String,
		},
		createdAt: Date,
	},
	meteorMethods: {

	}
});

export default Tournament;