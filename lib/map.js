/* CONSTANTS AND GLOBALS */
let width = (+d3.select('#map-container').style('width').slice(0, -2)),
  height = (+d3.select('#map-container').style('height').slice(0, -2)),
  margin= 0,
  projection, pathGen, mapsvg, countries;

// const width = Element.innerWidth *.9,
//   height = Element.innerHeight*.9,
//   margin=10;

  // margin = { top: 20, bottom: 20, left:10, right: 10 };

let state = {
  geodata: [],
  floodData: []
};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("../lib/custom.geo.json"),
  d3.csv("../data/flood_myths_site_data.csv", d3.autoType),
]).then(([geojson, floodloc]) => {
  state.geodata = geojson;
  state.floodData = floodloc;
  draw();
});

d3.select(window).on('resize', mapresize);

function draw() {
  // SPECIFY PROJECTION
  projection = d3.geoEckert4()
    .fitSize([
      width-margin,
      height-margin
    ], state.geodata)

  pathGen = d3.geoPath().projection(projection)

  // APPEND GEOJSON PATH  
  mapsvg = d3.select("#map-container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "mapsvg")
      .append("g")

  mapsvg.append("path")
    .attr("class", "mapborder")
    .datum({type: "Sphere"})
    .attr("d", pathGen)
    .attr("fill", "#A1BCB6")
    .attr("stroke", "darkgrey")

  countries = mapsvg.selectAll(".countries")
    .data(state.geodata.features, d => d.properties.postal)
    .enter().append("path")
      .attr("class", "countries")
      .attr("d", pathGen)
      .attr("fill", "#B38454")
      .attr("stroke", "grey");

  // APPEND DATA AS SHAPE
  mapsvg.selectAll("circle.floodloc")
  .data(state.floodData)
  .join("circle")
  .attr("class", "floodloc")
  .attr("r", 3)
  .attr("fill", "blue")
  .attr("transform", d => {
    const [x,y] = projection([d.Lon, d.Lat])
    return `translate(${x}, ${y})`
  })

  var mapSVGsize = d3.select(".mapsvg").node().getBoundingClientRect()
  var gSize = d3.select("g").node().getBoundingClientRect()

  var x = (mapSVGsize.x - gSize.x) + (mapSVGsize.width-gSize.width);
  var y = (mapSVGsize.y - gSize.y) + (mapSVGsize.height-gSize.height);

  y=0
  x=0
  // (mapSVGsize.top-gSize.top)
  // x=mapSVGsize.left-gSize.left
  console.log(mapSVGsize)
  console.log(gSize)
  console.log(mapSVGsize.width, $('.mapborder')[0].getBoundingClientRect().width)

  d3.select("g")
    .attr("transform", "matrix(0.9,0,0,.9," + x + "," + y + ")");
}

function mapresize() {
  width = +d3.select('#map-container').style('width').slice(0, -2)-margin;
  height = +d3.select('#map-container').style('height').slice(0, -2)-margin;
  d3.select(".mapsvg").remove()
  draw();
}