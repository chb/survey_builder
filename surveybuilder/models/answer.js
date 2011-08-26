Lineitem.extend("Answer",
	/* @Static */
	{
		defaults: {
			type: "answer"
		},
		setup: function(baseClass){
			this.defaults = $.extend({}, baseClass.defaults, this.defaults)
		}
	},
	/* @Prototype */
	{
		/**
	    * Load in Answer specific information from an XML representation
	    * @param {Object} xml XML node to parse
	    */
		loadFromXML: function(xml) {
			if (xml) {
				this.attr('answerNote', SURVEY_UTILS.getElementText(xml, "answerNote"));
			}	
		}
	}
);