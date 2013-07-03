
    /********************************************************************************/
    /********************************   UTILTIES   **********************************/

    String.prototype.trim = function(){ 
       return this.replace(/^ */, "").replace(/ *$/, "");
    } 
    
    function keys(obj){
        var keys = [];
        for(i in obj) if (obj.hasOwnProperty(i))
        {
            keys.push(i);
        }
        return keys;
    };
    
    function clone(obj){
        if(obj == null || typeof(obj) != 'object')
            return obj;

        var temp = {}; // changed, obj.constructor()

        for(var key in obj)
            temp[key] = clone(obj[key]);
        return temp;
    }

    Array.prototype.indexOf = function(el) {
        for (var i = 0; i < this.length; i += 1) {
            if (this[i] == el) return i;
        }
        return -1;
    };
    
    Array.prototype.lastIndexOf = function(el) {
        for (var i = this.length-1; i >= 0; i -= 1) {
            if (this[i] == el) return i;
        }
        return -1;
    };
    
    Array.prototype.distinct = function() {
        var derivedArray = [];
        for (var i = 0; i < this.length; i += 1) {
            if (derivedArray.indexOf(this[i]) == -1) {
                derivedArray.push(this[i])
            }
        }
        return derivedArray;
    };
    
    Array.prototype.each = function(callback) {
        var derivedArray = [];
        for (var i = 0; i < this.length; i += 1) {
            derivedArray.push(callback(this[i], i));
        }
        return derivedArray;
    };