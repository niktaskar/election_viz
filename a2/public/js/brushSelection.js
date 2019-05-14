
/**
 * Constructor for the Brush Selection
 */
function BrushSelection(){
    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart;
 */
BrushSelection.prototype.init = function(){
    var self = this;
    self.divBrushSelection = d3.select("#brush-selection").classed("sideBar", true);
};

/**
 * Creates a list of states that have been selected by brushing over the Electoral Vote Chart
 *
 * @param selectedStates data corresponding to the states selected on brush
 */
BrushSelection.prototype.update = function(selectedStates){
    var self = this;

    // ******* TODO: PART V *******
    //Display the names of selected states in a list


    //******** TODO: EXTRA CREDIT I*******
    //Handle brush selection on the year chart

};
