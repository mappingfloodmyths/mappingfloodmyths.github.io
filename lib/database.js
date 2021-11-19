/* CONSTANTS AND GLOBALS */


/* LOAD DATA INTO TABLE*/
d3.csv("../Data/flood_myths_site_data_cleaned.csv", d => {
    return {
        region: d.Land,
        subregion: d.Area,
        storyorigin: d.country,
        story: d.story_info_cleaned,
        ref: d.ref
    }
}).then(data => {
    console.log(data)

    data.sort((a,b) => d3.ascending(a.storyorigin, b.storyorigin))

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