Answer.extend("TextAnswer",
	/* @Static */
	{
		defaults: {
			subType: "TextAnswer",
			displayName: "Free Text"
		},
		
		setup: function(baseClass){
			this.defaults = $.extend({}, baseClass.defaults, this.defaults)
		}
	},
	/* @Prototype */
	{
		/**
	    * Load in TextAnswer specific information from an XML representation
	    * @param {Object} xml XML node to parse
	    */
		loadFromXML: function(xml) {
			this._super(xml, parent);
			if (xml) {
				this.attr('answerLabel', SURVEY_UTILS.getElementText(xml, "answerLabel"));
			}
		}
	}
);