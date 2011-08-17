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
		
		findByLine: function(line) {
			return this.findAll().grep(function(el, index){
				return el.lineAbout === line.about;
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
				this.attr('lineAbout', SURVEY_UTILS.getElementAttribute(xml, 'line', 'rdf:resource'));
			}
			this._super(xml);
		},
		
		getLineName: function() {
			// TODO: make sure this does not affect performance too much
			var name = "";
			if (this.lineAbout) {
				var line = Line.findOne({about:this.lineAbout});
				if (line) {
					name = line.attr("internalName");
				}
			}
			
			this.lineName = name;
			return name; 	
		}
	}
);
