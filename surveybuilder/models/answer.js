/**
 * @tag models, home
 * Wraps backend answer services.  Enables 
 * [Answer.static.findAll retrieving],
 * [Answer.static.update updating],
 * [Answer.static.destroy destroying], and
 * [Answer.static.create creating] answers.
 */
$.Model.extend('Answer',
/* @Static */
{
    /**
     * Retrieves answers data from your backend services.
     * @param {Object} params params that might refine your results.
     * @param {Function} success a callback function that returns wrapped answer objects.
     * @param {Function} error a callback function for an error in the ajax request.
     */
    findAll : function(params, success, error){
    	answers = [new Answer({'type':'answer','subType':'label', 'displayName':'Fixed Choice'}), new Answer({'type':'answer','subType':'text', 'displayName':'Free Text'})];
        if (success) {
        	success(answers);
        }
        return answers;
    },
    /**
     * Updates an answer's data.
     * @param {String} id A unique id representing your answer.
     * @param {Object} attrs Data to update your answer with.
     * @param {Function} success a callback function that indicates a successful update.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    update : function(id, attrs, success, error){
        alert('implement update');
    },
    /**
     * Destroys an answer's data.
     * @param {String} id A unique id representing your answer.
     * @param {Function} success a callback function that indicates a successful destroy.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    destroy : function(id, success, error){
        alert('implement destroy');
    },
    /**
     * Creates an answer.
     * @param {Object} attrs A answer's attributes.
     * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
     * @param {Function} error a callback that should be called with an object of errors.
     */
    create : function(attrs, success, error){
        alert('implement create');
    }
},
/* @Prototype */
{})
