(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['./State.min.js'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('./State'));
    } else {
        // Browser globals (root is window)
        // State.js need to be included before StateManager.
        root.StateManager = factory(root.StateManager.State);
    }
}(this, function(State) {
    'use strict'

    /**
     * @contructor
     * @param {object} owner=this - Object of what owns the states of the state manager. Used to mantain scope.
     */
    function StateManager(owner) {
        this._owner = owner || this;

        this._states = {};
        this._currentState;
        this._prevState;
        this._initialState;
    }

    StateManager.State = State;

    /**
     * Adds a state object to be managed.
     * @param {string} name
     * @param {StateManager.State} state - State object that contains all of the process methods.
     * @param {boolean} [isInitial] - If true, sets the state as the initial start state.
     */
    StateManager.prototype.addState = function(name, state, isInitial) {
        this._states[name] = state;

        if (isInitial !== undefined) {
            this._initialState = name;
            this.setCurrentState(initialState);
        }
    };

    StateManager.prototype.enterState = function(name) {
        var state = this._states[state.name];
        if (state !== undefined) {
            var enterFrom = state['enter:from:' + name];

            if (enterFrom !== undefined) {
                var beforeEnterFrom = state['before:enter:from:' + name];
                if (beforeEnterFrom !== undefined)
                    beforeEnterFrom.call(this._owner);
                enterFrom.call(this._owner);
            }
            state['enter'].call(this._owner);
        }
    };

    /**
     * Modifier.
     * Sets the current state to the state passed in without triggering events.
     * @param {string} name
     */
    StateManager.prototype.setCurrentState = function(name) {
        var currState = this._currentState;
        if (currState !== undefined)
            if (this._prevState !== currState)
                this._prevState = currState.toString();
        this._currentState = name;
    };

    /**
     * Sets the state machine back to the initial state.
     * @param {string} initialStateName
     */
    StateManager.prototype.start = function(initialStateName) {
        if (initialStateName !== undefined) {
            this.setCurrentState(initialStateName);
            this._prevState = undefined;
        }
        //this.changeState(this._initialState);
    };

    return StateManager;
}));
