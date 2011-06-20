/**
 * @tag controllers, home
 */
$.Controller.extend('Surveybuilder.Controllers.Main',
/* @Static */
{
    onDocument: true
},
/* @Prototype */
{
    init: function(){
    	surveyBuilder = {};
        HIDEHOWTO = $.jStorage.get('hideHowto');
        surveyBuilder['PREDICATES'] = [];
        surveyBuilder['PREDICATE_MAP'] = {};
        surveyBuilder['OBJECTS'] = [];
        surveyBuilder['OBJECT_MAP'] = {};
    },
    
    'survey.open subscribe': function(event, params) {
    	//render main layout
    	$('#surveyContainer').html($.View('//surveybuilder/views/main/show', {}));
    	
    	//attach controllers
		$('#components').surveybuilder_components();
		$('#survey').surveybuilder_survey();
		$('.ui-tabs-nav').surveybuilder_tabs();
		$('#buttons').surveybuilder_buttons();
		
		//init survey load
		OpenAjax.hub.publish('survey.load', {data_connector:params['data_connector'], id:params['id']});
    }
});



