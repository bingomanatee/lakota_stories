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

    var MIN_WIDTH = window.innerWidth / 10, MAX_WIDTH = window.innerWidth / 4, SIZE_UNIT = 7;
    var MIN_HEIGHT = window.innerHeight / 20, MAX_HEIGHT = window.innerHeight / 8;
    var MAX_DEPTH = 50;
    var MTN_INT = 150;
    var MAX_MTNS = 15;

    function _randomWidth() {
        var out = Math.random() * (MAX_WIDTH - MIN_WIDTH) + MIN_WIDTH;
        out -= out % SIZE_UNIT;
        return out;
    }

    function _randomHeight() {
        var out = Math.random() * (MAX_HEIGHT - MIN_HEIGHT) + MIN_HEIGHT;
        out -= out % SIZE_UNIT;
        return out;
    }

    function _randomX() {
        return Math.random() * MAX_WIDTH * 2 * (Math.random() > 0.5 ? 1 : -1);
    }

    function _randomZ() {
        return Math.random() * MAX_DEPTH * -1;
    }

    var colors = ['red', 'black', 'orange', 'grey'];
    var classes = ['background-extreme', 'background-far', 'background-mid', 'background-near'];
    var mountains = [];

    function Background(options) {
        View.call(this, options);

        this.mi = setInterval(function () {
            if (mountains > MAX_MTNS) {
                return this.clearInterval(this.mi);
            }
            this.add(new Mountain());
        }.bind(this), MTN_INT);
    }

    Background.prototype = Object.create(View.prototype);

    var MOUNTAIN_MOVE = 200;
    var MOUNTAIN_MOVE_DURATION = 5000;
    var MTN_OP_TIME = 700;

    function Mountain(options) {

        View.call(this, options);

        var h = _randomHeight();
        var w = _randomWidth();
        var z = -MAX_DEPTH;
        var x = _randomX();

        this.startXYZ = [2 *x, 0, z];
        var mod = new Modifier({
            transform: Transform.translate.apply(Transform, this.startXYZ),
            origin: [0.5, 0.5],
            opacity: 0
        });

        this.mod = mod;

        this.mtnColor = _.shuffle(colors)[0];

        var s = new Surface({
            size: [w, h],
            anchor: [0.5, 0.5],
            content: '<div class="shadowMask" />'
        });

        this.s = s;

        this.add(mod).add(s);


        mountains.push(this);

        this.initMtn();
    }

    Mountain.prototype = Object.create(View.prototype);

    Mountain.prototype.initMtn = function () {

        this.mtnClasses = classes.slice(0);
        this.mod.setTransform(Transform.translate.apply(Transform, this.startXYZ));
        var offsetCoords = this.startXYZ.slice();
        offsetCoords[2] += MOUNTAIN_MOVE;
        this.mod.setTransform(Transform.translate.apply(Transform, offsetCoords), {duration: MOUNTAIN_MOVE_DURATION},
            function () {
                this.mod.setOpacity(0, {duration: MTN_OP_TIME / 2}, this.initMtn.bind(this));
            }.bind(this)
        );
        this.mod.setOpacity(1, {duration: MTN_OP_TIME});

        var ci = setInterval(function () {
            var c = this._nextClass();
            if (c) {
                this.s.setClasses(c);
            } else {
                clearInterval(ci);
            }
        }.bind(this), MOUNTAIN_MOVE_DURATION / classes.length);

        this.s.setClasses(this._nextClass());
    };

    Mountain.prototype._nextClass = function (preserve) {
        if (preserve) {
            return this.mtnClasses[0];
        }
        return this.mtnClasses.length ? [this.mtnClasses.shift(), this.mtnColor] : false;
    };

    return Background;
});
