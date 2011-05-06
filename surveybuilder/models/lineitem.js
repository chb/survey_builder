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
	attributes : { 
    branchTarget : 'string'
  },
    /**
     * Retrieves lineitems data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped lineitem objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    findAll : function(params, success, error){
        var lineitemsarray = [];

		//TODO: move this logic out of here 
        if(params.lineId){
            for (var lineitem in LINEITEMS){
                if(LINEITEMS[lineitem].lineId == params.lineId && LINEITEMS[lineitem].type === 'branch'){
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
    	if (!!params.answerProperty){
    		for (var lineitem in LINEITEMS){
                if(LINEITEMS[lineitem].answerProperty === params.answerProperty){
                    return LINEITEMS[lineitem];
                }
            }
    	}
    	else {
	        return LINEITEMS[params.id];
	    }
    },
    
    findChildren: function(params){
		var children = [];
    	var parent = LINEITEMS[params.id];
    	
    	if (!!parent) {
			var childId = parent.child
			
			while (!!childId) {
				var current = LINEITEMS[childId];
				children.push(current);
				childId = current.nextLineitem;
			}
    	}
    	
    	return children;
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
        	// update existing
            for(var attribute in attrs){
                existingLineitem.attr(attribute, attrs[attribute]);
            }
        }
        else{
        	// new
            LINEITEMS[attrs.id] = new Lineitem(attrs);
        }
        
        // initial autocomplete hack
        if (attrs.answerProperty) {
			this.updatePredicates(attrs.id, attrs.answerProperty);
		}
		if (attrs.answerObject) {
			this.updateObjects(attrs.id, attrs.answerObject);
		}
        
        success();
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
    				surveyBuilder.PREDICATES.push(surveyBuilder.PREDICATE_MAP[key]);
    			}
    		}
    	}
    	else {
    		// new entry
    		if (value) {
				surveyBuilder.PREDICATE_MAP[id] = value;
				surveyBuilder.PREDICATES.push(value);
    		}
    	}
    	
		OpenAjax.hub.publish('predicates.update', {});
    },
    
    updateObjects: function(id, value) {
    	if (surveyBuilder.OBJECT_MAP[id]) {
    		// already an entry for this id
    		if (surveyBuilder.OBJECT_MAP[id] !== value) {
    			// value has changed
    			if (!value) {
    				// null value causes delete
    				delete surveyBuilder.OBJECT_MAP[id];			
    			}
    			else {
	    			surveyBuilder.OBJECT_MAP[id] = value;
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
				surveyBuilder.OBJECT_MAP[id] = value;
				surveyBuilder.OBJECTS.push(value);
    		}
    	}
    	
		OpenAjax.hub.publish('objects.update', {});
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
        // remove any predicate entries this lineitem had
        this.updatePredicates(id, null);
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
        alert('implement Lineitem.saveAll');
    },
    loadAll : function(){
    	alert('implement Lineitem.loadAll');
    },
    /**
     * Load Lineitem from the local cache.
     * @param {Number} id the id of the Lineitem to load
     */
    loadFromCache : function(id){
        var cachedLineitems = $.jStorage.get('lineitems');
        if (!cachedLineitems){
            // no lineitems cached off
            LINEITEMS = {};
        }
        else{
            if (cachedLineitems[id]){
                // lineitem has a previous save state
                LINEITEMS[id] = new Lineitem(cachedLineitems[id]);
            }
            else {
                // lineitem does not have a previous save state
                delete LINEITEMS[id];
            }
        }
    },
    
    /**
     * Create Lineitems from their XML representation
     * @param {Object} lineitems array of Lineitems in xml form 
     * @param {Object} parent the parent of these Lineitems
     */
    loadFromXML: function(lineitems, parent) {
    	steal.dev.log("loading lineitems from xml");
    	if (!lineitems) {
    		return;
    	}
    	
    	var newLineitems = [];
    	
    	lineitems.each(function(index) { 
    		var params = {};
	    	var newLineitem = null;
    		var lineitem = jQuery(this).children().first();
    		var tagName = lineitem.get(0).nodeName;
    
    		// create an ID
    		params.id = new Date().getTime();
    		
    		// create links
    		if (index == 0) {
    			// link first child to parent
    			if (parent.subType === 'gridSelectOne') {
    				if (tagName === 'LabelAnswer') {
    					parent.attr('childAnswer', params.id);
    				}
    				if (tagName === 'SelectOneQuestion') {
    					parent.attr('childQuestion', params.id);
    				}
    			}
    			else {
    				parent.attr('child', params.id);
    			}
    			parent.save();
    			params.parentId = parent.id;
    			params.parentType = parent.type;
    		}
    		else {
    			// link siblings
    			params.prevLineitem = newLineitems[index-1].id;
    			newLineitems[index-1].attr('nextLineitem', params.id).save();
    		}
    		
    		switch(tagName) {
    			case "LabelAnswer":
					params.type = "answer";
					params.subType = "label";
					params.displayName = "Fixed Choice";
					params.answerText = SURVEY_UTILS.getElementText(lineitem, "answerText");
					params.answerProperty = SURVEY_UTILS.getElementText(lineitem, "answerProperty");
					params.answerObject = SURVEY_UTILS.getElementAttribute(lineitem, 'answerObject', 'rdf:resource'); 
					params.answerNote = SURVEY_UTILS.getElementText(lineitem, "answerNote");
					//create lineitem
					newLineitems[index] = new Lineitem(params);
					newLineitems[index].save();
    				break;
    			case "TextAnswer":
					params.type = "answer";
					params.subType = "text";
					params.displayName = "Free Text";
					params.answerProperty = SURVEY_UTILS.getElementText(lineitem, "answerProperty");
					params.dataType = SURVEY_UTILS.getElementAttribute(lineitem, 'dataType', 'rdf:resource');
					params.answerNote = SURVEY_UTILS.getElementText(lineitem, "answerNote");
					params.answerLabel = SURVEY_UTILS.getElementText(lineitem, "answerLabel");
					//create lineitem
					newLineitems[index] = new Lineitem(params);
					newLineitems[index].save();
    				break;
    			case "SimpleQuestion":
					params.type = "question";
					params.subType = "simple";
					params.displayName = "Simple";
					params.about = lineitem.attr('rdf:about');
					params.questionText = SURVEY_UTILS.getElementText(lineitem, "questionText");
					params.defaultAnswerForEstimation = SURVEY_UTILS.getElementText(lineitem, "defaultAnswerForEstimation");
					params.answerProperty = SURVEY_UTILS.getElementAttribute(lineitem, 'answerProperty', 'rdf:resource');
					params.dataType = SURVEY_UTILS.getElementAttribute(lineitem, 'datatype', 'rdf:resource');
					params.answerLabel = SURVEY_UTILS.getElementText(lineitem, "answerLabel");
					params.answerNote = SURVEY_UTILS.getElementText(lineitem, "answerNote");
					//create lineitem
					newLineitems[index] = new Lineitem(params);
					newLineitems[index].save();
    				break;
    			case "SelectOneQuestion":
					params.type = "question";
					params.subType = "selectOne";
					params.displayName = "Multiple Choice";
					params.about = lineitem.attr('rdf:about');
					params.questionText = SURVEY_UTILS.getElementText(lineitem, "questionText");
					params.answerProperty = SURVEY_UTILS.getElementAttribute(lineitem, 'answerProperty', 'rdf:resource');
					params.defaultAnswerForEstimation = SURVEY_UTILS.getElementText(lineitem, "defaultAnswerForEstimation");
					params.displayType = SURVEY_UTILS.getElementText(lineitem, "displayType");
					params.answersId = SURVEY_UTILS.getElementAttribute(lineitem, 'questionAnswers', 'rdf:resource');
					
					//create lineitem
					newLineitems[index] = new Lineitem(params);
					newLineitems[index].save();

					//grab answers if needed
					if (!params.answersId) {
						Lineitem.loadFromXML(SURVEY_UTILS.getElements(lineitem, 'rdf:li'), newLineitems[index]);
					}
    				break;
    			case "SelectMultipleQuestion":
					params.type = "question";
					params.subType = "selectMultiple";
					params.displayName = "All That Apply";
					params.about = lineitem.attr('rdf:about');
					params.questionText = SURVEY_UTILS.getElementText(lineitem, "questionText");
					params.answerProperty = SURVEY_UTILS.getElementAttribute(lineitem, 'answerProperty', 'rdf:resource');
					params.defaultAnswerForEstimation = SURVEY_UTILS.getElementText(lineitem, "defaultAnswerForEstimation");
					/* TODO: reusable answer sequences
					var answersResource = SURVEY_UTILS.getElementAttribute(lineitem, 'questionAnswers', 'rdf:resource');
					if (answersResource) {
						params.answersResource = answersResource;
					}*/
					//create lineitem
					newLineitems[index] = new Lineitem(params);
					newLineitems[index].save();
					//grab answers
					Lineitem.loadFromXML(SURVEY_UTILS.getElements(lineitem, 'rdf:li'), newLineitems[index]);
    				break;
    			case "GridSelectOneQuestion":
					params.type = "question";
					params.subType = "gridSelectOne";
					params.displayName = "Grid";
					params.about = lineitem.attr('rdf:about');
					params.questionText = SURVEY_UTILS.getElementText(lineitem, "questionText");
					//create lineitem
					newLineitems[index] = new Lineitem(params);
					newLineitems[index].save();
					//grab answers
					Lineitem.loadFromXML(SURVEY_UTILS.getElements(SURVEY_UTILS.getElement(lineitem, 'GridAnswers'), 'rdf:li'), newLineitems[index]);
					//grab questions
					Lineitem.loadFromXML(SURVEY_UTILS.getElements(SURVEY_UTILS.getElement(lineitem, 'GridQuestions'), 'rdf:li'), newLineitems[index]);
    				break;
    			case "Branch":
					params.type = "branch";
					params.subType = "branch";
					params.about = jQuery(lineitem).find('[nodeName="line"]').first().attr("rdf:resource"); //TODO use utils
					//create lineitem
					newLineitems[index] = new Lineitem(params);
					newLineitems[index].save();
    				break;
    			case "ConditionalBranch":
					params.type = "logicComponent";
					params.subType = "conditionalBranch";
					params.displayName = "Conditional Branch";
					//params.branchCondition = SURVEY_UTILS.getElementTextHTMLEncoded(lineitem, "branchCondition");
					params.branchTarget = SURVEY_UTILS.getElementAttribute(lineitem, 'line', 'rdf:resource');
					// TODO: for now we only have a single condition and are 
					// treating it as a part of this lineitem
					var operator = SURVEY_UTILS.getElement(lineitem, 'operator');
					var leftOperand = SURVEY_UTILS.getElement(lineitem, 'leftOperand');
					var rightOperand = SURVEY_UTILS.getElement(lineitem, 'rightOperand');
					params.operator = SURVEY_UTILS.getElementTextHTMLEncoded(operator, 'value');
					params.leftOperandDataType = SURVEY_UTILS.getElementText(leftOperand, 'datatype');
					if (params.leftOperandDataType === 'survey:predicate' || params.leftOperandDataType === 'survey:object') {
						params.leftOperand = SURVEY_UTILS.getElementAttribute(leftOperand, 'value', 'rdf:resource');
					}
					else {
						params.leftOperand = SURVEY_UTILS.getElementText(leftOperand, "value");
					}
					params.rightOperandDataType = SURVEY_UTILS.getElementText(rightOperand, 'datatype');
					if (params.rightOperandDataType === 'survey:predicate' || params.rightOperandDataType === 'survey:object') {
						params.rightOperand = SURVEY_UTILS.getElementAttribute(rightOperand, 'value', 'rdf:resource');
					}
					else {
						params.rightOperand = SURVEY_UTILS.getElementText(rightOperand, "value");
					}
					
					//create lineitem
					newLineitems[index] = new Lineitem(params);
					newLineitems[index].save();
    				break;
    			default:
    				steal.dev.log("unrecognized lineitem type: " + tagName );
    				return;  //TODO: what to do on error?
    		}
		});
    }
},
/* @Prototype */
{

})
