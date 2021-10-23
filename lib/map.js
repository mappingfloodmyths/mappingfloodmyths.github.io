/* CONSTANTS AND GLOBALS */
const width = +d3.select('#map-container').style('width').slice(0, -2),
  height = +d3.select('#map-container').style('height').slice(0, -2),
  margin= 10;

// const width = Element.innerWidth *.9,
//   height = Element.innerHeight*.9,
//   margin=10;

  // margin = { top: 20, bottom: 20, left:10, right: 10 };

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("../lib/custom.geo.json"),
  d3.csv("../data/flood_myths_site_data.csv", d3.autoType),
]).then(([geojson, floodloc]) => {
  // console.log(geojson, floodloc)
  
  // SPECIFY PROJECTION
  const projection = d3.geoEckert4()
    .fitSize([
      width-margin,
      height-margin
    ], geojson)
    // .scale(250)
  console.log(projection.scale())

  // const projection = d3.geoEckert4()
  //   .rotate(-75)
  //   .fitExtent([
  //     [0,0],
  //     [width,height]
  //   ], geojson)

  // DEFINE PATH FUNCTION
    const pathGen = d3.geoPath().projection(projection)
    // console.log('path :>>', pathGen);

  // APPEND GEOJSON PATH  
  const svg = d3.select("#map-container").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("display", "block")
  
  // svg.append("rect")
  //   .attr("width", width)
  //   .attr("height", height)
    // .attr("fill", "black")

  // svg.append('svg:image')
  //   .attr('xlink:href', 'https://imgc.allpostersimages.com/img/posters/vintage-map_u-L-F7V1S30.jpg')
  //   .attr("width", width)
  //   .attr("height", height)
  //   .style("object-fit", "fill")

  // svg.append('defs')
  //   .append('pattern')
  //     .attr('id', 'pic1')
  //     .attr('patternUnits', 'userSpaceOnUse')
  //     .attr('width', width)
  //     .attr('height', height)
  //   .append('svg:image')
  //     .attr('xlink:href', 'https://imgc.allpostersimages.com/img/posters/vintage-map_u-L-F7V1S30.jpg')
  //     .attr("width", width)
  //     .attr("height", height)
  //     .attr("x", 0)
  //     .attr("y", 0)

  svg.append("path")
    .datum({type: "Sphere"})
    .attr("d", pathGen)
    .attr("fill", "#A1BCB6")
    .attr("stroke", "darkgrey")

  const countries = svg.selectAll("path.countries")
    .data(geojson.features, d => d.properties.postal)
    .join("path")
    .attr("class", "countries")
    .attr("d", d => pathGen(d))
    .attr("fill", "#B38454")
    .attr("stroke", "grey")

  // APPEND DATA AS SHAPE
  svg.selectAll("circle.floodloc")
  .data(floodloc)
  .join("circle")
  .attr("class", "floodloc")
  .attr("r", 3)
  .attr("fill", "blue")
  .attr("transform", d => {
    const [x,y] = projection([d.Lon, d.Lat])
    return `translate(${x}, ${y})`
  })
    // .append("svg:title")
    // .text(d => d.FMcountry)

});