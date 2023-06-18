import "./main.html";
import { } from "./routing";

//Components
import '../imports/ui/components/navbar/navbar';
import '../imports/ui/components/tournamentCard/tournamentCard';
import '../imports/ui/components/playerCard/playerCard';
import '../imports/ui/components/Modals/playerFormModal/playerFormModal';
import '../imports/ui/components/Modals/playerSelectorModal/playerSelectorModal';
import '../imports/ui/components/loading/loading.html';
import '../imports/ui/components/paginationControls/paginationControls';
import '../imports/ui/components/Modals/pokerEventFormModal/pokerEventFormModal';
import '../imports/ui/components/Modals/buvetteOrderFormModal/buvetteOrderFormModal';
import '../imports/ui/components/Modals/buvetteMenuFormModal/buvetteMenuFormModal';
import '../imports/ui/components/Modals/tournamentFormModal/tournamentFormModal';
import '../imports/ui/components/Buttons/addButton/addButton';

import '../imports/ui/errors/404/404.html';

//Layout
import './templates/layout.html';
import './templates/login/login';
import './templates/register/register';
import './templates/admin-layout/admin-users/admin-users';
import './templates/errors/accessDenied/accessDenied';
import './templates/PlayersList/PlayerList';
import './templates/admin-layout/admin-database/dataManager';
import './templates/TournamentList/TournamentList';
import './templates/TournamentPage/TournamentPage';
import './templates/TournamentPage/PokerTournament/home/PokerTournamentHome';
import './templates/TournamentPage/PokerTournament/players/PokerTournamentPlayers';
import './templates/TournamentPage/PokerTournament/tables/PokerTournamentTables';
import './templates/TournamentPage/PokerTournament/events/PokerTournamentEvents';
import './templates/Overview/PokerOverview/PokerOverview';
import './templates/Buvette/Buvette';
import './templates/Buvette/menu/buvetteMenu';
import './templates/Buvette/todo/buvetteTodo';
import './templates/Buvette/done/buvetteDone';
import './templates/Service/Service';
import './templates/TournamentPage/ScoreGameTournament/ScoreGameTournament';
Meteor.startup(function() {
    $('html').attr('data-bs-theme', 'dark');
});
