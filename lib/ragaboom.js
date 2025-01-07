/*
Ragaboom Framework by Chambs o.chambs@gmail.com

Copyright (C) 2011 by Willian Carvalho

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

const RB = {};

RB.Scene = function(canvasObj, loopTime) {
    
    if(!canvasObj){
        throw new Error("RB.Scene(canvasObject): You must specify a canvas object");
    }
    
    if(!loopTime){
        loopTime = 24;
    }
    
    this.timeInterval = loopTime;
    const c = canvasObj;
    const d = document;
    this.ctx = c.getContext('2d');
    const objects = [];
    
    /** The object that must be moved by arrow keys */
    let movableObjectId = null;
    
    //the keys pressed at the present moment
    let leftP = false;
    let rightP = false;
    let topP = false;
    let downP = false;
    
    //controls if mouse is pressed or not
    let mouseIsDown = false;
    
    //the current object being dragged
    let currentObject = null;
    
    let dX=0, dY=0;

    // collidable objects
    const colObjects = [];
    
    const draggableObjects = [];

    // controls if the game loop should run or not
    let isStarted = false;

    // number of images attached to the scene
    let imgNum = 0;

    // number of loaded images which are attached to the scene
    let imgCounter = 0;
    
    let divIdCounter = 0;
    
    this.genID = function(){
        return 'RB_OBJECT' + (divIdCounter++);
    }	
    
    // attaches the object to the scene object
    this.add = function(obj) {
        
        //checks if the object exists
        if(!obj){
            throw new Error("RB.Scene.add(obj): the object you are trying to add to the scene doesn't exist.");
        }
        
        objects.push(obj);

        // adds the object on a separate 
        // array if it is set to collision
        if (obj.collidable)
            colObjects.push(obj);
        
        // adds the object on a separate 
        // array if it is draggable
        if (obj.draggable){
            draggableObjects.push(obj);
        }
        
        return obj;
    };
    
    //adds a lot of objects at a time by passing an array
    this.addLots = function(objArray){
        const theScene = this;
        for(let i=0; i < objArray.length; i++){
            theScene.add(objArray[i]);
        }
    };
    
    //removes an object from the scene
    this.remove = function(obj){
        const UID = obj.getId();
        const OBJ_LEN = objects.length;
        const D_OBJ_LEN = draggableObjects.length;
        const C_OBJ_LEN = colObjects.length;
        
        for(let i=0; i < OBJ_LEN; i++){
            if(UID == objects[i].getId()){
                objects.splice(i, 1);
                break;
            }
        }
        
        for(let i=0; i < C_OBJ_LEN; i++){
            if(UID == colObjects[i].getId()){
                colObjects.splice(i, 1);
                break;
            }
        }
        
        for(let i=0; i < D_OBJ_LEN; i++){
            if(UID == draggableObjects[i].getId()){
                draggableObjects.splice(i, 1);
                break;
            }
        }
    };
    
    //removes a lot of objects at once by passing an array
    this.removeLots = function(objArray){
        const theScene = this;
        for(let i=0; i < objArray.length; i++){
            theScene.remove(objArray[i]);
        }
    };
    
    /*
     * Removes all objects from the scene
     * Usually used to show a new screen
     */
    this.removeAll = function(){
        const OBJ_LEN = objects.length;
        const D_OBJ_LEN = draggableObjects.length;
        const C_OBJ_LEN = colObjects.length;

        objects.splice(0, OBJ_LEN);
        colObjects.splice(0, C_OBJ_LEN);
        draggableObjects.splice(0, D_OBJ_LEN);
    };
    
    this.zIndex = function(obj, index){
        const OBJ_LEN = objects.length;
        const currIndex = getIdByObject(obj);
        let newIndex = currIndex + index;
        
        if(newIndex < 0){
            newIndex = 0;
        }
        if(newIndex >= OBJ_LEN){
            newIndex = OBJ_LEN-1;
        }
        
        //saves a copy of the object
        const tmp = objects[currIndex];
        objects[currIndex] = objects[newIndex];
        objects[newIndex] = tmp;
    };
    
    //returns an object from the object array by its id
    getObjectById = function(id){
        const OBJ_LEN = objects.length;
        for(let i=0; i < OBJ_LEN; i++){
            if(objects[i].getId() == id){
                return obj;
            }
        }
        return null;
    };
    
    //returns an object id from the oject
    getIdByObject = function(ob){
        const OBJ_LEN = objects.length;
        for(let i=0; i < OBJ_LEN; i++){
            if(objects[i].getId() == ob.getId()){
                return i;
            }
        }
        return null;
    };
    
    this.setMovableObject = function(objectOrId){
        if(typeof objectOrId == 'object') {
            movableObjectId = objectOrId.getId();
        } else {
            movableObjectId = objectOrId;
        }
    };
    
    this.getMovableObject = function(){
        return getObjectById(movableObjectId);
    };
    
    /**
     * Key direction
     * 
     * Gets the keys pressed. It's used on the movable object.
     * @param {KeyboardEvent} keyboardEvent Keyboard event
     * @param {boolean} flag Boolean flag
     */
    var getKeyDirection = function(keyboardEvent, flag){
        const CODE = keyboardEvent.keyCode | keyboardEvent.code;
    
        switch(CODE){
            case 37:
            leftP = flag;
            break;
        
            case 38:
            topP = flag;
            break;
        
            case 39:
            rightP = flag;
            break;
        
            case 40:
            downP = flag;
            break;
        }
    };
    
    this.onmousemove = function(event){};
    this.onmousedown = function(event){};
    this.onmouseup = function(event){};
    this.onkeydown = function(event){};
    this.onkeyup = function(event){};
    
    //registers canvas events
    let theScene = this;
    c.onmousemove = function(event){mouseMove(event); theScene.onmousemove(event);};
    c.onmousedown = function(event){mousedown(event); theScene.onmousedown(event);};
    c.onmouseup = function(event){mouseIsDown = false; theScene.onmouseup(event);};
    
    d.onkeydown = function(event){
        getKeyDirection(event, true);
        theScene.onkeydown(event);
    };
    
    d.onkeyup = function(event){
        getKeyDirection(event, false);
        theScene.onkeyup(event);
    };
    
    //event methods
    const mouseMove = function(event){
        if(mouseIsDown && currentObject) {
            currentObject.x = (RB.xPos(event) - dX);
            currentObject.y = (RB.yPos(event) - dY);
            
            /* if you r trying to drag something
             * but the scene is being animated, that should be checked first.
             * so, if the scene is being animated, the animation itself
             * takes care of the drag effect. otherwise the update method
             * is called.  
             */
            if(!isStarted){
                theScene.update();
            }
        }
    };
    
    const mousedown = function(event){
        const D_OBJ_LEN = draggableObjects.length-1;

        for(let i=D_OBJ_LEN; i >= 0; i--){
            const obj = draggableObjects[i];

            if( obj.checkRange(RB.xPos(event), RB.yPos(event)) ){
            
                //mouse events for objects go here
                obj.onmousedown(event);
            
                currentObject = obj;
                
                dX = RB.xPos(event) - currentObject.x;
                dY = RB.yPos(event) - currentObject.y;
                mouseIsDown = true;
                break;
            }
        }
    };
    
    /**
     * Get object size
     * 
     * @returns Object list size
     */
    this.getObjectSize = function() {
        return objects.length;
    };

    /**
     * 
     * @param {number} index Object index
     * @returns Object
     */
    this.getObj = function(index) {
        return objects[index];
    };
    
    /**
     * Rectangle
     * 
     * Draws a rectangle inside a buffer canvas.
     * @param {number} width Width
     * @param {number} height Height
     * @param {string | CanvasGradient} fillStyle Fill style
     * @param {string} id Object ID
     * @param {Object} strokeStyle Stroke style object
     * @returns 
     */
    this.rect = function(width, height, fillStyle, id, strokeStyle) {
        var theScene = this;
        if(!id) id = theScene.genID();
        const c = RB.createCanvas(width, height, id);
        const ctx = c.getContext('2d');
        
        if(fillStyle){
            ctx.fillStyle = RB.getFS(fillStyle, ctx, height);
            ctx.fillRect(0, 0, width, height);
        }
        
        if(strokeStyle){
            const LW = strokeStyle.lineWidth || 1;
            ctx.lineWidth = strokeStyle.lineWidth;
            ctx.strokeStyle = strokeStyle.strokeStyle;
            ctx.rect(0+LW, 0+LW, width-LW-LW, height-LW-LW);
            ctx.stroke();
        }
        
        return rectObj = new RB.Obj(c, this.ctx);
    };

    // load an image inside a buffer canvas
    //and return it in a RB.Obj
    /**
     * 
     * @param {string} url Image URL
     * @param {Function} callback Callback function
     * @param {string} id Object ID
     */
    this.image = function(url, callback, id) {
        const img = new Image();
        const theScene = this;
        let c = null;
        img.onload = function() {
            id = id || theScene.genID();
            c = RB.createCanvas(img.width, img.height, id);
            const ctx = c.getContext('2d');
            ctx.drawImage(this, 0, 0);
            imgCounter++;
            
            const obj = new RB.Obj(c, theScene.ctx);
            callback(obj);
        };
        img.src = url;
        imgNum++;
    };

    // load an image inside a buffer canvas
    //and returns the canvas DOM
    /**
     * 
     * @param {string} url Image URL
     * @param {string} id Object ID
     * @param {Function} callback Callback function
     */
    this.loadImage = function(url, id, callback) {
        const img = new Image();
        const theScene = this;
        let c = null;
        img.onload = function() {
            id = id || theScene.genID();
            c = RB.createCanvas(img.width, img.height, id);
            const ctx = c.getContext('2d');
            ctx.drawImage(this, 0, 0);
            imgCounter++;
            
            callback(c);
        };
        img.src = url;
        imgNum++;
    };

    // draws a (repeated) pattern inside a buffer canvas
    /**
     * 
     * @param {string} url Image URL
     * @param {number} w Width
     * @param {number} h Height
     * @param {string} patternType Pattern type
     * @param {string} id 
     */
    this.imagePattern = function(url, w, h, patternType, id) {
        const img = new Image();
        const theScene = this;
        img.onload = function() {
            id = id || theScene.genID();
            const c = RB.createCanvas(w, h, id);
            const ctx = c.getContext('2d');
            const fs = ctx.createPattern(img, patternType);
            ctx.fillStyle = fs;
            ctx.fillRect(0, 0, w, h);

            imgCounter++;

            if (imgCounter == imgNum) {
                theScene.doAfterLoad();
            }
        };
        img.src = url;
        imgNum++;
    };

    /**
     * 
     * @param {number} width Width
     * @param {number} height Height
     * @param {number} arco Arco
     * @param {string | CanvasGradient} fillStyle Fill style
     * @param {string} id Object ID
     * @param {Object} strokeStyle Stroke style object
     * @returns 
     */
    this.roundRect = function(width, height, arco, fillStyle, id, strokeStyle) {
        
        const theScene = this;
        
        id = id || theScene.genID();
        const c = RB.createCanvas(width, height, id);
        
        const ctx = c.getContext('2d');
        let x = 0, y = 0;

        ctx.beginPath();
        ctx.moveTo(x + arco, y);
        ctx.lineTo(width + x - arco, y);
        ctx.quadraticCurveTo(width + x, y, width + x, y + arco);
        ctx.lineTo(width + x, height + y - arco);
        ctx.quadraticCurveTo(width + x, y + height, width + x - arco, y + height);
        ctx.lineTo(x + arco, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - arco);
        ctx.lineTo(x, y + arco);
        ctx.quadraticCurveTo(x, y, x + arco, y);
        ctx.closePath();
        
        if(fillStyle){
            ctx.fillStyle = RB.getFS(fillStyle, ctx, height);
            ctx.fill();
        }
        
        if(strokeStyle){
            //const LW = strokeStyle.lineWidth || 1;
            ctx.lineWidth = strokeStyle.lineWidth;
            ctx.strokeStyle = strokeStyle.strokeStyle;
            //ctx.rect(0+LW, 0+LW, width-LW-LW, height-LW-LW);
            ctx.stroke();
        }
        
        return new RB.Obj(c, theScene.ctx);
    };

    // 
    /**
     * Text
     * 
     * Draws a text inside a buffer canvas
     * @param {string} str Input text
     * @param {string} fontFamily Font family
     * @param {string} fontSize Font size
     * @param {string | CanvasGradient} fillStyle Fill style
     * @param {string} id Object ID
     * @returns 
     */
    this.text = function(str, fontFamily, fontSize, fillStyle, id) {
        const tb = RB.getTextBuffer();
        const theScene = this;
        if(!id) id = theScene.genID();
        
        tb.innerHTML = str;
        tb.style.fontFamily = fontFamily;
        tb.style.fontSize = fontSize + 'px';
        
        //check if that id already exists
        //if so doesnt create a new canvas
        let c = RB.el(id);
        let ctx;
        
        if(!c){
            c = RB.createCanvas(tb.offsetWidth, tb.offsetHeight + 15, id);
            ctx = c.getContext('2d');
        } else {
            //if already existed, clear and rezise the canvas
            ctx = c.getContext('2d');
            
            c.width = tb.offsetWidth;
            c.height = tb.offsetHeight + 15;
            ctx.clearRect(0, 0, tb.offsetWidth, tb.offsetHeight + 15);
        }

        ctx.fillStyle = RB.getFS(fillStyle, ctx, tb.offsetHeight + 25);
        ctx.font = 'normal ' + fontSize + 'px ' + fontFamily;
        ctx.fillText(str, 0, tb.offsetHeight + 5);
        
        const obj = new RB.Obj(c, theScene.ctx);
        
        return obj;
    };

    /** Start */
    this.start = function() {
        isStarted = true;
        this.animate();
    };

    /** Stop */
    this.stop = function() {
        isStarted = false;
    };

    /** Toggle start */
    this.toggleStart = function() {
        isStarted ? this.stop() : this.start();
    };
    
    /** On loop */
    this.onLoop = function(){};
    
    /**
     * Run once
     * 
     * This is all the logic when a scene starts running.
     * It is separated from animate method so that it can be used in other cases.
     */
    this.runOnce = function(){
        this.ctx.restore();
        const OBJECT_LEN = objects.length;
        const COL_OBJECTS_LEN = colObjects.length;

        for (let i = 0; i < OBJECT_LEN; i++) {
        //for (var i = OBJECT_LEN; i >= 0; i--) {
            const otmp = objects[i];

            if(otmp.visible) {
                otmp.run();
            } else {
                continue;
            }
            
            if (otmp.collidable && !otmp.obstacle) {

                for (let j = 0; j < COL_OBJECTS_LEN; j++) {
                    let obj = colObjects[j];

                    // object doesnt check collision with itself,
                    // so if object unique ids are the same this part is skipped
                    if (otmp.getId() != obj.getId()) {
                        const colCheck = otmp.checkCollision(obj, true);
                        obj=null;

                        if (colCheck.top || colCheck.bottom || colCheck.left || colCheck.right) {
                            otmp.colliding = true;
                            otmp.collidingCoords = colCheck;

                            // object collided in something, so abort the loop
                            break;
                        } else {
                            otmp.colliding = false;
                            otmp.collidingCoords = null;
                        }
                    }
                }
            }
            
            moveOrCollide(otmp);

        }
        this.ctx.save();
    };
    
    /**
     * Move or collide
     * @param {Object} obj Object
     */
    var moveOrCollide = function(obj){
        //check if object is movable
        const ANY_ARROW_IS_PRESSED = leftP || rightP || downP || topP;
        if(obj.getId() == movableObjectId && ANY_ARROW_IS_PRESSED){
        
            //check coordinate collisions
            let lc=false, rc=false, tc=false, dc=false;
            const cc = obj.collidingCoords;
            if(cc){
                lc = cc.left;
                rc = cc.right;
                tc = cc.top;
                dc = cc.bottom;
            }
        
            if(leftP && !lc)obj.left();
            if(rightP && !rc)obj.right();
            if(topP && !tc) obj.up();
            if(downP && !dc) obj.down();
        }
    };

    /** Animate */
    this.animate = function() {
        this.runOnce();
        
        //global operation that is executed every loop
        this.onLoop();

        if (isStarted) {
            const theScene = this;
            setTimeout(function() {
                theScene.animate();
            }, this.timeInterval);
        }
    };
    
    /**
     * Update
     * 
     * Update the canvas only once.
     * I don't know if this can cause any trouble if ran at same time as
     * .animate .
     * :-/
     */
    this.update = function() {
        const OBJECT_LEN = objects.length;
        for ( let i = 0; i < OBJECT_LEN; i++) {
            const otmp = objects[i];
            otmp.run();
        }
    };

    /**
     * Do after load
     * 
     * Method executed after all images are buffered and loaded.
     */
    this.doAfterLoad = function() {};
};

