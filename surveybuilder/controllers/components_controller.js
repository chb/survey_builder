/**
 * @tag controllers, home
 */
$.Controller.extend('Surveybuilder.Controllers.Components',
/* @Static */
{
    onDocument: false
},
/* @Prototype */
{
    init: function(){
		steal.dev.log('new components controller instance created');
		// attach component_list controllers
		$('#line-list').surveybuilder_component_list({model: Line, template: '//surveybuilder/views/line/list', draggableClass: 'branch', nameAttribute: 'internalName'});
		$('#question-list').surveybuilder_component_list({model: QuestionType, template: '//surveybuilder/views/questionType/list', draggableClass: 'questionType'});
		$('#answer-list').surveybuilder_component_list({model: AnswerType, template: '//surveybuilder/views/answerType/list', draggableClass: 'answerType', connectTo: '.answers'});
		$('#logic-list').surveybuilder_component_list({model: LogicComponentType , template: '//surveybuilder/views/logicComponentType/list', draggableClass: 'logicComponentType'});
		
        //attach lineitem and logicComponent controllers
        $('.lineitem').surveybuilder_lineitem();
    },
    
    "#add-line click": function(el, ev){
        var params = [];
        line = new Line();
        line.save();  // save to generate id
    	line.attr('internalName', 'new-section');
        // set 'about' to default to the title + generated id
        line.attr('about', line.internalName + line.id);
        line.save();
        OpenAjax.hub.publish('tabs.openLine', {id:line.id});
        $('#saveAll').removeClass('disabled').attr("disabled", false);
    },
    
    toggleDropdown: function(el) {
    	// Show drop-down menus on click
    	if (el.hasClass("active")) {
    		// close this active menu
    		el.removeClass('active ui-corner-tl').addClass("ui-corner-left");
    		el.siblings('.drop-down-list').hide();	
    	}
    	else {
    		// close other config menus
    		$('.drop-down.active').each(function(i) {
    			$(this).removeClass('active ui-corner-tl').addClass("ui-corner-left");
    			$(this).siblings('.drop-down-list').hide();
    		});
    		// show the menu
	    	el.addClass('active ui-corner-tl').removeClass("ui-corner-left");
	    	el.siblings('.drop-down-list').show();
    	}
    },
    
    ".drop-down click": function(el, ev) {
		this.toggleDropdown(el);
    	return false;
    },
    
    ".delete-line click": function(el, ev){
        this.toggleDropdown(el.closest('.drop-down-list').siblings('.drop-down'));
        if(confirm('Do you really want to delete this Section? Everything under this Section will be deleted, along with any existing references to this section in your Survey or other Sections.')){
            var lineId = el.attr("data-line");
            var lineToDelete = Line.findOne({id:lineId});
            OpenAjax.hub.publish('tabs.close', {id:lineId});
            if (lineToDelete.childId){
            	OpenAjax.hub.publish('lineitem.deleteRecursive', {lineitem:Lineitem.findOne({id:lineToDelete.childId})});
            }
            lineToDelete.destroy();
            $('#saveAll').removeClass('disabled').attr("disabled", false);
        }
        return false;
    },
    
    '.edit-line click' : function(el, ev){
    	OpenAjax.hub.publish('tabs.openLine', {id:el.attr("data-line")});
        el.closest('.button-menu-content').hide();
        this.toggleDropdown(el.closest('.drop-down-list').siblings('.drop-down'));
        return false;
    }
});
