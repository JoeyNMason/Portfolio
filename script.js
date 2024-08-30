var events = new Events();
// setting up variable called events
// creating a new instance
// this will then create a new object using the Events function
// this obj will be able to manage and handle events

events.add = function(obj){
    obj.events = { };
}
// this adds a function that is linked
// to the var events which gives abilities to obj
// obj can now manage and handle events

events.implement = function(fn) {
    fn.prototype = Object.create(Events.prototype);
}
// the implement method is to give any function used to create objects the
// ability to handle events using the 'Events' class's methods.
// fn.prototype = Object.create(Events.prototype); this line creates 
// new proto obj for fn based on 'Events.prototype'
// this means fns proto now has all methods and properties
// fn can now handle events

function Events(){
    this.events = { };
}
// creating a new object 
// that will store 
// this.events is a property of object
// { } object that will store events 

Events.prototype.on = function(name, fn){
    // method called on for all objects created with Events 
    // function should be executed when event happens
    var events = this.events[name];
    // looks for functions specified by `name`
    // holds current list of function this event
    if(events == undefined) {
        this.events[name] = [ fn ];
        this.emit('event:on', fn);
        // if first time adding func
        // create new list with func fn 
        // assign it to `this.events[name]`
        // calls emit method to notify that new event handler has been added
    } else {
        if(events.indexOf(fn) == -1){
            // checks if fn is not already in the list 
            events.push(fn);
            // adds it
            this.emit('event:on', fn);
            // calls emit
        }
    }
    return this;
    // method chaining
    // can call on multiple times in a row 
}


Events.prototype.once = function (name, fn){
    // once method for obj created with Events
    // adds function that will run only once when
    // specific event happens
    var events = this.events[name];
    fn.once = true;
    // adds property so it knows to only run once
    if(!events){
        // checks if theres no functions for this event
        this.events[name] = [ fn ];
        // creates new list with fn and gives it to the `name` event
        this.emit('event:once', fn);
    } else {
        if(events.indexOf(fn) == -1){
            // checks if fn is there
            events.push(fn);
            // adds fn if not
            this.emit('event:once', fn);
            // notify that new fn func has been added
        }
    }
    return this;
    // method chaining
    // even tho its a once method it can still be called multi times
}

Events.prototype.emit = function(name, args){
    // emit method triggers or fires the event and call all functions associated with it 
    // arguments passed to functions that handle this event
    var events = this.events[name];
    if (events){
        var i = events.length;
        // gets number of functions in list
        while(i--){
            // loops through each function in list
            if(events[i]){
                // checks if func exists
                events[i].call(this, args);
                // calls func with arguements and sets the context to current obj
                // this runs the func and gives it data provided
                if(events[i].once){
                    // checks if func is marked to run only once
                    delete events[i];
                    // removes func if it is a once function
                    // wont run again in future
                }
            }
        }
    }
    return this;
    // method chaining
    // can be called multi times in row
}

Events.prototype.unbind = function(name, fn){
    // unbind method 
    // removes event handlers from event system
    // event handlers need to be removed from name
    // fn the function that needs to be removed
    // if not provided removes all handlers from event
    if(name){
        // event name is provided
        var events = this.events[name];
        // retrieve list of functions 
        if(events){
            // checks if there are functions for this event
            if(fn){
                // checks if specific func is provided
                var i = events.indexOf(fn);
                // finds position of func in list
                if(i != -1){
                    // if found removes func
                    delete events[i];
                    // deletes func from list
                }
            } else{
                delete this.events[name];
                // if no spec func was provided remove all funcs by 
                // deleting event from list
            }
        }
    } else {
        delete this.events;
        this.events = { };
        // if no event name was provided
        // deletes all events and resets list to empty obj
    }
    return this;
    // method chaining 
    // call unbind multi times
}

var userPrefix;
// declares variable named userPrefix
// store a value that is important for future code

