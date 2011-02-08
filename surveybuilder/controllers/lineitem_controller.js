/**
 * @tag controllers, home
 */
jQuery.Controller.extend('Surveybuilder.Controllers.Lineitem',
/* @Static */
{
    onDocument: false,
    
    lineitemDeleteRecursive: function(lineitem){
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

    },
    
    deleteLineitemFromDOM: function(el){
        // "move" the lineitem to limbo
        Surveybuilder.Controllers.Lineitem.lineitemMovedInDom(el, true);
	if (el.closest('.content').children().length === 1) {
           	// this is the only item
           	el.closest('.content').removeClass("hideBorder").siblings('.empty-message').show().removeClass('stay-hidden');
        }
        $(el).slideUp().remove();
    },
    
    lineitemDeleteById: function(id){
        // delete this lineitem and all children
        var lineitemToDelete = Lineitem.findOne({id:id});
        Surveybuilder.Controllers.Lineitem.lineitemDelete(lineitemToDelete);
    },
    
    lineitemDelete: function(lineitemToDelete){
        // delete this lineitem and all children
        if(lineitemToDelete.child){
            Surveybuilder.Controllers.Lineitem.lineitemDeleteRecursive(Lineitem.findOne({id:lineitemToDelete.child}));
        }
        Lineitem.destroy(lineitemToDelete.id);
    },
    
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
                Surveybuilder.Controllers.Lineitem.lineitemMoved(lineitemId, null, null, null, 'delete');
            }
            
            Surveybuilder.Controllers.Lineitem.lineitemDelete(lineitem)
        }
    },
    
    lineitemMovedInDom: function(el, isDelete){

        var lineitem = $(el);  //TODO: check to see if this is necessary, or if it is already a jQuery object
        var params = lineitem.children("form").formParams();
        var prev = lineitem.prev();
        var next = lineitem.next();
        var newParent = null;
        var moveType;

		// get the parent
		var parent = lineitem.parent() && lineitem.parent().closest('.parent');  // have to go up to parent before calling closest, since lineitem has that class

        // If this is the first child, set the new parent
        if(prev && prev.length === 0){
            newParent = parent;
        }

        // check to see if new lineitem or not
        if(!isDelete){
            if (!lineitem.attr("id")) {
                moveType = 'new';
                lineitem.attr("id", new Date().getTime());  //TODO: better id creation scheme
                lineitem.addClass("lineitem");
                params["id"] = lineitem.attr("id");
                if (parent.hasClass("grid") && params["type"] === "question") {
                	params["answersId"] = "#" + parent.attr("id") + "Answers";
                }

                new Lineitem(params).save();
            }
            else{
                moveType = 'existing';
            }
	// hide the empty-Message and content border if content no longer empty
        if (lineitem.closest('.content').children().length === 1) {
		// this is the only item
		lineitem.closest('.content').addClass('hideBorder').siblings('.empty-message').hide().addClass("stay-hidden");
	}
	
        }
        else{
            moveType = 'delete'
        }

        // make content section sortable if this is a new lineitem
        if (moveType === 'new') {
        	//TODO: move these into a sigle place for configuring connections
        	OpenAjax.hub.publish('tabs.makeSortable', {'el':lineitem.find('.line-items'), connectWith:'.line-items'});
		    OpenAjax.hub.publish('tabs.makeSortable', {'el':lineitem.find('.sub-questions'), connectWith:'.sub-questions'});
		    OpenAjax.hub.publish('tabs.makeSortable', {'el':lineitem.find('.grid-answers'), connectWith:'.grid-answers'});
	  		OpenAjax.hub.publish('tabs.makeSortable', {'el':lineitem.find('.answers'), connectWith:'.answers'});
        }

        Surveybuilder.Controllers.Lineitem.lineitemMoved(lineitem.attr("id"), prev, next, newParent, moveType);
    },
    lineitemMoved: function(id, prev, next, newParent, moveType){
        var oldPrev;
        var oldNext;
        var currentLineitem;
        var parent = null;
        var oldParentId;
        var oldParentType;
        var newParentId;
        var newParentType;

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
                    if("lineitem" === oldParentType) {
                    	var parentLineItem = Lineitem.findOne({id:oldParentId});
                    	if(newParent.hasClass("grid")) {
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
                    }
                    else if("line" === oldParentType){
                        //steal.dev.log("moved child of a line");
                        var parentLine = Line.findOne({id:oldParentId});
                        parentLine.attr("firstLineitem", newChild);
                        parentLine.save();
                    }
                    else if("survey" === oldParentType){
                        //steal.dev.log("moved first child of survey");
                        var survey = Survey.findOne({id:"1"}); // TODO: currently hardcoded to a single survey
                        survey.attr("firstLineitem", newChild);
                        survey.save();
                    }
                    if (oldNext){
                        // moved first child, so give next sibling a parent
                        oldNext.attr('parentId', oldParentId);
                        oldNext.attr('parentType', oldParentType);
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
            if(prev && prev.length > 0){
                // not the first child, so clear out parent info
                currentLineitem.attr('parentId', null);
                currentLineitem.attr('parentType', null);

                // update the new previous
                var prevLineItem = Lineitem.findOne({id:prev.attr("id")});
                currentLineitem.attr("prevLineitem", prevLineItem.id);
                prevLineItem.attr("nextLineitem", id);
                prevLineItem.save();
            }
            else {
                // first item
                currentLineitem.attr("prevLineitem", "");
                // update parent
                if (newParent){
                        newParentId = newParent.attr("id");
                        if(newParent.hasClass("lineitem")) {
                        	if(newParent.hasClass("grid")) {
                        		newParentType = "grid"
                        	}
                        	else {
	                            newParentType = "lineitem";
	                        }
                        }
                        else if(newParent.hasClass("line")){
                            newParentType = "line";
                        }
                        else if(newParent.attr("id") === "survey"){
                            newParentType = "survey";
                        }
                        currentLineitem.attr("parentId", newParentId);
                        currentLineitem.attr("parentType", newParentType);
                    }
                if (newParentId && newParentType){
                    if("lineitem" === newParentType) {
                        var parentLineItem = Lineitem.findOne({id:newParentId});
                        parentLineItem.attr("child", id);
                        parentLineItem.save();
                    }
                    if("grid" === newParentType) {
                        var parentLineItem = Lineitem.findOne({id:newParentId});
                        if (currentLineitem.attr("type") === "question") {
                        	parentLineItem.attr("childQuestion", id);
                        }
                   		else if (currentLineitem.attr("type") === "answer") {
                   			parentLineItem.attr("childAnswer", id);
                   		}
                        parentLineItem.save();
                    }
                    else if("line" === newParentType){
                        //steal.dev.log("new first child for a line");
                        var parentLine = Line.findOne({id:newParentId});
                        parentLine.attr("firstLineitem", id);
                        parentLine.save();
                    }
                    else if("survey" === newParentType){
                        //steal.dev.log("new first child of survey");
                        var survey = Survey.findOne({id:"1"}); // TODO: currently hardcoded to a single survey
                        survey.attr("firstLineitem", id);
                        survey.save();
                    }
                }
                
            }
            if(next && next.length > 0){
                // update the new next
                var nextLineItem = Lineitem.findOne({id:next.attr("id")});
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

            if('delete' !== moveType){
                currentLineitem.save();
            }
        }
    },
    
    discardChanges : function(id){
        var thisLineitem = Lineitem.findOne({id:id});
        var childLineitem = Lineitem.findOne({id:thisLineitem.attr('child')});
        var childQuestion = Lineitem.findOne({id:thisLineitem.attr('childQuestion')});
        var childAnswer = Lineitem.findOne({id:thisLineitem.attr('childAnswer')});
        
        // discard the children of this lineitem
        while (childLineitem){
            Surveybuilder.Controllers.Lineitem.discardChanges(childLineitem.id);
            childLineitem = Lineitem.findOne({id:childLineitem.attr('nextLineitem')});
        }
        // discard the child questions of this lineitem
        while (childQuestion){
            Surveybuilder.Controllers.Lineitem.discardChanges(childQuestion.id);
            childQuestion = Lineitem.findOne({id:childLineitem.attr('nextLineitem')});
        }
        // discard the child answers of this lineitem
        while (childAnswer){
            Surveybuilder.Controllers.Lineitem.discardChanges(childAnswer.id);
            childAnswer = Lineitem.findOne({id:childLineitem.attr('nextLineitem')});
        }

        Surveybuilder.Controllers.Lineitem.loadPreviousVersion(id);
    },
    loadPreviousVersion: function(id){
        Lineitem.loadOne(id);
    }
},
/* @Prototype */
{
    init : function(el, message){
        // make quick add icon hoverable (if present)
        $('.quick-add').hover(
            function(){
                $(this).parent().find('.quick-add-buttons').show();
            },
            function(){
                $(this).parent().find('.quick-add-buttons').hide();
            }
        );
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
        currentLineitem.attr(el.attr("name"), el.val());
        currentLineitem.save();
        ev.stopPropagation();
    }    
    
});

