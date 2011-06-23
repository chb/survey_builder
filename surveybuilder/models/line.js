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
	listType:  $.Model.List,
	/**
     * Retrieves Line data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped Line objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    findAll : function(params, success, error){
        var linesarray = Line.list;
        
        if(success) {
        	success(linesarray);
        } 
        return linesarray;
    },  
     /**
     * Retrieves a line data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped line objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    findOne : function(params, success, error){
    	var result = null;
    	if (params.about) {
    		lineList = Line.list;
    		for (var i=0; i< lineList.length; i++) {
    			if (lineList[i].about === params.about) {
    				result = lineList[i];
    			}
    		}
    	}
    	else {
        	if (params.id) {
	    		result = Line.list.get(params.id)[0]; //TODO why is list.get returning an array?
	    	}
        }
        
        if (success) {
        	success(result);
        }
        
        return result;
    },
    /**
     * Updates a Line's data.
     * @param {String} id A unique id representing your Line.
     * @param {Object} attrs Data to update your Line with.
     * @param {Function} success a callback function that indicates a successful update.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    update : function(id, attrs, success, error){
		//Since we are using $.Model.list to store lines, just return the model from the list
		line = Line.findOne({id:id});
		if (success) {
			success(line);
		}
		return line
    },
    /**
     * Creates a Line.
     * @param {Object} attrs A line's attributes.
     * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
     * @param {Function} error a callback that should be called with an object of errors.
     */
	create : function(attrs, success, error){
		// NOTE: The success callback passed in by $.Model.save() will update the  
		// calling model with the new id, which will in turn add it to our
		// $.Model.list store.  Because of this, we do not create a new instance
		// of Line here, since it would end up being duplicated in our store.
		attrs.id = new Date().getTime();
		if (success) {
			success(attrs);
		}
	},
    /**
     * Destroys a Line's data.
     * @param {String} id A unique id representing the Line.
     * @param {Function} success a callback function that indicates a successful destroy.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    destroy : function(id, success, error){
    	var about = "";
    	var line = Line.findOne({id:id});
    	if (line) {
    		about = line.about;
    	}
		if (success) {
			success();
		}
		
        this.publish("destroyed", {id:id, about:about});
    },
    saveAll : function(){
        alert('implement Line.saveAll');
    },
    /**
     * Save all Lines to the local cache
     */
    saveAllToCache : function() {
    	// build an array of Line attributes, so we don't recreate the actual 
    	// Classes when loading them from cache
    	var attrArray = $.map(Line.findAll(), function(line, i){
    		return line.attrs();
    	});
    	
		$.jStorage.set('lines', attrArray);
    },
    /**
     * Load a Line from the local cache
     * @param {Number} id the id of the Line to load
     */
    loadFromCache : function(id){
        var line = Line.findOne({id:id});
        var lineId = line.id;
        var cachedLine = null;
        
        //line.destroy();
        
        var cachedLines = $.jStorage.get('lines');
        // find the cached line
        if (cachedLines) {
        	for (var i=0; i<cachedLines.length; i++) {
        		if (cachedLines[i].id == lineId) {
        			cachedLine = cachedLines[i];
        			break;
        		}
        	}
        }
        if (cachedLine){
        	// line has a previous save state, so load from cache
            line.attrs(cachedLine);
            line.save();
        }
        
        return line;
    },
    
    loadFromXML: function(node) {
    	steal.dev.log("loading line from xmlDoc");
		line = new Line({type:'line'});
		line.attr('about', node.attr('rdf:about'));
		line.attr('title', SURVEY_UTILS.getElementText(node, "dc:title"));
		line.attr('questionsPerPage', SURVEY_UTILS.getElementText(node, "questionsPerPage"));
		line.save();
		
		//only grab the top level Lineitems
		Lineitem.loadFromXML(node.children().filter('[nodeName="rdf:li"]'), line);
    },
    
    
},
/* @Prototype */
{})
