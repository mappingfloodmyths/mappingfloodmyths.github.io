// Wave Menu up/down
const wavesvg = d3.select("#menu")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("version", "1.1")
  .attr("xmlns", "http://www.w3.org/2000/svg")
wavesvg.append("defs")
wavesvg.append("path")
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

  const menudiv = d3.select(".menu-box").transition(t)
    .style("height", "100%")

  d3.select("header").transition(t)
    .style("opacity", ".5")
  d3.select(".container").transition(t)
    .style("opacity", ".5")
  d3.select("footer").transition(t)
    .style("opacity", ".5")
  d3.select("#popup").transition(t)
    .style("opacity", null)
  
  d3.select(".menu").transition().style("height", "75%").duration(4000).delay(500)
  d3.select(".activetxt").transition().style("display", "block").style("opacity", "1").style("height", "94.4%").duration(4000).delay(650)
}

function backbtnclick() {
  const t = d3.transition()
    .duration(4000)
    .delay(500)

  const menudiv = d3.select(".menu-box").transition(t)
    .style("height", "0%")

  d3.select("header").transition(t)
    .style("opacity", null)
  d3.select(".container").transition(t)
    .style("opacity", null)
  d3.select("footer").transition(t)
    .style("opacity", null)

  d3.select(".menu").transition().style("height", "0%").duration(4000)
  d3.select(".activetxt").transition().style("opacity", "0").style("height", "0%").duration(4000)
  d3.select(".activetxt").transition().style("display", "none").delay(3800)
}

// Text on menu
var currentpage = "about"
d3.select(`#${currentpage}`)
  .style("color", "#1C2833")
activetext(currentpage);

function activelink(id) {
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
  $("#activetxt").load(`/../pages/${currentpage}.html`);
}