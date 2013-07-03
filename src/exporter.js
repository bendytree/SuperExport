
    /********************************************************************************/
    /*******************************  LAYER EXPORT  **********************************/

    var exportLayer = function(data){
        
        //crop
        runCroppingLayers(data);
    
        //Hide bad stuff
        hideSiblingsOfSelfAndOfParent(data);

        //Prepare saving function
        var save = function(filename){
            //Save
            var filepath = getPath()+"/"+filename;
            var exportOptions = getExportOptions(data);
            doc.exportDocument(new File(filepath), ExportType.SAVEFORWEB, exportOptions);

            //Retina?
            if(data.filename.match(/@2x[.][a-z]+$/)){
                var preResizeState = doc.activeHistoryState;
                
                try { doc.flatten(); }catch(e){}
                    
                doc.resizeImage(doc.width/2, doc.height/2, doc.resolution, ResampleMethod.BICUBICSHARPER);
            
                var filepath = getPath()+"/"+filename.replace("@2x", "");
                doc.exportDocument(new File(filepath), ExportType.SAVEFORWEB, exportOptions);
                doc.activeHistoryState = preResizeState;
            }
        };

        //save once for each tagged layer inside this layerset
        if(new RegExp(/\{[^}]+\}/).test(data.filename)){
            //gather all possible tags & tag values
            var allTags = {};
            data.descendents.each(function(d){
                var currentTags = keys(d.tags);
                for(var i=0; i<currentTags.length; i++){
                    var t = currentTags[i];
                    if(allTags[t]){
                        allTags[t] = allTags[t].concat([ d.tags[t] ]).distinct();   
                    }else{
                        allTags[t] = [d.tags[t] ];
                    }
                }
            });
            var allKeys = keys(allTags);
            
            //create a strategy for covering all tag combinations
            var allCombinations = [];
            var addTagSetToCombinations = function(tag, tagValues){
                //no previous combos, so just add ours
                if(allCombinations.length == 0){
                    for(var i=0; i<tagValues.length; i++){
                        var combo = {};
                        combo[tag] = tagValues[i];
                        allCombinations.push(combo);
                    }
                
                //explode our tag into previous combos
                }else{
                    var newCombos = [];
                    for(var i=0; i<allCombinations.length; i++){
                        for(var j=0; j<tagValues.length; j++){
                            var newCombo = clone(allCombinations[i]);
                            newCombo[tag] = tagValues[j];
                            newCombos.push(newCombo);
                        }
                    }
                    allCombinations = newCombos;
                }
            };
        
           //actually create the combinations
           allKeys.each(function(key){
               addTagSetToCombinations(key, allTags[key]);
           });
             
           //save each combo
           for(var i=0; i<allCombinations.length; i++){
                var combo = allCombinations[i];
                data.descendents.each(function(l){
                    if(!l.hasTags) return;
                    
                    var visible = true;
                    keys(l.tags).each(function(key){
                       visible &= l.tags[key] == combo[key];
                    });
                
                    if(l.layer.visible != visible)
                        l.layer.visible = visible;
                });
                
                //create filename
                var filename = data.filename;
                allKeys.each(function(key){
                    filename = filename.replace("{"+key+"}", combo[key]); 
                });
          
                //save
                save(filename);
            }
            
        //save normally (no swapable layers)
        }else{
            save(data.filename);
        }
    
        revert();
    };

    var prepGuiForExport = function(){
        win.btnOne.enabled = false;
        win.btnExportAll.enabled = false;
        win.btnOne.active = false;
        win.btnExportAll.active = false;
        win.btnOne.visible = false;
        win.btnExportAll.visible = false;
        win.lblProgress.visible = true;     
    };

    var exportableLayers = [];
    layerDatas.each(function(l){
        if(l.isExportable){
            exportableLayers.push(l);
        }
    });