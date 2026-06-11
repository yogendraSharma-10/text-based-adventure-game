/**
 * @file src/player.js
 * @description Defines the Player class, managing the player's state, inventory, health, and location.
 * This class is central to tracking the player's progress and capabilities throughout the adventure.
 */

/**
 * Represents the player character in the game.
 * Manages player attributes such as name, health, inventory, current location, and stats.
 */
class Player {
    /**
     * Creates an instance of Player.
     * @param {string} name - The name of the player.
     * @param {number} [initialHealth=100] - The starting health of the player.
     * @param {string} [initialLocationId='start'] - The ID of the player's starting location.
     * @param {Object.<string, number>} [initialStats={ strength: 10, intelligence: 10, agility: 10 }] - Initial player stats.
     */
    constructor(name, initialHealth = 100, initialLocationId = 'start', initialStats = { strength: 10, intelligence: 10, agility: 10 }) {
        if (!name || typeof name !== 'string') {
            throw new Error('Player name must be a non-empty string.');
        }
        if (initialHealth <= 0) {
            console.warn(`Initial health for player ${name} is set to ${initialHealth}. Player might start dead.`);
        }

        /** @private @type {string} */
        this._name = name;
        /** @private @type {number} */
        this._health = initialHealth;
        /** @private @type {Map<string, {id: string, name: string, description: string, quantity: number}>} */
        this._inventory = new Map(); // Stores items by their ID
        /** @private @type {string} */
        this._currentLocationId = initialLocationId;
        /** @private @type {Object.<string, number>} */
        this._stats = { ...initialStats }; // Deep copy to prevent external modification
        /** @private @type {Set<string>} */
        this._visitedLocations = new Set(); // Track visited locations for potential bonuses/achievements
        this._visitedLocations.add(initialLocationId); // Add initial location as visited
    }

    /**
     * Gets the player's name.
     * @returns {string} The player's name.
     */
    getName() {
        return this._name;
    }

    /**
     * Gets the player's current health.
     * @returns {number} The current health value.
     */
    getHealth() {
        return this._health;
    }

    /**
     * Checks if the player is alive.
     * @returns {boolean} True if health is greater than 0, false otherwise.
     */
    isAlive() {
        return this._health > 0;
    }

    /**
     * Applies damage to the player's health.
     * Health cannot go below 0.
     * @param {number} amount - The amount of damage to take. Must be a positive number.
     * @returns {number} The new health value.
     */
    takeDamage(amount) {
        if (amount < 0) {
            console.warn('Attempted to take negative damage. Use heal() instead.');
            return this._health;
        }
        this._health = Math.max(0, this._health - amount);
        console.log(`${this._name} took ${amount} damage. Health: ${this._health}`);
        return this._health;
    }

    /**
     * Heals the player, increasing their health.
     * Health cannot exceed a maximum (e.g., initial health, or a defined max).
     * For simplicity, we'll cap at initial health for now, but a `maxHealth` property could be added.
     * @param {number} amount - The amount to heal. Must be a positive number.
     * @returns {number} The new health value.
     */
    heal(amount) {
        if (amount < 0) {
            console.warn('Attempted to heal with a negative amount. Use takeDamage() instead.');
            return this._health;
        }
        // Assuming initial health is max health for now. Can be extended with a _maxHealth property.
        const maxHealth = 100; // Or this._initialHealth from constructor if stored
        this._health = Math.min(maxHealth, this._health + amount);
        console.log(`${this._name} healed for ${amount}. Health: ${this._health}`);
        return this._health;
    }

    /**
     * Adds an item to the player's inventory.
     * If the item already exists and is stackable, its quantity is increased.
     * @param {{id: string, name: string, description: string, quantity?: number}} item - The item object to add.
     * @returns {boolean} True if the item was added/updated successfully, false otherwise.
     */
    addItem(item) {
        if (!item || !item.id || !item.name) {
            console.error('Invalid item object provided to addItem:', item);
            return false;
        }

        const quantityToAdd = item.quantity && item.quantity > 0 ? item.quantity : 1;

        if (this._inventory.has(item.id)) {
            const existingItem = this._inventory.get(item.id);
            existingItem.quantity += quantityToAdd;
            console.log(`Added ${quantityToAdd} to existing item '${item.name}'. Total: ${existingItem.quantity}`);
        } else {
            this._inventory.set(item.id, { ...item, quantity: quantityToAdd });
            console.log(`Added new item '${item.name}' (x${quantityToAdd}) to inventory.`);
        }
        return true;
    }

    /**
     * Removes an item from the player's inventory.
     * If a quantity is specified, only that amount is removed. If quantity exceeds available, all are removed.
     * If no quantity, all instances of the item are removed.
     * @param {string} itemId - The ID of the item to remove.
     * @param {number} [quantityToRemove] - The specific quantity to remove. If undefined, all are removed.
     * @returns {boolean} True if the item was removed (partially or fully), false if not found or invalid quantity.
     */
    removeItem(itemId, quantityToRemove) {
        if (!this._inventory.has(itemId)) {
            console.warn(`Attempted to remove item '${itemId}' but it's not in inventory.`);
            return false;
        }

        const item = this._inventory.get(itemId);
        const currentQuantity = item.quantity;

        if (quantityToRemove === undefined || quantityToRemove >= currentQuantity) {
            this._inventory.delete(itemId);
            console.log(`Removed all '${item.name}' from inventory.`);
            return true;
        } else if (quantityToRemove > 0 && quantityToRemove < currentQuantity) {
            item.quantity -= quantityToRemove;
            console.log(`Removed ${quantityToRemove} of '${item.name}'. Remaining: ${item.quantity}`);
            return true;
        } else {
            console.warn(`Invalid quantityToRemove (${quantityToRemove}) for item '${itemId}'.`);
            return false;
        }
    }

