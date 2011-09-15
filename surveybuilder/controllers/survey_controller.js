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
    			// attach components and tabs controller after everything has loaded
    			$('#components').surveybuilder_components();
    			$('.ui-tabs-nav').surveybuilder_tabs();
    			
    			OpenAjax.hub.publish('survey.render', {});
    			var mainLine = Line.findOne({about:Survey.findOne({id:1}).surveyLine});
    			OpenAjax.hub.publish('tabs.openLine', {id:mainLine.id});
    			OpenAjax.hub.publish('survey.loadFinished', {});
    		},
    		//error
    		function(){
    			alert('ERROR: failed to load survey');
    			OpenAjax.hub.publish('survey.loadFailed', {});
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
        $('#surveyBuilderTabs').tabs('add' , "#export" , 'RDF/XML');
    },
    ".survey-form input keyup": function(el, ev){
        this.surveyFormChange(el, ev);
    },
    ".survey-form input blur": function(el, ev){
        this.surveyFormChange(el, ev);
    },
    ".survey-form input change": function(el, ev){
        this.surveyFormChange(el, ev);
    },
    ".survey-form textarea keyup": function(el, ev){
        this.surveyFormChange(el, ev);
    },
    ".survey-form textarea blur": function(el, ev){
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
        var name = el.attr("name");
        if (el.attr('type') == 'checkbox') {
        	// checkbox
        	if (!el.attr('checked')) {
				// unset the attribute if unchecked
	        	survey.attr(name, null);
        	}
        	survey.save();
        }
        else {
        	// other
        	var newValue = SURVEY_UTILS.htmlEncode(el.val());
        	var oldValue = survey.attr(name);
        	if (name && oldValue !== newValue) {
		        survey.attr(name, 
		        			newValue, 
		        			function(){
								//success
								el.closest('.attribute').removeClass("error");
								el.siblings(".help-inline").remove();
								if (!(!oldValue && newValue === "")) {
										// don't save if trying to replace null/undefined with the empty string
										this.save();
									}
							}, 
							function(errors){
								//error
								el.closest('.attribute').addClass("error");
								// remove any old errors and display new
								el.siblings(".help-inline").remove();
								el.after($.View('//surveybuilder/views/error/validation', {message:errors[name][0]}));
	        	});
        	}
        }
        return false;
    },
    
    /*
     * Handlers for static Lineitem events
	 */ 
	'lineitem.movedInDom subscribe': function(event, params) {
    	Surveybuilder.Controllers.Lineitem.lineitemMovedInDom(params.el, params.isDelete, params.showValidationErrors);
    },
    	
	'lineitem.deleteRecursive subscribe': function(event, params) {
    	Surveybuilder.Controllers.Lineitem.lineitemDeleteRecursive(params.lineitem);
    },
   
	/*
     * Handlers for static Line events
	 */ 
    "line.destroyed subscribe": function(event, line){
		// delete any branches to this line
		branches = Branch.findByLine(line);		
		Surveybuilder.Controllers.Lineitem.deleteBranches(branches);
    },
    
    'line.discardChanges subscribe': function(event, params) {
    	Surveybuilder.Controllers.Line.discardChanges(params.id);
    },
    
    "predicates.update subscribe": function(event, params) {
    	this.updateOperands(params.id, params.value);
    },
    
    "objects.update subscribe": function(event, params) {
    	this.updateOperands(params.id, params.value);
    },
    
    updateOperands: function(id, value) {
    	var conditionalBranches = ConditionalBranch.findAll();
    	for (var i = 0; i < conditionalBranches.length; i++) {
			// update operands if they referenced the updated object
    		if (conditionalBranches[i].getLeftOperandID() == id) {
    			conditionalBranches[i].attr("leftOperand", value);
    		}
    		if (conditionalBranches[i].getRightOperandID() == id) {
    			conditionalBranches[i].attr("rightOperand", value);
    		}
    	}
    }
});
