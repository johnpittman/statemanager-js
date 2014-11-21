statemanager
============

Manages states with optional before and after transitions per state. Always built with JavaScript performance in mind.

<h1>Notes</h1>

Universal module defined to be used with <b>requirejs</b>, <b>node</b>, <b>commonjs</b>, or <b>global scoped</b> if no module loader is used.

- All files in the <b>dist</b> folder are minified for <b>production</b> use.
- All files in the <b>src</b> directory are the source code for <b>development</b> use.
- Packages point at the <b>dist</b> minified code with <b>source maps</b>.

<h1>Development</h1>

<h4>Requirements</h4>

- nodejs
- npm install
- npm install -g gulp bower

<h4>Test</h4>

gulp test

<h4>Gulp Commands</h4>

Each process is dependent upon the previous. If one fails the build process exits.

- gulp
- gulp test (Unit specifications)
- gulp build (Test, folder clean-ups, minification, source maps, renaming)
- gulp deploy (Test, build, versioning)

<h1>Usage</h1>

<h4>Installation</h4>

npm: npm install statemanager<br />
bower: bower install statemanager

<h4>How to use...</h4>

    var stateExample = {
        enter: function() {},
        leave: function() {},
        transitions: {
            beforeEnter: function() {},             // Optional
            beforeEnterFromStill: function() {},    // Optional
            leaveToWalking: function() {},          // Optional
        }
    };

    var movementStates = {
        'Still': {
            enter: function() {
                console.log('Standing Still.');
            },
            leave: function() {
                console.log('Leaving \'Still\'.');
            },
            transitions: {
                beforeEnter: function() {
                    console.log('Transitioning to \'Still\'.');
                }
            }
        },
        'Walking': {
            enter: function() {
                console.log('Walking.');
            },
            leave: function() {
                console.log('Leaving \'Walking\'.');
            },
            transitions: {
                beforeEnter: function() {
                    console.log('Transitioning to \'Walking\'.');
                }
            }
        },
        'Running': {
            enter: function() {
                console.log('Running.');
            },
            leave: function() {
                console.log('Leaving \'Running\'.');
            },
            transitions: {
                beforeEnterFromWalking: function() {
                    console.log('Enter \'Running\' from \'Walking\'.');
                },
                leaveToStill: function() {
                    console.log('Leave \'Running\' to \'Still\'.');
                }
            }
        }
    }

    var listener1 = function(data) {
        console.log('State change listener!');
        console.log(JSON.stringify(data));
    };

    var movementStateManager = new StateManager(this);

    console.log('Adding states.');
    movementStateManager.initialize(movementStates, 'Still');

    console.log('Initial state: ' + movementStateManager.getCurrentStateId());

    console.log('Changing state...');
    movementStateManager.changeState('Walking');

    console.log('Changing state...');
    movementStateManager.changeState('Running');

    console.log('Changing state...');
    movementStateManager.changeState('Still');

    console.log('Changing state...');
    movementStateManager.changeState('Walking');

<h1>Release Notes</h1>

<h3>v1.3.0</h3>

<h4>Breaking Changes...</h4>

These are breaking only if you were using them.
- Removed the initialize and unload processes. An object should be keeping track of it's own initial state. The object would run it's initialize method in the beforeEnter or enter processes and it's unload method in the leave process.
- Removed before leave processes because these make no sense to have since enter is the main(update) process and before enter is the previous which means leave is the next so we don't need a before next since there's no before previous.
- Removed the enterFrom process because one process to distinguish what state we're transitioning from is enough.

- Added: 
    /**
     * Accessor.
     * @return {object} - The actual state object to re-run the enter process if needed.
     */
    StateManager.prototype.getCurrentState;

<h3>v1.2.5</h3>

<h4>Additional Changes...</h4>

- Change the process order of the beforeEnter/beforeEnterFrom/enter calls as well as the beforeLeave/beforeLeaveTo/leave calls. It now is in the logical order of when they would need to be called unless I see something differently down the road but this was pretty thought out.

<h3>v1.1.1</h3>

<h4>Bug Fixes...</h4>

- Removed initialStateId paramenter from addStates(). This is now done on the initializeStates() method or can me manually set by setInitialState().

<h3>v1.1.0</h3>

<h4>Breaking Changes...</h4>

- addStates no longer runs the initial state. The initialize method should be used which will call addStates and then start();
- Names of the transistion events for each state have changed format. Before ex. onBeforeEnter, Now ex. beforEnter.

<h4>Additional Changes...</h4>

- Added setInitialState();
- Added ability to have optional initialize process for each state that will only get run once unless it's unloaded.
- Added ability to have optional unload process for each state that will only get run if the initialize process has been run.

<h4>Bug Fixes...</h4>

 - Make sure the transition object for a state exists.
 - leaveState now passes the data parameter into all leave processes.