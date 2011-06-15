/**
 * @tag models, home
 * Wraps backend logic component services.  Enables 
 * [LogicComponent.static.findAll retrieving],
 * [LogicComponent.static.update updating],
 * [LogicComponent.static.destroy destroying], and
 * [LogicComponent.static.create creating] logic components.
 */
$.Model.extend('LogicComponent',
/* @Static */
{
    /**
     * Retrieves logic component data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped logic component objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    findAll : function(params, success, error){
    	logicComponents = [new LogicComponent({'type':'logicComponent','subType':'conditionalBranch', 'displayName':'Conditional Branch'})]; 
        if (success) {
        	success(logicComponents);
        }
        return logicComponents;
    },
    /**
     * Updates a logic component's data.
     * @param {String} id A unique id representing your logic component.
     * @param {Object} attrs Data to update your logic component with.
     * @param {Function} success a callback function that indicates a successful update.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    update : function(id, attrs, success, error){
        alert('implement update');
    },
    /**
     * Destroys a logic component's data.
     * @param {String} id A unique id representing your logic component.
     * @param {Function} success a callback function that indicates a successful destroy.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    destroy : function(id, success, error){
        alert('implement destroy');
    },
    /**
     * Creates a logic component.
     * @param {Object} attrs A logic component's attributes.
     * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    create : function(attrs, success, error){
        alert('implement create');
    }
},
/* @Prototype */
{})
