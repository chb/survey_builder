steal('jquery/jquery.js',
	'jquery/controller',			// a widget factory
	'jquery/controller/subscribe',	// subscribe to OpenAjax.hub
	'jquery/view/ejs',				// client side templates
	'jquery/model',					// Ajax wrappers
	'jquery/model/list',
	'jquery/dom/form_params',		// form data helper
	'jquery/model/validations')
	
	
	.then('./resources/facebox/facebox.css') // Facebox for modals  TODO: replace with Bootstrap modals
	.then('./resources/css/bootstrap-1.2.0.min.css') // Twitter Bootstrap 
	.then('./resources/css/jqueryui-custom/jquery-ui-1.8.14.custom.css') // jQuery UI theme 
	.then('./resources/css/main.css')	

	.then('./resources/js/jquery-ui-1.8.10.custom.js')
    .then('./resources/js/application.js')
    .then('./resources/js/utils.js')
    .then('./resources/js/jquery-json.js')
	.then('./resources/js/jstorage.min.js')
    .then('./resources/facebox/facebox.js')

	.then('./models/survey',
		  './models/questionType', 
		  './models/answerType', 
		  './models/logicComponentType', 
		  './models/line', 
		  './models/lineitem') 
	.then('./models/answer', 
		  './models/question', 
		  './models/logicComponent')
	.then('./models/labelAnswer', 
		  './models/textAnswer', 
		  './models/simpleQuestion', 
		  './models/selectOneQuestion', 
		  './models/selectMultipleQuestion', 
		  './models/gridSelectOneQuestion',
		  './models/branch', 
		  './models/conditionalBranch')	

	.then('./controllers/main_controller.js', 
		  './controllers/component_list_controller.js', 
		  './controllers/components_controller.js',
		  './controllers/survey_controller.js',
		  './controllers/line_controller.js',
		  './controllers/tabs_controller.js', 
		  './controllers/lineitem_controller.js', 
		  './controllers/buttons_controller.js', 
		  './controllers/logicComponent_controller.js', 
		  './controllers/branch_controller.js', 
		  './controllers/lineitem_content_controller.js')	// loads files in controllers folder

	.then('./views/lineitem/_move.ejs',
		  './views/lineitem/show_rdf.ejs',
		  './views/lineitem/show.ejs',
		  './views/line/listAsButtons.ejs',
		  './views/line/show_min.ejs',
		  './views/line/list.ejs',
		  './views/line/show_line_rdf.ejs',
		  './views/line/show.ejs',
		  './views/components/show.ejs',
		  './views/info/show.ejs',
		  './views/questionType/list.ejs',
		  './views/questionType/show.ejs',
		  './views/logicComponent/show_branchObjects.ejs',
		  './views/logicComponent/show_ConditionalBranch.ejs',
		  './views/logicComponent/show_branchOperations.ejs',
		  './views/logicComponent/show_branchOperand.ejs',
		  './views/logicComponent/show_branchProperties.ejs',
		  './views/logicComponent/show_Branch_rdf.ejs',
		  './views/logicComponent/show_ConditionalBranch_rdf.ejs',
		  './views/logicComponent/show_condition.ejs',
		  './views/logicComponent/show_Branch.ejs',
		  './views/logicComponent/show_branchOperandTypes.ejs',
		  './views/logicComponent/show_branchTargets.ejs',
		  './views/common/textarea.ejs',
		  './views/common/textInput.ejs',
		  './views/logicComponentType/list.ejs',
		  './views/logicComponentType/show.ejs',
		  './views/buttons/show.ejs',
		  './views/error/validation.ejs',
		  './views/question/show_SelectOneQuestion.ejs',
		  './views/question/show_GridSelectOneQuestion.ejs',
		  './views/question/show_SelectMultipleQuestion.ejs',
		  './views/question/show_SelectOneQuestion_rdf.ejs',
		  './views/question/show_GridSelectOneQuestion_rdf.ejs',
		  './views/question/show_SelectMultipleQuestion_rdf.ejs',
		  './views/question/show_SimpleQuestion_rdf.ejs',
		  './views/question/show_SimpleQuestion.ejs',
		  './views/survey/show_rdf.ejs',
		  './views/survey/show.ejs',
		  './views/answer/show_LabelAnswer.ejs',
		  './views/answer/show_LabelAnswer_rdf.ejs',
		  './views/answer/show_answerObject.ejs',
		  './views/answer/show_TextAnswer.ejs',
		  './views/answer/show_TextAnswer_rdf.ejs',
		  './views/main/show.ejs',
		  './views/tabs/show.ejs',
		  './views/answerType/list.ejs',
		  './views/answerType/show.ejs');

