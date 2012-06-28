/**
 * @tag controllers, home
 */
$.Controller.extend('Surveybuilder.Controllers.Condition',
/* @Static */
{
	onDocument: false
},
/* @Prototype */
{
	init: function(){
		steal.dev.log('loaded condition controller');
		
		// enable comboboxes
		var rightOperandSelector = this.element.find('.right-operand-dataType');
		this.configureCombobox(this.element.find('.leftOperand'), 'survey:predicate');
		this.configureCombobox(this.element.find('.rightOperand'), rightOperandSelector.val());
	},
	
	configureCombobox: function(el, dataType, options) {
		var operand = el.val();
		var name = el.attr('name');
		switch (dataType) {
			case 'survey:object':
				var operandID = el.find("option:selected").attr("data-object-id");
				var selectedPredicateID = el.closest('.condition').find('.leftOperand option:selected').attr("data-predicate-id");
				var options = $.map(surveyBuilder.OBJECTS, function(val, i) {
					// filter out objects that aren't under the selected predicate
					return (val.parent === selectedPredicateID) ? val : null;
				});
				$($.View('//surveybuilder/views/logicComponent/show_branchOperand', {operand:{value:operand, id:operandID}, operandDatatype:dataType, name:name, options:options})).replaceAll(el).combobox();
				break;
			case 'survey:predicate':
				var operandID = el.find("option:selected").attr("data-predicate-id");
				$($.View('//surveybuilder/views/logicComponent/show_branchOperand', {operand:{value:operand, id:operandID}, operandDatatype:dataType, name:name, options:surveyBuilder.PREDICATES})).replaceAll(el).combobox();
				break;
			default:
				$($.View('//surveybuilder/views/logicComponent/show_branchOperand', {operand:{value:operand, id:null}, operandDatatype:dataType, name:name})).replaceAll(el);
				break;
		}
	},
	
	'predicates.update subscribe': function(event, params) {
		var lists = this.element.find('.predicate-list');
		for (var i=0; i < lists.length; i+=1) {
			this.configureCombobox($(lists[i]), 'survey:predicate');
		}
	},	

	'objects.update subscribe': function(event, params) {
		var lists = this.element.find('.object-list');
		for (var i=0; i < lists.length; i+=1) {
			this.configureCombobox($(lists[i]), 'survey:object');
		}
	},

	".leftOperand change": function(el, ev) {
		var currentLineitem = Lineitem.findOne({id:el.closest(".lineitem").attr('id')});
		var leftOperandClassName = Lineitem.findOne({id:el.closest('.lineitem').find('.leftOperand option:selected').attr("data-predicate-id")}).Class.fullName;
		// update operators based on selected operand
		var operandElement = el.siblings(".branchOperation");
		operandElement.html($.View('//surveybuilder/views/logicComponent/show_branchOperations', {lineitem:currentLineitem, leftOperandClassName:leftOperandClassName}));
		
		var condition = el.closest('.condition');
		var dataType = condition.find('.right-operand-dataType').val();
		var operandEl = el.closest('.condition').find('.rightOperand');
		this.configureCombobox(operandEl, dataType);
	},

	".right-operand-dataType change": function(el, ev) {
		var operandEl = el.closest('.condition').find('.rightOperand');
		this.configureCombobox(operandEl, el.val());
	},
	
	".logical-operator click": function(el, ev) {
		var currentLineitem = Lineitem.findOne({id:el.closest(".lineitem").attr('id')});
		var newValue = "";
		if (el.text() === "AND") {
			newValue = "OR";
		}
		else {
			newValue = "AND";
		}
		el.text(newValue);
		currentLineitem.attr('logicOperator', newValue);
		currentLineitem.save();
		return false;
	}
});
