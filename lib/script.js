// Wave Menu up/down
const svg = d3.select("#menu")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("version", "1.1")
  .attr("xmlns", "http://www.w3.org/2000/svg")
svg.append("defs")
svg.append("path")
  .attr("id", "myID")
  .attr("d", myWave)

var myWave = $('#myID').wavify({
  height: 60,
  bones: 3,
  amplitude: 40,
  color: '#2158A8',
  speed: .25
});

function menubtnclick() {
  const t = d3.transition()
    // .delay(1000)
    .duration(4000)

  const menudiv = d3.select("#menu").transition(t)
    .style("height", "100%")

  d3.select("header").transition(t)
    .style("opacity", ".5")
  d3.select(".container").transition(t)
    .style("opacity", ".5")
  d3.select("footer").transition(t)
    .style("opacity", ".5")
  
  d3.select(".menu").transition().style("height", "75%").duration(4000).delay(500)
}

function backbtnclick() {

  const t = d3.transition()
    // .delay(1000)
    .duration(4000)
    .delay(500)

  const menudiv = d3.select("#menu").transition(t)
    .style("height", "0%")

  d3.select("header").transition(t)
    .style("opacity", null)
  d3.select(".container").transition(t)
    .style("opacity", null)
  d3.select("footer").transition(t)
    .style("opacity", null)

  d3.select(".menu").transition().style("height", "0%").duration(4000)

}


// Text on menu
const pagetext = {
  about: "about text",
  howtouse: "how to use text",
  data: "data text",
  sources: "sources text",
  contact: "contact text"
}

var currentpage = "about"
d3.select(`#${currentpage}`)
  .style("color", "#1C2833")
activetext(currentpage);

// console.log(currentpage)

function activelink(id) {
  console.log(id);

  if (id != currentpage) {
    d3.select(`#${currentpage}`)
      .style("color", "white")
    currentpage = id
    d3.select(`#${id}`)
      .style("color", "#1C2833")
  }
  activetext(currentpage);
}

function activetext(currentpage){
  // console.log(pagetext[currentpage])
  $("#activetxt").load(`/../pages/${currentpage}.html`)
}

