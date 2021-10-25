/* CONSTANTS AND GLOBALS */


/* LOAD DATA */
d3.csv("../data/flood_myths_site_data_cleaned.csv", d => {
    return {
        storyorigin: d.region,
        region: d.country,
        story: d.story_info_cleaned,
        ref: d.ref,
        // expandedstory: d.story_info_w_par_breaks
    }
}).then(data => {
    console.log(data)

    const table = d3.select("#data-container")
        .selectAll("table")

    const rows = table
        .selectAll(".row")
        .data(data)
        .join("tr")
        .attr("class", "row")

    const cells = rows
        .selectAll(".cell")
        .data(d => Object.values(d))
        .join("td")
        .text(d => d)

});