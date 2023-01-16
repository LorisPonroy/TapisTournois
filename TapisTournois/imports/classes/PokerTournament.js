// Client and server.
import { started_tournaments } from '../methods/methods';
import { PlayerState } from './PlayerState';
import PokerEvent from './PokerEvent';
import Tournament from './Tournament';

const PokerTournament = Tournament.inherit({
    name: 'PokerTournament',
    secured: false,
    typeField: '_type',
    fields: {
        playerStates: {
            type: [PlayerState],
            default: function () {
                return [];
            }
        },
        events: {
            type: [Object],
            default: function () {
                return [];
            }
        },
        time: {
            type: Number,
            default: function () {
                return 0;
            }

        },
    },
    meteorMethods: {
        isStarted() {
            return Object.keys(started_tournaments).includes(this._id);
        }
    }
});

export default PokerTournament;