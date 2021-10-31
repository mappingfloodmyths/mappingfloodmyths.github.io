/* CONSTANTS AND GLOBALS */
let width = (+d3.select('#map-container').style('width').slice(0, -2)),
  height = (+d3.select('#map-container').style('height').slice(0, -2)),
  margin= 0,
  projection, pathGen, mapsvg, countries, colorScale, tooltip;

let scale=0.9;

var defs, filter;

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
  d3.csv("../data/flood_myths_site_data_cleaned.csv", d3.autoType),
]).then(([geojson, floodloc]) => {
  state.geodata = geojson;
  state.floodData = floodloc;
  // console.log(geojson.features)
  init();
});

d3.select(window).on('resize', mapresize);

function init() {
  colorScale = d3.scaleOrdinal()
    .domain(["Africa", "Americas", "Oceania", "Asia", "Europe"])
    .range(['#b07f14', '#83B799', '#086781', '#434167', '#327361'])
  colorScaleDark = d3.scaleOrdinal()
    .domain(["Africa", "Americas", "Oceania", "Asia", "Europe"])
    .range(['#7b590e', '#518b69', '#06485a', '#2f2d48', '#235144'])
  tooltip = d3.select("#tooltip")
  draw();
}

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

  // create dropshadow for map (source: https://stackoverflow.com/questions/12277776/how-to-add-drop-shadow-to-d3-js-pie-or-donut-chart)
  defs = mapsvg.append("defs");

  filter = defs.append("filter")
      .attr("id", "dropshadow")

  filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 6)
      .attr("result", "blur");
  filter.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 3)
      .attr("dy", 3)
      .attr("result", "offsetBlur");

  feMerge = filter.append("feMerge");

  feMerge.append("feMergeNode")
      .attr("in", "offsetBlur")
  feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");

  // mapborder
  mapsvg.append("path")
    .attr("class", "mapborder")
    .datum({type: "Sphere"})
    .attr("d", pathGen)
    .attr("fill", "#A1BCB6")
    .attr("stroke", "#E2C497")
    .attr("filter", "url(#dropshadow)")    

  // countries shapes
  countries = mapsvg.selectAll(".countries")
    .data(state.geodata.features, d => d.properties.postal)
    .enter().append("path")
      .attr("class", "countries")
      .attr("d", pathGen)
      .attr("fill", "#AF9069")
      .attr("stroke", "#767676")
      .attr("id", d => d.properties.region_un)

  mapsvg.on("mousemove", (ev, d) => {
    if (ev.target.className.baseVal === "floodloc" || (ev.target.className.baseVal === "countries" && ev.target.id === state.hover_country))
      {
        hover()
      }
    else if (ev.target.className.baseVal === "floodloc" || (ev.target.className.baseVal === "countries" && ev.target.id != state.hover_country)) {
      countries
          .attr("fill", "#AF9069")
          .attr("stroke", "#767676")
          .attr("stroke-width", 1)
      state.hover_country = ev.target.id
      hover()
    }
    else 
      {
        countries
          .attr("fill", "#AF9069")
          .attr("stroke", "#767676")
          .attr("stroke-width", 1)
      }
  })

  // APPEND DATA AS SHAPE
  floodpins = mapsvg.selectAll("circle.floodloc")
    .data(state.floodData)
    .join("circle")
    .attr("class", "floodloc")
    .attr("r", 4)
    // .attr("fill", "red")
    // .style("background-image", "radial-gradient(white, red)")
    .attr("filter", "url(#dropshadow)")
    // .attr("stroke", "red")
    .attr("transform", d => {
      const [x,y] = projection([d.Lon, d.Lat])
      return `translate(${x}, ${y})`
    })
    .attr("id", d =>{
      return d.Land
    })
  
  // Pin Colors (source: https://www.w3schools.com/graphics/svg_grad_radial.asp)
  flooddef=mapsvg.append("defs")
    .append("radialGradient")
      .attr("id", "spheregradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%")
      .attr("fx", "35%")
      .attr("fy", "25%")
        
  flooddef.append("stop")
    .attr("offset", "20%")
    .style("stop-color", "red")
    .style("stop-opacity", "1")

  flooddef.append("stop")
    .attr("offset", "100%")
    .style("stop-color", "#1d1d1d")
    .style("stop-opacity", "1")
    
  floodpins.attr("fill", "url(#spheregradient")

  var mapSVGsize = d3.select(".mapsvg").node().getBoundingClientRect()
  var gSize = d3.select("g").node().getBoundingClientRect()

  var x = (mapSVGsize.width/2)-((gSize.width*scale)/2)+(-gSize.x);
  var y = 0;

  d3.select("g")
    .attr("transform", "matrix("+ scale +",0,0,"+ scale +"," + x + "," + y + ")");
}

function mapresize() {
  width = +d3.select('#map-container').style('width').slice(0, -2)-margin;
  height = +d3.select('#map-container').style('height').slice(0, -2)-margin;
  d3.select(".mapsvg").remove()
  draw();
}

function hover() {
  d3.selectAll(`#${state.hover_country}.countries`)
      .attr("fill", colorScale(state.hover_country))
      .attr("stroke", colorScaleDark(state.hover_country))
      .attr("stroke-width", 2)
}