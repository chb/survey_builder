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
		    if(lineitem.child){
		        Surveybuilder.Controllers.Lineitem.lineitemDeleteRecursive(Lineitem.findOne({id:lineitem.child}));
		    }
		    if(lineitem.childQuestion){
		        Surveybuilder.Controllers.Lineitem.lineitemDeleteRecursive(Lineitem.findOne({id:lineitem.childQuestion}));
		    }
		    if(lineitem.childAnswer){
		        Surveybuilder.Controllers.Lineitem.lineitemDeleteRecursive(Lineitem.findOne({id:lineitem.childAnswer}));
		    }
		    if(lineitem.nextLineitem){
		        Surveybuilder.Controllers.Lineitem.lineitemDeleteRecursive(Lineitem.findOne({id:lineitem.nextLineitem}));
		    }
		    Lineitem.destroy(lineitem.id);
        }
    },
    
    /**
     * Restore a Lineitem, its children, and any siblings to the state saved off in cache
     * @param {Object} lineitem the lineitem to restore
     */
    lineitemRestoreRecursive: function(lineitem){
		if (lineitem){
		    if(lineitem.child){
		        Surveybuilder.Controllers.Lineitem.lineitemRestoreRecursive(Lineitem.findOne({id:lineitem.child}));
		    }
		    if(lineitem.childQuestion){
		        Surveybuilder.Controllers.Lineitem.lineitemRestoreRecursive(Lineitem.findOne({id:lineitem.childQuestion}));
		    }
		    if(lineitem.childAnswer){
		        Surveybuilder.Controllers.Lineitem.lineitemRestoreRecursive(Lineitem.findOne({id:lineitem.childAnswer}));
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
        if(lineitemToDelete.child){
		        Surveybuilder.Controllers.Lineitem.lineitemDeleteRecursive(Lineitem.findOne({id:lineitemToDelete.child}));
		    }
		    if(lineitemToDelete.childQuestion){
		        Surveybuilder.Controllers.Lineitem.lineitemDeleteRecursive(Lineitem.findOne({id:lineitemToDelete.childQuestion}));
		    }
		    if(lineitemToDelete.childAnswer){
		        Surveybuilder.Controllers.Lineitem.lineitemDeleteRecursive(Lineitem.findOne({id:lineitemToDelete.childAnswer}));
		    }
        Lineitem.destroy(lineitemToDelete.id);
    },
    
    /**
     * Delete the branches to a given Line
     * //TODO: this is more of a generic bulk delete on Lineitems, so rename or refactor
     */
    deleteBranches: function(lineitems){
        var lineitem;
        var lineitemId;

        for (var lineitemKey in lineitems){
            lineitem = lineitems[lineitemKey];
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

        var params = el.children("form").formParams();
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
            	if(parent.hasClass("grid")) {
            		newParentType = "grid"
            	}
            	else {
                    newParentType = "lineitem";
                }
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
                params["id"] = new Date().getTime();
                if (el.hasClass("grid")) {
                	// 
                	params["about"] = params.id;
                }
                if (parent.hasClass("grid") && params["type"] === "question") {
                	params["answersId"] = "#" + Lineitem.findOne({id:parent.attr("id")}).about + "Answers";
                }
                if (el.hasClass("branch")) {
                	params["lineId"] = el.attr("data-line");
                }

                lineitem = new Lineitem(params);
                lineitem.save();
				el.replaceWith($.View('//surveybuilder/views/' + el.attr("data-type") + '/show_' + el.attr("data-subType"), {lineitem: lineitem}));
				// grab new element in dom
				el = $('#' + lineitem.id);  
				// attach controllers as needed
				el.surveybuilder_lineitem();
                if (el.hasClass('logicComponent')) {
                	el.surveybuilder_logic_component();
                }
                if (el.hasClass('branch')) {
                	line = Line.findOne({id: el.attr("data-line")});
                	el.surveybuilder_branch({model: line});
                }
            }
            else{
                moveType = 'existing';
                //lineitem = el.model();
                lineitem = Lineitem.findOne({id:el.attr('id')}); 
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
                oldPrev.attr("nextLineitem", (oldNext.id || ""));
                oldPrev.save();
            }
            else {
                // moving or deleting the first element, so update the old parent
                var newChild = (oldNext && oldNext.id) || null;
                if (oldParentId && oldParentType){
                	switch (oldParentType) {
                		case "lineitem":
                			var parentLineItem = Lineitem.findOne({id:oldParentId});
	                    	if(newParentType === "grid") {
	                        	steal.dev.log("moved child of grid")
	                        	if (currentLineitem.attr("type") === "question") {
			                    	parentLineItem.attr("childQuestion", newChild);
			                    }
			               		else if (currentLineitem.attr("type") === "answer") {
			               			parentLineItem.attr("childAnswer", newChild);
			               		}
	                    	}
	                    	else {
	                            steal.dev.log("moved child of lineitem")
			                    parentLineItem.attr("child", newChild);
	                        }
	                        parentLineItem.save();
                			break;
                		case "line":
                			var parentLine = Line.findOne({id:oldParentId});
	                        parentLine.attr("child", newChild);
	                        parentLine.save();
                			break;
                		case "survey":
                			var survey = Survey.findOne({id:"1"}); // TODO: currently hardcoded to a single survey
	                        survey.attr("child", newChild);
	                        survey.save();
                			break;
                		default:
                			break;
                	}
                    
                    if (oldNext){
                        // moved first child, so give next sibling a parent
                        oldNext.attr('parentId', oldParentId);
                        oldNext.attr('parentType', oldParentType);
                        oldNext.save();
                    }
                }
            }
            if(oldNext){
                oldNext.attr("prevLineitem", (oldPrev.id || ""));
                oldNext.save();
            }
        }

        // update the new siblings and parent as needed
        if('delete' !== moveType) {
            if(prevId){
                // not the first child, so clear out parent info
                currentLineitem.attr('parentId', null);
                currentLineitem.attr('parentType', null);

                // update the new previous
                var prevLineItem = Lineitem.findOne({id:prevId});
                currentLineitem.attr("prevLineitem", prevLineItem.id);
                prevLineItem.attr("nextLineitem", id);
                prevLineItem.save();
            }
            else {
                // first item
                currentLineitem.attr("prevLineitem", "");
                // update parent
                if (newParentId){
                        currentLineitem.attr("parentId", newParentId);
                        currentLineitem.attr("parentType", newParentType);
                        switch (newParentType) {
                        	case "lineitem":
                        		var parentLineItem = Lineitem.findOne({id:newParentId});
		                        parentLineItem.attr("child", id);
		                        parentLineItem.save();
                        		break;
                        	case "grid":
                        		var parentLineItem = Lineitem.findOne({id:newParentId});
		                        if (currentLineitem.attr("type") === "question") {
		                        	parentLineItem.attr("childQuestion", id);
		                        }
		                   		else if (currentLineitem.attr("type") === "answer") {
		                   			parentLineItem.attr("childAnswer", id);
		                   		}
		                   		parentLineItem.save();
                        		break;
                        	case "line":
		                        var parentLine = Line.findOne({id:newParentId});
		                        parentLine.attr("child", id);
		                        parentLine.save();
                        		break;
                        	case "survey":
                        		var survey = Survey.findOne({id:"1"}); // TODO: currently hardcoded to a single survey
		                        survey.attr("child", id);
		                        survey.save();
                        		break;
                        	default:
                        		break;
                        }
                    }
            }
            if(nextId){
                // update the new next
                var nextLineItem = Lineitem.findOne({id:nextId});
                currentLineitem.attr("nextLineitem", nextLineItem.id);
                nextLineItem.attr("prevLineitem", currentLineitem.id);
                // clear out the new next's parent info in case it is populated
                nextLineItem.attr('parentId', null);
                nextLineItem.attr('parentType', null);
                nextLineItem.save();
            }
            else{
                // last Lineitem
                currentLineitem.attr("nextLineitem", "");
            }
        }
        currentLineitem.save();
    },
    
    /**
     * Discard any changes made to a Lineitem and its children
     * @param {Number} id the id of the Lineitem to discard changes to
     */
    /*discardChanges : function(id){
        var thisLineitem = Lineitem.findOne({id:id});
        var childLineitem = Lineitem.findOne({id:thisLineitem.attr('child')});
        var childQuestion = Lineitem.findOne({id:thisLineitem.attr('childQuestion')});
        var childAnswer = Lineitem.findOne({id:thisLineitem.attr('childAnswer')});
        
        // discard the children of this lineitem
        while (childLineitem){
        	var nextId = childLineitem.attr('nextLineitem');
        	Surveybuilder.Controllers.Lineitem.discardChanges(childLineitem.id);
        	childLineitem = Lineitem.findOne({id:nextId});
        }
        // discard the child questions of this lineitem
        while (childQuestion){
        	var nextId = childQuestion.attr('nextLineitem');
            Surveybuilder.Controllers.Lineitem.discardChanges(childQuestion.id);
            childQuestion = Lineitem.findOne({id:nextId});
        }
        // discard the child answers of this lineitem
        while (childAnswer){
        	var nextId = childAnswer.attr('nextLineitem');
            Surveybuilder.Controllers.Lineitem.discardChanges(childAnswer.id);
            childAnswer = Lineitem.findOne({id:nextId});
        }

        Surveybuilder.Controllers.Lineitem.loadPreviousVersion(id);
    },
    loadPreviousVersion: function(id){
        Lineitem.loadFromCache(id);
    }*/
},
/* @Prototype */
{
    init : function(el, message){
	    steal.dev.log('new lineitem controller instance created');
        // make quick add icon hoverable (if present)
        $('.quick-add').hover(
            function(){
                $(this).parent().find('.quick-add-buttons').show();
            },
            function(){
                $(this).parent().find('.quick-add-buttons').hide();
            }
        );
        $(el).find('.line-items').surveybuilder_lineitem_content({connectWith: '.line-items'});
        $(el).find('.sub-questions').surveybuilder_lineitem_content({connectWith: '.sub-questions'});
        $(el).find('.grid-answers').surveybuilder_lineitem_content({connectWith: '.grid-answers'});
        $(el).find('.answers').surveybuilder_lineitem_content({connectWith: '.answers'});
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
    	line = Line.findOne({id:el.closest(".line").attr("id")});
    	Line.findAll({}, function(lines){
    		el.find('.move-buttons').html($.View('//surveybuilder/views/line/listAsButtons', {lines:lines, currentLine:line})).prepend('<div class="move-header ui-state-default ui-corner-top">Move To: </div>').show(); //TODO: move to view
    	});
    },
    
    ".move button click": function(el, ev) {
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
    		this.Class.lineitemMoved(lineitemElement.attr("id"), null, line.child, lineId, "line", "existing");
    		lineitemElement.remove();
    	}
    	
    	el.closest(".move-buttons").hide();
    	ev.stopPropagation();
    },
    
    ".move-buttons mouseleave": function(el, ev) {
    	el.slideUp();
    },
    
    ".quick-add-buttons button click": function(el, ev){
        var element = $(el);
        var content = element.closest('.lineitem').find('.content');
        var type = element.attr("data-type");
        var subType = element.attr("data-subType");
        var lineitemCopy = $('#' + type + '-list .' + subType );
        this.Class.lineitemMovedInDom(lineitemCopy.clone().appendTo(content), false );
    },
    
    ".quick-add-subquestion click": function(el, ev) {
    	var element = $(el);
        var content = element.closest('.lineitem').find('.sub-questions');
        var lineitemCopy = $('#question-list .selectOne');
        this.Class.lineitemMovedInDom(lineitemCopy.clone().appendTo(content), false );
    },
    
    ".quick-add-gridanswer click": function(el, ev) {
    	var element = $(el);
        var content = element.closest('.lineitem').find('.grid-answers');
        var lineitemCopy = $('#answer-list .label');
        this.Class.lineitemMovedInDom(lineitemCopy.clone().appendTo(content), false );
    },
    
    lineitemFormChange: function(el, ev) {
        var currentLineitem = Lineitem.findOne({id:el.closest('.lineitem').attr('id')}); 
        //var currentLineitem = el.closest('.lineitem').model();
        currentLineitem.attr(el.attr("name"), SURVEY_UTILS.htmlEncode(el.val()));
        currentLineitem.save();
        ev.stopPropagation();
    }    
    
});

