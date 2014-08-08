
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

    var colors = ['red', 'black', 'orange', 'grey', 'white', 'yellow', 'blue'];
    colors.push.apply(colors, colors);

 //   var classes = ['background-extreme', 'background-far', 'background-mid', 'background-near'];

    var MOUNTAIN_MOVE = 200;
    var MOUNTAIN_MOVE_DURATION = 5000;
    var MTN_OP_TIME = 700;

    var MIN_WIDTH = window.innerWidth / 10, MAX_WIDTH = window.innerWidth / 4, SIZE_UNIT = 7;
    var MIN_HEIGHT = window.innerHeight / 20, MAX_HEIGHT = window.innerHeight / 8;
    var MAX_DEPTH = 50;

    function Mountain(options) {

        View.call(this, options);

        colors = _.shuffle(colors);
        this.mtnClass = colors.pop();

        this.addBottom();

        this.mtnSpeed = (Math.random() + 0.5)/10;

       this.initMtn();
    }

    Mountain.prototype = Object.create(View.prototype);

    Mountain.prototype.addBottom = function(){
        var s = new Surface({
            size:[ window.innerWidth, window.innerHeight/2],
            origin: [0.5, 1],
            classes: [this.mtnClass]

        }) ;
        this.add(s);

    };

    var a = 0;
    var startTime = new Date().getTime();

    Mountain.prototype.initMtn = function () {
        var max = 2 + (Math.floor(Math.random() * 4));
        var self = this;
        for (var i = 0; i < max; ++i){
            (function(n){
                var hill = new Surface({
                    size: [window.innerWidth/(2 * max), 40],
                    classes: [self.mtnClass],
                    content: '<b style="color: black">hill' + n + ': ' + a++ + '</b>'
                });

                self.add(new Modifier({
                    origin: [0, 0.5],
                   transform: function(){
                       var x = n * window.innerWidth /( max);
                       return Transform.translate((x + (new Date().getTime() - startTime) * self.mtnSpeed) % window.innerWidth * 2 - window.innerWidth/2, -20, 0);
                   }
                })).add(hill);

            }.bind(this))(i);
        }
    };

    Mountain.prototype._nextClass = function (preserve) {
        if (preserve) {
            return this.mtnClasses[0];
        }
        return this.mtnClasses.length ? [this.mtnClasses.shift(), this.mtnColor] : false;
    };

    module.exports = Mountain;
});