// code is figuring out what browser is being used so 
// correct css and js prefixes can be applied
var prefix = (function () {
    var styles = window.getComputedStyle(document.documentElement, ''),
    // gets all css styles applied to root <html>
    // stored in var styles
        pre = (Array.prototype.slice
            // looking for spec prefix used by browser
            .call(styles)
            // converting styles into array of strings 
            .join('')
            // joining all strings into one long string
            .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
            // searching that string for prefix
        )[1],
        dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
        // looks for standard JS name that matches prefix in string
    userPrefix = {
        // creates obj that stores diff forms of prefix
        dom: dom,
        // the JS friendly ver of prefix
        lowercase: pre,
        // lower case ver of prefix
        css: '-' + pre + '-',
        // the css ver of prefix
        js: pre[0].toUpperCase() + pre.substr(1)
        // the JS ver
    };
})();
// code is wrapped in a func that runs immediately

// func makes sure that if something happens to html element the 
// code will run regardless of which browser youre using
// checks if element has event listener
// if browser supports add event listener it attaches
// if older browser it uses attachEvent in the else statement
function bindEvent(element, type, handler){
    if(element.addEventListener){
        element.addEventListener(type, handler, false);
        // when event type happens on this element run handler func
        // false means event will bubble up 
    } else {
        element.attachEvent('on' + type, handler);
    }
}

function Viewport(data){
    // how cube reacts to mouse movement or touch on a screen
    events.add(this);
    // connects Viewport obj to event system to listen to trigger events

    var self = this;
    // makes sure that inside other funcs self always refers to this Viewport object

    this.element = data.element;
    // the html element that 3D obj is attached too
    this.fps = data.fps;
    this.sensivity = data.sensivity;
    this.sensivityFade = data.sensivityFade;
    this.touchSensivity = data.touchSensivity;
    this.speed = data.speed;

    this.lastX = 0;
    this.lastY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.distanceX = 0;
    this.distanceY = 0;
    this.positionX = 1122;
    this.positionY = 136;
    this.torqueX = 0;
    this.torqueY = 0;

    this.down = false;
    this.upsideDown = false;

    this.previousPositionX = 0;
    this.previousPositionY = 0;

    this.currentSide = 0;
    this.calculatedSide = 0;

    bindEvent(document, 'mousedown', function() {
        self.down = true;
    });
    // listens for mouse button is down sets a flag (self.down)
    // to true showing that mouse is currently pressed

    bindEvent(document, 'mouseup', function () {
        self.down = false;
    });
    // when mouse is released flag is set to false

    bindEvent(document, 'keyup', function () {
        self.down = false;
    });
    // when key is released flag is set to false

    bindEvent(document, 'mousemove', function(e) {
        self.mouseX = e.pageX;
        self.mouseY = e.pageY;
    });
    // tracks current position of mouse as it moves on screen 
    // stores X and Y cords

    bindEvent(document, 'touchstart', function(e) {

        self.down = true;
        e.touches ? e = e.touches[0] : null;
        self.mouseX = e.pageX / self.touchSensivity;
        self.mouseY = e.pageY / self.touchSensivity;
        self.lastX  = self.mouseX;
        self.lastY  = self.mouseY;
    });
    // tracks if finger is pressed on screen
    // tracks if finger is moving along screen
    // tracks if finger is off the screen
    // stores inside self.mouseX & Y

    bindEvent(document, 'touchmove', function(e) {
        if(e.preventDefault) {
            e.preventDefault();
        }

        if(e.touches.length == 1){
            e.touches ? e = e.touches[0] : null;

            self.mouseX = e.pageX / self.touchSensivity;
            self.mouseY = e.pageY / self.touchSensivity;
        }
    });
    // tracks if finger is pressed on screen
    // tracks if finger is moving along screen
    // tracks if finger is off the screen
    // stores inside self.mouseX & Y

    bindEvent(document, 'touchend', function(e) {
        self.down = false;
    });
    // tracks if finger is pressed on screen
    // tracks if finger is moving along screen
    // tracks if finger is off the screen
    // stores inside self.mouseX & Y

    setInterval(this.animate.bind(this), this.fps);
    // this line sets up reg update every few milliseconds to adjust
    // pos and rot of 3d obj on screen based on latest mouse or touch
    // inputs
}