/**
 * Object
 * @param {HTMLCanvasElement} c Canvas element
 * @param {Object} sceneContext Scene context
 * @param {Object | null} _x X
 * @param {Object | null} _y Y
 */
RB.Obj = function(c, sceneContext, _x, _y) {
    
    if(!sceneContext){
        throw new Error("RB.Obj(c, sceneContext, _x, _y): You must specify a scene context");
    }

    const ID = Math.random();
    let sCtx = sceneContext;
    let ctx = null;
    let canvas = null;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    
    if(_x) this.x = _x;
    if(_y) this.y = _y;
    
    this.w = c.width;
    this.h = c.height;
    
    this.onmousedown = function(event){};
    
    
    /**
     * Visible state
     * 
     * Tells the scene if the object should be read or not which means, if
     * the object is visible for the scene if set to true, the scene will
     * ignore the object and will not run it.
     */
    this.visible = true;

    /**
     * Collidable state
     * 
     * Sets if this object should respect collision system.
     */
    this.collidable = false;

    /**
     * Obstacle label
     * 
     * Sets if this object is an obstacle.
     * Obstacles collide but they dont check anything.
     * Only non-obstacles should check for collisions.
     */
    this.obstacle = false;
    this.colliding = false;
    this.collidingCoords = null;
    
    /**
    * Last direction
    * 
    * Used by collision system.
    * It tells the collision system which direction should I check.
    * It indicates which way the object is moving to.
    * For instance, if `lastDirection` is north, this means that I should
    * check for colisions in the top of my object.
    */
    let lastDirection = null;
    
    this.draggable = false;

    this.speedX = 1;
    this.speedY = 1;

    /**
     * Sprites
     * 
     * Array containing list of sprites for object animation
     */
    let sprites = null;

    /**
     * Sprite change interval
     * 
     * Number of loops before changing sprite image.
     */
    this.spriteChangeInterval = 1;

    /**
     * Sprite counter
     * 
     * Counts if spriteChangeInterval reached its goal.
     */
    let spriteCounter = 0;

    // 
    /**
     * Sprite pointer
     * 
     * Sprites array pointer to navigate through the array.
     */
    let spritePointer = 0;

    /* setters and getters */

    /**
     * Canvas setter
     * @param {HTMLCanvasElement | string} _canvas Canvas element
     */
    this.setCanvas = function(_canvas) {
        canvas = (typeof _canvas == 'object' ? _canvas : RB.el(_canvas));

        this.w = canvas.width;
        this.h = canvas.height;
    };
    
    /**
     * Coordinates setter
     * @param {number} _x X
     * @param {number} _y Y
     */
    this.setCoords = function(_x, _y){
        this.x = _x; this.y = _y;
    };
    
    /**
     * Dimension setter
     * @param {number} _w Width
     * @param {number} _h Height
     */
    this.setDimension = function(_w, _h){
        this.w = _w; this.h = _h;
    };
    
    this.setCanvas(c);

    /**
     * Canvas getter
     * @returns Canvas element
     */
    this.getCanvas = function() {
        return canvas;
    };

    /**
     * ID getter
     * @returns Object ID
     */
    this.getId = function() {
        return ID;
    };

    /**
     * Scene context setter
     * @param {Object} sceneContext
     */
    this.setSCtx = function(sceneContext) {
        sCtx = sceneContext;
    };

    /**
     * Scene context getter
     * @returns Scene context
     */
    this.getSCtx = function() {
        return sCtx;
    };

    /**
     * Canvas context setter
     * @param {Object} canvasContext Canvas context
     */
    this.setCtx = function(canvasContext) {
        ctx = canvasContext;
    };

    /**
     * Canvas context getter
     * @returns Canvas context
     */
    this.getCtx = function() {
        return ctx;
    };

    /**
     * Coordinates setter
     * @param {number} p X
     * @param {number} q Y
     */
    this.setXY = function(p, q){
        this.x=p; this.y=q;
    };

    /**
     * Speed setter
     * @param {number} p Speed
     */
    this.setSpeed = function(p){
        this.speedX = p;
        this.speedY = p;
    };
    
    this.getX2 = function() {
        return this.x + this.w;
    };
    
    this.getY2 = function() {
        return this.y + this.h;
    };
    
    this.fn = function() {
        this.draw();
    };

    this.run = function() {
        this.fn();
    };

    /**
     * Clone
     * 
     * Clones the object and returns a new instance of it.
     * @returns Object
     */
    this.clone = function() {
        const obj = new RB.Obj(c, sCtx);
        obj.x = this.x;
        obj.y = this.y;
        obj.w = this.w;
        obj.h = this.h;
        obj.collidable = this.collidable;
        obj.obstacle = this.obstacle;
        obj.fn = this.fn;
        obj.speedX = this.speedX;
        obj.speedY = this.speedY;
        obj.setSprites(sprites, this.spriteChangeInterval);
        obj.draggable = this.draggable;
        obj.visible = this.visible;

        return obj;
    };
    
    /**
     * Draw
     * 
     * Façade for `ctx.drawImage`.
     * @param {number} width 
     * @param {number} height 
     */
    this.draw = function(width, height) {
    
        try{
            if (width && height) {
                sCtx.drawImage(canvas, this.x, this.y, width, height);
            } else {
                sCtx.drawImage(canvas, this.x, this.y, this.w, this.h);
            }
        } catch(error){
            throw error;
        }
        
    };

    /**
     * Move up
     * 
     * Moves the object up.
     * @param {number} speed Speed
     */
    this.up = function(speed) {
        this.y -= speed || this.speedY;
        lastDirection = 'up';
    };

    /**
     * Move down
     * 
     * Moves the object down.
     * @param {number} speed Speed
     */
    this.down = function(speed) {
        this.y += speed || this.speedY;
        lastDirection = 'down';
    };

    /**
     * Move left
     * 
     * Moves the object left.
     * @param {number} speed Speed
     */
    this.left = function(speed) {
        this.x -= speed || this.speedX;
        lastDirection = 'left';
    };

    /**
     * Move right
     * 
     * Moves the object right.
     * @param {number} speed Speed
     */
    this.right = function(speed) {
        this.x += speed || this.speedX;
        lastDirection = 'right';
    };

    /**
     * Set sprites
     * 
     * It sets an sprite array.
     * Every 'interval' loops the next image from array is displayed.
     * After the last image is shown, it points to the first image again and restarts the process.
     * @param {HTMLCanvasElement[]} canvasList 
     * @param {number} interval 
     */
    this.setSprites = function(canvasList, interval) {
        sprites = canvasList;
        this.spriteChangeInterval = interval;
    };

    /**
     * Animate sprite
     * 
     * Animates the object using the sprite array.
     */
    this.animateSprite = function() {
        if (spriteCounter == this.spriteChangeInterval) {
            canvas = sprites[++spritePointer] ? sprites[spritePointer]
                    : sprites[spritePointer = 0];
            spriteCounter = 0;
        } else {
            spriteCounter++;
        }
    };

    /**
     * Check Collision
     * 
     * Has it collided with another object ?
     * @param {RB.Obj} otherObj Object
     * @param {Object} predict Predict
     * @returns Collision flags object
     */
    this.checkCollision = function(otherObj, predict) {
        let x1 = otherObj.x;
        let y1 = otherObj.y;
        let x2 = otherObj.getX2();
        let y2 = otherObj.getY2();
        
        if(predict){
            x1 -= this.speedX;
            y1 -= this.speedY;
            x2 += this.speedX;
            y2 += this.speedY;
        }
        
        const collisions = {
            top: false,
            bottom: false,
            left: false,
            right: false
        };
        
        //checks which way I should look for collisions
        if(lastDirection=='up'){
            collisions['top'] = upCheck(x1, y1, x2, y2);
            collisions['left'] = leftCheck(x1, y1, x2, y2);
            collisions['right'] = rightCheck(x1, y1, x2, y2);
        }
        
        if(lastDirection=='down'){
            collisions['bottom'] = bottomCheck(x1, y1, x2, y2);
            collisions['left'] = leftCheck(x1, y1, x2, y2);
            collisions['right'] = rightCheck(x1, y1, x2, y2);
        }
        
        if(lastDirection=='right'){
            collisions['right'] = rightCheck(x1, y1, x2, y2);
            collisions['top'] = upCheck(x1, y1, x2, y2);
            collisions['bottom'] = bottomCheck(x1, y1, x2, y2);
        }
        
        if(lastDirection=='left'){
            collisions['left'] = leftCheck(x1, y1, x2, y2);
            collisions['top'] = upCheck(x1, y1, x2, y2);
            collisions['bottom'] = bottomCheck(x1, y1, x2, y2);
        }
        
        return collisions;
    };
    
    var theObject = this;
    var leftCheck = function(x1, y1, x2, y2){
        //means i must check if I hit something on my left side
        var yCase = theObject.y < y2 && theObject.getY2() > y1;
        var xCase = theObject.x < x2 && theObject.getX2() > x2;
        return yCase && xCase;
    };
    
    var rightCheck = function(x1, y1, x2, y2){
        //means i must check if i hit something on my right side
        var yCase = theObject.y < y2 && theObject.getY2() > y1;
        var xCase = theObject.getX2() > x1 && theObject.getX2() < x2;
        return yCase && xCase;
    };

    var upCheck = function(x1, y1, x2, y2){
        //means i must check if i hit something above me
        var yCase = theObject.y < y2 && theObject.getY2() > y2;
        var xCase = theObject.x < x2 && theObject.getX2() > x1;
        return yCase && xCase;
    };

    var bottomCheck = function(x1, y1, x2, y2){
        //means i must check if i hit something below me
        var yCase = theObject.getY2() > y1 && theObject.getY2() < y2;
        var xCase = theObject.x < x2 && theObject.getX2() > x1;
        return yCase && xCase;
    };

    //returns true if rx and ry are inside the objects area
    this.checkRange = function(rx, ry){
        var xRange = rx >= this.x && rx <= this.getX2();
        var yRange = ry >= this.y && ry <= this.getY2();
        
        return xRange && yRange;
    };

};

