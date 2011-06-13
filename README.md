# Indivo Survey Builder

### About
* Implemented in JavaScript using:
 * [JavaScriptMVC (JMVC)](http://javascriptmvc.com/) 
  * [jQuery](http://jquery.com/) & [jQuery UI](http://jqueryui.com/)
* Creates RDF/XML survey definitions as described [here](http://wiki.chip.org/indivo/index.php/Survey_RDF_Model)

### Getting Started
#### Download
1. <code>git clone git://github.com/chb/survey_builder.git</code>
2. <code>cd survey_builder</code>
3. <code>git submodule init</code>
4. <code>git submodule update</code>

#### Quick Look
The quickest way to run the builder (without preview functionality) is to open up <code>survey_builder/surveybuilder/index.html</code> in your favorite browser.  (though Chrome's XMLHttpRequest by default doesn't let you read from the file system anymore, so you can launch it with the flag  --allow-file-access-from-files, or use a different browser)

####Enabling Previews

The builder's example data connector is configured by default to read and save to your browser's local storage when retrieving and storing definitions.  This setup works well when testing the builder in conjunction with the [Indivo Survey Client](https://github.com/chb/survey_client), which by default is configured to read from browser local storage.

In order to view previews of your survey, you will need to install the [Indivo Survey Client](https://github.com/chb/survey_client) and then configure the builder's <code>PREVIEW_PATH</code> variable in <code>survey_builder/surveybuilder/index.html</code> to point to where the client is hosted.

Note, since you can't access local storage cross-domain, you will need to host both the builder and client under the same domain (using Apache HTTP Server on your localhost for example) if you want them to use the default local storage setup for saving and loading.

### Data Connector
The Indivo Survey Builder saves and retrieves survey definitions using a generic data connector that provides two methods

* save_survey
 * passed the RDF/XML definition to save 
* get_survey
 * retrieves an RDF/XML definition to load

The data connector resides in <code>survey_builder/surveybuilder/index.html</code>, and  replacing the example implementations with ones that communicate with another service is your key to integrating the builder with a persistent store. 

###Development v.s. Production Modes
By default, the builder will run in development mode, allowing for console logging and easier debugging.  To compress the builder for increased performance and a decreased download profile, do the following

1. from <code>survey_builder/</code> run <code>./steal/js ./surveybuilder/scripts/build.js</code>
2. edit <code>survey_builder/surveybuilder/index.html</code> and change the existing script tag to point to the new production bundle: 
 * old <code> src='../steal/steal.js?surveybuilder,development'></code>
 * new <code> src='../steal/steal.js?surveybuilder,production'></code>

