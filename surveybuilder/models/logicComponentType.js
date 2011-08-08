/**
 * @tag models, home
 * Enables 
 * [LogicComponentType.static.findAll retrieving],
 * [LogicComponentType.static.update updating],
 * [LogicComponentType.static.destroy destroying], and
 * [LogicComponentType.static.create creating] logic components.
 */
$.Model.extend('LogicComponentType',
/* @Static */
{
    /**
     * Retrieves LogicComponentType components
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped LogicComponentType objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    findAll : function(params, success, error){
    	logicComponents = [new LogicComponentType({'type':'logicComponent','subType':'ConditionalBranch', 'displayName':'Conditional Branch'})]; 
        if (success) {
        	success(logicComponents);
        }
        return logicComponents;
    },
    /**
     * Updates a LogicComponentType component's data.
     * @param {String} id A unique id representing your LogicComponentType.
     * @param {Object} attrs Data to update your LogicComponentType with.
     * @param {Function} success a callback function that indicates a successful update.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    update : function(id, attrs, success, error){
        alert('implement update');
    },
    /**
     * Destroys a LogicComponentType's data.
     * @param {String} id A unique id representing your LogicComponentType.
     * @param {Function} success a callback function that indicates a successful destroy.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    destroy : function(id, success, error){
        alert('implement destroy');
    },
    /**
     * Creates a LogicComponentType.
     * @param {Object} attrs A LogicComponentType's attributes.
     * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    create : function(attrs, success, error){
        alert('implement create');
    }
},
/* @Prototype */
{})
