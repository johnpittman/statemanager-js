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
        initialize: function() {},
        enter: function() {},
        leave: function() {},
        unload: function() {},
        transitions: {
            beforeEnter: function() {},
            beforeEnterFromStill: function() {},
            enterFromStill: function() {},
            beforeLeave: function() {},
            leaveToWalking: function() {},
            beforeLeaveToWalking: function() {}
        }
    };

    var movementStates = {
        'Still': {
            initialize: function() {
                console.log('Calling the \'Still\' initialize the  process...');
            },
            enter: function() {
                console.log('Standing Still.');
            },
            leave: function() {
                console.log('Leaving \'Still\'.');
            },
            unload: function() {
                console.log('Calling the \'Still\' unload the  process...');
            },
            transitions: {
                beforeEnter: function() {
                    console.log('Transitioning to \'Still\'.');
                },
                beforeLeave: function() {
                    console.log('Transitioning from \'Still\'.');
                }
            }
        },
        'Walking': {
            initialize: function() {
                console.log('Calling the \'Walking\' initialize the  process...');
            },
            enter: function() {
                console.log('Walking.');
            },
            leave: function() {
                console.log('Leaving \'Walking\'.');
            },
            transitions: {
                beforeEnter: function() {
                    console.log('Transitioning to \'Walking\'.');
                },
                beforeLeave: function() {
                    console.log('Transitioning from \'Walking\'.');
                }
            }
        },
        'Running': {
            initialize: function() {
                console.log('Calling the \'Running\' initialize the  process...');
            },
            enter: function() {
                console.log('Running.');
            },
            leave: function() {
                console.log('Leaving \'Running\'.');
            },
            transitions: {
                enterFromWalking: function() {
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

    console.log('Initial state: ' + movementStateManager.getCurrentState());

    console.log('Changing state...');
    movementStateManager.changeState('Walking');

    console.log('Changing state...');
    movementStateManager.changeState('Running');

    console.log('Changing state...');
    movementStateManager.changeState('Still');

    console.log('Changing state...');
    movementStateManager.changeState('Walking');

<h1>Release Notes</h1>

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