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

- gulp test (Unit specifications)
- gulp build (Test, folder clean-ups, minification, source maps, renaming)
- gulp deploy (Test, build, versioning)

<h1>Usage</h1>

<h4>Installation</h4>

npm: npm install statemanager<br />
bower: bower install statemanager

<h4>How to use...</h4>

    var movementStates = {
        'Still': {
            enter: function() {
                console.log('Standing still.');
            },
            leave: function() {
                console.log('On to something else.');
            },
            transitions: {
                onBeforeEnter: function() {
                    console.log('Time to be chill.');
                },
                onBeforeLeave: function() {
                    console.log('Being still sucks.');
                }
            }
        },
        'Walking': {
            enter: function() {
                console.log('Walking.');
            },
            leave: function() {
                console.log('On to something else.');
            },
            transitions: {
                onBeforeEnter: function() {
                    console.log('Time to walk.');
                },
                onBeforeLeave: function() {
                    console.log('Screw walking.');
                }
            }
        },
        'Running': {
            enter: function() {
                console.log('Running.');
            },
            leave: function() {
                console.log('On to something else.');
            },
            transitions: {
                onEnterFromWalking: function() {
                    console.log('Time to run.');
                },
                onLeaveToStill: function() {
                    console.log('Running is tiresome.');
                }
            }
        }
    }

    var listener1 = function(data) {
        console.log('State change listener!');
    };

    var movementStateManager = new StateManager(this);

    console.log('Adding states.');
    movementStateManager.addStates(movementStates, 'Still');

    console.log('Previous state: ' + movementStateManager.getPreviousState());
    console.log('Initial state: ' + movementStateManager.getCurrentState());

    console.log('Changing state...');
    movementStateManager.changeState('Walking');
    console.log('Current state: ' + movementStateManager.getCurrentState());

    console.log('Changing state...');
    movementStateManager.changeState('Running');
    console.log('Current state: ' + movementStateManager.getCurrentState());

    console.log('Changing state...');
    movementStateManager.changeState('Still');
    console.log('Current state: ' + movementStateManager.getCurrentState());

<h1>Release Notes</h1>
