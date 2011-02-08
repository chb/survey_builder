/**
 * @tag controllers, home
 */
$.Controller.extend('Surveybuilder.Controllers.Line',
/* @Static */
{
    onDocument: false,
    
    discardChanges: function(id){

        var thisLine = Line.findOne({id:id});
        var childLineitem = Lineitem.findOne({id:thisLine.attr('firstLineitem')});
        var next;

        // discard the changes to lineitems in this line
        while (childLineitem){
            next = childLineitem.attr('nextLineitem');
            OpenAjax.hub.publish('lineitem.discardChanges', {id:childLineitem.id});
            childLineitem = Lineitem.findOne({id:next});
        }
        
        Surveybuilder.Controllers.Line.loadPreviousVersion(id);
    },
    
    loadPreviousVersion: function(id){
        Line.loadOne(id);
    }
},
/* @Prototype */
{
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