// 
// 
/**
 * Create text buffer
 * 
 * This is the `div` element responsible to calculate canvas dimensions for
 * a text painted.
 */
RB.createTextBuffer = function() {
    const d = document;
    const txtBuffer = d.createElement("div");

    txtBuffer.id = 'txtBuffer';
    txtBuffer.style.position = 'absolute';
    txtBuffer.style.width = 'auto';
    txtBuffer.style.height = 'auto';
    txtBuffer.style.padding = '0px';
    txtBuffer.style.visibility = 'hidden';

    d.body.appendChild(txtBuffer);
};

// 
// 
/**
 * Get text buffer
 * 
 * Returns the `div` element `txtBuffer`.
 * If it doesnt exist, instantiate it (singleton!).
 * @returns Text buffer as `div` element
 */
RB.getTextBuffer = function() {
    if (!RB.el('txtBuffer')) {
        RB.createTextBuffer();
    }
    return RB.el('txtBuffer');
};

/**
 * Create canvas location
 * 
 * Specifies a DOM element where all canvas objects will be stored.
 * If this parameter is not set, all objects will be stored in the
 * document body.
 */
RB.createCanvasLocation = null;

/**
 * Create canvas
 * 
 * Creates a new buffer canvas.
 * @param {*} _width 
 * @param {*} _height 
 * @param {*} id 
 * @returns 
 */
