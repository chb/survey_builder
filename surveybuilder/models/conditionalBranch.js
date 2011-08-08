LogicComponent.extend("ConditionalBranch",
	/* @Static */
	{
		defaults: {
			subType: "ConditionalBranch",
			displayName: "Conditional Branch",
			leftOperandDataType: "survey:predicate"
		},
		
		setup: function(baseClass){
			this.defaults = $.extend({}, baseClass.defaults, this.defaults)
		}
	},
	/* @Prototype */
	{
		/**
	    * Load in ConditionalBranch specific information from an XML representation
	    * @param {Object} xml XML node to parse
	    */
		loadFromXML: function(xml) {
			if (xml) {
				this.attr('branchTarget', SURVEY_UTILS.getElementAttribute(xml, 'line', 'rdf:resource'));
				// TODO: for now we only have a single condition and are 
				// treating it as a part of this Model
				var operator = SURVEY_UTILS.getElement(xml, 'operator');
				var leftOperand = SURVEY_UTILS.getElement(xml, 'leftOperand');
				var rightOperand = SURVEY_UTILS.getElement(xml, 'rightOperand');
				this.attr('operator', SURVEY_UTILS.getElementTextHTMLEncoded(operator, 'value'));
				this.attr('leftOperandDataType', SURVEY_UTILS.getElementText(leftOperand, 'datatype'));
				if (this.leftOperandDataType === 'survey:predicate' || this.leftOperandDataType === 'survey:object') {
					this.attr('leftOperand', SURVEY_UTILS.getElementAttribute(leftOperand, 'value', 'rdf:resource'));
				}
				else {
					this.attr('leftOperand', SURVEY_UTILS.getElementText(leftOperand, "value"));
				}
				this.attr('rightOperandDataType', SURVEY_UTILS.getElementText(rightOperand, 'datatype'));
				if (this.rightOperandDataType === 'survey:predicate' || this.rightOperandDataType === 'survey:object') {
					this.attr('rightOperand', SURVEY_UTILS.getElementAttribute(rightOperand, 'value', 'rdf:resource'));
				}
				else {
					this.attr('rightOperand', SURVEY_UTILS.getElementText(rightOperand, "value"));
				}
			}
			this._super(xml);
		}
	}
);