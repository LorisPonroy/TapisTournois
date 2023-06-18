import {PokerPlayerState, ScoreGamePlayerState} from '../PlayerState';
import Tournament from './Tournament';

const ScoreGameTournament = Tournament.inherit({
    name: 'ScoreGameTournament',
    secured: false,
    typeField: '_type',
    fields: {

    },
    meteorMethods: {
        playerStates(){
            return ScoreGamePlayerState.find({_id : {"$in" : this.playerState_ids}}).fetch();
        },
    }
});
export default ScoreGameTournament;