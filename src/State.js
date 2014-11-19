(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory();
    } else {}
}(this, function() {
    'use strict'

    /**
     * @contructor
     */
    function State() {
    }

    // State.prototype.onEnter = function(callback) {
    //     this['enter'] = callback;
    // };

    //  State.prototype.onLeave = function(callback) {
    //     this['leave'] = callback;
    // };

    // State.prototype.onEnterFrom = function(from, callback) {
    //     if (this.transitions === undefined)
    //         this.transitions = {};
    //     this.transitions['enter:from:' + from] = callback;
    // };

    // State.prototype.onBeforeEnterFrom = function(from, callback) {
    //     if (this.transitions === undefined)
    //         this.transitions = {};
    //     this.transitions['before:enter:from:' + from] = callback;
    // };

    // State.prototype.onLeaveTo = function(to, callback) {
    //     if (this.transitions === undefined)
    //         this.transitions = {};
    //     this.transitions['leave:to:' + from] = callback;
    // };

    // State.prototype.onBeforeLeaveTo = function(to, callback) {
    //     if (this.transitions === undefined)
    //         this.transitions = {};
    //     this.transitions['before:leave:to:' + from] = callback;
    // };

    return State;
}));
