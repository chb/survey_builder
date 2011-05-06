$(function(){

	SURVEY_UTILS = {
		/**
		 * Return the first matching element
		 * @param {Object} root the root element to search from
		 * @param {String} elementName the name of the element to get
		 */
		getElement: function(root, elementName) {
			elements = root.find('[nodeName="'+ elementName + '"]');
			if (elements.length == 0) {
				//no matching elements
				return null;
			}
			return elements.first();
		},
	
		/**
		 * Return all matching elements
		 * @param {Object} root the root element to search from
		 * @param {String} elementName the name of the elements to get
		 */
		getElements: function(root, elementName) {
			elements = root.find('[nodeName="'+ elementName + '"]');
			if (elements.length == 0) {
				//no matching elements
				return null;
			}
			return elements;
		},
	
		/**
		 * Return the attribute value of the first matching element
		 * @param {Object} root the root element to search from
		 * @param {String} elementName the name of the element to get
		 */
		getElementAttribute: function(root, elementName, attributeName) {
			elements = root.find('[nodeName="'+ elementName + '"]');
			if (elements.length == 0) {
				//no matching elements
				return null;
			}
			return elements.first().attr(attributeName);
		},
	
		/**
		 * Return the text of the first matching element
		 * @param {Object} root the root element to search from
		 * @param {String} elementName the name of the element to get the text of
		 */
		getElementText: function(root, elementName) {
			elements = root.find('[nodeName="'+ elementName + '"]');
			if (elements.length == 0) {
				//no matching elements
				return null;
			}
			return elements.first().text();
		},
	
		/**
		 * Return the html encoded text of the first matching element
		 * @param {Object} root the root element to search from
		 * @param {String} elementName the name of the element to get the text of
		 */
		getElementTextHTMLEncoded: function(root, elementName) {
			elements = root.find('[nodeName="'+ elementName + '"]');
			if (elements.length == 0) {
				//no matching elements
				return null;
			}
			return this.htmlEncode(elements.first().text());
		},
	
		htmlEncode: function(text) {
			return jQuery('<div/>').text(text).html();
		}
	};
});
