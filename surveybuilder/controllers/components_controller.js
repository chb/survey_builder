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

    	// load existing components
    	Line.findAll({}, this.callback('listLines'));
        Question.findAll({}, this.callback('listQuestions'));
        Answer.findAll({}, this.callback('listAnswers'));
        LogicComponent.findAll({}, this.callback('listLogicComponents'));
        
        //attach controllers
        $('.lineitem').surveybuilder_lineitem();
        $('.logicComponent').surveybuilder_logic_component();
    },
    
    /**
     * List available Lines and make them draggable
     * @param {Object} lines array of lines to render
     */
    listLines: function(lines) {
    	//TODO: move add a line html to view
    	$('#line-list').html($.View('//surveybuilder/views/line/list', {lines:lines} )).append('<div id="add-line-div"><span id="add-line" class="ui-icon ui-icon-circle-plus"></span><span id="add-line-description">create a section</span></div>');

        $('#line-list .branch').draggable({
            connectToSortable: '.line-items',
            handle: '.handle',
            helper: 'clone',
            revert: 'invalid',
            start: function(event, ui){
            	$('.line-items').sortable('refresh');
                $('.line-items').addClass('highlighted');
                // we want a different placeholder style when dragging into a sortable
                $('.line-items').sortable('option', 'placeholder', 'placeholder-drag');
            },
            stop: function(event, ui){
                $('.line-items').removeClass('highlighted');
                // revert the placeholder for sortables back to normal
                $('.line-items').sortable('option', 'placeholder', 'placeholder');
            }
        });

        // Bound here instead of directly by the controller since JMVC 2.0 doesn't support mouseleave
        $('.button-menu').mouseleave( function(){
             $(this).find('.button-menu-content').slideUp("fast");
        });
    },

	'components.refreshLines subscribe': function(event, params) {
    	this.refreshLines();
    },

	/**
	 * Refresh the list of Lines
	 */
    refreshLines: function(){
        Line.findAll({},this.callback('listLines'));
    },

	/**
	 * List available question types and make them draggable
	 * @param {Object} questions array of question types to render
	 */
    listQuestions: function(questions) {
        $('#question-list').html($.View('//surveybuilder/views/question/list', {questions:questions} ));
        $('#question-list .question').draggable({
            connectToSortable: '.line-items',
            handle: '.handle',
            helper: 'clone',
            revert: 'invalid',
            start: function(event, ui){
            	$('.line-items').sortable('refresh');
                $('.line-items').addClass('highlighted');
                // we want a different placeholder style when dragging into a sortable
                $('.line-items').sortable('option', 'placeholder', 'placeholder-drag');
            },
            stop: function(event, ui){
                $('.line-items').removeClass('highlighted');
                // revert the placeholder for sortables back to normal
                $('.line-items').sortable('option', 'placeholder', 'placeholder');
            }
        });
    },

	/**
	 * List available answer types and make them draggable
	 * @param {Object} answers array of answer types to render
	 */
    listAnswers: function(answers) {
        $('#answer-list').html($.View('//surveybuilder/views/answer/list', {answers:answers} ));
        $('#answer-list .answer').draggable({
            connectToSortable: '.answers',
            handle: '.handle',
            helper: 'clone',
            revert: 'invalid',
            start: function(event, ui){
	            $('.answers').sortable('refresh');
                $('.answers').addClass('highlighted');
                // we want a different placeholder style when dragging into a sortable
                $('.answers').sortable('option', 'placeholder', 'placeholder-drag');
            },
            stop: function(event, ui){
                $('.answers').removeClass('highlighted');
                 // revert the placeholder for sortables back to normal
                $('.answers').sortable('option', 'placeholder', 'placeholder');
            }
        });
    },
    
    /**
	 * List available logic components and make them draggable
	 * @param {Object} logicComponents array of logic component types to render
	 */
    listLogicComponents: function(logicComponents) {
        $('#logic-list').html($.View('//surveybuilder/views/logicComponent/list', {logicComponents:logicComponents} ));
        $('#logic-list .logicComponent').draggable({
            connectToSortable: '.line-items',
            handle: '.handle',
            helper: 'clone',
            revert: 'invalid',
            start: function(event, ui){
            	$('.line-items').sortable('refresh');
                $('.logicComponent').addClass('highlighted');
                 // we want a different placeholder style when dragging into a sortable
                $('.logicComponent').sortable('option', 'placeholder', 'placeholder-drag');
            },
            stop: function(event, ui){
                $('.logicComponent').removeClass('highlighted');
                 // revert the placeholder for sortables back to normal
                $('.line-items').sortable('option', 'placeholder', 'placeholder');
            }
        });
    },
    
    "#add-line click": function(el, ev){
        var tabs = $('#surveyBuilderTabs');
        var params = [];
        params['title'] = 'new-section';
        params['id'] = new Date().getTime();
        // set 'about' to default to the title + generated id
        params['about'] = params['title'] + params['id'];
        new Line(params).save();
        var newLine = Line.findOne(params['id']);
        OpenAjax.hub.publish('tabs.openLine', {id:params.id});
        OpenAjax.hub.publish('tabs.markTabAsChanged', {'id':params['id']});
        OpenAjax.hub.publish('components.refreshLines', {});
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
    /**
     *TODO:  we should only be doing this on title updates....
     * Listens for updated lines.  When a line is updated,
     * reload the line list.
     */
    'line.updated subscribe' : function(called, line){
       // Line.findAll({}, this.callback('listLines'));
    },
    "line.destroyed subscribe": function(called, params){
        // refresh the display of available Lines
        Line.findAll({}, this.callback('listLines'));
    },
    '.button-menu click' : function(el, ev){
        el.find('.button-menu-content').show();
        ev.stopPropagation();
    },
    '.edit-line click' : function(el, ev){
    	OpenAjax.hub.publish('tabs.openLine', {id:el.attr("data-line")});
        el.closest('.button-menu-content').hide();
        ev.stopPropagation();
    }
});
