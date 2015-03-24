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
    var View = require('famous/core/View');
    var Transitionable = require('famous/transitions/Transitionable');
    var Easing = require('famous/transitions/Easing');
    var EventHandler = require('famous/core/EventHandler');


    // create the main context
    var mainContext = Engine.createContext();

    // your app here
    mainContext.setPerspective(1000);


    var initialTime = Date.now();
    var radius = 100;
    var transitionState = new Transitionable(0);
    var numberRotationState = new Transitionable(0);
    var transition = { duration: 3000, curve: Easing.outBounce };
    var ageClickEventHandler = new EventHandler();

    var clockModifier = new Modifier({
        align: [0.5, 0.5],
        origin: [0.5, 0.5],
        transform: function() {
            return Transform.rotate(.001 * (Date.now() - initialTime), .001 * (Date.now() - initialTime), 0);
        }
    });
    var innerClockModifier = new Modifier({
        align: [0.5, 0.5],
        origin: [0.5, 0.5],
        transform: function() {
            return Transform.rotateX(.0005 * (Date.now() - initialTime));
        }
    });
    var innerClockScaleModifier = new Modifier({
        transform: function() {
            if (transitionState.get() == 1) {
                transitionState.set(4, transition);
            } else if (transitionState.get() == 4) {
                transitionState.set(1, transition);
            }
            return Transform.scale(transitionState.get());
        }
    });
    var innerDotModifier = new Modifier({
        align: [0.5, 0.5],
        origin: [0.5, 0.5]
 
    });
    var clockSurface = new Surface({
        size: [radius*2, radius*2],
        properties: {
            borderRadius: '50%',
            border: '10px solid #A3F4FF',
            backfaceVisibility: 'visible'
        }
    });
    var innerClockSurface = new Surface({
        size: [radius, radius],
        properties: {
            borderRadius: '50%',
            border: '5px solid #FFFDA3',
            backfaceVisibility: 'visible'
        }
    });
    var innerDotSurface = new Surface({
        size: [10, 10],
        properties: {
            backgroundColor: 'pink',
            borderRadius: '50%',
            backfaceVisibility: 'visible'
        }
    });

    mainContext.add(innerDotModifier).add(innerDotSurface);
    mainContext.add(clockModifier).add(clockSurface);
    mainContext.add(innerClockModifier).add(innerClockSurface);
    //    mainContext.add(innerClockModifier).add(innerClockScaleModifier).add(innerClockSurface);
    function makeAgeFromClock(n) {
        console.log("called");
        if (n < 13) return [n];
        n = n + "";
        return [+n[0], +n[1]];

    }
    var transitionBack = [];
    var originalTranslate = Transform.translate(radius * 5,0,0);
    var originalProperties = { fontSize: "13px", color: "#7010B5" };

    function createTime(i) {
        var angle = (- i - 3) * Math.PI / 6;

        var m = new Modifier({
            align: [.5, .5], 
            origin: [.5, .5],
            transform:  function () {  return Transform.rotateZ(angle + transitionState.get()) }
            
        });
        var numberSurface = new Surface({
            content: i,
            size: [true, true],
            properties: originalProperties
        });
        var translateModifier = new StateModifier({
            transform : originalTranslate
        });
        var rotateModifier = new StateModifier({
            transform : Transform.rotateZ(-angle)
        });
        
        ageClickEventHandler.on("ageClicked", function(age) {
            var a = makeAgeFromClock(age);
            if (a.indexOf(i) != -1) {
                transitionBack.push(i);
                translateModifier.setTransform(Transform.translate(radius*1.2,0,0), { duration: 1000, curve: 'easeOut' } );
                numberSurface.setProperties({ fontSize: "20px", color: "#B527C2"});
            } else if (transitionBack.indexOf(i)) {
                translateModifier.setTransform(Transform.translate(radius, 0, 0), { duration: 1000, curve: 'easeOut' } );
                numberSurface.setProperties(originalProperties);
                transitionBack.splice(transitionBack.indexOf(i), 1);
            }
        });

       mainContext.add(m).add(translateModifier).add(rotateModifier).add(numberSurface);
       translateModifier.setTransform(Transform.translate(radius, 0, 0), transition);

    }
    function setTimes () {
        for (var i = 1; i < 13; i++) {
            createTime(i);
        }
    }
    setTimes();

    var secondHandModifier = new Modifier({
        align: [0.5, 0.5], 
        origin: [-3, 0.5],
        transform: function() {
            return Transform.rotateZ(((.001 * Date.now())%60)*-Math.PI/30 - Math.PI/2);
        }
    });
    var minuteHandModifier = new Modifier({
        align: [0.5, 0.5], 
        origin: [-1.5, 0.5],
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
        size: [radius * .3, 1],
        properties: {
            backgroundColor: 'blue'
        }
    });

    var minuteHand = new Surface({
        size: [radius * .3, 1],
        properties: {
            backgroundColor: 'red',
        }
    });

    var hourHand = new Surface({
        size: [radius * .3, 1],
        properties: {
            backgroundColor: 'green'
        }
    });

    mainContext.add(secondHandModifier).add(secondHand);
    mainContext.add(minuteHandModifier).add(minuteHand);
    mainContext.add(hourHandModifier).add(hourHand);

    for (var i = 1; i < 27; i++) {
        createAgeSurface(i);
    }
    function createAgeSurface (age) {
        var ageSurface = new Surface({
            content: age,
            size: [true,true],
            properties: {
                color: '#333',
                fontSize: '24px',
                cursor: 'pointer'
            }
        });
        ageSurface.on('click', function() {
            ageClickEventHandler.emit('ageClicked', age);
        });
        var positionModifier = new Modifier({
            transform: Transform.translate(50 * age, 20, 0)
        });
        var alignModifier = new StateModifier({
            align: [0, 0.1]
        });
        mainContext.add(alignModifier).add(positionModifier).add(ageSurface);
    }

    transitionState.set(2*Math.PI, transition);


});
