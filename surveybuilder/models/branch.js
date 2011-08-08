LogicComponent.extend("Branch",
	/* @Static */
	{
		defaults: {
			subType: "Branch",
			displayName: "Branch To"
		},
		
		setup: function(baseClass){
			this.defaults = $.extend({}, baseClass.defaults, this.defaults)
		},
		
		findAll : function(params, success, error){
			var resultsArray = [];
		
			resultsArray =  this.list.grep(function(el, index){
								return el.subType === "Branch";
							});
	
			if (success) {
				success(resultsArray);
			}
	
			return resultsArray;
		},
		
		findByLine: function(line) {
			return this.findAll().grep(function(el, index){
				return el.lineId === line.about;
			});
		}
	},
	/* @Prototype */
	{
		/**
	    * Load in Branch specific information from an XML representation
	    * @param {Object} xml XML node to parse
	    */
		loadFromXML: function(xml) {
			if (xml) {
				this.attr('lineId', SURVEY_UTILS.getElementAttribute(xml, 'line', 'rdf:resource'));
			}
			this._super(xml);
		}
	}
);
