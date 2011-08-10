Question.extend("SelectOneQuestion",
	/* @Static */
	{
		defaults: {
			subType: "SelectOneQuestion",
			displayName: "Multiple Choice"
		},
		
		setup: function(baseClass){
			this.defaults = $.extend({}, baseClass.defaults, this.defaults);
		}
	},
	/* @Prototype */
	{
		/**
	    * Load in SelectOneQuestion specific information from an XML representation
	    * @param {Object} xml XML node to parse
	    */
		loadFromXML: function(xml) {
			this._super(xml);
			if (xml) {
				this.attr('answerProperty', SURVEY_UTILS.getElementAttribute(xml, 'answerProperty', 'rdf:resource')); //TODO: should live in Question?
				this.attr('displayType', SURVEY_UTILS.getElementText(xml, "displayType"));
				this.attr('answersId', SURVEY_UTILS.getElementAttribute(xml, 'questionAnswers', 'rdf:resource'));
				
				//grab answers if needed
				if (!this.answersId) {
					Lineitem.createFromXML(SURVEY_UTILS.getElements(xml, 'rdf:li'), this);
				}
			}
		}
	}
);
					
					
					
					