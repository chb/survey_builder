Lineitem.extend("LogicComponent",
	/* @Static */
	{
		defaults: {
			type: "logicComponent"
		},
		setup: function(baseClass){
			this.defaults = $.extend(true, {}, baseClass.defaults, this.defaults)
		}
	},
	/* @Prototype */
	{
		/**
	    * Load in LogicComponent specific information from an XML representation
	    * @param {Object} xml XML node to parse
	    */
		loadFromXML: function(xml) {
			
		}
	}
);