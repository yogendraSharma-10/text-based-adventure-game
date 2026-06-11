import { Game } from './game.js';
import { Player } from './player.js';
import { Narrative } from './narrative.js';
import { UI } from './ui.js';
import { config } from './config.js';

/**
 * main.js
 *
 * This is the primary entry point for the Text-Based Adventure Game.
 * It orchestrates the initialization of all core game components:
 * UI, Player, Narrative, and the central Game logic.
 *
 * The script ensures the DOM is fully loaded before attempting to
 * interact with HTML elements or load external resources like the story data.
 * It also includes basic error handling for critical operations.
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded. Initializing game...');

    // --- UI Initialization ---
    // Retrieve references to the main UI elements from the DOM.
    // These elements are expected to be present in index.html.
    const storyDisplay = document.getElementById('story-display');
    const choicesContainer = document.getElementById('choices-container');
    const inventoryDisplay = document.getElementById('inventory-display');
    const gameTitleElement = document.getElementById('game-title');
    const gameContainer = document.getElementById('game-container'); // For displaying global errors

    // Validate that all essential UI elements are found.
    if (!storyDisplay || !choicesContainer || !inventoryDisplay || !gameTitleElement || !gameContainer) {
        console.error('Critical UI elements missing. Please ensure index.html is correctly structured.');
        // Display a user-friendly error message directly on the page if possible.
        if (gameContainer) {
            gameContainer.innerHTML = `
                <div class="error-message">
                    <h1>Game Initialization Error</h1>
                    <p>The game could not start because essential display elements are missing from the page.</p>
                    <p>Please check the browser console for more details or contact support.</p>
                </div>
            `;
        }
        return; // Halt execution if UI cannot be initialized.
    }

    // Create an instance of the UI manager.
    const ui = new UI(storyDisplay, choicesContainer, inventoryDisplay, gameTitleElement);
    ui.updateTitle(config.gameTitle); // Set the game title from configuration.

    // --- Story Data Loading ---
    // Fetch the game's narrative data from the specified JSON file.
    let storyData;
    try {
        const response = await fetch(config.storyDataPath);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }
        storyData = await response.json();
        console.log('Story data loaded successfully.');
    } catch (error) {
        console.error('Failed to load story data:', error);
        ui.displayMessage(`Error: Could not load game narrative. ${error.message}. Please refresh the page.`, 'error');
        return; // Prevent the game from starting without its core narrative.
    }

    // --- Core Game Component Initialization ---
    // Initialize the Player with their starting state defined in config.
    const player = new Player(config.initialPlayerState);

    // Initialize the Narrative manager with the loaded story data.
    const narrative = new Narrative(storyData);

    // --- Game Initialization ---
    // Create the main Game instance, which ties together the Player, Narrative, and UI.
    // The Game class will handle the overall game flow, state transitions, and user interactions.
    const game = new Game(player, narrative, ui);

    // --- Start the Game ---
    // Begin the adventure! This typically loads the initial scene and displays it to the player.
    game.startGame();

    // --- Global Error Handling ---
    // Catch any unhandled promise rejections that might occur during gameplay,
    // providing a fallback for displaying critical errors to the user.
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled Promise Rejection:', event.reason);
        ui.displayMessage(`An unexpected error occurred: ${event.reason.message || 'Unknown error'}. Please refresh.`, 'error');
        // In a production environment, you might also send this error to a centralized logging service.
        // e.g., sendErrorToMonitoringService(event.reason);
    });

    // --- Cross-Project Context / Microservice Integration Examples ---
    // This section demonstrates how this Text-Based Adventure Game might
    // interact with other services in a larger interconnected system.
    // These are illustrative examples and not active code for this project.

    // Example 1: Dynamic Scene Imagery from a Canvas Drawing Board service.
    // If scenes required dynamic images (e.g., based on player choices or game state),
    // the game could request them from a dedicated image generation service.
    // if (config.canvasServiceEnabled) {
    //     // Assuming a method in UI or Game to load dynamic assets
    //     // ui.loadDynamicSceneImage(`${config.canvasServiceUrl}/render-scene?sceneId=${narrative.getCurrentSceneId()}&playerState=${player.getStateHash()}`);
    //     console.log(`[Cross-Project Context] Canvas Drawing Board integration point: Could fetch dynamic scene images from ${config.canvasServiceUrl}`);
    // }

    // Example 2: In-Browser Code Editor for advanced players or modding.
    // A "developer mode" or "modding" feature could allow players to open an
    // external code editor service to inspect game state, write scripts, or create custom content.
    // if (config.codeEditorEnabled && document.getElementById('dev-tools-button')) {
    //     document.getElementById('dev-tools-button').addEventListener('click', () => {
    //         window.open(config.codeEditorServiceUrl, '_blank', 'noopener,noreferrer');
    //         console.log(`[Cross-Project Context] In-Browser Code Editor integration point: Opened editor at ${config.codeEditorServiceUrl}`);
    //     });
    // }

    console.log('Game initialized and started successfully.');
});