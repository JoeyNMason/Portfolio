var events = new Events();
// setting up variable called events
// creating a new instance
// this willl then create a new object using the Events funciton
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
    var events = this.events[name];
    if (events){
        var i = events.length;
        while(i--){
            if(events[i]){
                events[i].call(this, args);
                if(events[i].once){
                    delete events[i];
                }
            }
        }
    }
    return this;
}

