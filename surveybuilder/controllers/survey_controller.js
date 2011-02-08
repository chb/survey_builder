/**
 * @tag controllers, home
 */
$.Controller.extend('Surveybuilder.Controllers.Survey',
/* @Static */
{
    onDocument: false
},
/* @Prototype */
{
    /**
     * Loads in the Survey and then renders it.
     */
    load: function(){
        Survey.loadRemote();
        if (!SURVEY){
            new Survey().save();
            SURVEY = Survey.findOne({id:"1"});
        }
        else{
            Lineitem.loadAll();
        }
    	this.list();
    },
    
    'survey.list subscribe': function(event, params) {
    	this.list();
    },
    
    /**
     * Display the survey
     */
    list: function(){
        var surveyDiv = $('#survey').html(this.view('show', {survey:SURVEY}));
        // add controller(s) to all the rendered lineitems
        $('#survey .lineitem').surveybuilder_lineitem();
        $('#survey .logicComponent').surveybuilder_logic_component();
        $('#survey .branch').surveybuilder_branch();
        // make the content divs sortable
        OpenAjax.hub.publish('tabs.makeSortable', {'el':surveyDiv.find('.line-items'), connectWith:'.line-items'});
        OpenAjax.hub.publish('tabs.makeSortable', {'el':surveyDiv.find('.sub-questions'), connectWith:'.sub-questions'});
        OpenAjax.hub.publish('tabs.makeSortable', {'el':surveyDiv.find('.grid-answers'), connectWith:'.grid-answers'});
  		OpenAjax.hub.publish('tabs.makeSortable', {'el':surveyDiv.find('.answers'), connectWith:'.answers'});
    },
    
    'survey.export subscribe': function(event, params) {
    	this.exportSurvey();
    },
    
    /**
     * Opens up a new tab with the exported XML version of the survey that is readable by the SurveyClient
     */
    exportSurvey: function(){
        if ($('#export').length > 0) {
            // close the existing export tab if it exists
      		OpenAjax.hub.publish('tabs.close', {id:'export'});      
        }

        $('.ui-tabs-nav').after('<div id="export"><button id="saveExport" class="sexybutton sexysimple"><span class="download2">Save Export</button><textarea >' + this.view('show_rdf', {survey:SURVEY, lines:LINES, date:new Date()}).replace(/^\s*[\n\f\r]/gm, '') + '</textarea></div>');
        $('#tabs').tabs('add' , "#export" , 'export');
    },
    ".survey-form input change": function(el, ev){
        this.surveyFormChange(el, ev);
    },
    ".survey-form select change": function(el, ev){
        this.surveyFormChange(el, ev);
    },
    /**
     * Update the local Survey model when a form item changes
     */
    surveyFormChange: function(el, ev){
        var survey = Survey.findOne({id:"1"});
        if (el.attr('type') == 'checkbox' && !el.attr('checked')) {
			// unset the attribute if a checkbox was unchecked
        	survey.attr(el.attr("name"), null);
        }
        else {
	        survey.attr(el.attr("name"), el.val());
        }
        survey.update();
        ev.stopPropagation();
    },
    
    /*
     * Handlers for Lineitem events
	 */ 
	'lineitem.movedInDom subscribe': function(event, params) {
    	Surveybuilder.Controllers.Lineitem.lineitemMovedInDom(params.el, params.isDelete);
    },
    
    'lineitem.discardChanges subscribe': function(event, params) {
    	Surveybuilder.Controllers.Lineitem.discardChanges(params.id);
    },
    	
	'lineitem.deleteRecursive subscribe': function(event, params) {
    	Surveybuilder.Controllers.Lineitem.lineitemDeleteRecursive(params.lineitem);
    },
   
	/*
     * Handlers for Line events
	 */ 
        
    
    'line.updated subscribe' : function(event, line){
    	// update tab showing the Line
		Surveybuilder.Controllers.Tabs.updateTitle(line); 
		
		// update any Logic Components that use this Line
        Line.findAll({}, function(lines) {
        	OpenAjax.hub.publish('logicComponent.updateLines', {lines:lines});     
        });
        
        // update branches  
        OpenAjax.hub.publish('branch.updatedLine', line); 
    },
    
    "line.destroyed subscribe": function(event, line){
		// delete any branches to this line		
		Lineitem.findAll({lineId:line}, Surveybuilder.Controllers.Lineitem.deleteBranches);
		
		// update any logic components that depend on this line
        Line.findAll({}, function(lines) {
        	OpenAjax.hub.publish('logicComponent.updateLines', {lines:lines});     
        });
    },
    
    'line.discardChanges subscribe': function(event, params) {
    	Surveybuilder.Controllers.Line.discardChanges(params.id);
    },
   
});
