/**
 * @tag controllers, home
 */
$.Controller.extend('Surveybuilder.Controllers.Tabs',
/* @Static */
{
    onDocument: false
},
/* @Prototype */
{
	updateTitle: function(line) {
    	$('#surveyBuilderTabs a[href="#' + line.id + '"]').children().text(line.title);
    },
       
    init: function(){
    	steal.dev.log('new tabs controller instance created');
    	//TODO: using this.element.tabs() does the initial tab-ification of the 
    	//tabs, but does not attach the jquery id to the element, and so future 
    	//calls to the tabs() function fail.  For now using the id for selection,
    	//but this does not make sense on a prototype init
    	$('#surveyBuilderTabs').tabs({
		    tabTemplate: '<li><a href="#{href}"><span class="ui-icon ui-icon-gear changes-made" title="content changed"></span><span>#{label}</span></a><a class="close-tab"><span class="ui-icon ui-icon-closethick close-icon"></span></a></li>',
		    add: function(event, ui) {
		        $('#surveyBuilderTabs').tabs('select', '#' + ui.panel.id);
		    }
		});
		
		// Make tabs resizable
        $('#surveyBuilderTabs').resizable({
            handles: 'e',
            alsoResize: '.ui-tabs-nav, #tabsTopper, #tabsTopperHelper',
            stop: function(event, ui){
                // resize sets a specific height, but we want it to be able to grow after a resize
                $('#surveyBuilderTabs').css("height", "auto");
            }
        });
        
        // Make tabs able to receive lines dropped on them 
        $(".ui-tabs-nav").droppable({
		    accept: '.line',
		    hoverClass: 'tab-hover',
		    drop: function(event, ui) {
		        var lineId = ui.draggable.attr("data-line");
		        OpenAjax.hub.publish('tabs.openLine', {id:lineId});
		    }
		});
    },
    
    'tabs.openLine subscribe': function(event, params) {
    	this.openLineInTab(params.id);
    },
    
    /**
     * Open up a Line in the tabs
     * @param {Number} id the Line to open
     */
    openLineInTab: function(id){
        var currentLine = Line.findOne({id:id});
        if ($('#'+id).length) {
            // line already open
            return;
        }
        var tabsDiv = $('#surveyBuilderTabs');
        tabsDiv.append($.View('//surveybuilder/views/line/show', {line:currentLine}));
        tabsDiv.tabs('add' , "#"+id , currentLine.title);
        // add line-controller to newly opened line
        $('#'+id).surveybuilder_line();
        // add controllers to each newly rendered lineitem
        $('#'+id + ' .lineitem').surveybuilder_lineitem();
        $('#'+id + ' .logicComponent').surveybuilder_logic_component();
        $('#'+id + ' .branch').each(function() {
        	line = Line.findOne({id:$(this).attr('data-line')});
        	$(this).surveybuilder_branch({model:line});
        });
    },
    
    'tabs.close subscribe': function(event, params) {
    	this.closeTabById(params.id);
    },
    
    /**
     * Close a tab
     * @param {Number} id the tab to close
     */
    closeTabById: function(id){
        var tabsDiv = $('#surveyBuilderTabs');
        var fullId = '#' + id;

        $('#surveyBuilderTabs .ui-tabs-nav li').each(function(index){
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
                var tabs = $('#surveyBuilderTabs');
                var lineId = $('.ui-tabs-selected a').attr('href').replace('#', '');
                OpenAjax.hub.publish('line.discardChanges', {id:lineId});
                //OpenAjax.hub.publish('survey.render', {});
                tabs.tabs('remove', tabs.tabs('option', 'selected'));
            }
        }
        else{
            var tabs = $('#surveyBuilderTabs');
            tabs.tabs('remove', tabs.tabs('option', 'selected'));
        }
        ev.stopPropagation();
    },
    
    /**
     * Collection of subscriptions for events that should mark the tab as changed
     */
    
    'survey.created subscribe': function() {
    	steal.dev.log("Tabs: survey.updated");
    	this.markTabAsChanged('survey');
    	OpenAjax.hub.publish('buttons.enableSaveButton', {}); 
    },
    
    'survey.updated subscribe': function() {
    	steal.dev.log("Tabs: survey.updated");
    	this.markTabAsChanged('survey');
    	OpenAjax.hub.publish('buttons.enableSaveButton', {});
    },
    
    'line.updated subscribe': function(event, line) {
    	steal.dev.log("Tabs: line.updated");
		this.updateTitle(line); 
    	this.markTabAsChanged(line.id);
    	OpenAjax.hub.publish('buttons.enableSaveButton', {});
    },
    
    'line.destroyed subscribe': function(event, params) {
    	steal.dev.log("Tabs: line.destroy");
    	OpenAjax.hub.publish('buttons.enableSaveButton', {});
    },
    
    'lineitem.updated subscribe': function() {
    	steal.dev.log("Tabs: lineitem.updated");
    	this.markCurrentTabAsChanged();
    	OpenAjax.hub.publish('buttons.enableSaveButton', {});
    },
    
    'lineitem.destroyed subscribe': function() {
    	steal.dev.log("Tabs: lineitem.destroy");
    	this.markCurrentTabAsChanged();
    	OpenAjax.hub.publish('buttons.enableSaveButton', {});
    },
    
    'tabs.markTabAsChanged subscribe': function(event, params) {
    	this.markTabAsChanged(params.id);
    },
    /**
     * Mark a tab as changed
     * @param {Number} id the id of the tab to change
     */
    markTabAsChanged: function(id){
    	$('#surveyBuilderTabs a[href="#' + id + '"] .ui-icon-gear').show();
    	OpenAjax.hub.publish('buttons.enableSaveButton', {});
    },
    
    'survey.loadFinished subscribe': function(event, params) {
    	this.markTabsAsUnchanged();
    },
    
    'tabs.markTabsAsUnchanged subscribe': function(event, params) {
    	this.markTabsAsUnchanged();
    },
    
    /**
     * Remove all changed indicators from tabs
     */
    markTabsAsUnchanged: function() {
    	$('.ui-icon-gear').hide();
    },
    
    /**
     * Mark the currently selected tab as changed
     */
    markCurrentTabAsChanged: function(){
       $('.ui-tabs-selected .ui-icon-gear').show();
    }
    
});
