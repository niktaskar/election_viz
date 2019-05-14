/**
 * Constructor for the Vote Percentage Chart
 */
function VotePercentageChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
VotePercentageChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};
    var divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divvotesPercentage.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 300;

    //creates svg element within the div
    self.svg = divvotesPercentage.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
VotePercentageChart.prototype.chooseClass = function (party) {
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
 * Renders the HTML content for tool tip
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for tool tip
 */
VotePercentageChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text = "<ul>";

    tooltip_data.result.forEach(function(row){
        text += "<li class = " + self.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
    });
    return text;
};

/**
 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
 *
 * @param electionResult election data for the year selected
 */
VotePercentageChart.prototype.update = function(electionResult){
    var self = this;

    //for reference:https://github.com/Caged/d3-tip
    //Use this tool tip element to handle any hover over the chart
    var tip = d3.tip().attr('class', 'd3-tip')
        .direction('s')
        .offset(function() {
            return [0,0];
        })
        .html(function(d) {
            /* populate data in the following format
             * tooltip_data = {
             * "result":[
             * {"nominee": D_Nominee_prop,"votecount": D_Votes_Total,"percentage": D_PopularPercentage,"party":"D"} ,
             * {"nominee": R_Nominee_prop,"votecount": R_Votes_Total,"percentage": R_PopularPercentage,"party":"R"} ,
             * {"nominee": I_Nominee_prop,"votecount": I_Votes_Total,"percentage": I_PopularPercentage,"party":"I"}
             * ]
             * }
             * pass this as an argument to the tooltip_render function then,
             * return the HTML content returned from that method.
             * */

            for(var i = 0; i < electionResult.length; i++){
                electionResult[i].D_Percentage = parseFloat(electionResult[i].D_Percentage);
                electionResult[i].I_Percentage = parseFloat(electionResult[i].I_Percentage);
                electionResult[i].R_Percentage = parseFloat(electionResult[i].R_Percentage);

                electionResult[i].D_Votes = parseInt(electionResult[i].D_Votes);
                electionResult[i].I_Votes = parseInt(electionResult[i].I_Votes);
                electionResult[i].R_Votes = parseInt(electionResult[i].R_Votes);

                electionResult[i].Total_EV = parseInt(electionResult[i].Total_EV);
            }

            var popVotes = [0,0,0];

            for(var index = 0; index < electionResult.length; index++){
                if(!isNaN(electionResult[index].I_Votes)) {
                    popVotes[0] = popVotes[0] + parseFloat(electionResult[index].I_Votes);
                }
                if(!isNaN(electionResult[index].D_Votes)) {
                    popVotes[1] = popVotes[1] + parseFloat(electionResult[index].D_Votes);
                }
                if(!isNaN(electionResult[index].R_Votes)) {
                    popVotes[2] = popVotes[2] + parseFloat(electionResult[index].R_Votes);
                }
            }

            var totalVotes = popVotes[0] + popVotes[1] + popVotes[2];

            popVotes[0] = 100*popVotes[0]/totalVotes;
            popVotes[1] = 100*popVotes[1]/totalVotes;
            popVotes[2] = 100*popVotes[2]/totalVotes;

            var tooltip_data = {
                "result":[
                    {"nominee": electionResult[0].I_Nominee,"votecount": ((popVotes[0]*totalVotes)/100).toFixed(0),"percentage": popVotes[0].toFixed(1),"party":"I"},
                    {"nominee": electionResult[0].D_Nominee,"votecount": ((popVotes[1]*totalVotes)/100).toFixed(0),"percentage": popVotes[1].toFixed(1),"party":"D"},
                    {"nominee": electionResult[0].R_Nominee,"votecount": ((popVotes[2]*totalVotes)/100).toFixed(0),"percentage": popVotes[2].toFixed(1),"party":"R"}
                    ]
            };

            return self.tooltip_render(tooltip_data);

        });


    // ******* TODO: PART III *******

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .votesPercentage class to style your bars. -DONE

    //Display the total percentage of votes won by each party
    //on top of the corresponding groups of bars.
    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary -DONE

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar. -DONE

    //Just above this, display the text mentioning details about this mark on top of this bar
    //HINT: Use .votesPercentageNote class to style this text element -DONE

    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
    //then, vote percentage and number of votes won by each party. -DONE

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    d3.select("#votes-percentage")
        .select("svg")
        .selectAll("rect")
        .remove();

    d3.select("#votes-percentage")
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

    var popVotes = [0,0,0];

    for(var index = 0; index < electionResult.length; index++){
        if(!isNaN(electionResult[index].I_Votes)) {
            popVotes[0] = popVotes[0] + parseFloat(electionResult[index].I_Votes);
        }
        if(!isNaN(electionResult[index].D_Votes)) {
            popVotes[1] = popVotes[1] + parseFloat(electionResult[index].D_Votes);
        }
        if(!isNaN(electionResult[index].R_Votes)) {
            popVotes[2] = popVotes[2] + parseFloat(electionResult[index].R_Votes);
        }
    }

    var totalVotes = popVotes[0] + popVotes[1] + popVotes[2];

    popVotes[0] = 100*popVotes[0]/totalVotes;
    popVotes[1] = 100*popVotes[1]/totalVotes;
    popVotes[2] = 100*popVotes[2]/totalVotes;

    var startx = 0;
    var totals = [];
    var colors = [];

    //INITIALIZE A WAY OF KEEPING TRACK OF INDEPENDENTS
    var independents = electionResult.filter(function(d){
        return !isNaN(d.I_Percentage);
    });

    independents = electionResult.filter(function(d){
        return d.I_Percentage > d.R_Percentage && d.I_Percentage > d.D_Percentage;

    });

    independents = independents.sort(function(a,b){
        return b.I_Percentage - a.I_Percentage;
    });


    electionResult = electionResult.filter(function(d){
        return !(d.I_Percentage > d.R_Percentage && d.I_Percentage > d.D_Percentage);
    });

    electionResult = electionResult.sort(function(a,b){
        return (b.D_Percentage-b.R_Percentage) - (a.D_Percentage-a.R_Percentage);
    });


    var widthScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, self.svgWidth]);

    totals = [popVotes[0], popVotes[1], popVotes[2]];
    colors = ["green", "blue", "red"];

    // INITIALIZE THE TOOLTIP AND TRY TO RENDER
    d3.select("#votes-percentage")
        .select("svg")
        .call(tip);

    d3.select("#votes-percentage")
        .select("svg")
        .selectAll("rect")
        .data(totals)
        .enter()
        .append("rect")
        .attr("height", 40)
        .attr("width", function(d){
            return widthScale(d);
        })
        .attr("x", function(d){
            startx += widthScale(d);
            return startx - widthScale(d);
        })
        .attr("y", 100)
        .attr("class", "votesPercentage")
        .attr("fill", function(d){
            return colors[totals.indexOf(d)];
        });

    d3.select("#votes-percentage")
        .select("svg")
        .selectAll("rect")
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

    d3.select("#votes-percentage")
        .select("svg")
        .append("rect")
        .attr("x", self.svgWidth/2)
        .attr("y", 95)
        .attr("width", 5)
        .attr("height", 50)
        .attr("class", "middlePoint");

    d3.select("#votes-percentage")
        .select("svg")
        .append("text")
        .attr("class", "votesPercentageNote")
        .attr("x", self.svgWidth/2)
        .attr("y", 80)
        .text("Popular Vote (50%)");

    d3.select("#votes-percentage")
        .select("svg")
        .append("text")
        .attr("class", "votesPercentageText " + self.chooseClass("D"))
        .text("" + electionResult[0].D_Nominee+" "+popVotes[1].toFixed(1))
        .attr("x", function(){
            if(totals.length === 3){
                return widthScale(popVotes[0]);
            } else {
                return 0;
            }
        })
        .attr("y", 60);

    d3.select("#votes-percentage")
        .select("svg")
        .append("text")
        .attr("class", "votesPercentageText " + self.chooseClass("R"))
        .text(""+ electionResult[0].R_Nominee+" " + popVotes[2].toFixed(1))
        .attr("x", widthScale(100))
        .attr("y", 60);

    if(popVotes[0] > 0) {
        d3.select("#votes-percentage")
            .select("svg")
            .append("text")
            .attr("class", "votesPercentageText " + self.chooseClass("I"))
            .text("" + electionResult[0].I_Nominee+" "+ popVotes[0].toFixed(1))
            .attr("x", 0)
            .attr("y", 80);
    }

};