RB.createCanvas = function(_width, _height, id) {
    const d = document;
    const c = d.createElement("canvas");
    c.width = _width;
    c.height = _height;
    c.id = id;
    c.style.display = "none";
    
    if(RB.createCanvasLocation){
        RB.createCanvasLocation.appendChild(c);
    } else {
        d.body.appendChild(c);
    }
    
    return c;
};

/**
 * Destroy canvas
 * @param {string} id 
 */
RB.destroyCanvas = function(id){
    const d = document;
    const obj = d.getElementById(id);
    d.body.removeChild(obj);
};

/**
 * Element
 * 
 * Returns a `div` element.
 * @param {string} id 
 * @returns `div` element
 */
RB.el = function(id) {
    return document.getElementById(id);
};

/*
 * colorSettings should be like this:
 * var colorSettings = { h: 0, colors:[ {stopPoint: 0, name: 'rgb(240, 240,
 * 240)'}, {stopPoint: 1, name: 'gray'} ] };
 */

/**
 * Linear gradient
 * 
 * Color settings should be like this :
 * @example
 * let colorSettings = {
 *     h: 0,
 *     colors: [
 *         {
 *             stopPoint: 0,
 *             name: 'rgb(240, 240, 240)'
 *         },
 *         {
 *             stopPoint: 1,
 *             name: 'gray'
 *         }
 *     ]
 * };
 * 
 * @param {Object} colorSettings Color settings
 * @param {Object} ctx Canvas context
 * @returns Linear gradient
 */
