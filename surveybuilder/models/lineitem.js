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
     * Retrieves lineitems data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped lineitem objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    findAll : function(params, success, error){
        var lineitemsarray = [];

		//TODO: move this logic out of here 
        if(params && params.lineId){
            for (var lineitem in Lineitem.list){
                if(lineitem.lineId == params.lineId && lineitem.type === 'branch'){
                    lineitemsarray.push(lineitem);
                }
            }
        }
        else{
            lineitemsarray = Lineitem.list;
        }

		if (success) {
        	success(lineitemsarray);
       }
       
       return lineitemsarray;
    },
    /**
     * Retrieves a lineitem data from backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped lineitem objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    findOne : function(params, success, error){
    	if (params.id) {
    		return Lineitem.list.get(params.id)[0]; //TODO why is list.get returning an array?
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
		lineitem = Lineitem.findOne({id:id});
		if (success) {
			success(lineitem);
		}
		return lineitem
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
        //delete LINEITEMS[id];
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
    	var attrArray = $.map(Lineitem.findAll(), function(lineitem, i){
    		return lineitem.attrs();
    	});
    	
		$.jStorage.set('lineitems', attrArray);
    },
    /**
     * Load Lineitem from the local cache.
     * @param {Number} id the id of the Lineitem to load
     */
    loadFromCache : function(id){
        var cachedLineitems = $.jStorage.get('lineitems');
        var lineitem = Lineitem.findOne(id);
        if (cachedLineitems && cachedLineitems[id]){
            // lineitem has a previous save state, so destroy the old and load from cache
            lineitem.destroy();
            lineitem = new Lineitem(cachedLineitems[id]);
            lineitem.save();
        }
        else {
	        // lineitem does not have a previous save state
            lineitem.destroy();
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
	    	var currentLineitem = null;
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
    			params.parentId = parent.id;
    			params.parentType = parent.type;
    		}
    		else {
    			// link siblings
    			params.prevLineitem = newLineitems[index-1].id;
    			newLineitems[index-1].attr('nextLineitem', params.id).save();
    		}
    		newLineitems[index] = new Lineitem(params);
    		
    		currentLineitem = newLineitems[index];
    		
    		switch(tagName) {
    			case "LabelAnswer":
					currentLineitem.attr('type', "answer");
					currentLineitem.attr('subType', "label");
					currentLineitem.attr('displayName', "Fixed Choice");
					currentLineitem.attr('answerText', SURVEY_UTILS.getElementText(lineitem, "answerText"));
					currentLineitem.attr('answerProperty', SURVEY_UTILS.getElementText(lineitem, "answerProperty"));
					currentLineitem.attr('answerObject', SURVEY_UTILS.getElementAttribute(lineitem, 'answerObject', 'rdf:resource')); 
					currentLineitem.attr('answerNote', SURVEY_UTILS.getElementText(lineitem, "answerNote"));
    				break;
    			case "TextAnswer":
					currentLineitem.attr('type', "answer");
					currentLineitem.attr('subType', "text");
					currentLineitem.attr('displayName', "Free Text");
					currentLineitem.attr('answerProperty', SURVEY_UTILS.getElementText(lineitem, "answerProperty"));
					currentLineitem.attr('dataType', SURVEY_UTILS.getElementAttribute(lineitem, 'dataType', 'rdf:resource'));
					currentLineitem.attr('answerNote', SURVEY_UTILS.getElementText(lineitem, "answerNote"));
					currentLineitem.attr('answerLabel', SURVEY_UTILS.getElementText(lineitem, "answerLabel"));
    				break;
    			case "SimpleQuestion":
					currentLineitem.attr('type', "question");
					currentLineitem.attr('subType', "simple");
					currentLineitem.attr('displayName', "Simple");
					currentLineitem.attr('about', lineitem.attr('rdf:about'));
					currentLineitem.attr('questionText', SURVEY_UTILS.getElementText(lineitem, "questionText"));
					currentLineitem.attr('defaultAnswerForEstimation', SURVEY_UTILS.getElementText(lineitem, "defaultAnswerForEstimation"));
					currentLineitem.attr('answerProperty', SURVEY_UTILS.getElementAttribute(lineitem, 'answerProperty', 'rdf:resource'));
					currentLineitem.attr('dataType', SURVEY_UTILS.getElementAttribute(lineitem, 'datatype', 'rdf:resource'));
					currentLineitem.attr('answerLabel', SURVEY_UTILS.getElementText(lineitem, "answerLabel"));
					currentLineitem.attr('answerNote', SURVEY_UTILS.getElementText(lineitem, "answerNote"));
    				break;
    			case "SelectOneQuestion":
					currentLineitem.attr('type', "question");
					currentLineitem.attr('subType', "selectOne");
					currentLineitem.attr('displayName', "Multiple Choice");
					currentLineitem.attr('about', lineitem.attr('rdf:about'));
					currentLineitem.attr('questionText', SURVEY_UTILS.getElementText(lineitem, "questionText"));
					currentLineitem.attr('answerProperty', SURVEY_UTILS.getElementAttribute(lineitem, 'answerProperty', 'rdf:resource'));
					currentLineitem.attr('defaultAnswerForEstimation', SURVEY_UTILS.getElementText(lineitem, "defaultAnswerForEstimation"));
					currentLineitem.attr('displayType', SURVEY_UTILS.getElementText(lineitem, "displayType"));
					currentLineitem.attr('answersId', SURVEY_UTILS.getElementAttribute(lineitem, 'questionAnswers', 'rdf:resource'));
					
					//grab answers if needed
					if (!currentLineitem.answersId) {
						Lineitem.loadFromXML(SURVEY_UTILS.getElements(lineitem, 'rdf:li'), currentLineitem);
					}
    				break;
    			case "SelectMultipleQuestion":
					currentLineitem.attr('type', "question");
					currentLineitem.attr('subType', "selectMultiple");
					currentLineitem.attr('displayName', "All That Apply");
					currentLineitem.attr('about', lineitem.attr('rdf:about'));
					currentLineitem.attr('questionText', SURVEY_UTILS.getElementText(lineitem, "questionText"));
					currentLineitem.attr('answerProperty', SURVEY_UTILS.getElementAttribute(lineitem, 'answerProperty', 'rdf:resource'));
					currentLineitem.attr('defaultAnswerForEstimation', SURVEY_UTILS.getElementText(lineitem, "defaultAnswerForEstimation"));
					/* TODO: reusable answer sequences
					var answersResource = SURVEY_UTILS.getElementAttribute(lineitem, 'questionAnswers', 'rdf:resource');
					if (answersResource) {
						params.answersResource = answersResource;
					}*/

					//grab answers
					Lineitem.loadFromXML(SURVEY_UTILS.getElements(lineitem, 'rdf:li'), currentLineitem);
    				break;
    			case "GridSelectOneQuestion":
					currentLineitem.attr('type', "question");
					currentLineitem.attr('subType', "gridSelectOne");
					currentLineitem.attr('displayName', "Grid");
					currentLineitem.attr('about', lineitem.attr('rdf:about'));
					currentLineitem.attr('questionText', SURVEY_UTILS.getElementText(lineitem, "questionText"));

					//grab answers
					Lineitem.loadFromXML(SURVEY_UTILS.getElements(SURVEY_UTILS.getElement(lineitem, 'GridAnswers'), 'rdf:li'), currentLineitem);
					//grab questions
					Lineitem.loadFromXML(SURVEY_UTILS.getElements(SURVEY_UTILS.getElement(lineitem, 'GridQuestions'), 'rdf:li'), currentLineitem);
    				break;
    			case "Branch":
					currentLineitem.attr('type', "branch");
					currentLineitem.attr('subType', "branch");
					currentLineitem.attr('about', jQuery(lineitem).find('[nodeName="line"]').first().attr("rdf:resource")); //TODO use utils
    				break;
    			case "ConditionalBranch":
					currentLineitem.attr('type', "logicComponent");
					currentLineitem.attr('subType', "conditionalBranch");
					currentLineitem.attr('displayName', "Conditional Branch");
					//params.branchCondition = SURVEY_UTILS.getElementTextHTMLEncoded(lineitem, "branchCondition");
					currentLineitem.attr('branchTarget', SURVEY_UTILS.getElementAttribute(lineitem, 'line', 'rdf:resource'));
					// TODO: for now we only have a single condition and are 
					// treating it as a part of this lineitem
					var operator = SURVEY_UTILS.getElement(lineitem, 'operator');
					var leftOperand = SURVEY_UTILS.getElement(lineitem, 'leftOperand');
					var rightOperand = SURVEY_UTILS.getElement(lineitem, 'rightOperand');
					currentLineitem.attr('operator', SURVEY_UTILS.getElementTextHTMLEncoded(operator, 'value'));
					currentLineitem.attr('leftOperandDataType', SURVEY_UTILS.getElementText(leftOperand, 'datatype'));
					if (currentLineitem.leftOperandDataType === 'survey:predicate' || currentLineitem.leftOperandDataType === 'survey:object') {
						currentLineitem.attr('leftOperand', SURVEY_UTILS.getElementAttribute(leftOperand, 'value', 'rdf:resource'));
					}
					else {
						currentLineitem.attr('leftOperand', SURVEY_UTILS.getElementText(leftOperand, "value"));
					}
					currentLineitem.attr('rightOperandDataType', SURVEY_UTILS.getElementText(rightOperand, 'datatype'));
					if (currentLineitem.rightOperandDataType === 'survey:predicate' || currentLineitem.rightOperandDataType === 'survey:object') {
						currentLineitem.attr('rightOperand', SURVEY_UTILS.getElementAttribute(rightOperand, 'value', 'rdf:resource'));
					}
					else {
						currentLineitem.attr('rightOperand', SURVEY_UTILS.getElementText(rightOperand, "value"));
					}
					
    				break;
    			default:
    				steal.dev.log("unrecognized lineitem type: " + tagName );
    				return;  //TODO: what to do on error?
    		}
    		currentLineitem.save();
    		parent.save();
		});
    }
},
/* @Prototype */
{
	setup : function(attributes) {
		this.attr("id", new Date().getTime());
		this._super(attributes);
	},
	setAnswerProperty : function(newAnswerProperty) {
		// initial autocomplete hack
		Lineitem.updatePredicates(this.id, newAnswerProperty);
		return newAnswerProperty;
	},
	setAnswerObject : function(newAnswerObject) {
		// initial autocomplete hack
		Lineitem.updateObjects(this.id, newAnswerObject);
		return newAnswerObject;
	}
})
