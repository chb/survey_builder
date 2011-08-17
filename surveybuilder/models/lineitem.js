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
	listType:  $.Model.List,
	attributes : { 
		branchTarget : 'string'
	},
	
	/**
	 * Check to see if a Model is an instance of this Class
	 * @param {Object} model Model to check
	 */
	isInstance: function(model) {
		return model instanceof this;
	},

	/* Retrieve Lineitems.
	* @param {Object} params params that might refine your results.
	* @param {Function} success a callback function that returns wrapped lineitem objects.
	* @param {Function} error a callback function for an error in the ajax request.
	*/
	findAll : function(params, success, error){
		var resultsArray = [];

		resultsArray =  this.list.grep(this.callback("isInstance"));
		
		if (success) {
			success(resultsArray);
		}

		return resultsArray;
	},
    /**
     * Retrieves a lineitem data from backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped lineitem objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    findOne : function(params, success, error){
    	if (params.id) {
    		return this.list.get(params.id)[0]; //TODO why is list.get returning an array?
    	}
    	else {
    		return null;
    	}
    },

    /**
     * Updates a lineitem's data.
     * @param {String} id A unique id representing your lineitem.
     * @param {Object} attrs Data to update your lineitem with.
     * @param {Function} success a callback function that indicates a successful update.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    update : function(id, attrs, success, error){
       //Since we are using $.Model.list to store Lineitems, just return the model from the list
		var model = this.findOne({id:id});
		if (success) {
			success(model);
		}
		return model
    },
    
    updatePredicates: function(id, value) {
    	if (surveyBuilder.PREDICATE_MAP[id]) {
    		// already an entry for this id
    		if (surveyBuilder.PREDICATE_MAP[id] !== value) {
    			// value has changed
    			if (!value) {
    				// null value causes delete
    				delete surveyBuilder.PREDICATE_MAP[id];			
    			}
    			else {
	    			surveyBuilder.PREDICATE_MAP[id] = value;
    			}
    			// rebuild the array
    			surveyBuilder.PREDICATES = [];
    			for (var key in surveyBuilder.PREDICATE_MAP) {
    				surveyBuilder.PREDICATES.push({value:surveyBuilder.PREDICATE_MAP[key], id:key});
    			}
    		}
    	}
    	else {
    		// new entry
    		if (value) {
				surveyBuilder.PREDICATE_MAP[id] = value;
				surveyBuilder.PREDICATES.push({value:value, id:id});
    		}
    	}
    	
		OpenAjax.hub.publish('predicates.update', {id:id, value:value});
    },
    
    updateObjects: function(parentID, id, value) {
    	if (surveyBuilder.OBJECT_MAP[id]) {
    		// already an entry for this id
    		if (surveyBuilder.OBJECT_MAP[id].value !== value || surveyBuilder.OBJECT_MAP[id].parent !== parentID) {
    			// value has changed
    			if (!value) {
    				// null value causes delete
    				delete surveyBuilder.OBJECT_MAP[id];			
    			}
    			else {
    				// update value and parent
	    			surveyBuilder.OBJECT_MAP[id].value = value;
	    			surveyBuilder.OBJECT_MAP[id].parent = parentID;
    			}
    			// rebuild the array
    			surveyBuilder.OBJECTS = [];
    			for (var key in surveyBuilder.OBJECT_MAP) {
    				surveyBuilder.OBJECTS.push(surveyBuilder.OBJECT_MAP[key]);
    			}
    		}
    	}
    	else {
    		// new entry
    		if (value) {
				surveyBuilder.OBJECT_MAP[id] = {value:value, parent:parentID, id:id};
				surveyBuilder.OBJECTS.push(surveyBuilder.OBJECT_MAP[id]);
    		}
    	}
    	
		OpenAjax.hub.publish('objects.update', {id:id, value:value, parentID:parentID});
    },
    
    /**
     * Destroys a lineitem's data.
     * @param {String} id A unique id representing your lineitem.
     * @param {Function} success a callback function that indicates a successful destroy.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    destroy : function(id, success, error){
        // remove any predicate entries this lineitem had
        this.updatePredicates(id, null);
        
        this.list.remove(id);
        if(success) {
        	success();
        }
    },
    /**
     * Creates a lineitem.
     * @param {Object} attrs A lineitem's attributes.
     * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    create : function(attrs, success, error){
    	// NOTE: The success callback passed in by $.Model.save() will update the  
		// calling model with the new id, which will in turn add it to our
		// $.Model.list store.  Because of this, we do not create a new instance
		// of Lineitem here, since it would end up being duplicated in our store.
		attrs.id = new Date().getTime();
		if (success) {
			success(attrs);
		}
    },
    saveAll : function(){
        alert('implement Lineitem.saveAll');
    },
    loadAll : function(){
    	alert('implement Lineitem.loadAll');
    },
    /**
     * Save all Lineitems to the local cache
     */
    saveAllToCache : function() {
    	// build an array of Lineitem attributes, so we don't recreate the actual 
    	// Classes when loading them from cache
    	var attrArray = $.map(this.findAll(), function(model, i){
    		return model.attrs();
    	});
    	
		$.jStorage.set(this.fullName, attrArray);
    },
    /**
     * Load Lineitem from the local cache.
     * @param {Number} id the id of the Lineitem to load
     */
    loadFromCache : function(id){
        var cachedModels = $.jStorage.get(this.fullName);
        var model = this.findOne(id);
        if (cachedModels && cachedModels[id]){
            // lineitem has a previous save state, so destroy the old and load from cache
            model.destroy();
            model = this.newInstance(cachedModels[id]);
            model.save();
        }
        else {
	        // lineitem does not have a previous save state
            model.destroy();
        }
    },
    
    /**
     * Create Lineitems from their XML representation
     * @param {Object} lineitemsXML array of Lineitems in xml form 
     * @param {Object} parent the parent of these Lineitems
     */
    createFromXML: function(lineitemsXML, parent) {
    	steal.dev.log("creating lineitems from xml");
    	if (!lineitemsXML) {
    		return;
    	}
    	
    	var newLineitems = [];
    	
    	lineitemsXML.each(function(index) { 
	    	var currentLineitem = null;
    		var lineitemXML = jQuery(this).children().first();
    		var tagName = lineitemXML.get(0).nodeName;
    		try {
    			currentLineitem = new window[tagName]; //TODO:
    		} 
    		catch (e)
    		{
    			alert("Error while loading in survey: Unrecognized tag: " + tagName );
    			return false;
    		}
    		
    		// populate from xml
    		currentLineitem.loadFromXML(lineitemXML);
    		
    		// add to array
    		newLineitems[index] = currentLineitem;
    		
    		// create links
    		if (index == 0) {
    			// link first child to parent
    			currentLineitem.setParent(parent);
    			parent.setChild(currentLineitem);
    		}
    		else {
    			// link siblings
    			currentLineitem.setPrev(newLineitems[index-1]);
    			newLineitems[index-1].setNext(currentLineitem);
    			newLineitems[index-1].save();
    		}
    		currentLineitem.save();
    		parent.save();
		});
    }
},
/* @Prototype */
{
	setup : function(attributes) {
		// we add in the id here since we are not tied into a remote service that would generate it for us
		this.attr("id", SURVEY_UTILS.generateUUID());
		this._super(attributes);
	},
	
	setParent: function(parent) {
		//set new parent
		this.attr("parentId", ((parent) ? parent.id : null));
		this.attr("parentType", ((parent) ? parent.type : null));
	},
	
	setChild: function(child) {
		this.attr("childId", ((child) ? child.id : null));
	},
	
	setPrev: function(prev) {
		this.attr("prevLineitem", ((prev) ? prev.id : null));
	},
	
	setNext: function(next) {
		this.attr("nextLineitem", ((next) ? next.id : null));
	},
	
	setAnswerObject : function(newAnswerObject) {
		// initial autocomplete hack
		Lineitem.updateObjects(this.findParentID(), this.id, newAnswerObject);
		return newAnswerObject;
	},
	findParentID: function() {
		//TODO inefficient, cache parent ID on all children?
		var parent = null;
		var current = this;
		var prevID = this.prevLineitem;
		
		while (prevID) {
			current = Lineitem.findOne({id:prevID});
			prevID = current.prevLineitem;
		}

		return current.parentId;
	}
})
