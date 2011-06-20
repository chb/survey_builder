steal.plugins(	
	'jquery/controller',			// a widget factory
	'jquery/controller/subscribe',	// subscribe to OpenAjax.hub
	'jquery/view/ejs',				// client side templates
	'jquery/model',					// Ajax wrappers
	'jquery/model/list',
	'jquery/dom/form_params')		// form data helper
	
	.css('resources/facebox/facebox', 'resources/css/SexyButtons/sexybuttons', 'resources/css/redmond/jquery-ui-1.8.6.custom', 'resources/css/main')	// loads styles, overwrites styles from right to left

	.resources('js/jquery-ui-1.8.10.custom.js')
    .resources('js/application.js')
    .resources('js/utils.js')
    .resources('js/jquery-json.js')
	.resources('js/jstorage.min.js')
    .resources('facebox/facebox.js')

	.models('survey','line', 'lineitem', 'question', 'answer', 'logicComponent')	// loads files in models folder 

	.controllers('main', 'component_list', 'components','survey','line','tabs', 'lineitem', 'buttons', 'logicComponent', 'branch', 'lineitem_content')	// loads files in controllers folder

	.views();	// adds views to be added to build
