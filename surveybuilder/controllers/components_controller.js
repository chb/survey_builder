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
    load: function(){
    	// load existing lines
    	Line.loadAll(this.callback('listLines'));
        Question.findAll({}, this.callback('listQuestions'));
        Answer.findAll({}, this.callback('listAnswers'));
        LogicComponent.findAll({}, this.callback('listLogicComponents'));
        $('.lineitem').surveybuilder_lineitem();
        $('.logicComponent').surveybuilder_logic_component();
    },
    
    listLines: function(lines) {
    	$('#line-list').html(this.view('line/list', {lines:lines} )).append('<div id="add-line-div"><span id="add-line" class="ui-icon ui-icon-circle-plus"></span><span id="add-line-description">create a section</span></div>');

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

    refreshLines: function(){
        Line.findAll({},this.callback('listLines'));
    },

    listQuestions: function(questions) {
        $('#question-list').html(this.view('question/list', {questions:questions} ));
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

    listAnswers: function(answers) {
        $('#answer-list').html(this.view('answer/list', {answers:answers} ));
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
    
    listLogicComponents: function(logicComponents) {
        $('#logic-list').html(this.view('logicComponent/list', {logicComponents:logicComponents} ));
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
        var tabs = $('#tabs');
        var params = [];
        params['title'] = 'new-section';
        params['id'] = new Date().getTime();
        new Line(params).save();
        var newLine = Line.findOne(params['id']);
        OpenAjax.hub.publish('tabs.openLine', {id:params.id});
        $('#tabs li a[href="#' + params['id'] +  '"] .ui-icon-gear').show();
        $('#saveAll').removeClass('disabled').attr("disabled", false);
        Line.findAll({}, this.callback('listLines'));
    },
    ".delete-line click": function(el, ev){
        el.closest('.button-menu-content').hide();
        ev.stopPropagation();
        if(confirm('Do you really want to delete this Section? Everything under this Section will be deleted, along with any existing references to this section in your Survey or other Sections.')){
            var lineId = el.attr("data-line");
            var lineToDelete = Line.findOne({id:lineId});
            OpenAjax.hub.publish('tabs.close', {id:lineId});
            if (lineToDelete.firstLineitem){
            	OpenAjax.hub.publish('lineitem.deleteRecursive', {lineitem:Lineitem.findOne({id:lineToDelete.firstLineitem})});  //TODO why is this calling the recursive version?
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
        Line.findAll({}, this.callback('listLines'));
    },
    "line.destroyed subscribe": function(called, line){
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
