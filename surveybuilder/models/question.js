Lineitem.extend("Question",
	/* @Static */
	{
		defaults: {
			type: "question"
		},
		setup: function(baseClass){
			this.defaults = $.extend({}, baseClass.defaults, this.defaults)
		}
	},
	/* @Prototype */
	{
		/**
	    * Load in Question specific information from an XML representation
	    * @param {Object} xml XML node to parse
	    */
		loadFromXML: function(xml) {
			if (xml) {
				this.attr('about', xml.attr('rdf:about'));
				this.attr('questionText', SURVEY_UTILS.getElementText(xml, "questionText"));
				this.attr('defaultAnswerForEstimation', SURVEY_UTILS.getElementText(xml, "defaultAnswerForEstimation"));
			}
		},
		
		setAnswerProperty : function(newAnswerProperty) {
			// initial autocomplete hack
			Lineitem.updatePredicates(this.id, newAnswerProperty);
			return newAnswerProperty;
		}
	}
);