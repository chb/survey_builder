steal.plugins(	
	'jquery/controller',			// a widget factory
	'jquery/controller/subscribe',	// subscribe to OpenAjax.hub
	'jquery/view/ejs',				// client side templates
	'jquery/model',					// Ajax wrappers
	'jquery/model/list',
	'jquery/dom/form_params')		// form data helper
	
	.css('resources/css/reset-min',
		'resources/facebox/facebox', 
		'resources/css/button-container/jquery-ui-1.8.14.custom', // jQuery UI theme for buttons 
		'resources/css/tabs-container/jquery-ui-1.8.14.custom', // jQuery UI theme for tabs
		'resources/css/survey-container/jquery-ui-1.8.14.custom', // jQuery UI theme for everything else
		'resources/css/main')	// loads styles, overwrites styles from right to left

	.resources('js/jquery-ui-1.8.10.custom.js')
    .resources('js/application.js')
    .resources('js/utils.js')
    .resources('js/jquery-json.js')
	.resources('js/jstorage.min.js')
    .resources('facebox/facebox.js')

	.models('survey',
			'questionType', 'answerType', 'logicComponentType', 
			'line', 
			'lineitem', 
			'answer', 'labelAnswer', 'textAnswer', 
			'question', 'simpleQuestion', 'selectOneQuestion', 'selectMultipleQuestion', 'gridSelectOneQuestion',
			'logicComponent', 'branch', 'conditionalBranch')	// load models

	.controllers('main', 'component_list', 'components','survey','line','tabs', 'lineitem', 'buttons', 'logicComponent', 'branch', 'lineitem_content')	// loads files in controllers folder

	.views();	// adds views to be added to build
