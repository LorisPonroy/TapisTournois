import { Class }
	from 'meteor/jagi:astronomy';
import { check } from 'meteor/check';
import Menu from "/imports/classes/Buvette/Menu";

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
		menu_ids :{
			type : [String],
			default: function(){
				return [];
			}
		},
		playerState_ids: {
			type: [String],
			default: function () {
				return [];
			}
		},
	},
	meteorMethods: {
		menu(){
			return Menu.find({_id : {$in : this.menu_ids}}).fetch();
		},
		playerStates(){
			return [];
		}
	}
});

export default Tournament;