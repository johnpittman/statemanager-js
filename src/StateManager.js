/**
 * @author John Pittman <johnrichardpittman@gmail.com>
 */

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['./../../eventhandler/dist/EventHandler.min.js'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('eventhandler'));
    } else {
        // Browser globals (root is window)
        // Require EventHandler.js to be loaded before.
        root.StateManager = factory(root.EventHandler);
    }
}(this, function(EventHandler) {
    'use strict'

    /**
     * @contructor
     * @param {object} [owner=this] - Object of what owns the states of the state manager. Used to mantain scope.
     */
    function StateManager(owner) {
        EventHandler.call(this);

        this._owner = owner || this;

        this._states = {};
        this._currentStateId;
        this._previousStateId;
        this._initialStateId;

        this._started = false;
    }

    StateManager.prototype = Object.create(EventHandler.prototype);
    StateManager.contructor = StateManager;

    /**
     * Initializes the states collection with more states.
     * Every state already has a 'Default' event
     * @param {object} states
     * @param {string} [initialStateId]
     */
    StateManager.prototype.initialize = function(states, initialStateId) {
        this.addStates(states);
        this.start(initialStateId);
    };

    /**
     * Initializes the states collection with more states.
     * @param {object} states
     */
    StateManager.prototype.addStates = function(states) {
        for (var state in states) {
            this._states[state] = states[state];
        }
    };

    /**
     * Runs all enter processes for a state.
     * @param  {object} state
     * @param  {string} data - Additional info to pass through to processes and listeners.
     */
    StateManager.prototype._enterState = function(state, data) {
        var hasTransitions = state.transitions !== undefined;

        if (hasTransitions === true) {
            // Call the before process that will do the setup for the enter process.
            var beforeEnter = state.transitions['beforeEnter'];
            if (beforeEnter !== undefined)
                beforeEnter.call(this._owner, data);
            // If there's special needs when coming from another state, run the specific transition process to do special setup for that transition.
            var beforeEnterFrom = state.transitions['beforeEnterFrom' + this._previousStateId];
            if (beforeEnterFrom !== undefined)
                beforeEnterFrom.call(this._owner, data);
        }
        this.emit('beforeenterstate', data);

        // Call the static process that will always run on enter.
        state.enter.call(this._owner, data);
        if (hasTransitions === true) {
            // If there's special needs when coming from another state, run the process that should do specific work needed to be done for the given case.
            var enterFrom = state.transitions['enterFrom' + this._previousStateId];
            if (enterFrom !== undefined) {
                enterFrom.call(this._owner, data);
            }
        }
        this.emit('enterstate', data);
    };

    /**
     * Runs all leave processes for a state.
     * @param  {object} state
     * @param  {*} data
     * @param  {string} toStateId
     */
    StateManager.prototype._leaveState = function(state, data, toStateId) {
        var hasTransitions = state.transitions !== undefined;
        if (hasTransitions === true) {
            var beforeLeave = state.transitions['beforeLeave'];
            if (beforeLeave !== undefined)
                beforeLeave.call(this._owner, data);
            var beforeLeaveTo = state.transitions['beforeLeaveTo' + toStateId];
            if (beforeLeaveTo !== undefined)
                beforeLeaveTo.call(this._owner, data);
        }
        this.emit('beforeleavestate', data);

        // Call the static process that will always run on leave.
        state.leave.call(this._owner, data);
        if (hasTransitions === true) {
            // If there's special needs when going to another state, run the process that should do specific work needed to be done for the given case.
            var leaveTo = state.transitions['leaveTo' + toStateId];
            if (leaveTo !== undefined)
                leaveTo.call(this._owner, data);
        }
        this.emit('leavestate', data);
    };

    /**
     * Updates the current state to the state that's passed in.
     * Emits all events.
     * @param  {string} toStateId
     * @param  {*} [data] - Data to be access by all event listeners.
     */
    StateManager.prototype.changeState = function(toStateId, data) {
        var changeStateData = {
            from: this._currentStateId.toString(),
            to: toStateId,
            data: data
        };

        if (this._started === true) {
            var currState = this._states[this._currentStateId];
            this._leaveState(currState, changeStateData, toStateId);
            // Run an unload process for the state if there is one.
            if (currState.initialized === true)
                if (currState['unload'] !== undefined) {
                    currState['unload'].call(this._owner, data);
                    currState.initialized = false;
                }
        }

        // Update current state.
        this._setCurrentStateId(toStateId);

        // Run an initialize process for the state if there is one.
        var toState = this._states[toStateId];
        if (!toState.initialized)
            if (toState['initialize'] !== undefined) {
                toState['initialize'].call(this._owner, data);
                toState.initialized = true;
            }
        this._enterState(toState, changeStateData);
    };

    /**
     * Modifier.
     * Sets the current state to the state passed in without triggering events.
     * @param {string} name
     */
    StateManager.prototype._setCurrentStateId = function(name) {
        if (this._started === true)
            this._previousStateId = this._currentStateId.toString();
        this._currentStateId = name;
    };

    /**
     * Sets the state machine back to the initial state and runs the initial state.
     * @param {string} initialStateId
     */
    StateManager.prototype.start = function(initialStateId) {
        var defaultState = this._initialStateId = initialStateId || this._initialStateId;

        this._setCurrentStateId(defaultState);
        this.changeState(defaultState);
        this._started = true;
    };

    /**
     * Modifier
     * @param {string} initialStateId
     */
    StateManager.prototype.setInitialState = function(initialStateId) {
        this._initialStateId = initialStateId;
    };

    /**
     * Accessor.
     * @return {string}
     */
    StateManager.prototype.getCurrentState = function() {
        return this._currentStateId;
    };

    /**
     * Accessor.
     * @return {string}
     */
    StateManager.prototype.getPreviousState = function() {
        return this._previousStateId;
    };

    return StateManager;
}));
