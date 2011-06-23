/**
 * @tag models, home
 * Represents a Survey
 */
$.Model.extend('Survey',
/* @Static */
{
	listType:  $.Model.List,
    /**
     * Retrieves a Survey 
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped Survey objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    findOne : function(params, success, error){
    	steal.dev.log("findOne on survey");
    	if (params.id) {
    		return Survey.list.get(params.id)[0]; //TODO why is list.get returning an array?
    	}
    	else {
    		return null;
    	}
    },
    /**
     * Updates a Survey's data.
     * @param {String} id A unique id representing your Survey.
     * @param {Object} attrs Data to update your Survey with.
     * @param {Function} success a callback function that indicates a successful update.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    update : function(id, attrs, success, error){
        //Since we are using $.Model.list to store Surveys, just return the model from the list
		survey = Survey.findOne({id:id});
		if (success) {
			success(survey);
		}
		return survey
    },
    /**
     * Creates a Survey.
     * @param {Object} attrs A Survey's attributes.
     * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    create : function(attrs, success, error){
    	if (Survey.findOne(1)) {
    		// currently hard-coded for a single survey, so throw error if we are trying to create another
    		if (error) {
    			error();
    		}
    		alert("ERROR: tried to create second survey");
    	}
    	else {
    		// NOTE: The success callback passed in by $.Model.save() will update the  
			// calling model with the new id, which will in turn add it to our
			// $.Model.list store.  Because of this, we do not create a new instance
			// of Line here, since it would end up being duplicated in our store.
			attrs.id = 1;
			if (success) {
				success(attrs);
			}
		}
    },
    /**
     * Save off survey builder definition using the provided data connector
     * @param {Number} id The id of the survey to save off
     * @param {function} success callback function that indicates a successful remote save
     * @param {function} error callback function that should be called on failure
     */
    saveRemote : function(id, success, error){
    	DATA_CONNECTOR.save_survey(id, $.View('//surveybuilder/views/survey/show_rdf', {survey:Survey.findOne({id:1}), lines:Line.findAll(), date:new Date()}).replace(/^\s*[\n\f\r]/gm, ''), success, error); 
    },
    /**
     * Save off the Survey and all of its components to local cache.
     */
    saveToCache : function() {
    	$.jStorage.set('survey', Survey.findOne({id:1}).attrs());
    	Line.saveAllToCache();
		Lineitem.saveAllToCache();
    },
    /**
     * Load survey builder definition using the provided data connector
     * @param {Number} id The id of the survey to load
     * @param {function} success callback function that indicates a successful remote load
     * @param {function} error callback function that should be called on failure
     */
    loadRemote : function(id, success, error){
    	DATA_CONNECTOR.get_survey(id,
    		function(surveyRDF){
    			Survey.loadFromXML(surveyRDF, success, error);
    		},
    		error
    	);
	},
	
	loadFromXML: function(xml, success, error){
		steal.dev.log("Survey.loadFromXML");
		if (jQuery.isXMLDoc(xml)) {
			steal.dev.log("This is an xml doc");
		}
		else {
			steal.dev.log("This is not an xml doc");
		}
		
		survey = new Survey();
		survey.attr('type', 'survey');
		var root = jQuery(xml).find('[nodeName="Survey"]').first();
		var name = SURVEY_UTILS.getElementText(root, "id");
		survey.attr('name', name);
		var RDF = jQuery(root).find('[nodeName="rdf:RDF"]');
		survey.attr('xmlBase', RDF.attr('xml:base')); 
		var surveyRDF = RDF.find('[nodeName="Survey"]');
		survey.attr('title', SURVEY_UTILS.getElementText(surveyRDF, "dc:title"));
		//survey.attr('description', SURVEY_UTILS.getElementText(surveyRDF, "")); TODO
		survey.attr('creator', SURVEY_UTILS.getElementText(surveyRDF, "dc:creator"));
		//survey.attr('language', SURVEY_UTILS.getElementText(surveyRDF, "")); TODO
		survey.attr('contactEmail', SURVEY_UTILS.getElementText(surveyRDF, "contactEMail"));
		survey.attr('introText', SURVEY_UTILS.getElementText(surveyRDF, "introText"));
		survey.attr('completedMessage', SURVEY_UTILS.getElementText(surveyRDF, "completedMessage"));
		survey.attr('deident', SURVEY_UTILS.getElementText(surveyRDF, "showDeIdentifiedMessage"));
		survey.attr('reviewAnswers', SURVEY_UTILS.getElementText(surveyRDF, "reviewAnswers"));
		survey.attr('questionsPerPage', SURVEY_UTILS.getElementText(surveyRDF, "questionsPerPage"));
		survey.attr('mainLineTitle', SURVEY_UTILS.getElementText(surveyRDF, "mainLineTitle"));
		survey.attr('surveyLine', SURVEY_UTILS.getElementAttribute(surveyRDF, 'surveyLine', 'rdf:resource'));
		survey.save();
		
		//only grab the top level Lines
		var mainLine;
		RDF.children().filter('[nodeName="Line"]').each(function(index) { 
			Line.loadFromXML($(this));
		});
		
		//resolve branch displayNames and lineIds
		Lineitem.findAll({},function(lineitems) {
			steal.dev.log("resolving branch displayNames and lineIds")
			for (var id in lineitems) {
				if (lineitems[id].type === 'branch') {
					var branchTarget = Line.findOne({about:lineitems[id].about});
					if (branchTarget) {
						lineitems[id].attr('displayName', branchTarget.title);
						lineitems[id].attr('lineId', branchTarget.id);
						lineitems[id].save();
					}
				}
			}
			
		});
		
		// populate cache
		Survey.saveToCache();
		
		success(); 
	}
},
/* @Prototype */
{})
