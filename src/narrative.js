/**
 * @module Narrative
 * @description Manages the game's story progression, loading story data,
 * and navigating between chapters based on player choices.
 * This module is responsible for the story's structure and flow,
 * but delegates player-specific condition checks and state modifications
 * to the `Game` and `Player` modules respectively.
 */
import { STORY_DATA_PATH } from './config.js';

const Narrative = (() => {
    /**
     * @private
     * @type {object|null} Stores the loaded story data, mapping chapter IDs to chapter objects.
     * Each key is a chapter ID, and its value is the chapter object containing text, choices, etc.
     */
    let story