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
		},
		
		/**
		 * Parse a given string to an XML document in the context of a Survey 
		 * definition.
		 * @param {String} xmlString string to parse
		 */
		parseAsSurveyXML: function(xmlString) {
			var openRDF = '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" \
               xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" \
               xmlns:survey="http://indivo.org/survey/vocab#" \
               xmlns:indivo="http://indivo.org/vocab/#" \
               xmlns:dc="http://purl.org/dc/elements/1.1/" \
               xmlns="http://indivo.org/survey/vocab#">';
            var closeRDF = '</rdf:RDF>';
            xmlString = openRDF + xmlString + closeRDF;
            
            return $($.parseXML(xmlString)).children().children();
		},
		
		/**
		 * Generate an rfc4122 version 4 compliant UUID
		 */
		generateUUID: function() {
			//TODO: based purely on browser's implementation of Math.random with no timestamp component, so look into better option if collisions appear 
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
																				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); 
																				return v.toString(16);
																			});
		} 
	};
});
