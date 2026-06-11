import { GAME_CONFIG } from './config.js';

// Private variables for DOM elements, initialized in init
let storyDisplay;
let choicesContainer;
let inventoryDisplay;
let statusDisplay;
let gameInput;
let gameInputButton;
let gameEndScreen;
let gameEndMessage;
let restartButton;
let saveButton;
let loadButton;
let messageDisplay; // For general messages/errors

// Callbacks to communicate with the game logic
let onChoiceMadeCallback = null;
let onInputSubmittedCallback = null;
let onRestartGameCallback = null;
let onSaveGameCallback = null;
let onLoadGameCallback = null;

/**
 * Handles the submission of text input from the game input field