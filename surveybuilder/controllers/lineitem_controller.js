/**
 * @tag controllers, home
 */
jQuery.Controller.extend('Surveybuilder.Controllers.Lineitem',
/* @Static */
{
    onDocument: false,
    
    /**
     * Delete a Lineitem, its children, and any siblings
     * @param {Object} lineitem the lineitem to delete
     */
    lineitemDeleteRecursive: function(lineitem){
		if (lineitem){
		    if(lineitem.childId){
		        Surveybuilder.Controllers.Lineitem.lineitemDeleteRecursive(Lineitem.findOne({id:lineitem.childId}));
		    }
		    if(lineitem.childQuestionId){
		        Surveybuilder.Controllers.Lineitem.lineitemDeleteRecursive(Lineitem.findOne({id:lineitem.childQuestionId}));
		    }
		    if(lineitem.childAnswerId){
		        Surveybuilder.Controllers.Lineitem.lineitemDeleteRecursive(Lineitem.findOne({id:lineitem.childAnswerId}));
		    }
		    if(lineitem.nextLineitem){
		        Surveybuilder.Controllers.Lineitem.lineitemDeleteRecursive(Lineitem.findOne({id:lineitem.nextLineitem}));
		    }
		    lineitem.destroy();
        }
    },
    
    /**
     * Restore a Lineitem, its children, and any siblings to the state saved off in cache
     * @param {Object} lineitem the lineitem to restore
     */
    lineitemRestoreRecursive: function(lineitem){
		if (lineitem){
		    if(lineitem.childId){
		        Surveybuilder.Controllers.Lineitem.lineitemRestoreRecursive(Lineitem.findOne({id:lineitem.childId}));
		    }
		    if(lineitem.childQuestionId){
		        Surveybuilder.Controllers.Lineitem.lineitemRestoreRecursive(Lineitem.findOne({id:lineitem.childQuestionId}));
		    }
		    if(lineitem.childAnswerId){
		        Surveybuilder.Controllers.Lineitem.lineitemRestoreRecursive(Lineitem.findOne({id:lineitem.childAnswerId}));
		    }
		    if(lineitem.nextLineitem){
		        Surveybuilder.Controllers.Lineitem.lineitemRestoreRecursive(Lineitem.findOne({id:lineitem.nextLineitem}));
		    }
		    Lineitem.loadFromCache(lineitem.id);
        }
    },
    
    /**
     * Remove a Lineitem from the DOM
     * @param {Object} el the element to remove
     */
    deleteLineitemFromDOM: function(el){
        // "move" the lineitem to limbo
        Surveybuilder.Controllers.Lineitem.lineitemMovedInDom(el, true);
		if (el.closest('.content').children().length === 1) {
           	// this is the only item
           	el.closest('.content').removeClass("hideBorder").siblings('.empty-message').show().removeClass('stay-hidden');
        }
        $(el).slideUp().remove();
    },

	/**
	* Delete a Lineitem and its children
	* @param {Number} id the id of the Lineitem to delete
	*/
	lineitemDeleteById: function(id){
		// delete this lineitem and all children
		var lineitemToDelete = Lineitem.findOne({id:id});
		if(lineitemToDelete.childId){
			Surveybuilder.Controllers.Lineitem.lineitemDeleteRecursive(Lineitem.findOne({id:lineitemToDelete.childId}));
			}
			if(lineitemToDelete.childQuestionId){
				Surveybuilder.Controllers.Lineitem.lineitemDeleteRecursive(Lineitem.findOne({id:lineitemToDelete.childQuestionId}));
			}
			if(lineitemToDelete.childAnswerId){
				Surveybuilder.Controllers.Lineitem.lineitemDeleteRecursive(Lineitem.findOne({id:lineitemToDelete.childAnswerId}));
			}
			lineitemToDelete.destroy();
	},

    /**
     * Delete the branches to a given Line
     * //TODO: this is more of a generic bulk delete on Lineitems, so rename or refactor
     */
    deleteBranches: function(lineitems){
        var lineitem;
        var lineitemId;

		for (var i=0; i < lineitems.length; i++){
            lineitem = lineitems[i];
            lineitemId = lineitem.id;
            
            var el = $('#' + lineitemId);
            if(el.length > 0){
                // the lineitem is currently in the DOM
                Surveybuilder.Controllers.Lineitem.deleteLineitemFromDOM(el);
            }
            else{
                Surveybuilder.Controllers.Lineitem.lineitemMoved(lineitemId, null, null, null, null, 'delete');
            }
            
            Surveybuilder.Controllers.Lineitem.lineitemDeleteById(lineitem.id);
        }
    },
    
    /**
    * Handle changes that need to happen when an element has been moved in the DOM
    * @param {Object} el the element that was moved
    * @param {Boolean} isDelete flag for whether this is a delete
    */
    lineitemMovedInDom: function(el, isDelete){

        var prev = el.prev();
        var prevId = prev ? prev.attr('id') : null;
        var next = el.next();
        var nextId = next ? next.attr('id') : null;
        var newParentId = null;
        var newParentType = null;
        var moveType;
        var lineitem;

		// get the parent
		var parent = el.parent() && el.parent().closest('.parent');  // have to go up to parent before calling closest, since lineitem has that class
		var parentId = parent ? parent.attr('id') : null;

        // If this is the first child, set the new parent
        if(!prevId){
            newParentId = parentId;
            if(parent.hasClass("lineitem")) {
                newParentType = "lineitem";
            }
            else if(parent.hasClass("line")){
                newParentType = "line";
            }
            else if(parent.attr("id") === "survey"){
                newParentType = "survey";
            }
        }

        // check to see if new lineitem or not
        if(!isDelete) {
            if (!el.attr("id")) {
                moveType = 'new';
				subType = el.formParams().subType;
				var lineitem;
				
				try {
	    			lineitem = new window[subType]; //TODO: alter for future namespacing of models
	    		} 
	    		catch (e)
	    		{
	    			alert("Error while creating new object: Unrecognized type: " + subType );
	    			return false;
	    		}
				
				if (lineitem instanceof GridSelectOneQuestion) {
                	// 
                	lineitem.attr("about", lineitem.id);
                }
                if (parent.hasClass("grid") && lineitem instanceof Question) {
                	lineitem.attr("answersId", "#" + Lineitem.findOne({id:parent.attr("id")}).about + "Answers");
                }
                if (lineitem instanceof Branch) {
                	lineitem.attr("lineAbout", Line.findOne({id:el.attr("data-line")}).about);
                }
				
                lineitem.save();
				el.replaceWith($.View('//surveybuilder/views/' + $.String.camelize(lineitem.type) + '/show_' + lineitem.subType, {lineitem: lineitem}));
				// grab new element in dom
				el = $('#' + lineitem.id);  
            }
            else{
                moveType = 'existing';
                //lineitem = el.model();
                lineitem = Lineitem.findOne({id:el.attr('id')}); 
            }
            
            // attach controllers as needed
            if (!el.controller(this)) {
            	// no lineitem controller attached
				el.surveybuilder_lineitem();
	            if (el.hasClass('logicComponent')) {
	            	el.surveybuilder_logic_component();
	            }
	            if (el.hasClass('branch')) {
	            	var targetLine = Line.findOne({about:el.attr("data-lineAbout")});
	            	el.surveybuilder_branch({model:targetLine});
	            }
            }
            
			// hide the empty-Message and content border if content no longer empty
		    if (el.closest('.content').children().length === 1) {
				// this is the only item
				el.closest('.content').addClass('hideBorder').siblings('.empty-message').hide().addClass("stay-hidden");
			}
        }
        else{
            moveType = 'delete';
            //lineitem = el.model();
            lineitem = Lineitem.findOne({id:el.attr('id')});  
        }

        Surveybuilder.Controllers.Lineitem.lineitemMoved(lineitem.id, prevId, nextId, newParentId, newParentType, moveType);
    },
    
    /**
    * Update the underlying Objects when a Lineitem is moved or deleted
    * @param {Number} id the id of the element that was moved
    * @param {Number} prev ID of the previous sibling of this element
    * @param {Number} next ID of next sibling of this element
    * @param {Number} newParent ID of new parent of this element
    * @param {String} newParentType the type of the new parent (lineitem, line, or survey)
    * @param {String} moveType the type of move (new, existing, or delete)
    */
    lineitemMoved: function(id, prevId, nextId, newParentId, newParentType, moveType){
        var oldPrev;
        var oldNext;
        var currentLineitem;
        var oldParentId;
        var oldParentType;

        // get the existing object
        currentLineitem = Lineitem.findOne({id:id});
        
        // get previous parent info
        oldParentId = currentLineitem.parentId;
        oldParentType = currentLineitem.parentType;

        if ('new' !== moveType) {
            // find the old siblings
            oldPrev = Lineitem.findOne({id:currentLineitem.prevLineitem}) || "";
            oldNext = Lineitem.findOne({id:currentLineitem.nextLineitem}) || "";

            // update the old siblings as needed
            if(oldPrev){
                oldPrev.setNext(oldNext || "");
                oldPrev.save();
            }
            else {
                // moving or deleting the first element, so update the old parent
                var newChild = oldNext || null;
                var oldParentModel;
                //grab parent Model
                if (oldParentId && oldParentType){
                	switch (oldParentType) {
                		case "line":
                			oldParentModel = Line.findOne({id:oldParentId});
                			break;
                		case "survey":
                			oldParentModel = Survey.findOne({id:"1"}); // TODO: currently hardcoded to a single survey
                			break;
                		default:
                			oldParentModel = Lineitem.findOne({id:oldParentId});
                			break;
                	}
                	//update parent Model
                	oldParentModel.setChild(newChild);
					oldParentModel.save();
                    
                    if (oldNext){
                        // moved first child, so give next sibling a parent
                        oldNext.setParent(oldParentModel);
                        oldNext.save();
                    }
                }
            }
            if(oldNext){
            	oldNext.setPrev(oldPrev || "");
                oldNext.save();
            }
        }

        // update the new siblings and parent as needed
        if('delete' !== moveType) {
            if(prevId){
                // not the first child, so clear out parent info
                currentLineitem.setParent(null);

                // update the new previous
                var prevLineitem = Lineitem.findOne({id:prevId});
                currentLineitem.setPrev(prevLineitem);
				prevLineitem.setNext(currentLineitem);
                prevLineitem.save();
            }
            else {
                // first item
                currentLineitem.setPrev(null);
                // update parent
                if (newParentId){
                	var parentModel;
                	//grab parent Model
                    switch (newParentType) {
                    	case "lineitem":
                    		parentModel = Lineitem.findOne({id:newParentId});
                    		break;
                    	case "line":
	                        parentModel = Line.findOne({id:newParentId});
                    		break;
                    	case "survey":
                    		parentModel = Survey.findOne({id:"1"}); // TODO: currently hardcoded to a single survey
                    		break;
                    	default:
                    		break;
                    }
                    //update parent Model
                    parentModel.setChild(currentLineitem);
                    parentModel.save();
                    //update current parent
                    currentLineitem.setParent(parentModel);
                }
            }
            if(nextId){
                // update the new next
                var nextLineitem = Lineitem.findOne({id:nextId});
                currentLineitem.setNext(nextLineitem);
                nextLineitem.setPrev(currentLineitem);
                // clear out the new next's parent info in case it is populated
                nextLineitem.setParent(null);
                nextLineitem.save();
            }
            else{
                // last Lineitem
                currentLineitem.setNext(null);
            }
        }
        currentLineitem.save();
    }
},
/* @Prototype */
{
    init : function(el, message){
	    steal.dev.log('new lineitem controller instance created');
        
        $(el).find('.line-items').surveybuilder_lineitem_content({connectWith: '.line-items'});
        $(el).find('.sub-questions').surveybuilder_lineitem_content({connectWith: '.sub-questions'});
        $(el).find('.grid-answers').surveybuilder_lineitem_content({connectWith: '.grid-answers'});
        $(el).find('.answers').surveybuilder_lineitem_content({connectWith: '.answers'});
        
        $(el).find('.button').button();
    },
   
    ".lineitem-form input change": function(el, ev){
        this.lineitemFormChange(el, ev);
    },
    ".lineitem-form textarea change": function(el, ev){
        this.lineitemFormChange(el, ev);
    },
    ".lineitem-form select change": function(el, ev){
        this.lineitemFormChange(el, ev);
    },
    ".ui-icon-trash click": function(el, ev){
        if(confirm("really delete this " + el.parent().children('form').find('input[name="type"]').attr('value') + '?')) {
            var lineitemId = el.parent().attr("id")

            // remove from the DOM
            this.Class.deleteLineitemFromDOM(el.parent());
            this.Class.lineitemDeleteById(lineitemId);
        }
        ev.stopPropagation();
    },
    
    ".move click": function(el, ev) {
    	steal.dev.log("move clicked");
    	if (!el.hasClass("active")){
    		line = Line.findOne({id:el.closest(".line").attr("id")});
	    	Line.findAll({}, function(lines){
	    		var list = el.find('.drop-down-list');
	    		list.html($.View('//surveybuilder/views/line/listAsButtons', {lines:lines, currentLine:line})).prepend('<div class="move-header ui-state-active ui-corner-top">Move To: </div>'); //TODO: move to view
	    		list.find('.button').button();
	    	});
    	}
    	this.toggleDropdown(el);
    	return false;
    },
    
    ".move .button click": function(el, ev) {
    	var lineitemElement = el.closest('.lineitem');
    	var lineId = el.attr('data-line');
    	var line = Line.findOne({id:lineId});
    	var lineElement = $('#' + lineId);
    	if (lineElement && lineElement.length > 0) {
    		// line open in DOM
    		this.Class.lineitemMovedInDom(lineitemElement.detach().prependTo(lineElement.find('.content').first()), false );
    	}
    	else {
    		// line not open in DOM
    		this.Class.lineitemMoved(lineitemElement.attr("id"), null, line.childId, lineId, "line", "existing");
    		lineitemElement.remove();
    	}
    	
    	this.toggleDropdown(el.closest(".drop-down"));
		return false;
    },
    
    ".move-buttons mouseleave": function(el, ev) {
    	el.slideUp();
    },
    
    ".copy click": function(el, ev) {
    	// get original Lineitem and create RDF/XML representation
    	var originalElement = el.closest('.lineitem');
    	var originalLineitem = Lineitem.findOne({id:originalElement.attr("id")});
    	var originalXMLString = '<rdf:li>' + $.View('//surveybuilder/views/' + $.String.camelize(originalLineitem.type) + '/show_' + originalLineitem.subType + '_rdf', {lineitem: originalLineitem}) + '</rdf:li>';
    	var originalXMLDoc = SURVEY_UTILS.parseAsSurveyXML(originalXMLString);
    	
    	// load in a Lineitem created from original's RDF/XML and insert after original
    	var tempParent = new Lineitem();
    	Lineitem.createFromXML(originalXMLDoc, tempParent);
    	var copyLineitem = Lineitem.findOne({id:tempParent.childId});
    	var copyElement = $($.View('//surveybuilder/views/' + $.String.camelize(copyLineitem.type) + '/show_' + copyLineitem.subType, {lineitem: copyLineitem}));
    	copyElement.insertAfter(originalElement);
    	this.Class.lineitemMovedInDom(copyElement, false );
    	
    	tempParent.destroy();
    	
    	return false;
    },
    
    toggleDropdown: function(el){
    	// Show drop-down menus on click
		var button = el.find('.drop-down');
    	if (button.hasClass("active")) {
    		// close this active menu
    		button.removeClass('active ui-corner-tl').addClass("ui-corner-left");
    		button.siblings('.drop-down-list').hide();	
    	}
    	else {
    		// close other config menus
    		$('.drop-down.active').each(function(i) {
    			$(this).removeClass('active ui-corner-tl').addClass("ui-corner-left");
    			$(this).siblings('.drop-down-list').hide();
    		});
    		// show the menu
	    	button.addClass('active ui-corner-tl').removeClass("ui-corner-left");
	    	button.siblings('.drop-down-list').show();
    	}
    },
    
    ".quick-add click": function(el, ev) {
    	this.toggleDropdown(el);
    	return false;
    },
    
    ".quick-add .button click": function(el, ev){
        var content = el.closest('.lineitem').find('.content');
        var subType = el.attr("data-subType");
        var lineitem = new window[subType];
        var lineitemHTML = $.View('//surveybuilder/views/' + $.String.camelize(lineitem.type) + '/show_' + lineitem.subType, {lineitem: lineitem});
        
        this.Class.lineitemMovedInDom($(lineitemHTML).appendTo(content), false );
    },
    
    ".quick-add-subquestion click": function(el, ev) {
    	var parent = el.closest('.lineitem');
        var content = parent.find('.sub-questions');
        
        // for now we only add SelectOneQuestions
        var lineitem = new SelectOneQuestion();
        lineitem.attr("answersId", "#" + Lineitem.findOne({id:parent.attr("id")}).about + "Answers");
        var lineitemHTML = $.View('//surveybuilder/views/question/show_' + lineitem.subType, {lineitem: lineitem});
        this.Class.lineitemMovedInDom($(lineitemHTML).appendTo(content), false );
    },
    
    ".quick-add-gridanswer click": function(el, ev) {
        var content = el.closest('.lineitem').find('.grid-answers');
        
        // for now we only add LabelAnswers
        var lineitem = new LabelAnswer();
        var lineitemHTML = $.View('//surveybuilder/views/answer/show_' + lineitem.subType, {lineitem: lineitem});
        this.Class.lineitemMovedInDom($(lineitemHTML).appendTo(content), false );
    },
    
    lineitemFormChange: function(el, ev) {
        var currentLineitem = Lineitem.findOne({id:el.closest('.lineitem').attr('id')}); 
        //var currentLineitem = el.closest('.lineitem').model();
        var name = el.attr("name");
        if (name) {
        	// autocomplete can cause submissions with empty names, so ignore those
        	currentLineitem.attr(name, SURVEY_UTILS.htmlEncode(el.val()));
        	currentLineitem.save();
        }
        ev.stopPropagation();
    }    
    
});

