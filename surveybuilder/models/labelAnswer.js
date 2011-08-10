Answer.extend("LabelAnswer",
	/* @Static */
	{
		defaults: {
			subType: "LabelAnswer",
			displayName: "Fixed Choice"
		},
		
		setup: function(baseClass){
			this.defaults = $.extend({}, baseClass.defaults, this.defaults)
		}
	},
	/* @Prototype */
	{
		/**
	    * Load in LabelAnswer specific information from an XML representation
	    * @param {Object} xml XML node to parse
	    */
		loadFromXML: function(xml) {
			this._super(xml);
			if (xml) {
				this.attr('answerText', SURVEY_UTILS.getElementText(xml, "answerText"));
				this.attr('answerObject', SURVEY_UTILS.getElementAttribute(xml, 'answerObject', 'rdf:resource'));
			}
		}
	}
);