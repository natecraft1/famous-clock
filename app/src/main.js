/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Surface = require('famous/core/Surface');
    var StateModifier = require('famous/modifiers/StateModifier');

    // create the main context
    var mainContext = Engine.createContext();

    // your app here
    mainContext.setPerspective(1000);

    // var logo = new ImageSurface({
    //     size: [100, 100],
    //     content: '/content/images/famous_logo.png',
    //     classes: ['backfaceVisibility']
    // });

    var initialTime = Date.now();
    var radius = 100;
    // var centerSpinModifier = new Modifier({
    //     align: [0.5, 0.5],
    //     origin: [0.5, 0.5],
    //     transform: function() {
    //         return Transform.rotateX(.002 * (Date.now() - initialTime));
    //     }
    // });

    // mainContext.add(centerSpinModifier).add(logo);

    var clockModifier = new Modifier({
        align: [0.5, 0.5],
        origin: [0.5, 0.5],
        transform: function() {
            return Transform.rotateY(.001 * (Date.now() - initialTime));
        }
    });
    var innerClockModifier = new Modifier({
        align: [0.5, 0.5],
        origin: [0.5, 0.5], 
        transform: function() {
            return Transform.rotateY(.0005 * (Date.now() - initialTime));
        }
    });
    var clockSurface = new Surface({
        size: [radius*2, radius*2],
        properties: {
            borderRadius: '50%',
            border: '10px solid lightblue',
            backfaceVisibility: 'visible'
        }
    });
    var innerClockSurface = new Surface({
        size: [radius, radius],
        properties: {
            borderRadius: '50%',
            border: '5px solid red',
            backfaceVisibility: 'visible'
        }
    });


    mainContext.add(clockModifier).add(clockSurface);
    mainContext.add(innerClockModifier).add(innerClockSurface);

    function createTime(i) {
        var angle = (- i - 3) * Math.PI / 6;
        var m = new Modifier({
            align: [.5, .5], 
            origin: [.5, .5],
            transform: function () {
                return Transform.translate(Math.cos(angle) * radius * .83, Math.sin(angle) * radius * .83);
            }
        });
        var numberSurface = new Surface({
            content: i,
            size: [true, true]
        });
    
        mainContext.add(m).add(numberSurface);
    }
    function setTimes () {
        for (var i = 1; i < 13; i++) {
            createTime(i);
        }
    }
    setTimes();

    var secondHandModifier = new Modifier({
        align: [0.5, 0.5], 
        origin: [0, 0.5],
        transform: function() {
            return Transform.rotateZ(((.001 * Date.now())%60)*-Math.PI/30 - Math.PI/2);
        }
    });
    var minuteHandModifier = new Modifier({
        align: [0.5, 0.5], 
        origin: [0, 0.5],
        transform: function() {
            var d = new Date;
            return Transform.rotateZ(((d.getMinutes() + Date.now()/1000%60/60) * -Math.PI/30) - Math.PI/2);
        }
  
    });
    var hourHandModifier = new Modifier({
        align: [0.5, 0.5], 
        origin: [0, 0.5],
        transform: function() {
            var d = new Date;
            var pc = (d.getHours() + d.getMinutes()/60 + Date.now()/1000%60/3600) * -Math.PI/6 - Math.PI/2;
            return Transform.rotateZ(pc);
        }
    });
    var secondHand = new Surface({
        size: [radius * .7, 1],
        properties: {
            backgroundColor: 'blue'
        }
    });

    var minuteHand = new Surface({
        size: [radius * .5, 1],
        properties: {
            backgroundColor: 'red',
        }
    });

    var hourHand = new Surface({
        size: [radius * .35, 1],
        properties: {
            backgroundColor: 'green'
        }
    });

    mainContext.add(secondHandModifier).add(secondHand);
    mainContext.add(minuteHandModifier).add(minuteHand);
    mainContext.add(hourHandModifier).add(hourHand);

});
