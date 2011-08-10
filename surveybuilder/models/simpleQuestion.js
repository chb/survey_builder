Question.extend("SimpleQuestion",
	/* @Static */
	{
		defaults: {
			subType: "SimpleQuestion",
			displayName: "Simple"
		},
		
		setup: function(baseClass){
			this.defaults = $.extend({}, baseClass.defaults, this.defaults);
		}
	},
	/* @Prototype */
	{
		/**
	    * Load in SimpleQuestion specific information from an XML representation
	    * @param {Object} xml XML node to parse
	    */
		loadFromXML: function(xml){
			if (xml) {
				this.attr('answerProperty', SURVEY_UTILS.getElementAttribute(xml, 'answerProperty', 'rdf:resource'));
				this.attr('dataType', SURVEY_UTILS.getElementAttribute(xml, 'datatype', 'rdf:resource'));
				this.attr('answerLabel', SURVEY_UTILS.getElementText(xml, "answerLabel"));
				this.attr('answerNote', SURVEY_UTILS.getElementText(xml, "answerNote"));
			}
			this._super(xml);
		}
	}
);