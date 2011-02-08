/**
 * @tag controllers, home
 */
$.Controller.extend('Surveybuilder.Controllers.Branch',
/* @Static */
{
    onDocument: false
},
/* @Prototype */
{
    init: function(){
        console.log('loaded branch controller');
    },
    
    'branch.updatedLine subscribe': function(event, line) {
    	steal.dev.log('branch.updatedLine received');
    	var el = this.element; 
    	
    	if (el.attr('data-line') == line.id) {
    		el.find('.header').text('Branch to: ' + line.title);  //TODO: switch to a view
    		branchToUpdate = Lineitem.findOne({id:el.attr('id')});
			branchToUpdate.attr("displayName", line.title);
			branchToUpdate.save();
    	}
    }
});