events.implement(Viewport);
Viewport.prototype.animate = function(){
    
    // calculate how much the mouse has moved since last frame
    this.distanceX = (this.mouseX - this.lastX);
    this.distanceY = (this.mouseY - this.lastY);

    // update last known mouse position
    this.lastX = this.mouseX;
    this.lastY = this.mouseY;

    // if the mouse is being held down
    if(this.down){
        // adjust the rotatation speed based on how fast the mouse is moving
        this.torqueX = this.torqueX * this.sensivityFade + (this.distanceX * this.speed - this.torqueX) * this.sensivity;
        this.torqueY = this.torqueY * this.sensivityFade + (this.distanceY * this.speed - this.torqueY) * this.sensivity;
    }

    // if the rotation is signif enough more then 1deg in any direction
    if(Math.abs(this.torqueX) > 1.0 || Math.abs(this.torqueY) > 1.0) {
        // if the mouse is not held down slowly reduce the rotation speed 
        if(!this.down){
            this.torqueX *= this.sensivityFade;
            this.torqueY *= this.sensivityFade;
        }

        //  update the vert rotation 
        this.positionY -= this.torqueY;

        // ensure the rotation stays within 0-360deg range
        if(this.positionY > 360){
            this.positionY -= 360;
        } else if(this.positionY < 0){
            this.positionY += 360;
        }

        // depending on the vert rotation adjust the hori rotation
        // this determines whether the element should rotate left or right or be flipped upside down
        if(this.positionY > 90 && this.positionY < 270){
            this.positionX -= this.torqueX;

            // if the element is now upside down emit event to notif the system 
            if(!this.upsideDown) {
                this.upsideDown = true;
                this.emit('upsideDown', { upsideDown: this.upsideDown });
            }
        } else {

            this.positionX += this.torqueX;

            // if element is no longer upside down emit an event to notify the system
            if(this.upsideDown) {
                this.upsideDown = false;
                this.emit('upsideDown', { upsideDown: this.upsideDown });
            }
        }

        // ensure the rotate stays within the 0-360deg range
        if(this.positionX > 360){
            this.positionX -= 360;
        } else if(this.positionX < 0){
            this.positionX += 360;
        }

        // determine which side of element is currently facing the user based on its rotation 
        if(!(this.positionY >= 46 && this.positionY <= 130) && !(this.positionY >= 220 && this.positionY <= 308)){
            // if element is upside down the sides are reversed
            if(this.upsideDown){
                if(this.positionX >= 42 && this.positionX <= 130){
                    this.calculatedSide = 3;
                } else if (this.positionX >= 131 && this.positionX <= 223){
                    this.calculatedSide = 2;
                } else if(this.positionX >= 224 && this.positionX <= 314){
                    this.calculatedSide = 5;
                } else {
                    this.calculatedSide = 4;
                }
            } else {
                // else calc the side normally 
                if(this.positionX >= 42 && this.positionX <= 130){
                    this.calculatedSide = 5;
                } else if(this.positionX >= 131 && this.positionX <= 223){
                    this.calculatedSide = 4;
                } else if(this.positionX >= 224 && this.positionX <= 314){
                    this.calculatedSide = 3;
                } else {
                    this.calculatedSide = 2;
                }
            }
        } else {
            // if element is tilted more up or down the top or bottom sides are showing 
            if(this.positionY >= 46 && this.positionY <= 130){
                this.calculatedSide = 6;
            }

            if(this.positionY >= 220 && this.positionY <= 308){
                this.calculatedSide = 1;
            }
        }
        
        // if the currently displayed side has change emit event to notif system
        if(this.calculatedSide !== this.currentSide) {
            this.currentSide = this.calculatedSide;
            this.emit('sideChange');
        }
    }

    // apply calc rotation to element CSS
    this.element.style[userPrefix.js + 'Transform'] = 'rotateX(' + this.positionY + 'deg) rotateY(' + this.positionX + 'deg)';

    // if position has changed since last frame emit a rotate event
    if(this.positionY != this.previousPositionY || this.positionX != this.previousPositionX) {
        this.previousPositionY = this.positionY;
        this.previousPositionX = this.positionX;

        this.emit('rotate');
    }
}

