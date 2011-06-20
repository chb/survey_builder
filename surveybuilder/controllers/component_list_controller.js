/**
 * Controller for displaying lists of components.
 */
$.Controller("Surveybuilder.ComponentList", {
	defaults : {
		template: "", //template to use for rendering the list item
		model: null,  //model to list instances of
		draggableClass: 'line-item',  //class of items to make draggable
		connectTo: ".line-items",  //class(es) of sortables to connect draggables to
		nameAttribute: 'displayName',  //attribute on the model that gets displayed as the name
		nameSpan: '.display-name',  //span to update when the nameAttribute is updated
		nameInput: 'displayName',  //input to update when the nameAttribute is updated
		stuff: Lineitem
	}
}, {
	init : function() {
		this.element.html( this.options.template, this.options.model.findAll());
		this.makeDraggable(this.element.find("." + this.options.draggableClass), this.options.connectTo);
	},
	"{model} created" : function(Model, ev, newItem) {
		//add newly created models to the list
		this.element.append(this.options.template, [newItem]);
		//make models draggable if they match the draggableClass 
		newElement = newItem.elements(this.element);
		if (newElement.hasClass(this.options.draggableClass)) {
			this.makeDraggable(newElement, this.options.connectTo);
		}
	},
	"{model} updated" : function(Model, ev, updatedItem) {
		//find the element that represents the updated model
		existingElement = updatedItem.elements(this.element);
		//update the nameSpan and nameInput with the updated nameAttribute
		existingElement.find(this.options.nameSpan).text(updatedItem[this.options.nameAttribute]);
		existingElement.find('input[name="' + this.options.nameInput + '"]').val(updatedItem[this.options.nameAttribute]);
	},
	"{model} destroyed" : function(Model, ev, destroyedItem) {
		destroyedItem.elements(this.element)
		.remove();
	},
	/**
	 * Make element(s) draggable
	 * @param {Object} elements the element(s) to make draggable
	 * @param {String} connectTo the selector for sortables this draggable can be dropped on
	 */
	makeDraggable: function(elements, connectTo) {
		elements.draggable({
			connectToSortable: connectTo,
			handle: '.handle',
			helper: 'clone',
			revert: 'invalid',
			start: function(event, ui) {
				$(connectTo).sortable('refresh');
				$(connectTo).addClass('highlighted');
				// we want a different placeholder style when dragging into a sortable
				$(connectTo).sortable('option', 'placeholder', 'placeholder-drag');
			},
			stop: function(event, ui) {
				$(connectTo).removeClass('highlighted');
				// revert the placeholder for sortables back to normal
				$(connectTo).sortable('option', 'placeholder', 'placeholder');
			}
		});
	}	
});