/**
 * Constructor for the TileChart
 */
function TileChart(){

    var self = this;
    self.init();
}

/**
 * Initializes the svg elements required to lay the tiles
 * and to populate the legend.
 */
TileChart.prototype.init = function(){
    var self = this;

    //Gets access to the div element created for this chart and legend element from HTML
    var divTileChart = d3.select("#tiles").classed("content", true);
    var legend = d3.select("#legend").classed("content",true);
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    var svgBounds = divTileChart.node().getBoundingClientRect();
    self.svgWidth = svgBounds.width;
    self.svgHeight = self.svgWidth/2;
    var legendHeight = 150;

    //creates svg elements within the div
    self.legendSvg = legend.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",legendHeight)
        .attr("transform", "translate(" + self.margin.left + ",0)")

    self.svg = divTileChart.append("svg")
                        .attr("width",self.svgWidth)
                        .attr("height",self.svgHeight)
                        .attr("transform", "translate(" + self.margin.left + ",0)")
                        .style("bgcolor","green")

};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
TileChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R"){
        return "republican";
    }
    else if (party== "D"){
        return "democrat";
    }
    else if (party == "I"){
        return "independent";
    }
};

/**
 * Renders the HTML content for tool tip.
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for tool tip
 */
TileChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;

    var winner = tooltip_data.winner;
    var party;
    tooltip_data.result.forEach(function(row){
        if(row.nominee === winner){
            party = row.party;
        }
    });

    var text = "<h2 class ="  + self.chooseClass(party) + " >" + tooltip_data.state + "</h2>";
    text +=  "Electoral Votes: " + tooltip_data.electoralVotes;
    text += "<ul>";
    tooltip_data.result.forEach(function(row){
        text += "<li class = " + self.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>";
    });
    text += "</ul>";
    return text;
};

