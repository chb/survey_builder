/**
 * @tag controllers, home
 */
$.Controller.extend('Surveybuilder.Controllers.Line',
/* @Static */
{
    onDocument: false,
    
    /**
     * Discard changes made to a given Line
     * @param {Number} id line to discard unsaved changes from
     */
    discardChanges: function(id){

        var thisLine = Line.findOne({id:id});
        var childLineitem = Lineitem.findOne({id:thisLine.attr('child')});
        var next;

        // discard the changes to lineitems in this line
        while (childLineitem){
            next = childLineitem.attr('nextLineitem');
            OpenAjax.hub.publish('lineitem.discardChanges', {id:childLineitem.id});
            childLineitem = Lineitem.findOne({id:next});
        }
        
        Surveybuilder.Controllers.Line.loadPreviousVersion(id);
    },
    
    /**
     * Load the previous version of a Line
     * @param {Number} id line to reload
     */
    loadPreviousVersion: function(id){
        Line.loadFromCache(id);
    }
},
/* @Prototype */
{
	init : function(el, message){
	    steal.dev.log('new line controller instance created');
	    // add in content controller
        $(el).find('.line-items').surveybuilder_lineitem_content({connectWith: '.line-items'});
    },
    ".line-form input change": function(el, ev){
        var currentLine = Line.findOne({id:el.closest('.line').attr('id')});
        currentLine.attr(el.attr("name"), el.val());
        currentLine.save();
        
        // show "content changed" indicator
        $('.ui-tabs-selected .ui-icon-gear').show();
        $('#saveAll').removeClass('disabled').attr("disabled", false);
        ev.stopPropagation();
		//TODO: is this not in jvmc3?        ev.stopDelegation();
    }
    
});
