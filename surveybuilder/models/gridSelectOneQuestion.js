Question.extend("GridSelectOneQuestion",
	/* @Static */
	{
		defaults: {
			subType: "GridSelectOneQuestion",
			displayName: "Grid"
		},
		
		setup: function(baseClass){
			this.defaults = $.extend({}, baseClass.defaults, this.defaults);
		}	
	},
	/* @Prototype */
	{
		/**
	    * Load in GridSelectOneQuestion specific information from an XML representation
	    * @param {Object} xml XML node to parse
	    */
		loadFromXML: function(xml) {
			steal.dev.log("loading SelectOneQuestion from XML");
			if (xml) {
				//grab answers
				Lineitem.createFromXML(SURVEY_UTILS.getElements(SURVEY_UTILS.getElement(xml, 'GridAnswers'), 'rdf:li'), this);
				//grab questions
				Lineitem.createFromXML(SURVEY_UTILS.getElements(SURVEY_UTILS.getElement(xml, 'GridQuestions'), 'rdf:li'), this);
			}
			this._super(xml);
		},
		
		setChild: function(child) {
			//TODO: what about if setting a null child?
			if (child.type === 'question') {
				this.attr("childQuestionId", child.id);
			}
			else if (child.type === 'answer') {
				this.attr("childAnswerId", child.id);
			}
		}
	}
);