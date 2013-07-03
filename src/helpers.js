
    
    /********************************************************************************/
    /*********************************  HELPERS  ************************************/

    var cropRx = /^ *crop/i;
    var runCroppingLayers = function(data){
        data.children.each(function(c){
            if(cropRx.test(c.name)){
        
                //hide it
                if(c.layer.visible != false)
                    c.layer.visible = false;
                    
                //crop it
                if(c.layer.bounds)
                    doc.crop(c.layer.bounds);
            }
        });
    }

    function hideSiblingsOfSelfAndOfParent(data){
        var chain = [data];
        data.ancestors.each(function(a){
            chain.push(a);
        });

        chain.each(function(a){
            //show ancestors
            if(a.layer.visible != true)
                a.layer.visible = true;
                
            //hide ancestors siblings
            a.siblings.each(function(sib){
                var setVisible = new RegExp(/^ *[*]/).test(sib.name);
                if(sib.layer.visible != setVisible)
                     sib.layer.visible = setVisible;
            });
        });
    }

    
    function getExportOptions(layerInfo){
        var options = new ExportOptionsSaveForWeb();
        if(layerInfo.extension == "jpg"){
            options.format = SaveDocumentType.JPEG; //-24 //JPEG, COMPUSERVEGIF, PNG-8, BMP 
            
            //Quality
            if(layerInfo.q){
                if(isNaN(parseFloat(layerInfo.q)) == false){
                    layerInfo.q = Math.max(Math.min(parseFloat(layerInfo.q), 100), 0);
                    if(layerInfo.q<=1){
                        layerInfo.q = Math.round(layerInfo.q*100);
                    }
                }
            }
            options.quality = layerInfo.q || 80; 
        }else if(layerInfo.extension == "png"){
            options.format = SaveDocumentType.PNG; //JPEG, COMPUSERVEGIF, PNG-8, BMP 
            options.quality = 100;
            options.PNG8 = false;
        }else if(layerInfo.extension == "gif"){
            options.format = SaveDocumentType.COMPUSERVEGIF; //JPEG, COMPUSERVEGIF, PNG-8, BMP 
            options.matte = MatteType.NONE;
            options.transparency = true;
        }         
        return options;
    }

    var getCurrentDocumentIndex = function(){
        for(var i=0; i<app.documents.length; i++){
            if(app.activeDocument == app.documents[i])
                return i;
        }
    }
    
    var getPath = function(){
        if(app.documents.length == 1 || !new RegExp(/TemporaryItems/).test(app.activeDocument.path))
            return app.activeDocument.path;
        var newIndex = (getCurrentDocumentIndex()-1) % app.documents.length;
        return app.documents[newIndex].path;
    };