LogicComponent.extend("ConditionalBranch",
	/* @Static */
	{
		defaults: {
			subType: "ConditionalBranch",
			displayName: "Conditional Branch"
		},
		
		setup: function(baseClass){
			this.defaults = $.extend({}, baseClass.defaults, this.defaults)
		}
	},
	/* @Prototype */
	{
		/**
	    * Load in ConditionalBranch specific information from an XML representation
	    * @param {Object} xml XML node to parse
	    */
		loadFromXML: function(xml) {
			if (xml) {
				this.attr('branchTarget', SURVEY_UTILS.getElementAttribute(xml, 'line', 'rdf:resource'));
			}
			this._super(xml);
			
			// create the Condition
			var condition = new Condition;
			condition.loadFromXML(SURVEY_UTILS.getChildElement(SURVEY_UTILS.getChildElement(xml, "condition"), "Condition"), this);
		},
		
		setChild: function(child) {
			this.attr("childId", ((child) ? child.id : null));
		},
		
		getChild: function() {
			return Lineitem.findOne({id:this.attr("childId")});
		},
		
		getLastChild: function() {
			var lineitem = Lineitem.findOne({id:this.attr("childId")});
			
			while (lineitem.nextLineitem) {
				lineitem = Lineitem.findOne({id:lineitem.nextLineitem});
			}
			
			return lineitem;
		}
	}
);