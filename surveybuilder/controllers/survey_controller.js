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
    'survey.load subscribe': function(event, params) {
    	DATA_CONNECTOR = params['data_connector'];
    	this.loadSurvey(params['id'], 
    	    //success
    		function(){
    			OpenAjax.hub.publish('survey.render', {});
    			var mainLine = Line.findOne({about:Survey.findOne({id:1}).surveyLine});
    			OpenAjax.hub.publish('tabs.openLine', {id:mainLine.id});
    			OpenAjax.hub.publish('survey.loadFinished', {});
    		},
    		//error
    		function(){
    			alert('ERROR: failed to load survey');
    		});
    },

    /**
     * Load in the Survey
     */
    loadSurvey: function(id, success, error){
        Survey.loadRemote(id, success, error);
    },
    'survey.render subscribe': function(event, params) {
    	this.render();
    },
    
    /**
     * Display the survey
     */
    render: function(){
        var surveyDiv = $('#survey').html($.View('//surveybuilder/views/survey/show', {survey:Survey.findOne({id:1})}));
        
        // add controller(s) to all the rendered lineitems
        $('#survey .lineitem').surveybuilder_lineitem();
        $('#survey .logicComponent').surveybuilder_logic_component();
        $('#survey .branch').surveybuilder_branch();
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

		//add in an export tab and populate with exported survey
        $('.ui-tabs-nav').after('<div id="export"><textarea >' + $.View('//surveybuilder/views/survey/show_rdf', {survey:Survey.findOne({id:1}), lines:Line.findAll(), date:new Date()}).replace(/^\s*[\n\f\r]/gm, '') + '</textarea></div>');
        $('#surveyBuilderTabs').tabs('add' , "#export" , 'export');
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
        survey.save();
        ev.stopPropagation();
    },
    
    /*
     * Handlers for static Lineitem events
	 */ 
	'lineitem.movedInDom subscribe': function(event, params) {
    	Surveybuilder.Controllers.Lineitem.lineitemMovedInDom(params.el, params.isDelete);
    },
    	
	'lineitem.deleteRecursive subscribe': function(event, params) {
    	Surveybuilder.Controllers.Lineitem.lineitemDeleteRecursive(params.lineitem);
    },
   
	/*
     * Handlers for static Line events
	 */ 
    "line.destroyed subscribe": function(event, params){
		// delete any branches to this line		
		Lineitem.findAll({lineId:params.id}, Surveybuilder.Controllers.Lineitem.deleteBranches);
		
    },
    
    'line.discardChanges subscribe': function(event, params) {
    	Surveybuilder.Controllers.Line.discardChanges(params.id);
    }   
});