var viewport = new Viewport({
    element: document.getElementsByClassName('cube')[0],
    fps: 20,
    sensivity: .1,
    sensivityFade: .93,
    speed: 2,
    touchSensivity: 1.5
});

function Cube(data){
    var self = this;

    // stores cube element and its sides 
    this.element = data.element; // refer to html element that reps the cube
    this.sides = this.element.getElementsByClassName('side'); // gets all the elements with the class of side inside the cube

    // ref the viewport obj which control the cube rotation etc
    this.viewport = data.viewport;
    // event listeners on viewport for when certain actions occur
    // when cube rotates call rotateSides method
    this.viewport.on('rotate', function() {
        self.rotateSides();
    });
    
    // when cube flips upside down call method
    this.viewport.on('upsideDown', function(obj) {
        self.upsideDown(obj);
    });

    // whne visible cube side changes call method
    this.viewport.on('sideChange', function() {
        self.sideChange();
    });
}

// define a method on cube proto to rotate sides of cube 
Cube.prototype.rotateSides = function(){
    var viewport = this.viewport; // get a refer to viewport obj controlling cube 

    // check if cube is upside down based on vert position Y axis 
    if(viewport.positionY > 90 && viewport.positionY < 270){
        // rotate front side based on hori posi and torque
        this.sides[0].getElementsByClassName('cube-image')[0].style[userPrefix.js + 'Transform'] = 'rotate(' + (viewport.positionX + viewport.torqueX) + 'deg)';
        // rotate back face in oppo direction 
        this.sides[5].getElementsByClassName('cube-image')[0].style[userPrefix.js + 'Transform'] = 'rotate(' + -(viewport.positionX + 180 + viewport.torqueX) + 'deg)';
    } else {
        // if cube is not upside down rotate based on posi and torque
        this.sides[0].getElementsByClassName('cube-image')[0].style[userPrefix.js + 'Transform'] = 'rotate(' + (viewport.positionX - viewport.torqueX) + 'deg)';
        // rotate back face similarly
        this.sides[5].getElementsByClassName('cube-image')[0].style[userPrefix.js + 'Transform'] = 'rotate(' + -(viewport.positionX + 180 - viewport.torqueX) + 'deg)';
    }
}

// define method on cube flipping upside down
Cube.prototype.upsideDown = function(obj){

    // determine the rotate if cube is upside down or not 
    var deg = (obj.upsideDown == true) ? '180deg' : '0deg';
    var i = 5; // start with side 5 work downwards

    // loop through sides except front and back and apply rotation 
    while(i > 0 && --i) {
        this.sides[i].getElementsByClassName('cube-image')[0].style[userPrefix.js + 'Transform'] = 'rotate(' + deg + ')';
    }
}

// define method on cube proto to handle changes in active side of cube
Cube.prototype.sideChange = function(){
    
    // loop through all cube sides
    for(var i = 0; i < this.sides.length; ++i) {
        // reset class of each sides image to default
        this.sides[i].getElementsByClassName('cube-image')[0].className = 'cube-image';
    }

    // set class of current active side to cube-image-active
    this.sides[this.viewport.currentSide - 1].getElementsByClassName('cube-image')[0].className = 'cube-image active';
}

// create new instance of cube passing in viewport and cube element
new Cube({
    viewport: viewport, // link the cube instance to the existing viewport instance
    element: document.getElementsByClassName('cube')[0] // specify html element repre the cube
});

// ---------------------------clock-------------------------------

const timeElement = document.querySelector('.time');

function showTime() {
    let currentTime = new Date(); 
    timeElement.innerText = currentTime.toLocaleTimeString("en-GB", { 
        hour: "2-digit", 
        minute: "2-digit", 
        hour12: true 
    });
    setTimeout(showTime, 1000); 
}

showTime();