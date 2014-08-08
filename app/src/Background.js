/* globals define, _ */
define(function (require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Node = require('famous/core/RenderNode');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');

    var Mountain = require('./Mountain');

    var MTN_INT = 150;
    var MAX_MTNS = 15;
var INIT_MTNS = 5;


    function Background(options) {
        View.call(this, options);

        this.mountains = [];

        for (var i = 0; i < INIT_MTNS; ++i){
            var mtn = new Mountain({z: 0});
            this.add(new Modifier({transform: Transform.translate(0, i * 20, 0), origin: [0.5, 1]})).add(mtn);
            this.mountains.push(mtn);
        }
    }

    Background.prototype = Object.create(View.prototype);

    return Background;
});
