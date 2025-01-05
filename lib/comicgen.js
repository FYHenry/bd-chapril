import './jquery.min.js';
import './ragaboom.min.js';
import cgd from '../data/cgdata.js';
const d = document;
/**
 * Comicgen module
 */
const cg = {};
let w = parseInt(window.innerWidth * 0.8);
let h = parseInt(window.innerHeight * 0.8);
const canvas = $('#c');
canvas.attr('width',w).attr('height',h);
const c = canvas[0];
let ctx = c.getContext('2d');
let scene = new RB.Scene(c);
let fontFamily = 'Domestic Manners, Arial, helvetica, sans serif';
let pop = new Audio('sounds/pop.ogg');
let currentObj = null;
$('#newWidth').val(w);
$('#newHeight').val(h);

scene.add( scene.rect(w, h, 'white') );
scene.update();

const lib = $('#lib');

/** Clear the canvas */
cg.clearScreen = function(){
    ctx = c.getContext('2d');
    scene = new RB.Scene(c);
    w = c.width;
    h = c.height;
    fontFamily = 'Domestic Manners, Arial, helvetica, sans serif';
    pop = new Audio('sounds/pop.ogg');
    currentObj = null;

    scene.add( scene.rect(w, h, 'white') );
    scene.update();
}

$(d).on('keyup', function(event){

    const KEY = event.which;

    if(KEY == 46 && currentObj){
        scene.remove(currentObj);
        scene.update();
        RB.destroyCanvas( currentObj.getCanvas().id );
        currentObj = null;
    }

    if( currentObj && (KEY==37 || KEY==39) ){
        cg.hFlip(currentObj);
    }
});

canvas.on('focusin').on('keydown', function(event){
    event.preventDefault();
    const KEY = event.which;

    if(KEY == 38 && currentObj){
        cg.zoomIn(currentObj);
    }

    if(KEY == 40 && currentObj){
        cg.zoomOut(currentObj);
    }
});

const onWheelAndFocus = function(event) {
    event.preventDefault();
    if(currentObj && event.deltaY > 0){
        cg.zoomIn(currentObj);
    } else if (currentObj && event.deltaY < 0){
        cg.zoomOut(currentObj);
    }
};

c.addEventListener('wheel', onWheelAndFocus, { passive: false });
canvas.on('focusin', onWheelAndFocus);

/**
 * Hover 'div' element
 * @param {Event} event Event
 * @param {string} divid 'div' element ID
 * @returns 'false' value
 */
cg.hoverdiv = function(event,divid){
    const X = event.clientX + 25;
    const Y = event.clientY ;
    const LEFT  = X + 'px';
    const TOP  = Y  + 'px';

    
    const div = document.getElementById(divid);
    div.style.left = LEFT;
    div.style.top = TOP;

    $('#'+divid).toggle();
    return false;
}

/**
 * Source swap
 * @param {Event} event Event
 */
cg.sourceSwap = function (event) {
    const div_mini = $(this);
    const IMG_ID = parseInt(div_mini.data('src-id'));
    const IMG_URL = cgd.toonUrls[IMG_ID];
    $('#bigImg').attr('src','toons/' + IMG_URL);
    cg.hoverdiv(event,'focusImg')
}
/**
 * Build minitoons
 */
cg.buildMinis = function(){
    const addDiv = function(index) {
        const div = d.createElement('div');
        div.classList.add('himg');
        div.setAttribute('data-src-id', index);
        return div;
    };
    const addA = function(index) {
        const a = d.createElement('a');
        a.setAttribute('href', '#');
        a.addEventListener('click', function(){
            cg.createImage(`toons/${cgd.toonUrls[index]}`);
        });
        return a;
    };
    const addImg = function(index) {
        const img = d.createElement('img');
        img.classList.add('rc', 'mini');
        img.setAttribute('src', `toons/${cgd.miniUrls[index]}`);
        img.setAttribute('alt', 'toons');
        img.setAttribute('data-src-id', index);
        return img;
    };
    const elements = [];
    for(let i=0; i < cgd.miniUrls.length; i++){
        const div = addDiv(i);
        const a = addA(i);
        const img = addImg(i);
        div.appendChild(a);
        a.appendChild(img);
        elements.push(div);
    }
    lib.append(elements);
    $('#menuContainer').append( $('#instructs').clone() );
    $(function () {
        $('div.himg').hover(cg.sourceSwap, cg.sourceSwap);
    });
}

cg.buildMinis();

/**
 * Create image
 * @param {string} url 
 */
cg.createImage = function(url){
    scene.image(url, function(obj){
        obj.draggable = true;
        obj.setXY(30, 30);

        obj.onmousedown = function(){
            currentObj = obj;
            scene.zIndex(obj, 1);
            scene.update();
        }

        scene.add(obj);
        currentObj = obj;
        scene.update();
        pop.play();
    });
}