    /**
     * Checks if the player has a specific item in their inventory.
     * Optionally checks for a minimum quantity.
     * @param {string} itemId - The ID of the item to check for.
     * @param {number} [minQuantity=1] - The minimum quantity required.
     * @returns {boolean} True if the item is present (and meets quantity), false otherwise.
     */
    hasItem(itemId, minQuantity = 1) {
        const item = this._inventory.get(itemId);
        return item !== undefined && item.quantity >= minQuantity;
    }

    /**
     * Gets a copy of the player's current inventory.
     * @returns {Array<{id: string, name: string, description: string, quantity: number}>} An array of inventory items.
     */
    getInventory() {
        return Array.from(this._inventory.values());
    }

    /**
     * Gets the player's current location ID.
     * @returns {string} The ID of the current location.
     */
    getCurrentLocation() {
        return this._currentLocationId;
    }

    /**
     * Sets the player's current location.
     * Also marks the new location as visited.
     * @param {string} locationId - The ID of the new location.
     */
    setCurrentLocation(locationId) {
        if (typeof locationId !== 'string' || locationId.trim() === '') {
            console.error('Invalid location ID provided:', locationId);
            return;
        }
        this._currentLocationId = locationId;
        this._visitedLocations.add(locationId);
        console.log(`${this._name} moved to location: ${locationId}`);
    }

    /**
     * Checks if a location has been visited by the player.
     * @param {string} locationId - The ID of the location to check.
     * @returns {boolean} True if the location has been visited, false otherwise.
     */
    hasVisitedLocation(locationId) {
        return this._visitedLocations.has(locationId);
    }

    /**
     * Gets the value of a specific player stat.
     * @param {string} statName - The name of the stat (e.g., 'strength', 'intelligence').
     * @returns {number|undefined} The stat value, or undefined if the stat does not exist.
     */
    getStat(statName) {
        return this._stats[statName];
    }

    /**
     * Updates a player stat by adding or subtracting a value.
     * @param {string} statName - The name of the stat to update.
     * @param {number} value - The amount to add to the stat. Can be negative.
     * @returns {number|undefined} The new stat value, or undefined if the stat does not exist.
     */
    updateStat(statName, value) {
        if (typeof this._stats[statName] === 'number') {
            this._stats[statName] += value;
            console.log(`Stat '${statName}' updated by ${value}. New value: ${this._stats[statName]}`);
            return this._stats[statName];
        }
        console.warn(`Attempted to update non-existent stat: ${statName}`);
        return undefined;
    }

    /**
     * Sets a player stat to a specific value.
     * @param {string} statName - The name of the stat to set.
     * @param {number} value - The new value for the stat.
     * @returns {number|undefined} The new stat value, or undefined if the stat does not exist.
     */
    setStat(statName, value) {
        if (typeof this._stats[statName] === 'number') {
            this._stats[statName] = value;
            console.log(`Stat '${statName}' set to: ${this._stats[statName]}`);
            return this._stats[statName];
        }
        console.warn(`Attempted to set non-existent stat: ${statName}`);
        return undefined;
    }

    /**
     * Serializes the player's current state into a plain object for saving.
     * This object can be easily converted to JSON.
     * @returns {Object} A serializable object representing the player's state.
     */
    save() {
        return {
            name: this._name,
            health: this._health,
            inventory: Array.from(this._inventory.values()), // Convert Map to array of objects
            currentLocationId: this._currentLocationId,
            stats: { ...this._stats }, // Deep copy
            visitedLocations: Array.from(this._visitedLocations) // Convert Set to array
        };
    }

    /**
     * Loads the player's state from a saved object.
     * This method re-initializes the player instance with the provided state.
     * @param {Object} playerState - The saved player state object.
     * @returns {boolean} True if state was loaded successfully, false otherwise.
     */
    load(playerState) {
        if (!playerState || typeof playerState !== 'object') {
            console.error('Invalid player state object provided for loading.');
            return false;
        }

        try {
            this._name = playerState.name || this._name;
            this._health = playerState.health !== undefined ? playerState.health : this._health;
            this._currentLocationId = playerState.currentLocationId || this._currentLocationId;
            this._stats = { ...this._stats, ...(playerState.stats || {}) }; // Merge or overwrite stats

            // Reconstruct inventory Map
            this._inventory.clear();
            if (Array.isArray(playerState.inventory)) {
                playerState.inventory.forEach(item => {
                    if (item && item.id) {
                        this._inventory.set(item.id, item);
                    }
                });
            }

            // Reconstruct visited locations Set
            this._visitedLocations.clear();
            if (Array.isArray(playerState.visitedLocations)) {
                playerState.visitedLocations.forEach(locId => {
                    if (typeof locId === 'string') {
                        this._visitedLocations.add(locId);
                    }
                });
            }

            console.log(`Player state for ${this._name} loaded successfully.`);
            return true;
        } catch (error) {
            console.error('Error loading player state:', error);
            return false;
        }
    }
}

export default Player;