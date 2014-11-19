(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['./State'], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory(require('./State'));
    } else {
        // Browser globals (root is window)
        // State.js need to be included before StateManager.
        root.StateManager = factory();
    }
}(this, function(State) {
    'use strict'
    
    function StateManager() {}

    StateManager.State = State;

    return StateManager;
}));