/**
 * Create text
 */
cg.createText = function(){
    const TEXT = prompt("Adicione um texto:");

    if(TEXT){
        const obj = scene.text(TEXT, fontFamily, 26, 'black');
        obj.setXY(40, 40);
        obj.draggable = true;

        obj.onmousedown = function(){
            currentObj = obj;
            scene.zIndex(obj, 1);
            scene.update();
        }
        currentObj = obj;

        scene.add(obj);
        scene.update();
        pop.play();
    }
}

/**
 * Create text from input
 * @param {Event} event
 */
cg.createTextFromInput = function(event){

    const KEY = event.keyCode || event.which;
    const TEXT = $('#newText').val();

    if(KEY == 13){
        const obj = scene.text(TEXT, fontFamily, 26, 'black');
        obj.setXY(40, 40);
        obj.draggable = true;

        obj.onmousedown = function(){
            currentObj = obj;
            scene.zIndex(obj, 1);
            scene.update();
        }
        currentObj = obj;

        scene.add(obj);
        scene.update();
        $('#newText').val('');
        pop.play();
    }
}
/**
 * Create image from input
 * @param {HTMLInputElement} inputElement 
 */
cg.createImageFromInput= function(inputElement){
    /* now you can work with the file list */
    const fileList = inputElement.files; 
    const imageType = /image.*/;
    //var nBytes = 0;
  
    for (let i = 0; i < fileList.length; i++)
    {
        const file = fileList[i];
        //nBytes += file.size;
        if (!file.type.match(imageType))
        {
            continue;
        }
        let imgUrl = window.URL.createObjectURL(file);
        cg.createImage(imgUrl);
    }

}

/**
 * Save image
 */
cg.saveImage = function(){
    const data = c.toDataURL('png');
       // $.ajax({
       //   type: 'POST',
       //   url: 'https://lut.im',
       //   data: data,
       //   success: function(d){console.log(d);},
       //   dataType: 'json'
       // });
    const win = window.open();
    const b = win.document.body;
    const img = new Image();
    img.src = data;
    b.appendChild(img);
}

/**
 * Zoom out
 * @param {Object} obj Current object 
 */
cg.zoomOut = function(obj){
    const W = obj.w * 0.05;
    const H = obj.h * 0.05;

    if(obj.w - W > 0 && obj.h - H > 0){
        obj.w -= W;
        obj.h -= H;

        obj.x += (W/2);
        obj.y += (H/2);

        scene.update();
    }
}

/**
 * Zoom in
 * @param {Object} obj Current object
 */
cg.zoomIn = function(obj){
    const W = obj.w * 0.05;
    const H = obj.h * 0.05;

    obj.w += W;
    obj.h += H;

    obj.x -= (W/2);
    obj.y -= (H/2);

    scene.update();
}

/**
 * Horizontal flip
 * @param {Object} obj Current object
 */
cg.hFlip = function(obj){
    const tmpCanvas = $(obj.getCanvas()).clone()[0];
    const img = obj.getCanvas();
    const tmpCtx = tmpCanvas.getContext('2d');
    const w = tmpCanvas.width;
    const h = tmpCanvas.height;

    //save current size and position
    const cW = obj.w, cH = obj.h, cX = obj.x, cY = obj.y;

    tmpCtx.translate(w/2, h/2);
    tmpCtx.scale(-1, 1);
    tmpCtx.drawImage(img, (-1*w/2), (-1*h/2));
    tmpCanvas.id = obj.getCanvas().id;
    obj.getCanvas().id = 'killme';

    RB.destroyCanvas('killme');
    d.body.appendChild(tmpCanvas);
    obj.setCanvas(tmpCanvas);
    obj.x=cX; obj.y=cY; obj.h=cH; obj.w=cW;
    scene.update();
}

/**
 * Set screen
 * @param {number} w Width
 * @param {number} h Height
 */
cg.setScreen = function(w, h){
    if(w && h && !isNaN(w) && !isNaN(h)){
        //var OK = confirm('All your work will be lost. Continue?');
        const OK=true;
        if(OK){
            c.width = w;
            c.height = h;
            scene.update();
            //cg.clearScreen();
        }
    }
}

$('#newText').on('keyup', cg.createTextFromInput);

$('#imageFileInput').on('change', function() {
    cg.createImageFromInput(this);
});

$('#uploadSave').on('click', function() {
    $('#imageFileInput').click();
});

$('#textTool').on('click', function() {
    cg.createText();
});

$('#toolbarImageSave').on('click', function() {
    cg.saveImage();
});

$('#resizeCanvas').on('click', function() {
    cg.setScreen(
        $('#newWidth').val(),
        $('#newHeight').val()
    );
});