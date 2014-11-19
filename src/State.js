(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.StateManager = root.StateManager || {};
        root.StateManager.State = factory();
    }
}(this, function() {
    'use strict'

    /**
     * Enter and leave state processes are required as they are the foundation a state transition.
     * @contructor
     * @param {function} enterProcess - Code to be executed when entering the state.
     * @param {function} leaveProcess - Code to be executed when leaving the state.
     */
    function State(enterProcess, leaveProcess) {
        this.enter = enterProcess;
        this.leave = leaveProcess;
    }

    /**
     * Adds code as a function to be excuted before entering the state.
     * @param  {string} from - State name.
     * @param  {function} process - Code to be executed when entering the state.
     */
    State.prototype.onBeforeEnterFrom = function(from, process) {
        if (this.transitions === undefined)
            this.transitions = {};
        this.transitions['before:enter:from:' + from] = process;
    };

    /**
     * Adds code as a function to be excuted before entering the state.
     * @param  {string} from - State name.
     * @param  {function} process - Code to be executed when entering the state.
     */
    State.prototype.onEnterFrom = function(from, process) {
        if (this.transitions === undefined)
            this.transitions = {};
        this.transitions['enter:from:' + from] = process;
    };

    /**
     * Adds code as a function to be excuted before leaving the state.
     * @param  {string} to - State name.
     * @param  {function} process - Code to be executed when leaving the state.
     */
    State.prototype.onBeforeLeaveTo = function(to, process) {
        if (this.transitions === undefined)
            this.transitions = {};
        this.transitions['before:leave:to:' + from] = process;
    };

    /**
     * Adds code as a function to be excuted before leaving the state.
     * @param  {string} to - State name.
     * @param  {function} process - Code to be executed when leaving the state.
     */
    State.prototype.onLeaveTo = function(to, process) {
        if (this.transitions === undefined)
            this.transitions = {};
        this.transitions['leave:to:' + from] = process;
    };

    return State;
}));
