/**
 * @tag models, home
 * Wraps backend line services.  Enables 
 * [line.static.findAll retrieving],
 * [line.static.update updating],
 * [line.static.destroy destroying], and
 * [line.static.create creating] lines.
 */
$.Model.extend('Line',
/* @Static */
{
	/**
     * Retrieves Line data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped Line objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    findAll : function(params, success, error){
	//success([Line.wrap({'displayName':'testing line', 'about':'testing-line', 'type':'line', 'title':'line for testing'}), Line.wrap({'displayName':'another testing line', 'about':'another-testing-line', 'type':'line', 'title':'another line for testing'})]);
        // var lines = LINES;
        var linesarray = [];
        for (var line in LINES){
            linesarray.push(LINES[line]);
        }
        
        success(linesarray);
    },  
     /**
     * Retrieves a line data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped line objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    findOne : function(params, success, error){
        return LINES[params.id];
        //success([Line.wrap({'type':'simple', 'displayName':'Simple'}), Line.wrap({'type':'selectOne', 'displayName':'Select One'}), Line.wrap({'type':'selectMultiple', 'displayName':'Select Multiple'})]);
    },
    /**
     * Updates a Line's data.
     * @param {String} id A unique id representing your Line.
     * @param {Object} attrs Data to update your Line with.
     * @param {Function} success a callback function that indicates a successful update.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    update : function(id, attrs, success, error){
        // TODO: for now ends up getting called even if it should be a create, since the ID is set
        steal.dev.log('line.update');
        var existingLine = this.findOne(attrs);
        if (existingLine){
            for(var attribute in attrs){
                existingLine.attr(attribute, attrs[attribute]);
            }
        }
        else{
            LINES[attrs.id] = new Line(attrs);
        }
        success();
    },
    /**
     * Destroys a Line's data.
     * @param {String} id A unique id representing the Line.
     * @param {Function} success a callback function that indicates a successful destroy.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    destroy : function(id, success, error){
        // TODO: short circuiting to a local only delete for now
        delete LINES[id];
        this.publish("destroyed", id);
    },
    /**
     * Creates a Line.
     * @param {Object} attrs A line's attributes.
     * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    create : function(attrs, success, error){
        alert('implement create');
    },
    saveAll : function(){
        $.DOMCached.set('lines', LINES);
    },
    loadAll : function(success){
        var lines = $.DOMCached.get('lines');
        for (var line in lines){
            LINES[line] = new Line(lines[line]);
        }
        var linesarray = [];
        for (var line in LINES){
            linesarray.push(LINES[line]);
        }

        success(linesarray);
    },
    loadOne : function(id){
        var savedLines = $.DOMCached.get('lines');
        if (!savedLines){
            // no lines saved off
            LINES = {};
        }
        else{
            if (savedLines[id]){
                // line has a previous save state
                LINES[id] = new Line(savedLines[id]);
            }
            else {
                // line does not have a previous save state, so clear out info to default
                LINES[id].attr("firstLineitem", "null");
                LINES[id].attr("title", "new-section");
            }
        }
    }
},
/* @Prototype */
{})
