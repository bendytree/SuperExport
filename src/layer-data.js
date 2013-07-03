
    /********************************************************************************/
    /*****************************  LAYER DATA & CACHING  ***************************/
    
    function convertLayerToData(layer){
        var data = {
            layer: layer,
            isSet: layer.typename == "LayerSet",
            name: layer.name,
            startedVisible: layer.visible,
            tags: {},
            hasTags: false,
            siblings: [],
            descendents: [],
            ancestors: [],
            children: []
        };
        
        // Get tags
        if(data.name.indexOf("-") == 0){
            var tags = data.name.substring(data.name.lastIndexOf("-")+1).trim().split(",");
		    for(var i=0; i<tags.length; i++){
		        var t = tags[i].split(":");
                if(t.length == 1){
                    t[1] = t[0].trim();
                    t[0] = "0";
                }else{
                    t[0] = t[0].trim();
                    t[1] = t[1].trim();
                }
			    data.tags[t[0]] = t[1];
		    }
            data.name = data.name.substring(0, data.name.lastIndexOf("-")).trim();
            data.hasTags = true;
        }
        
        // Split by Comma
        var sections = data.name.split(",");
        for(var i=0; i<sections.length; i++){
            var section = sections[i].trim();

            //No Colon, So Maybe A Filename
            if(section.indexOf(":") == -1){
                var extension = section.match(/(jpg|png|gif)$/i);
                if(extension){
                    data.filename = section;
                    data.extension = extension[0].toLowerCase();
                }

            //Colon, So Split Into Key/Value
            }else{
                var fieldParts = section.split(":");
                data[fieldParts[0].trim().toLowerCase()] = fieldParts[1].trim();
            }
        }

        data.isExportable = data.isSet && !!data.filename;
        
        return data;
    }
    
    var layerDatas = [];
    var buildAndRegisterLayerData = function(layer){
        //create my data
        var data = convertLayerToData(layer);
        layerDatas.push(data);
        
        //add all descendents
        if(layer.layers && layer.layers.length > 0){
            for(var i=0; i<layer.layers.length; i++){
                //create data for the child
                var childData = buildAndRegisterLayerData(layer.layers[i]);
                
                //add this child
                data.children.push(childData);
                data.descendents.push(childData);
                
                //add this child's descendents
                childData.descendents.each(function(d){
                    data.descendents.push(d);
                });
            }
        
            //set siblings
            data.children.each(function(c1){
                data.children.each(function(c2){
                    if(c1 != c2)
                        c1.siblings.push(c2);
                });                
            });
        
            //add self as an ancestor
            data.descendents.each(function(d){                
                d.ancestors.push(data);
            });
        }
        return data;
    };
    buildAndRegisterLayerData(doc);
    
    var findDataForLayer = function(layer){
        var data = null;
        layerDatas.each(function(l){
            if(l.layer == layer)
            {
                data = l;
                return false;
            }
        });
        return data;
    };

    layerDatas.each(function(l){
        var txt = l.name + " => ";
        l.siblings.each(function(c){
            txt +=  c.name + ", ";
        });
        //$.writeln(txt);
    });
    //return;