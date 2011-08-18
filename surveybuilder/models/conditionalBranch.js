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
		},
		
		getPredicateID: function(value) {
			if (!value) {
				return null;
			}
			
			var predicate = $.grep(Question.findAll(), function(el){return (el.attr("answerProperty") === value);})[0];
			
			if (predicate) {
				return predicate.id;
			}
			else {
				return null;
			}
		},
		
		getObjectID: function(predicateID, value) {
			if (!value) {
				return null;
			}
			var objects = $.grep(surveyBuilder.OBJECTS, function(val, i) {
				// filter out objects that aren't under the selected predicate
				return val.parent === predicateID;
			});
			
			var object = $.grep(objects, function(el){return (el.value === value);})[0];
			
			if (object) {
				return object.id;
			}
			else {
				return null;
			}
			
			
		},
		
		getOperandID: function(dataType, value, predicateID) {
			var id;
			if (value) {
				switch (dataType) {
					case 'survey:object':
						id = this.getObjectID(predicateID, value);
						break;
					case 'survey:predicate':
						id = this.getPredicateID(value);
						break;
					default:
						break;
				}
			}
			return id;
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
		},
		
		getLeftOperandID: function() {
			// TODO: breaks down if you have non-unique values
			if (!this.leftOperandID) {
				this.leftOperandID = this.Class.getOperandID(this.attr("leftOperandDataType"), this.attr("leftOperand"));
			}
			
			return this.leftOperandID
		},
		
		getRightOperandID: function() {
			if(!this.rightOperandID) {
				this.rightOperandID = this.Class.getOperandID(this.attr("rightOperandDataType"), this.attr("rightOperand"), this.getLeftOperandID());
			}
			
			return this.rightOperandID;
		},
		
		setLeftOperand: function(value) {
			if (this.leftOperand !== value) {
				this.leftOperandID = null;
				this.leftOperand = value;
			}
		},
		
		setRightOperand: function(value) {
			if (this.rightOperand !== value) {
				this.rightOperandID = null;
				this.rightOperand = value;
			}
		}
		
		
	}
);