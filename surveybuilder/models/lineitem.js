/**
 * @tag models, home
 * Wraps backend lineitem services.  Enables
 * [LineItem.static.findAll retrieving],
 * [LineItem.static.update updating],
 * [LineItem.static.destroy destroying], and
 * [LineItem.static.create creating] lineitems.
 */
$.Model.extend('Lineitem',
/* @Static */
{
    /**
     * Retrieves lineitems data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped lineitem objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    findAll : function(params, success, error){
        var lineitemsarray = [];

        if(params.lineId){
            for (var lineitem in LINEITEMS){
                if(LINEITEMS[lineitem].about == params.lineId && LINEITEMS[lineitem].type === 'branch'){
                    lineitemsarray.push(LINEITEMS[lineitem]);
                }
            }
        }
        else{
            for (var lineitem in LINEITEMS){
                lineitemsarray.push(LINEITEMS[lineitem]);
            }
        }

        success(lineitemsarray);
    },
    /**
     * Retrieves a lineitem data from backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped lineitem objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    findOne : function(params, success, error){
        return LINEITEMS[params.id];
        //success([Lineitem.wrap({'type':'simple', 'displayName':'Simple'}), Lineitem.wrap({'type':'selectOne', 'displayName':'Select One'}), Lineitem.wrap({'type':'selectMultiple', 'displayName':'Select Multiple'})]);
    },
    /**
     * Updates a lineitem's data.
     * @param {String} id A unique id representing your lineitem.
     * @param {Object} attrs Data to update your lineitem with.
     * @param {Function} success a callback function that indicates a successful update.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    update : function(id, attrs, success, error){
        // TODO: for now ends up getting called even if it should be a create, since the ID is set
        steal.dev.log("Lineitem.update");
        var existingLineitem = this.findOne(attrs);
        if (existingLineitem){
            for(var attribute in attrs){
                existingLineitem.attr(attribute, attrs[attribute]);
            }
        }
        else{
            LINEITEMS[attrs.id] = new Lineitem(attrs);
        }
        success();
    },
    /**
     * Destroys a lineitem's data.
     * @param {String} id A unique id representing your lineitem.
     * @param {Function} success a callback function that indicates a successful destroy.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    destroy : function(id, success, error){
        // TODO:need a way to destroy remote ones as well? or does remote saving the survey store off one big lineitems object?
        delete LINEITEMS[id];
    },
    /**
     * Creates a lineitem.
     * @param {Object} attrs A lineitem's attributes.
     * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    create : function(attrs, success, error){
        alert("implement create in lineitem");
    },
    saveAll : function(){
        $.DOMCached.set('lineitems', LINEITEMS);
    },
    loadAll : function(){
    	var lineitems = $.DOMCached.get('lineitems');
        for (var lineitem in lineitems){
            LINEITEMS[lineitem] = new Lineitem(lineitems[lineitem]);
        }
    },
    loadOne : function(id){
        var savedLineitems = $.DOMCached.get('lineitems');
        if (!savedLineitems){
            // no lineitems saved off
            LINEITEMS = {};
        }
        else{
            if (savedLineitems[id]){
                // lineitem has a previous save state
                LINEITEMS[id] = new Lineitem(savedLineitems[id]);
            }
            else {
                // line does not have a previous save state
                delete LINEITEMS[id];
            }
        }
    }
},
/* @Prototype */
{

})
