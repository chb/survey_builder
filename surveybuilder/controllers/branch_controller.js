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
    	steal.dev.log('new branch controller instance created');
    },
    
    /**
     *	Updates branch name and rdf:about for any lines that are updated
     */
    'line.updated subscribe': function(event, line) {
    	steal.dev.log('line.updated received in branch_controller');
    	var el = this.element; 
    	
    	if (el.attr('data-line') == line.id) {
    		//update html
    		el.find('.header').text('Branch to: ' + line.title);  //TODO: switch to a view
    		
    		//update branch object
    		branchToUpdate = Lineitem.findOne({id:el.attr('id')});
    		if (branchToUpdate) {
				branchToUpdate.attr("displayName", line.title);
				branchToUpdate.attr("about", line.about);
				branchToUpdate.save();    		
    		}
    	}
    }
});
