

    /********************************************************************************/
    /******************************  HIDE HASHED LAYERS  ****************************/
    
    //Hide hashed
    layerDatas.each(function(l){
        if(l.name.indexOf("#") != -1 && l.layer.visible != false)
            l.layer.visible = false;
    });
    
    
    