/**
 * Creates tiles and tool tip for each state, legend for encoding the color scale information.
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */
TileChart.prototype.update = function(electionResult, colorScale){
    var self = this;

    //Calculates the maximum number of columns to be laid out on the svg
    self.maxColumns = d3.max(electionResult,function(d){
                                return parseInt(d["Space"]);
                            });

    //Calculates the maximum number of rows to be laid out on the svg
    self.maxRows = d3.max(electionResult,function(d){
                                return parseInt(d["Row"]);
                        });
    //for reference:https://github.com/Caged/d3-tip
    //Use this tool tip element to handle any hover over the chart
    tip = d3.tip().attr('class', 'd3-tip')
        .direction('se')
        .offset(function() {
            return [0,0];
        })
        .html(function(d) {
            /* populate data in the following format
             * tooltip_data = {
             * "state": State,
             * "winner":d.State_Winner
             * "electoralVotes" : Total_EV
             * "result":[
             * {"nominee": D_Nominee_prop,"votecount": D_Votes,"percentage": D_Percentage,"party":"D"} ,
             * {"nominee": R_Nominee_prop,"votecount": R_Votes,"percentage": R_Percentage,"party":"R"} ,
             * {"nominee": I_Nominee_prop,"votecount": I_Votes,"percentage": I_Percentage,"party":"I"}
             * ]
             * }
             * pass this as an argument to the tooltip_render function then,
             * return the HTML content returned from that method.
             * */

            var state_winner;

            if(!isNaN(d.I_Percentage)) {
                if (d.I_Percentage > d.R_Percentage && d.I_Percentage > d.D_Percentage) {
                    state_winner = d.I_Nominee;
                } else if (d.D_Percentage > d.R_Percentage && d.D_Percentage > d.I_Percentage) {
                    state_winner = d.D_Nominee;
                } else {
                    state_winner = d.R_Nominee;
                }
            } else {
                if (d.D_Percentage > d.R_Percentage) {
                    state_winner = d.D_Nominee;
                } else {
                    state_winner = d.R_Nominee;
                }
            }

            var tooltip_data = {
                "state": d.State,
                "winner": state_winner,
                "electoralVotes" : d.Total_EV,
                "result":[
                    {"nominee": d.I_Nominee,"votecount": d.I_Votes,"percentage": d.I_Percentage.toFixed(1),"party":"I"},
                    {"nominee": d.D_Nominee,"votecount": d.D_Votes,"percentage": d.D_Percentage.toFixed(1),"party":"D"},
                    {"nominee": d.R_Nominee,"votecount": d.R_Votes,"percentage": d.R_Percentage.toFixed(1),"party":"R"}
                ]
            };

            return self.tooltip_render(tooltip_data);
        });

    //Creates a legend element and assigns a scale that needs to be visualized
    self.legendSvg.append("g")
        .attr("class", "legendQuantile");

    var legendQuantile = d3.legendColor()
        .shapeWidth((self.svgWidth+self.margin.right)/13)
        .cells(10)
        .orient('horizontal')
        .scale(colorScale);

    // ******* TODO: PART IV *******
    //Tansform the legend element to appear in the center and make a call to this element for it to display. -DONE

    //Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data. -DONE

    //Display the state abbreviation and number of electoral votes on each of these rectangles

    //Use global color scale to color code the tiles. -DONE

    //HINT: Use .tile class to style your tiles; -DONE
    // .tilestext to style the text corresponding to tiles -DONE

    //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
    //then, vote percentage and number of votes won by each party.
    //HINT: Use the .republican, .democrat and .independent classes to style your elements.


    //Need to fix ALASKA(1), DC(8), HAWAII(11)


    var independents = electionResult.filter(function(d){
        return ((d.I_Percentage > d.D_Percentage) && (d.I_Percentage > d.R_Percentage));
    });

    d3.select("#tiles")
        .selectAll("rect")
        .remove();

    d3.select("#tiles")
        .selectAll("text")
        .remove();

    electionResult = electionResult.sort(function(a,b){
        return d3.ascending(a.State,b.State);
    });

    d3.select("#legend")
        .select("svg")
        .select("g")
        .call(legendQuantile)
        .attr("transform", "translate(0,0)")
        .attr("text-anchor", "center");

    var matrix = new Array(8);
    for(var i = 0; i < matrix.length; i++){
        matrix[i] = new Array(12);
    }

    if(electionResult.length === 50){
        matrix[0][0] = electionResult[1];
        matrix[0][1] = null;
        matrix[0][2] = null;
        matrix[0][3] = null;
        matrix[0][4] = null;
        matrix[0][5] = null;
        matrix[0][6] = null;
        matrix[0][7] = null;
        matrix[0][8] = null;
        matrix[0][9] = null;
        matrix[0][10] = null;
        matrix[0][11] = electionResult[18];
        matrix[1][0] = null;
        matrix[1][1] = null;
        matrix[1][2] = null;
        matrix[1][3] = null;
        matrix[1][4] = null;
        matrix[1][5] = null;
        matrix[1][6] = null;
        matrix[1][7] = null;
        matrix[1][8] = null;
        matrix[1][9] = null;
        matrix[1][10] = electionResult[44];
        matrix[1][11] = electionResult[28];
        matrix[2][0] = null;
        matrix[2][1] = electionResult[46];
        matrix[2][2] = electionResult[11];
        matrix[2][3] = electionResult[25];
        matrix[2][4] = electionResult[33];
        matrix[2][5] = electionResult[22];
        matrix[2][6] = electionResult[12];
        matrix[2][7] = electionResult[48];
        matrix[2][8] = electionResult[21];
        matrix[2][9] = electionResult[31];
        matrix[2][10] = electionResult[38];
        matrix[2][11] = electionResult[20];
        matrix[3][0] = null;
        matrix[3][1] = electionResult[36];
        matrix[3][2] = electionResult[27];
        matrix[3][3] = electionResult[49];
        matrix[3][4] = electionResult[40];
        matrix[3][5] = electionResult[14];
        matrix[3][6] = electionResult[13];
        matrix[3][7] = electionResult[34];
        matrix[3][8] = electionResult[37];
        matrix[3][9] = electionResult[29];
        matrix[3][10] = electionResult[6];
        matrix[3][11] = null;
        matrix[4][0] = null;
        matrix[4][1] = electionResult[4];
        matrix[4][2] = electionResult[43];
        matrix[4][3] = electionResult[5];
        matrix[4][4] = electionResult[26];
        matrix[4][5] = electionResult[24];
        matrix[4][6] = electionResult[16];
        matrix[4][7] = electionResult[47];
        matrix[4][8] = electionResult[45];
        matrix[4][9] = electionResult[19];
        matrix[4][10] = null;
        matrix[4][11] = null;
        matrix[5][0] = null;
        matrix[5][1] = null;
        matrix[5][2] = electionResult[2];
        matrix[5][3] = electionResult[30];
        matrix[5][4] = electionResult[15];
        matrix[5][5] = electionResult[3];
        matrix[5][6] = electionResult[41];
        matrix[5][7] = electionResult[32];
        matrix[5][8] = electionResult[39];
        matrix[5][9] = electionResult[7];
        matrix[5][10] = null;
        matrix[5][11] = null;
        matrix[6][0] = null;
        matrix[6][1] = null;
        matrix[6][2] = null;
        matrix[6][3] = null;
        matrix[6][4] = electionResult[35];
        matrix[6][5] = electionResult[17];
        matrix[6][6] = electionResult[23];
        matrix[6][7] = electionResult[0];
        matrix[6][8] = electionResult[9];
        matrix[6][9] = null;
        matrix[6][10] = null;
        matrix[6][11] = null;
        matrix[7][0] = null;
        matrix[7][1] = electionResult[10];
        matrix[7][2] = null;
        matrix[7][3] = null;
        matrix[7][4] = electionResult[42];
        matrix[7][5] = null;
        matrix[7][6] = null;
        matrix[7][7] = null;
        matrix[7][8] = null;
        matrix[7][9] = electionResult[8];
        matrix[7][10] = null;
        matrix[7][11] = null;
    } else if(electionResult.length == 48) {
        matrix[0][0] = null;
        matrix[0][1] = null;
        matrix[0][2] = null;
        matrix[0][3] = null;
        matrix[0][4] = null;
        matrix[0][5] = null;
        matrix[0][6] = null;
        matrix[0][7] = null;
        matrix[0][8] = null;
        matrix[0][9] = null;
        matrix[0][10] = null;
        matrix[0][11] = electionResult[16];
        matrix[1][0] = null;
        matrix[1][1] = null;
        matrix[1][2] = null;
        matrix[1][3] = null;
        matrix[1][4] = null;
        matrix[1][5] = null;
        matrix[1][6] = null;
        matrix[1][7] = null;
        matrix[1][8] = null;
        matrix[1][9] = null;
        matrix[1][10] = electionResult[42];
        matrix[1][11] = electionResult[26];
        matrix[2][0] = null;
        matrix[2][1] = electionResult[44];
        matrix[2][2] = electionResult[9];
        matrix[2][3] = electionResult[23];
        matrix[2][4] = electionResult[31];
        matrix[2][5] = electionResult[20];
        matrix[2][6] = electionResult[10];
        matrix[2][7] = electionResult[46];
        matrix[2][8] = electionResult[19];
        matrix[2][9] = electionResult[29];
        matrix[2][10] = electionResult[36];
        matrix[2][11] = electionResult[18];
        matrix[3][0] = null;
        matrix[3][1] = electionResult[34];
        matrix[3][2] = electionResult[25];
        matrix[3][3] = electionResult[47];
        matrix[3][4] = electionResult[38];
        matrix[3][5] = electionResult[12];
        matrix[3][6] = electionResult[11];
        matrix[3][7] = electionResult[32];
        matrix[3][8] = electionResult[35];
        matrix[3][9] = electionResult[27];
        matrix[3][10] = electionResult[5];
        matrix[3][11] = null;
        matrix[4][0] = null;
        matrix[4][1] = electionResult[3];
        matrix[4][2] = electionResult[41];
        matrix[4][3] = electionResult[4];
        matrix[4][4] = electionResult[24];
        matrix[4][5] = electionResult[22];
        matrix[4][6] = electionResult[14];
        matrix[4][7] = electionResult[45];
        matrix[4][8] = electionResult[43];
        matrix[4][9] = electionResult[17];
        matrix[4][10] = null;
        matrix[4][11] = null;
        matrix[5][0] = null;
        matrix[5][1] = null;
        matrix[5][2] = electionResult[1];
        matrix[5][3] = electionResult[28];
        matrix[5][4] = electionResult[13];
        matrix[5][5] = electionResult[2];
        matrix[5][6] = electionResult[39];
        matrix[5][7] = electionResult[30];
        matrix[5][8] = electionResult[37];
        matrix[5][9] = electionResult[6];
        matrix[5][10] = null;
        matrix[5][11] = null;
        matrix[6][0] = null;
        matrix[6][1] = null;
        matrix[6][2] = null;
        matrix[6][3] = null;
        matrix[6][4] = electionResult[33];
        matrix[6][5] = electionResult[15];
        matrix[6][6] = electionResult[21];
        matrix[6][7] = electionResult[0];
        matrix[6][8] = electionResult[8];
        matrix[6][9] = null;
        matrix[6][10] = null;
        matrix[6][11] = null;
        matrix[7][0] = null;
        matrix[7][1] = null;
        matrix[7][2] = null;
        matrix[7][3] = null;
        matrix[7][4] = electionResult[40];
        matrix[7][5] = null;
        matrix[7][6] = null;
        matrix[7][7] = null;
        matrix[7][8] = null;
        matrix[7][9] = electionResult[7];
        matrix[7][10] = null;
        matrix[7][11] = null;
    }else {

        matrix[0][0] = electionResult[1];
        matrix[0][1] = null;
        matrix[0][2] = null;
        matrix[0][3] = null;
        matrix[0][4] = null;
        matrix[0][5] = null;
        matrix[0][6] = null;
        matrix[0][7] = null;
        matrix[0][8] = null;
        matrix[0][9] = null;
        matrix[0][10] = null;
        matrix[0][11] = electionResult[19];
        matrix[1][0] = null;
        matrix[1][1] = null;
        matrix[1][2] = null;
        matrix[1][3] = null;
        matrix[1][4] = null;
        matrix[1][5] = null;
        matrix[1][6] = null;
        matrix[1][7] = null;
        matrix[1][8] = null;
        matrix[1][9] = null;
        matrix[1][10] = electionResult[45];
        matrix[1][11] = electionResult[29];
        matrix[2][0] = null;
        matrix[2][1] = electionResult[47];
        matrix[2][2] = electionResult[12];
        matrix[2][3] = electionResult[26];
        matrix[2][4] = electionResult[34];
        matrix[2][5] = electionResult[23];
        matrix[2][6] = electionResult[13];
        matrix[2][7] = electionResult[49];
        matrix[2][8] = electionResult[22];
        matrix[2][9] = electionResult[32];
        matrix[2][10] = electionResult[39];
        matrix[2][11] = electionResult[21];
        matrix[3][0] = null;
        matrix[3][1] = electionResult[37];
        matrix[3][2] = electionResult[28];
        matrix[3][3] = electionResult[50];
        matrix[3][4] = electionResult[41];
        matrix[3][5] = electionResult[15];
        matrix[3][6] = electionResult[14];
        matrix[3][7] = electionResult[35];
        matrix[3][8] = electionResult[38];
        matrix[3][9] = electionResult[30];
        matrix[3][10] = electionResult[6];
        matrix[3][11] = null;
        matrix[4][0] = null;
        matrix[4][1] = electionResult[4];
        matrix[4][2] = electionResult[44];
        matrix[4][3] = electionResult[5];
        matrix[4][4] = electionResult[27];
        matrix[4][5] = electionResult[25];
        matrix[4][6] = electionResult[17];
        matrix[4][7] = electionResult[48];
        matrix[4][8] = electionResult[46];
        matrix[4][9] = electionResult[20];
        matrix[4][10] = electionResult[8];
        matrix[4][11] = null;
        matrix[5][0] = null;
        matrix[5][1] = null;
        matrix[5][2] = electionResult[2];
        matrix[5][3] = electionResult[31];
        matrix[5][4] = electionResult[16];
        matrix[5][5] = electionResult[3];
        matrix[5][6] = electionResult[42];
        matrix[5][7] = electionResult[33];
        matrix[5][8] = electionResult[40];
        matrix[5][9] = electionResult[7];
        matrix[5][10] = null;
        matrix[5][11] = null;
        matrix[6][0] = null;
        matrix[6][1] = null;
        matrix[6][2] = null;
        matrix[6][3] = null;
        matrix[6][4] = electionResult[36];
        matrix[6][5] = electionResult[18];
        matrix[6][6] = electionResult[24];
        matrix[6][7] = electionResult[0];
        matrix[6][8] = electionResult[10];
        matrix[6][9] = null;
        matrix[6][10] = null;
        matrix[6][11] = null;
        matrix[7][0] = null;
        matrix[7][1] = electionResult[11];
        matrix[7][2] = null;
        matrix[7][3] = null;
        matrix[7][4] = electionResult[43];
        matrix[7][5] = null;
        matrix[7][6] = null;
        matrix[7][7] = null;
        matrix[7][8] = null;
        matrix[7][9] = electionResult[9];
        matrix[7][10] = null;
        matrix[7][11] = null;
    }

    d3.select("#tiles")
        .select("svg")
        .call(tip);

    d3.select("#tiles")
        .select("svg")
        .selectAll("rect")
        .data(electionResult)
        .enter()
        .append("rect")
        .attr("x", function(d){
            var colVal = 0;
            for (var row = 0; row < matrix.length; row++) {
                if (matrix[row].indexOf(d) !== -1) {
                    colVal = matrix[row].indexOf(d);
                    break;
                }
            }
            return self.svgWidth / 12 * colVal;
        })
        .attr("y", function(d){
            var rowVal = 0;
            for (var row = 0; row < matrix.length; row++) {
                if (matrix[row].indexOf(d) !== -1) {
                    rowVal = row;
                    break;
                }
            }
            return self.svgHeight / 8 * rowVal;
        })
        .attr("fill", function(d){
            if(independents.indexOf(d) !== -1){
                return "green";
            }
            return colorScale(d.R_Percentage-d.D_Percentage);
        })
        .attr("class", "tile")
        .attr("height", function(){
            return self.svgHeight/8;
        })
        .attr("width", function(){
            return self.svgWidth/12;
        })
        .on("mouseover", function(d){
            tip.show(d);
        })
        .on("mouseout", function(d){
            tip.hide(d);
        });

    d3.select("#tiles")
        .select("svg")
        .selectAll("text")
        .data(electionResult)
        .enter()
        .append("text")
        .attr("class", function(d){
            if(d.R_Percentage > d.D_Percentage){
                return "tilestext";
            }
            if(d.R_Percentage < d.D_Percentage){
                return "tilestext";
            }
        })
        .attr("x", function(d){
            var colVal = 0;
            for(var row = 0; row < matrix.length; row++){
                if(matrix[row].indexOf(d) !== -1){
                    colVal = matrix[row].indexOf(d);
                    break;
                }
            }
            return self.svgWidth/12*colVal+5;
        })
        .attr("y", function(d){
            var rowVal = 0;
            for(var row = 0; row < matrix.length; row++){
                if(matrix[row].indexOf(d) !== -1){
                    rowVal = row;
                    break;
                }
            }
            return self.svgHeight/8*rowVal+20;
        })
        .text(function(d){
            return ""+d.Abbreviation+": "+d.Total_EV;
        });

};
