var d = document;
var cg = {};
var w = parseInt(window.innerWidth * 0.8);
var h = parseInt(window.innerHeight * 0.8);
var canvas = $('#c');
canvas.attr('width',w).attr('height',h);
var c = canvas[0];
var ctx = c.getContext('2d');
var scene = new RB.Scene(c);
var fontFamily = 'Domestic Manners, Arial, helvetica, sans serif';
var pop = new Audio('sounds/pop.ogg');
var currentObj = null;
$('#newWidth').val(w);
$('#newHeight').val(h);

scene.add( scene.rect(w, h, 'white') );
scene.update();

var lib = $('#lib');

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

$(d).keyup(function(e){

    var key = e.keyCode || e.which;

    if(key == 46 && currentObj){
        scene.remove(currentObj);
        scene.update();
        RB.destroyCanvas( currentObj.getCanvas().id );
        currentObj = null;
    }

    if( currentObj && (key==37 || key==39) ){
        cg.hFlip(currentObj);
    }
});

$(d).keydown(function(event){

    var key = event.keyCode || event.which;

    if(key == 38 && currentObj){
        cg.zoomIn(currentObj);
    }

    if(key == 40 && currentObj){
        cg.zoomOut(currentObj);
    }
});

d.onmousewheel = function(mw){
    if(currentObj && mw.wheelDelta > 0){
        cg.zoomIn(currentObj);
    } else if (currentObj && mw.wheelDelta < 0){
        cg.zoomOut(currentObj);
    }
};

cg.hoverdiv = function(e,divid){
    var x = e.clientX + 25;
    var y = e.clientY ;
    var left  = x + 'px';
    var top  = y  + 'px';

    
    var div = document.getElementById(divid);
    div.style.left = left;
    div.style.top = top;

    $('#'+divid).toggle();
    return false;
}
cg.sourceSwap = function (e) {
    var div_mini = $(this);
    var img_id = parseInt(div_mini.data('src-id'));
    var img_url = cgd.toonUrls[img_id];
    $('#bigImg').attr('src','toons/' + img_url);
    cg.hoverdiv(e,'focusImg')
}
cg.buildMinis = function(){
    var buffer = '';
        var divString = "<div class='himg'  data-src-id='IMG_ID'>";
    var imgString = "<img src='toons/IMG_URL' data-src-id='IMG_ID' class='rc mini' alt='toons'></img>";
    var link = "<a href=\"javascript:cg.createImage('toons/IMG_URL')\">";

    for(var i=0; i < cgd.miniUrls.length; i++){
                buffer += divString.replace(/IMG_ID/,i);
        buffer += link.replace(/IMG_URL/, cgd.toonUrls[i]);
        buffer += imgString.replace(/IMG_URL/, cgd.miniUrls[i]).replace(/IMG_ID/, i) + '</a></div>';
    }

    lib.append(buffer);

    //lib.append( $('#textTool').clone() );
    $('#menuContainer').append( $('#instructs').clone() );
        $(function () {
          $('div.himg').hover(cg.sourceSwap, cg.sourceSwap);
        });
}

cg.buildMinis();

cg.createImage = function(url){
    scene.image(url, function(obj){
        obj.draggable = true;
        obj.setXY(30, 30);

        obj.onmousedown = function(e){
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

cg.createText = function(){
    var txt = prompt("Adicione um texto:");

    if(txt){
        var obj = scene.text(txt, fontFamily, 26, 'black');
        obj.setXY(40, 40);
        obj.draggable = true;

        obj.onmousedown = function(e){
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

cg.createTextFromInput = function(e){

    var key = e.keyCode || e.which;
    var txt = $('#newText').val();

    if(key == 13){
        var obj = scene.text(txt, fontFamily, 26, 'black');
        obj.setXY(40, 40);
        obj.draggable = true;

        obj.onmousedown = function(e){
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
cg.createImageFromInput= function(t){

  var fileList = t.files; /* now you can work with the file list */
    var imageType = /image.*/;
    var nBytes = 0;
  
    for (var i = 0; i < fileList.length; i++)
    {
      
        var file = fileList[i];
        nBytes += file.size;
        if (!file.type.match(imageType))
        {
            continue;
        }
        imgUrl = window.URL.createObjectURL(file);
        cg.createImage(imgUrl);
    }

}
cg.saveImage = function(){
    var data = c.toDataURL('png');
       // $.ajax({
       //   type: 'POST',
       //   url: 'https://lut.im',
       //   data: data,
       //   success: function(d){console.log(d);},
       //   dataType: 'json'
       // });
    var win = window.open();
    var b = win.document.body;
    var img = new Image();
    img.src = data;
    b.appendChild(img);
}

cg.zoomOut = function(obj){
    var w = obj.w * 0.05;
    var h = obj.h * 0.05;

    if(obj.w - w > 0 && obj.h - h > 0){
        obj.w -= w;
        obj.h -= h;

        obj.x += (w/2);
        obj.y += (h/2);

        scene.update();
    }
}

cg.zoomIn = function(obj){
    var w = obj.w * 0.05;
    var h = obj.h * 0.05;

    obj.w += w;
    obj.h += h;

    obj.x -= (w/2);
    obj.y -= (h/2);

    scene.update();
}

cg.hFlip = function(obj){
    var tmpCanvas = $(obj.getCanvas()).clone()[0];
    var img = obj.getCanvas();
    var tmpCtx = tmpCanvas.getContext('2d');
    var w = tmpCanvas.width;
    var h = tmpCanvas.height;

    //save current size and position
    var cW = obj.w, cH = obj.h, cX = obj.x, cY = obj.y;

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

cg.setScreen = function(w, h){
    if(w && h && !isNaN(w) && !isNaN(h)){
        //var ok = confirm('All your work will be lost. Continue?');
        ok=true;
        if(ok){
            c.width = w;
            c.height = h;
            scene.update();
            //cg.clearScreen();
        }
    }
}
