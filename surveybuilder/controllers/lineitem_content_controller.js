$.Controller("Surveybuilder.lineitemContent", {
	defaults : {
		connectWith: ".line-items"
	}
}, {
	init : function() {
		this.makeSortable(this.element, this.options.connectWith);
	},
	/**
     * Make an element sortable
     * @param {Object} DOM element to make sortable
     * @param {String} jQuery selector for other sortables to connect this element with
     */
	makeSortable: function(el, connectWith){
        $(el).sortable({
            axis: 'y',
            connectWith: connectWith,
            forcePlaceholderSize: true,
            handle: '.ui-icon-grip-dotted-vertical',
            placeholder: 'placeholder',
            update: function(event, ui){
                // occurs when a lineitem is moved, or created
                // register the move with the controller
                OpenAjax.hub.publish('lineitem.movedInDom', {el:ui.item, isDelete:false});
                OpenAjax.hub.publish('tabs.markTabAsChanged', {});
            },
            over: function(event, ui){
                ui.sender.parent().find('.empty-message').css("visibility", "hidden");
            },
            out: function(even, ui){
                ui.sender.parent().find('.empty-message').css("visibility", "visible");
            }
        });
    },
    
});