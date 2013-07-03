
    /********************************************************************************/
    /**********************************  REVERTING  *********************************/
    
    var selectedLayer = doc.activeLayer;
    var originalHistoryState = doc.activeHistoryState;
    
    var revert = function(){
        doc.activeHistoryState = originalHistoryState;
        doc.activeLayer = selectedLayer;

        layerDatas.each(function(l){
		    if(l.startedVisible != l.layer.visible)
                l.layer.visible = l.startedVisible;
        });
    };