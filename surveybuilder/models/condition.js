LogicComponent.extend("Condition",
	/* @Static */
	{
		defaults: {
			subType: "Condition",
			displayName: "Condition",
			leftOperandDataType: "survey:predicate",
			logicOperator: "AND"
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
		* Load in Condition specific information from an XML representation
		* Currently we support a subset of expression trees, where rightOperands
		* are restricted to being only a single condition deep.  This reflects 
		* what is possible with the builder, and allows us to group the logic 
		* operator and the rightOperand into a single Condition model.  We 
		* construct the chain of Condition objects in reverse order from 
		* how they appear in the xml.
		* @param {Object} xml XML node to parse
		*/
		loadFromXML: function(xml, parent) {
			if (xml) {
				// for now, all <condition> tags contain <Condition>s, with 
				// no rdf:resource support 
				var operator = SURVEY_UTILS.getChildElement(xml, 'operator');
				var leftOperand = SURVEY_UTILS.getChildElement(xml, 'leftOperand');
				var rightOperand = SURVEY_UTILS.getChildElement(xml, 'rightOperand');
				var leftOperandIsCondition = false;
				var rightOperandIsCondition = false;
				
				// operator
				this.attr('operator', SURVEY_UTILS.getElementTextHTMLEncoded(operator, 'value'));
				
				// leftOperand
				var leftConditionXML = SURVEY_UTILS.getChildElement(leftOperand, 'Condition');
				if (leftConditionXML) {
					// leftOperand is a Condition
					leftOperandIsCondition = true;
					var leftCondition = new Condition;
					this.setPrev(leftCondition);
					leftCondition.setNext(this);
					leftCondition.loadFromXML(leftConditionXML, parent);
					leftCondition.save();
				}
				else {
					// leftOperand is an Operand
					this.attr('leftOperandDataType', SURVEY_UTILS.getElementText(leftOperand, 'datatype'));
					if (this.leftOperandDataType === 'survey:predicate' || this.leftOperandDataType === 'survey:object') {
						this.attr('leftOperand', SURVEY_UTILS.getElementAttribute(leftOperand, 'value', 'rdf:resource'));
					}
					else {
						this.attr('leftOperand', SURVEY_UTILS.getElementText(leftOperand, "value"));
					}
				}
				
				// rightOperand
				var rightConditionXML = SURVEY_UTILS.getChildElement(rightOperand, 'Condition');
				if (rightConditionXML) {
					// rightOperand is a Condition
					rightOperandIsCondition = true;
					if (leftOperandIsCondition) {
						this.logicOperator = this.attr("operator");
						// load condition from rightCondition
						this.loadFromXML(rightConditionXML);
					}
					else
					{
						alert("ERROR: rightOperand is a condition, but leftOperand is not.  Not currently supported");
					}
				}
				else {
					// rightOperand is an Operand
					this.attr('rightOperandDataType', SURVEY_UTILS.getElementText(rightOperand, 'datatype'));
					if (this.rightOperandDataType === 'survey:predicate' || this.rightOperandDataType === 'survey:object') {
						this.attr('rightOperand', SURVEY_UTILS.getElementAttribute(rightOperand, 'value', 'rdf:resource'));
					}
					else {
						this.attr('rightOperand', SURVEY_UTILS.getElementText(rightOperand, "value"));
					}
				}
			}
			this._super(xml);
			
			if (!leftOperandIsCondition && !rightOperandIsCondition && parent) {
				parent.setChild(this);		
				this.setParent(parent);
				parent.save();		
			}
			this.save();
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
		
		setLeftOperand: function(value, success, error) {
			if (this.leftOperand !== value) {
				this.leftOperandID = null;
				this.leftOperand = value;
			}
			if (success) {
				success();
			}
		},
		
		setRightOperand: function(value, success, error) {
			if (this.rightOperand !== value) {
				this.rightOperandID = null;
				this.rightOperand = value;
			}
			if (success) {
				success();
			}
		}
		
	}
);