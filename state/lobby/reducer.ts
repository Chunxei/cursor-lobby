import rand from '../../utils/rangedRandom';
import {
  ILobbyState,
  LobbyAction,
  SET_CURRENT_USER,
  UPDATE_CURRENT_USER,
} from './types';

const starterNames = [
  'Zeus', 'Hera', 'Hestia', 'Dionysus', 'Poseidon', 'Diana',
  'Hades', 'Ares', 'Aphrodite', 'Hephaestus', 'Apollo',
  'Helios', 'Enyo', 'Nyx', 'Charon', 'Athena', 'Pan',
  'Demeter', 'Persephone', 'Gaia', 'Atlas', 'Eos', 'Io',
  'Thor', 'Odin', 'Freja', 'Heimdallr', 'Balder', 'Hothr',
  'Loki', 'Jormugandr', 'Tyr', 'Marika', 'Godwyn', 'Godrick',
  'Freide', 'Ymir', 'Nashandra', 'Shanalotte', 'Priscilla',
  'Ohhhhhhh Elden Ring 🤲🏾', 'Raime', 'Velstadt', 'Maki Z.',
  'Uzui T.', 'Muzan J.', 'Michael K.', 'Is Annie really ok?',
  'Eren', 'Mikasa es su casa', 'Clearly i\'m tired', '-_-',
];

export const INIT_STATE: ILobbyState = {
  me: {
    id: '',
    name: starterNames[rand(0, starterNames.length)],
    x: 0,
    y: 0,
    message: '',
    typing: false,
    color: `rgb(${rand(0, 200)}, ${rand(0, 200)}, ${rand(0, 200)})`,
    lastSeen: new Date().toISOString(),
  },
};

export const lobbyReducer = (
  state = INIT_STATE,
  action: LobbyAction,
): ILobbyState => {
  switch (action.type) {
  case SET_CURRENT_USER:
    return {...state, me: action.payload};

  case UPDATE_CURRENT_USER:
    return {
      ...state,
      me: {
        ...state.me,
        ...action.payload,
      },
    };

  default:
    return state;
  }
};
