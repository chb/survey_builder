Answer.extend("LabelAnswer",
	/* @Static */
	{
		defaults: {
			subType: "LabelAnswer",
			displayName: "Fixed Choice",
			datatype: "RDF"
		},
		
		setup: function(baseClass){
			this.defaults = $.extend({}, baseClass.defaults, this.defaults)
		},
		
		init : function(){
			this.validatePresenceOf("answerText", {message:"required"});
			this.validatePresenceOf("answerObject", {message:"required"});
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
				var rdfResource = SURVEY_UTILS.getElementAttribute(xml, 'answerObject', 'rdf:resource');
				if (rdfResource) {
					this.attr('answerObject', rdfResource);
					this.attr('datatype', SURVEY_UTILS.RDF);
				}
				else {
					var datatype = SURVEY_UTILS.getElementAttribute(xml, 'answerObject', 'rdf:datatype');
					if (datatype) {
						switch (datatype) {
							case SURVEY_UTILS.BOOLEAN:
							case SURVEY_UTILS.INTEGER:
							case SURVEY_UTILS.DECIMAL:
								this.attr('datatype', datatype);
								break;
							default:
								alert("unsupported datatype for LabelAnswer: " + datatype);
						}
						this.attr('answerObject', SURVEY_UTILS.getElementText(xml, "answerObject"));
					}
					else {
						// no datatype or resource, default to RDF
						this.attr('answerObject', null);
						this.attr('datatype', SURVEY_UTILS.RDF);
					}
				}
			}
		}
	}
);