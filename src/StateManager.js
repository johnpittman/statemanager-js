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
        this._currentState;
        this._prevState;
        this._initialState;
    }

    StateManager.prototype = Object.create(EventHandler.prototype);
    StateManager.contructor = StateManager;

    /**
     * Initializes the states collection with more states.
     * Every state already has a 'Default' event
     * @param {object} states
     * @param {string} [initialState]
     */
    StateManager.prototype.addStates = function(states, initialState) {
        for (var state in states) {
            this._states[state] = states[state];
        }

        this.start(initialState);
    };

    /**
     * Runs all enter processes for a state.
     * @param  {string} name
     * @param  {string} data - Additional info to pass through to processes and listeners.
     */
    StateManager.prototype.enterState = function(fromState, data) {
        var state = this._states[fromState];
        if (state !== undefined) {
            this.setCurrentState(fromState);

            var enterFrom = state.transitions['onEnterFrom' + this._prevState];
            if (enterFrom !== undefined) {
                // beforeEnterFrom should only exist if there's an enterFrom process.
                var beforeEnterFrom = state.transitions['onBeforeEnterFrom' + this._prevState];
                if (beforeEnterFrom !== undefined)
                    beforeEnterFrom.call(this._owner, data);
                enterFrom.call(this._owner, data);
            }

            var beforeEnter = state.transitions['onBeforeEnter'];
            if (beforeEnter !== undefined)
                beforeEnter.call(this._owner, data);
            this.emit('enterstate', data);
            state['enter'].call(this._owner, data);
        }
    };

    /**
     * Runs all leave processes for a state.
     * @param  {string} name
     */
    StateManager.prototype.leaveState = function(toState, data) {
        var state = this._states[this._currentState];

        var leaveTo = state.transitions['onLeaveTo' + toState];
        if (leaveTo !== undefined) {
            // beforeLeaveTo should only exist if there's an leaveTo process.
            var beforeLeaveTo = state.transitions['onBeforeLeaveTo' + toState];
            if (beforeLeaveTo !== undefined)
                beforeLeaveTo.call(this._owner);
            leaveTo.call(this._owner);
        }

        var beforeLeave = state.transitions['onBeforeLeave'];
        if (beforeLeave !== undefined)
            beforeLeave.call(this._owner);
        state['leave'].call(this._owner);
        this.emit('leavestate', data);
    };

    /**
     * Updates the current state to the state that's passed in.
     * Emits all events.
     * @param  {string} state
     * @param  {*} [data] - Data to be access by all event listeners.
     */
    StateManager.prototype.changeState = function(toState, data) {
        var prevState = this._prevState;
        var currState = this._currentState;

        var info = {
            from: currState,
            to: toState,
            data: data
        };

        if (currState !== this._prevState)
            this.leaveState(toState, info);
        this.enterState(toState, info);
    };

    /**
     * Modifier.
     * Sets the current state to the state passed in without triggering events.
     * @param {string} name
     */
    StateManager.prototype.setCurrentState = function(name) {
        if (this._currentState !== undefined)
            this._prevState = this._currentState.toString();
        else
            this._prevState = name;
        this._currentState = name;
    };

    /**
     * Sets the state machine back to the initial state.
     * @param {string} initialStateName
     */
    StateManager.prototype.start = function(initialState) {
        var defaultState = this._initialState = initialState || this._initialState;

        this.setCurrentState(defaultState);
        this.changeState(defaultState);
    };

    /**
     * Accessor.
     * @return {string}
     */
    StateManager.prototype.getCurrentState = function() {
        return this._currentState;
    };

    /**
     * Accessor.
     * @return {string}
     */
    StateManager.prototype.getPreviousState = function() {
        return this._prevState;
    };

    return StateManager;
}));
