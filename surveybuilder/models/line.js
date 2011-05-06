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
    	if (params.about) {
    		for (var line in LINES) {
    			if (LINES[line].about === params.about) {
    				return LINES[line];
    			}
    		}
    	}
    	else {
        	return LINES[params.id];
        }
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
    	var about = "";
    	var line = LINES[id];
    	if (line) {
    		about = line.about;
    	}
        delete LINES[id];
        this.publish("destroyed", {id:id, about:about});
    },
    /**
     * Creates a Line.
     * @param {Object} attrs A line's attributes.
     * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    create : function(attrs, success, error){
        alert('implement Line.create');
    },
    saveAll : function(){
        alert('implement Line.saveAll');
    },
    loadAll : function(success){
        alert('implement Line.loadAll');
    },
    /**
     * Load a Line from the local cache
     * @param {Number} id the id of the Line to load
     */
    loadFromCache : function(id){
        var cachedLines = $.jStorage.get('lines');
        if (!cachedLines){
            // no lines cached off
            LINES = {};
        }
        else{
            if (cachedLines[id]){
                // line has a previous save state
                LINES[id] = new Line(cachedLines[id]);
            }
            else {
				// line does not have a previous save state, so clear out info to default
			    LINES[id].attr("child", null);
			    LINES[id].attr("title", "new-section");
            }
        }
    },
    
    loadFromXML: function(node) {
    	steal.dev.log("loading line from xmlDoc");
		line = new Line({id:new Date().getTime(), type:'line'});
		line.attr('about', node.attr('rdf:about'));
		line.attr('title', SURVEY_UTILS.getElementText(node, "dc:title"));
		line.attr('questionsPerPage', SURVEY_UTILS.getElementText(node, "questionsPerPage"));
		line.save();
		
		//only grab the top level Lineitems
		Lineitem.loadFromXML(node.children().filter('[nodeName="rdf:li"]'), line);
    	
    }
},
/* @Prototype */
{})
