/**
 * @tag controllers, home
 */
$.Controller.extend('Surveybuilder.Controllers.Tabs',
/* @Static */
{
    onDocument: false,
    
    updateTitle: function(line) {
    	$('#tabs a[href="#' + line.id + '"]').children().text(line.title);
    }
},
/* @Prototype */
{
	'tabs.makeSortable subscribe': function(event, params) {
    	this.makeSortable(params.el, params.connectWith);
    },
    
	makeSortable: function(el, connectWith){
        //TODO: better way?  live attachement when upgrade to jquery 1.4?
        $(el).sortable({
            axis: 'y',
            connectWith: connectWith,
            forcePlaceholderSize: true,
            handle: '.ui-icon-grip-dotted-vertical',
            placeholder: 'placeholder',
            update: function(event, ui){
                // occurs when a lineitem is moved, or created
                // attach controller(s) to the new lineitem
                ui.item.surveybuilder_lineitem();
                if (ui.item.hasClass('logicComponent')) {
                	ui.item.surveybuilder_logic_component();
                	// TODO: inital hack to update branch targets
        			OpenAjax.hub.publish('logicComponent.updateLines', {lines:LINES});
                }
                if (ui.item.hasClass('branch')) {
                	ui.item.surveybuilder_branch();
                }
                
                // register the move with the controller
                OpenAjax.hub.publish('lineitem.movedInDom', {el:ui.item, isDelete:false});
                OpenAjax.hub.publish('tabs.markTabAsChanged', {});
            },
            over: function(event, ui){
                ui.sender.parent().find('.empty-message').css("visibility", "hidden");
            },
            out: function(even, ui){
                ui.sender.parent().find('.empty-message').css("visibility", "visible");
            }
        });
    },
    
    init: function(){
    	//steal.dev.log("tabs controller init");
        $('#tabs').resizable({
            handles: 'e',
            alsoResize: '.ui-tabs-nav, #tabsTopper, #tabsTopperHelper',
            stop: function(event, ui){
                // resize sets a specific height, but we want it to be able to grow after a resize
                $('#tabs').css("height", "auto");
            }
        });
        $(".ui-tabs-nav").droppable({
        accept: '.line',
        hoverClass: 'tab-hover',
        drop: function(event, ui) {
            var about = ui.draggable.find('input[name="about"]').attr("value");
            OpenAjax.hub.publish('tabs.openLine', {id:about});
        }
    });
    },
    
    'tabs.openLine subscribe': function(event, params) {
    	this.openLineInTab(params.id);
    },
    
    openLineInTab: function(id){
        var currentLine = Line.findOne({id:id});
        if ($('#'+id).length) {
            // line already open
            return;
        }
        var tabsDiv = $('#tabs');
        tabsDiv.append(this.view('/line/show', {line:currentLine}));
        tabsDiv.tabs('add' , "#"+id , currentLine.title);
        // add line-controller to newly opened line
        $('#'+id).surveybuilder_line();
        // add controllers to each newly rendered lineitem
        $('#'+id + ' .lineitem').surveybuilder_lineitem();
        $('#'+id + ' .logicComponent').surveybuilder_logic_component();
        $('#'+id + ' .branch').surveybuilder_branch();
        // make content divs sortable on newly opened line
        this.makeSortable($('#'+id).find('.line-items'), '.line-items');
        this.makeSortable($('#'+id).find('.sub-questions'), '.sub-questions');
        this.makeSortable($('#'+id).find('.grid-answers'), '.grid-answers');
        this.makeSortable($('#'+id).find('.answers'), '.answers');
        // TODO: inital hack to update branch targets
        OpenAjax.hub.publish('logicComponent.updateLines', {lines:LINES});
    },
    
    'tabs.close subscribe': function(event, params) {
    	this.closeTabById(params.id);
    },
    
    closeTabById: function(id){
        var tabsDiv = $('#tabs');
        var fullId = '#' + id;

        $('#tabs .ui-tabs-nav li').each(function(index){
            if ($(this).children(':first').attr("href") === fullId){  // TODO better way of selecting that isn't as brittle or slow
                tabsDiv.tabs('remove', index);
                return;
            }
        });
    },
    ".ui-icon-document click": function(el, ev){
        OpenAjax.hub.publish('survey.export', {});
        ev.stopPropagation();
    },
    "#saveExport click" : function(el, ev){
        window.open("data:text/plain," + encodeURIComponent($('#export textarea').val()));
    },
    '.close-tab click' : function(el, ev){
        if ($(el).siblings().find('.changes-made:visible').length > 0){
            if(confirm("close without saving changes?")) {
                var tabs = $('#tabs');
                var lineId = $('.ui-tabs-selected a').attr('href').replace('#', '');
                OpenAjax.hub.publish('line.discardChanges', {id:lineId});
                OpenAjax.hub.publish('components.refreshLines', {});
                OpenAjax.hub.publish('survey.list', {});
                tabs.tabs('remove', tabs.tabs('option', 'selected'));
            }
        }
        else{
            var tabs = $('#tabs');
            tabs.tabs('remove', tabs.tabs('option', 'selected'));
        }
        ev.stopPropagation();
    },
    
    'survey.created subscribe': function() {
    	steal.dev.log("Tabs: survey.updated");
    	this.markTabAsChanged()
    },
    
    'survey.updated subscribe': function() {
    	steal.dev.log("Tabs: survey.updated");
    	this.markTabAsChanged()
    },
    
    'survey.destroy subscribe': function() {
    	steal.dev.log("Tabs: survey.destroy");
    	this.markTabAsChanged()
    },
    
    'line.updated subscribe': function() {
    	steal.dev.log("Tabs: line.updated");
    	this.markTabAsChanged()
    },
    
    'line.destroy subscribe': function() {
    	steal.dev.log("Tabs: line.destroy");
    	this.markTabAsChanged()
    },
    
    'lineitem.updated subscribe': function() {
    	steal.dev.log("Tabs: lineitem.updated");
    	this.markTabAsChanged()
    },
    
    'lineitem.destroy subscribe': function() {
    	steal.dev.log("Tabs: lineitem.destroy");
    	this.markTabAsChanged()
    },
    
    'tabs.markTabAsChanged subscribe': function(event, params) {
    	this.markTabAsChanged();
    },
    
    markTabAsChanged: function(){
       $('.ui-tabs-selected .ui-icon-gear').show();
       $('#saveAll').removeClass('disabled').attr("disabled", false);
    }
    
});
