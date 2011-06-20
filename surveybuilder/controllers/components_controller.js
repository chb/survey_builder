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
		$('#line-list').surveybuilder_component_list({model: Line, template: '//surveybuilder/views/line/list', draggableClass: 'branch', nameAttribute: 'title'});
		$('#question-list').surveybuilder_component_list({model: Question, template: '//surveybuilder/views/question/list', draggableClass: 'question'});
		$('#answer-list').surveybuilder_component_list({model: Answer, template: '//surveybuilder/views/answer/list', draggableClass: 'answer', connectTo: '.answers'});
		$('#logic-list').surveybuilder_component_list({model: LogicComponent , template: '//surveybuilder/views/logicComponent/list', draggableClass: 'logicComponent'});
		
        //attach lineitem and logicComponent controllers
        $('.lineitem').surveybuilder_lineitem();
        $('.logicComponent').surveybuilder_logic_component();
    },
    
    "#add-line click": function(el, ev){
        var params = [];
        line = new Line();
        line.save();  // save to generate id
    	line.attr('title', 'new-section');
        // set 'about' to default to the title + generated id
        line.attr('about', line.title + line.id);
        line.save();
        OpenAjax.hub.publish('tabs.openLine', {id:line.id});
        $('#saveAll').removeClass('disabled').attr("disabled", false);
    },
    
    ".delete-line click": function(el, ev){
        el.closest('.button-menu-content').hide();
        ev.stopPropagation();
        if(confirm('Do you really want to delete this Section? Everything under this Section will be deleted, along with any existing references to this section in your Survey or other Sections.')){
            var lineId = el.attr("data-line");
            var lineToDelete = Line.findOne({id:lineId});
            OpenAjax.hub.publish('tabs.close', {id:lineId});
            if (lineToDelete.child){
            	OpenAjax.hub.publish('lineitem.deleteRecursive', {lineitem:Lineitem.findOne({id:lineToDelete.child})});
            }
            Line.destroy(lineId);
            $('#saveAll').removeClass('disabled').attr("disabled", false);
        }
    },
    '.button-menu click' : function(el, ev){
        el.find('.button-menu-content').show();
        ev.stopPropagation();
    },
	'.button-menu mouseleave': function(el, ev) {
		el.find('.button-menu-content').slideUp("fast");
	},
    '.edit-line click' : function(el, ev){
    	OpenAjax.hub.publish('tabs.openLine', {id:el.attr("data-line")});
        el.closest('.button-menu-content').hide();
        ev.stopPropagation();
    }
});
