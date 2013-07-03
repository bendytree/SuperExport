

    
    
    /********************************************************************************/
    /**********************************  MAIN  **************************************/

    
    //which layer to export?
    var activeLayerDataToExport = findDataForLayer(selectedLayer);
    if(activeLayerDataToExport && !activeLayerDataToExport.isExportable){
        var newActiveLayerDataToExport = null;
        activeLayerDataToExport.ancestors.each(function(a){
            if(a.isExportable){
                newActiveLayerDataToExport = a;
                return false;
            }
        });
        activeLayerDataToExport = newActiveLayerDataToExport;
    }

    if(activeLayerDataToExport && exportableLayers.length > 5)
    {
        // SHOW THE WINDOW
        var win = new Window("dialog{text:'Script Interface',bounds:[100,100,400,220],\
            btnExportAll:Button{bounds:[20,20,140,70] , text:'Export All ' },\
            btnOne:Button{bounds:[160,20,280,70] , text:'Export One ' },\
            prog:Progressbar{bounds:[20,90,280,101] , value:0,maxvalue:100},\
            lblProgress:StaticText{bounds:[20,40,280,70] , text:'Saving 10 Images... ' ,properties:{scrolling:true,multiline:true}}\
        };");
        win.lblProgress.visible = false;
        win.btnExportAll.text = "Export All ("+exportableLayers.length+")";
        win.btnExportAll.active = true;
        win.btnExportAll.onClick = function(){
            prepGuiForExport();
            win.lblProgress.text = "Exporting All Images...";
            
            exportableLayers.each(function(l, i){
                win.prog.value = ((i+1)*100.0)/(exportableLayers.length+1);
                exportLayer(l);
            });
            win.prog.value = 100;
                
            win.close();
        };
        win.btnOne.text = activeLayerDataToExport.name;
        win.btnOne.onClick = function(){
            prepGuiForExport();
            win.lblProgress.text = "Exporting "+activeLayerDataToExport.name+"...";
            win.prog.value = 50;
            exportLayer(activeLayerDataToExport);
            win.close();
        };
        win.center();
        win.show();
    }
    else
    {
        exportableLayers.each(function(l){
            exportLayer(l);
        });
    }
