/**
 * @tag controllers, home
 */
$.Controller.extend('Surveybuilder.Controllers.LogicComponent',
/* @Static */
{
    onDocument: false
},
/* @Prototype */
{
    init: function(){
        steal.dev.log('loaded logic controller');
    },
    
    'logicComponent.updateLines subscribe': function(event, params) {
    	console.log('logicComponent.updateLines received');
    	var currentLineitem = Lineitem.findOne({id:this.element.attr('id')});  
    	
    	if (currentLineitem) {
			if (params.lines[currentLineitem.attr('branchTarget')])  {
				// remove branch target if it is no longer an option
				currentLineitem.attr("branchTarget", null);
				currentLineitem.save();
			}
    	}
    	// update the drop-down list of branch targets
    	var parentLineId = this.element.closest('.line').attr('id');
    	this.element.find('.branchTarget').html(this.view('logicComponent/show_branchTargets', {lines:params.lines, lineitem:currentLineitem, parentLineId:parentLineId}));
    }
});
