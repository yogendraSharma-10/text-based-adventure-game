/**
 * @file src/game.js
 * @description Core game logic for the Text-Based Adventure Game.
 * Manages game state, player actions, scene transitions, and persistence.
 */

import { Player } from './player.js';
import { Narrative } from './narrative.js';
import { UI } from './ui.js';
import storyData from './data/story.json' assert { type: 'json' }; // Modern ES Module JSON import
import { GAME_CONFIG } from './config.js';

/**
 * @typedef {Object} GameState
 * @property {Player} player - The current player instance.
 * @property {string} currentSceneId - The ID of the currently active scene.
 * @property {Object.<string, any>} [gameFlags] - Optional global game flags for complex branching.
 */

/**
 * @type {GameState}
 * @description The central object holding the current state of the game.
 */
let gameState = {
    player: null,
    currentSceneId: null,
    gameFlags: {}, // For future expansion: e.g., `gameFlags: { 'dragonSlain': true }`
};

// --- Core Game Logic ---

/**
 * Initializes the game, setting up player, narrative, and UI components.
 * Attempts to load a saved game; if none exists, starts a new game.
 */
export function initGame() {
    console.log('Initializing Text-Based Adventure Game...');

    // Initialize core modules with necessary data and callbacks
    gameState.player = new Player(GAME_CONFIG.PLAYER_START_STATS);
    Narrative.init(storyData);
    UI.init({
        onChoiceMade: handleChoice,
        onNewGame: startGame,
        onSaveGame: saveGame,
        onLoadGame: loadGame,
        onClearSave: clearSaveGame, // Added for completeness
    });

    // Attempt to load a saved game from local storage
    if (!loadGame()) {
        console.log('No saved game found. Starting a new adventure!');
        startGame(); // If no save, start fresh
    }

    console.log('Game initialized and ready.');
}

/**
 * Starts a new game, resetting player state and beginning from the initial scene.
 * This function is typically called when no saved game is found or the player chooses to start over.
 */
function startGame() {
    console.log('Starting new game...');
    gameState.player.reset(GAME_CONFIG.PLAYER_START_STATS);
    gameState.currentSceneId = GAME_CONFIG.START_SCENE_ID;
    gameState.gameFlags = {}; // Reset any global flags
    renderCurrentScene();
    saveGame(); // Automatically save the initial state
    UI.showGameControls(); // Ensure game controls are visible
    UI.displayMessage('A new adventure begins!');
    console.log('New game started successfully.');
}

/**
 * Renders the current scene to the UI based on `gameState.currentSceneId`.
 * It fetches scene data, filters choices based on player conditions, and updates the display.
 */
function renderCurrentScene() {
    const scene = Narrative.getScene(gameState.currentSceneId);
    if (!scene) {
        console.error(`Error: Scene with ID "${gameState.currentSceneId}" not found in narrative data.`);
        UI.displayError("An unexpected error occurred: Scene data missing. Please try starting a new game.");
        return;
    }

    // Filter choices: only show options for which the player meets the conditions
    const availableChoices = scene.choices.filter(choice =>
        checkConditions(choice.conditions)
    );

    UI.updateScene(scene.text, availableChoices);
    UI.updatePlayerStatus(gameState.player.getStatus());
}

/**
 * Handles a player's choice, processing its effects and transitioning to the next scene.
 * This is the primary callback from the UI when a player makes a decision.
 * @param {string} choiceId - The unique identifier of the chosen option.
 */
function handleChoice(choiceId) {
    const currentScene = Narrative.getScene(gameState.currentSceneId);
    if (!currentScene) {
        console.error(`Error: Current scene "${gameState.currentSceneId}" not found during choice handling.`);
        UI.displayError("An error occurred while processing your choice. Please try again or restart.");
        return;
    }

    const chosenOption = currentScene.choices.find(choice =>