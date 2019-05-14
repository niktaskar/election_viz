
/**
 * Constructor for the ElectoralVoteChart
 *
 * @param brushSelection an instance of the BrushSelection class
 */
function ElectoralVoteChart(){

    var self = this;
    self.init();
}

/**
 * Initializes the svg elements required for this chart
 */
ElectoralVoteChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    //Gets access to the div element created for this chart from HTML
    var divelectoralVotes = d3.select("#electoral-vote").classed("content", true);
    self.svgBounds = divelectoralVotes.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 150;

    //creates svg element within the div
    self.svg = divelectoralVotes.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
ElectoralVoteChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R"){
        return "republican";
    }
    else if (party == "D"){
        return "democrat";
    }
    else if (party == "I"){
        return "independent";
    }
};

/**
 * Creates the stacked bar chart, text content and tool tips for electoral vote chart
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */

ElectoralVoteChart.prototype.update = function(electionResult, colorScale){
    var self = this;

    // ******* TODO: PART II *******

    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars. -DONE

    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars. -DONE
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary -DONE

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar. -DONE

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element -DONE

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary. -DONE

    d3.select("#electoral-vote")
        .select("svg")
        .selectAll("rect")
        .remove();

    d3.select("#electoral-vote")
        .select("svg")
        .selectAll("text")
        .remove();

    for(var i = 0; i < electionResult.length; i++){
        electionResult[i].D_Percentage = parseFloat(electionResult[i].D_Percentage);
        electionResult[i].I_Percentage = parseFloat(electionResult[i].I_Percentage);
        electionResult[i].R_Percentage = parseFloat(electionResult[i].R_Percentage);

        electionResult[i].D_Votes = parseInt(electionResult[i].D_Votes);
        electionResult[i].I_Votes = parseInt(electionResult[i].I_Votes);
        electionResult[i].R_Votes = parseInt(electionResult[i].R_Votes);

        electionResult[i].Total_EV = parseInt(electionResult[i].Total_EV);
    }

    var startx = 0;
    var rElectoralCount = 0;
    var dElectoralCount = 0;
    var iElectoralCount = 0;
    var totalElectoral = 0;

    for(var j = 0; j < electionResult.length; j++){
        totalElectoral += electionResult[j].Total_EV;
    }

    var independents = electionResult.filter(function(d){
        return !isNaN(d.I_Percentage) ;
    });

    independents = independents.filter(function(d){
       return d.I_Percentage > d.R_Percentage && d.I_Percentage > d.D_Percentage;
    });

    independents = independents.sort(function(a,b){
        return b.I_Percentage - a.I_Percentage;
    });

    for(var k = 0; k < independents.length; k++){
        iElectoralCount += independents[k].Total_EV;
    }

    electionResult = electionResult.filter(function(d){
        return !(d.I_Percentage > d.R_Percentage && d.I_Percentage > d.D_Percentage);
    });

    electionResult = electionResult.sort(function(a,b){
        return (b.D_Percentage-b.R_Percentage) - (a.D_Percentage-a.R_Percentage);
    });

    var widthScale = d3.scaleLinear()
        .domain([0, totalElectoral])
        .range([0, self.svgWidth]);

    var finalizedData = [];

    for(var ind = 0; ind < independents.length; ind++){
        finalizedData[ind] = independents[ind];
    }

    for(var rest = 0; rest < electionResult.length; rest++){
        finalizedData[rest+independents.length] = electionResult[rest];
    }

    d3.select("#electoral-vote")
        .select("svg")
        .selectAll("rect")
        .data(finalizedData)
        .enter()
        .append("rect")
        .attr("height", 40)
        .attr("width", function(s){
            // console.log(s);
            return widthScale(s.Total_EV);
        })
        .attr("x", function(s){
            startx += widthScale(s.Total_EV);
            return startx - widthScale(s.Total_EV);
        })
        .attr("y", 100)
        .attr("class", "electoralVotes")
        .attr("fill", function(s){
            if(independents.indexOf(s) > -1){
                return "green";
            }
            if (s.R_Percentage >= s.D_Percentage) {
                rElectoralCount += s.Total_EV;
            } else {
                dElectoralCount += s.Total_EV;
            }
            return colorScale(s.R_Percentage-s.D_Percentage);
        });

    d3.select("#electoral-vote")
        .select("svg")
        .append("rect")
        .attr("x", self.svgWidth/2)
        .attr("y", 95)
        .attr("width", 5)
        .attr("height", 50)
        .attr("class", "middlePoint");

    d3.select("#electoral-vote")
        .select("svg")
        .append("text")
        .attr("class", "electoralVotesNote")
        .attr("x", self.svgWidth/2)
        .attr("y", 65)
        .text("Electoral Vote ("+ parseInt(totalElectoral/2 + 1) + " needed to win)");

    d3.select("#electoral-vote")
        .select("svg")
        .append("text")
        .attr("class", "electoralVoteText " + self.chooseClass("D"))
        .text("" + parseInt(totalElectoral-iElectoralCount-rElectoralCount))
        .attr("x", widthScale(iElectoralCount))
        .attr("y", 65);

    d3.select("#electoral-vote")
        .select("svg")
        .append("text")
        .attr("class", "electoralVoteText " + self.chooseClass("R"))
        .text("" + rElectoralCount)
        .attr("x", widthScale(totalElectoral))
        .attr("y", 65);

    if(iElectoralCount > 0) {
        d3.select("#electoral-vote")
            .select("svg")
            .append("text")
            .attr("class", "electoralVoteText " + self.chooseClass("I"))
            .text("" + iElectoralCount)
            .attr("x", 0)
            .attr("y", 65);
    }

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of brushSelection and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.

};