RB.linearGradient = function(colorSettings, ctx) {
    const lingrad = ctx.createLinearGradient(0, 5, 0, colorSettings.h);
    const CS_LEN = colorSettings.colors.length;

    for ( let i = 0; i < CS_LEN; i++) {
        const color = colorSettings.colors[i];
        lingrad.addColorStop(color.stopPoint, color.name);
    }

    return lingrad;
};

/**
 * Get Fill style
 * @param {Object | string} fillStyle Fill style
 * @param {Object} ctx Canvas context
 * @param {number} h End point ordinate
 * @returns Fill style
 */
RB.getFS = function(fillStyle, ctx, h) {
    if (typeof fillStyle == 'object') {
        fillStyle.h = h;
        const fs = RB.linearGradient(fillStyle, ctx);
        return fs;
    }
    return fillStyle;
};

/**
 * Real time image
 * 
 * Load an image in real time.
 * @param {string} url Image URL
 * @param {string} id Object ID
 * @param {Function} fn Callback function
 */
RB.rtImage = function(url, id, fn) {
    var img = new Image();
    img.onload = function() {
        const c = RB.createCanvas(img.width, img.height, id);
        const ctx = c.getContext('2d');
        ctx.drawImage(this, 0, 0);
        if (fn) fn(c);
    };
    img.src = url;
};

/**
 * Canvas support
 * 
 * Returns true if browser has canvas support.
 * @param {HTMLCanvasElement} _canvas 
 * @returns "Canvas is supported by this browser."
 */
RB.canvasSupport = function(_canvas) {
    if (_canvas) {
        try {
            _canvas.getContext('2d');
            return true;
        } catch {
            return false;
        }
    } else {
        return false;
    }
};

/**
 * Relative Abscissa
 * @param {Event} event Event
 * @returns X
 */
RB.xPos = function(event){
    return event.pageX - event.target.offsetLeft;
};

/**
 * Relative Ordinate
 * @param {Event} event Event
 * @returns Y
 */
RB.yPos = function(event){
    return event.pageY - event.target.offsetTop;
};