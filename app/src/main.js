/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Background = require('./Background');

    // create the main context
    var mainContext = Engine.createContext();

    // your app here
    mainContext.setPerspective(1000);

    var logo = new ImageSurface({
        size: [200, 200],
        content: '/content/images/famous_logo.png',
        classes: ['backfaceVisibility']
    });

    var initialTime = Date.now();
    var centerSpinModifier = new Modifier({
        origin: [0.5, 0.5],
        transform : function() {
            return Transform.rotateY(.002 * (Date.now() - initialTime));
        }
    });


    mainContext.add(new Modifier({origin: [0.5, 0.5]})).add(new Background());
});