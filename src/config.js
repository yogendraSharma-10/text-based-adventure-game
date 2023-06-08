/**
 * @file Configuration settings for the Text-Based Adventure Game.
 * @module config
 * @author Your Name/Company
 * @version 1.0.0
 */

// --- Game Core Settings ---

/**
 * The title of the game, displayed in the UI and browser tab.
 * @type {string}
 */
export const GAME_TITLE = "The Whispering Labyrinth";

/**
 * The key used for storing and retrieving game state in localStorage.
 * This ensures persistent game progress across sessions.
 * @type {string}
 */
export const SAVE_GAME_KEY = "whisperingLabyrinthSaveGame";

/**
 * The ID of the narrative node where the game begins.
 * This should correspond to an entry in src/data/story.json.
 * @type {string}
 */
export const DEFAULT_START_NODE = "intro";

/**
 * Enables or disables debug features like extra console logs,
 * or special commands. Set to `false` for production.
 * @type {boolean}
 */
export const DEBUG_MODE = true; // Set to false for production builds

// --- Player Settings ---

/**
 * The initial health points for the player at the start of a new game.
 * @type {number}
 */
export const INITIAL_PLAYER_HEALTH = 100;

/**
 * The initial inventory items the player starts with.
 * Each item should have a 'name' (string) and 'quantity' (number).
 * @type {Array<{name: string, quantity: number}>}
 */
export const INITIAL_PLAYER_INVENTORY = [
    { name: "torch", quantity: 1 },
    { name: "rusty key", quantity: 1 }
];

// --- UI Settings ---

/**
 * The delay in milliseconds between each character appearing in the narrative text.
 * Set to 0 for instant text display.
 * @type {number}
 */
export const TYPING_SPEED_MS = 30;

/**
 * The maximum number of inventory items to display directly in the UI
 * before potentially requiring a scroll or "show more" functionality.
 * @type {number}
 */
export const MAX_INVENTORY_DISPLAY = 5;

// --- Cross-Project Integration Settings (Microservices Context) ---
// These URLs would typically point to deployed instances of other services
// within the larger interconnected system.

/**
 * Base URL for any backend API services this game might interact with.
 * E.g., for leaderboards, user authentication, or dynamic content.
 * @type {string}
 */
export const API_BASE_URL = "https://api.example.com/adventure-game";

/**
 * URL for the "Canvas Drawing Board" service.
 * This could be used to display in-game maps, concept art, or player-generated drawings.
 * For example, a "Map" button in the game could open this URL.
 * @type {string}
 */
export const CANVAS_DRAWING_BOARD_URL = "https://drawing-board.example.com/project/adventure-game";

/**
 * URL for the "In-Browser Code Editor" service.
 * This could be used for modding the game, viewing game scripts, or custom quest creation.
 * For example, a "Modding Tools" option could link here.
 * @type {string}
 */
export const CODE_EDITOR_URL = "https://code-editor.example.com/project/adventure-game";

/**
 * Feature flags to enable/disable certain functionalities,
 * potentially dependent on other services or in beta.
 * @type {Object.<string, boolean>}
 */
export const FEATURE_FLAGS = {
    ENABLE_LEADERBOARDS: false, // Requires API_BASE_URL integration
    ENABLE_MODDING_TOOLS: false, // Requires CODE_EDITOR_URL integration
    SHOW_MAP_BUTTON: true, // Could link to CANVAS_DRAWING_BOARD_URL
    ENABLE_CLOUD_SAVE_SYNC: false // Requires API_BASE_URL for user accounts
};

// --- Development/Environment Specific Settings ---

/**
 * Environment type (e.g., 'development', 'production', 'test').
 * In a browser environment, `process.env.NODE_ENV` is typically set by build tools
 * like Webpack or Rollup. A fallback is provided for direct browser loading.
 * @type {string}
 */
export const NODE_ENV = typeof process !== 'undefined' && process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

/**
 * Determines if the application is running in a production environment.
 * @type {boolean}
 */
export const IS_PRODUCTION = NODE_ENV === 'production';

/**
 * Determines if the application is running in a development environment.
 * @type {boolean}
 */
export const IS_DEVELOPMENT = NODE_ENV === 'development';