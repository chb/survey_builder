/**
 * @tag controllers, home
 */
$.Controller.extend('Surveybuilder.Controllers.LogicComponent',
/* @Static */
{
	onDocument: false
},
/* @Prototype */
{
	init: function(){
		steal.dev.log('loaded logic controller');
		// show possible branch targets
		var parentLine = Line.findOne({id:this.element.closest('.line').attr('id')});
		var currentLineitem = Lineitem.findOne({id:this.element.attr('id')});
		this.element.find('.branchTarget').html($.View('//surveybuilder/views/logicComponent/show_branchTargets', {lines:LINES, lineitem:currentLineitem, parentLine:parentLine}));
		// enable comboboxes
		var rightOperandSelector = this.element.find('.right-operand-dataType');
		this.configureCombobox(this.element.find('.leftOperand'), 'survey:predicate');
		this.configureCombobox(this.element.find('.rightOperand'), rightOperandSelector.val());
	},
	
	configureCombobox: function(el, dataType) {
		var operand = el.val();
		var name = el.attr('name');
		var parent = el.parent();
		switch (dataType) {
			case 'survey:object':
				parent.html($.View('//surveybuilder/views/logicComponent/show_branchOperand', {operand:operand, operandDatatype:dataType, name:name, options:surveyBuilder.OBJECTS}));
				parent.children().first().combobox();
				break;
			case 'survey:predicate':
				parent.html($.View('//surveybuilder/views/logicComponent/show_branchOperand', {operand:operand, operandDatatype:dataType, name:name, options:surveyBuilder.PREDICATES}));
				parent.children().first().combobox();
				break;
			default:
				parent.html($.View('//surveybuilder/views/logicComponent/show_branchOperand', {operand:operand, operandDatatype:dataType, name:name}));
				parent.children().first().combobox("destroy");
				break;
		}
	},
	
	'predicates.update subscribe': function(event, params) {
		lists = this.element.find('.predicate-list');
		for (var i=0; i < lists.length; i+=1) {
			this.configureCombobox($(lists[i]), 'survey:predicate');
		}
	},	

	'objects.update subscribe': function(event, params) {
		lists = this.element.find('.object-list');
		for (var i=0; i < lists.length; i+=1) {
			this.configureCombobox($(lists[i]), 'survey:object');
		}
	},

	'line.destroyed subscribe': function(event, params) {
		steal.dev.log('line.destroyed received in LogicComponent controller');
		var currentLineitem = Lineitem.findOne({id:this.element.attr('id')});  

		if (currentLineitem) {
			if (params.about == currentLineitem.attr('branchTarget'))  {
				// remove branch target if it is no longer an option
				currentLineitem.attr("branchTarget", null);
				currentLineitem.save();
			}
		}
		// update the drop-down list of branch targets
		this.element.find('option[value*="' + params.about + '"]').remove();

	},

	'line.updated subscribe': function(event, line) {
		steal.dev.log('line.updated received in LogicComponent controller');
		var currentLineitem = Lineitem.findOne({id:this.element.attr('id')});
		var parentLine = Line.findOne({id:this.element.closest('.parent').attr('id')});
		var branchTargetEl = this.element.find(".branchTarget");
		branchTargetEl.html($.View('//surveybuilder/views/logicComponent/show_branchTargets', {lines:LINES, lineitem:currentLineitem, parentLine:parentLine}));
	},

	".right-operand-dataType change": function(el, ev) {
		var operandEl = el.closest('.condition').find('.rightOperand');
		this.configureCombobox(operandEl, el.val());
	}
});
