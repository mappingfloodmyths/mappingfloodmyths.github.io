/* CONSTANTS AND GLOBALS */
let width = (+d3.select('#map-container').style('width').slice(0, -2)),
  height = (+d3.select('#map-container').style('height').slice(0, -2)),
  margin= 0,
  projection, pathGen, mapsvg, countries, colorScale, tooltip;

let scale=.97, regionNameGroup = {}, filteredPopData, groupedArea, groupedCountry, groupedRegion, currHoverpopList, countryLink;

var defs, filter;

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
  d3.csv("../Data/flood_myths_site_data_cleaned.csv", d3.autoType),
]).then(([geojson, floodloc]) => {
  state.geodata = geojson;
  state.floodData = floodloc;
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

  // APPEND DATA AS SHAPE
  floodpins = mapsvg.selectAll("circle.floodloc")
    .data(state.floodData)
    .join("circle")
    .attr("class", "floodloc")
    .attr("r", 4)
    // .attr("filter", "url(#dropshadow)")
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

  // centering map
  var mapSVGsize = d3.select(".mapsvg").node().getBoundingClientRect()
  var gSize = d3.select("g").node().getBoundingClientRect()

  var x = (mapSVGsize.width/2)-((gSize.width*scale)/2)+(-gSize.x);
  var y = 0;

  d3.select("g")
    .attr("transform", "matrix("+ scale +",0,0,"+ scale +"," + x + "," + y + ")");
  
    // hover over regions
    mapsvg.on("mousemove", (ev, d) => {
      state.mousex = ev.clientX;
      state.mousey = ev.clientY;
      if (ev.target.className.baseVal === "floodloc" || (ev.target.className.baseVal === "countries" && ev.target.id === state.hover_country))
        {
          tooltip.style("display", "none")
          state.hoverid = ev.target.className.baseVal
          hover()
        }
      else if (ev.target.className.baseVal === "floodloc" || (ev.target.className.baseVal === "countries" && ev.target.id != state.hover_country)) {
        countries
            .attr("fill", "#AF9069")
            .attr("stroke", "#767676")
            .attr("stroke-width", 1)
        tooltip.style("display", "none")
        state.hover_country = ev.target.id
        state.hoverid = ev.target.className.baseVal
        hover()
      }
      else 
      {
        countries
          .attr("fill", "#AF9069")
          .attr("stroke", "#767676")
          .attr("stroke-width", 1)
        tooltip.style("display", "none")
        state.hoverid = ev.target.className.baseVal
      }
    })

    // hover over pin
    floodpins.on("mousemove", (ev, d) => {
      if (ev.target.className.baseVal === "floodloc") {
        state.floodData.countryName = d.Country
        state.floodData.originName = d.country
        state.floodData.regionName = d.Region
        state.floodData.story = d['story_info_cleaned']
        state.hover_country = ev.target.id
        state.hoverid = ev.target.className.baseVal
        state.floodData.continentName = d.Area
      }
      else {
        tooltip.style("display", "none")
        state.hoverid = ev.target.className.baseVal
      }
      hover();
    })

    // click on pin
    floodpins.on("click", (ev,d) => {
      if(d.Country === null){
        poplistonClick(d.Region, "pin")
      }
      else{
        poplistonClick(d.Country, "pin")
      }
    })

    // click on area/region
    countries.on("click", function () {
      countryclicked()
    })
}

// map resize on screen change
function mapresize() {
  width = +d3.select('#map-container').style('width').slice(0, -2)-margin;
  height = +d3.select('#map-container').style('height').slice(0, -2)-margin;
  d3.select(".mapsvg").remove()
  draw();
}

// Hover on area/region
function hover() {
  d3.selectAll(`#${state.hover_country}.countries`)
      .attr("fill", colorScale(state.hover_country))
      .attr("stroke", colorScaleDark(state.hover_country))
      .attr("stroke-width", 2)

  if (state.hoverid === "floodloc") {
    tooltip
      .style("display", "block")
      .style("top", (state.mousey-15) + "px")
      .style("left", (state.mousex+15) + "px")

      if (state.floodData.countryName === null || state.floodData.countryName === "United States") {
        tooltip.html(
          `<p>${state.floodData.regionName}</p>`
        )
      }
      else if(state.floodData.regionName != null) {
        tooltip.html(
          `<p>${state.floodData.regionName}, ${state.floodData.countryName}</p>`
        )
      }
      else{
        tooltip.html(
          `<p>${state.floodData.countryName}</p>`
        )
      }
    }
  else{
  }

}

// create popup
function showPopup(){
  const t = d3.transition()
  .duration(100)

  const popupdiv = d3.select(".popup-box").transition(t)
    .style("opacity", "1")
    .style("display", "block")

  d3.select(".container").transition(t)
    .style("opacity", ".5")
    .style("pointer-events", "none")
}

// Map area/region clicked popup list
function countryclicked() {
  pageName = "area"
  currPage = state.hover_country
  filteredPopData = state.floodData.filter(d => d.Land === state.hover_country)

  groupedArea = d3.group(filteredPopData, d=>d.Area)
  groupedCountry = d3.rollup(filteredPopData, v => v.length, d=>d.Country)
  groupedRegion = d3.rollup(filteredPopData, v => v.length, d=>d.Region)

  showPopup();

  d3.select(".popup-header")
    .html(state.hover_country)
    
  // d3.select(".popup-text").append("div")
  //   .attr("class", "popup-body")
  
  filteredPopData.forEach(function (d) {
    if (d.Country === null) {
      return (regionNameGroup[d.Region] = d.Area)
    }
    else {
      return (regionNameGroup[d.Country] = d.Area)
    }
  })

  countryLink = d3.select(".popup-text")
    
    countryLink.each(function(d){
      const divlist = d3.select(this)
        .selectAll(".popup-list")
        .data(groupedArea)
        .join("div")
        .attr("class", "popup-list")

      const regionh2 = divlist.append("h2")
        .attr("class", "regionName")
        .text(d => d[0])

      divlist.each(function(d) {
        regions = Object.keys(regionNameGroup).filter(key => regionNameGroup[key]===d[0])

        d3.select(this)
          .selectAll(".countryName")
          .data(regions)
          .join("p")
          .attr("class", "countryName")
          .attr("id", d=> cleanword(d))
          .text(function(d){
            if (groupedCountry.get(d) === undefined) {
              floodnum = groupedRegion.get(d)
            }
            else {
              floodnum = groupedCountry.get(d)
            }
            return d + " (Flood Myths: " + floodnum +")"
          })
      })
    })

    d3.selectAll(".countryName").on("mousemove", (ev, d) => {
      if (ev.target.id === currHoverpopList) {
        poplisthover(ev,d);
      }
      else {        
        d3.select(`#${currHoverpopList}`)
          .style("color", "black")
          .style("font-weight", "normal")
        currHoverpopList = ev.target.id
      }
    })

    d3.selectAll(".countryName").on("click", (ev, d) => {
      poplistonClick(d, "area");
    })

    d3.select(".left-btn a").on("click", (ev,d) => {
      popupback(prevPage, pageName);
    })

}

// remove spaces and other non-letter characters
function cleanword(d) {
  cleaned = ((((d.split(" ").join("_")).split(",").join("_")).split("(").join("_")).split(")").join("_")).split("&").join("_")
  return cleaned
}

// Popup closed
function popup_close() {
  d3.selectAll(".popup-text").html(null);
  d3.selectAll(".popup-header").html(null)
    .style("margin-left", "10px");
  d3.select(".left-btn a")
    .style("display", "none")

  const t = d3.transition()
    .duration(100)

  d3.select(".popup-box").transition(t)
    .style("opacity", null)
    .style("display", "none")

  d3.select(".container").transition(t)
    .style("opacity", null)
    .style("pointer-events", null)
}

// Hover on country/region names
function poplisthover(ev,d) {
  d3.select(`#${ev.target.id}`)
    .style("color", "#014456")
    .style("font-weight", "bold")
    .style("cursor", "pointer")
}

// Country/Region Clicked
function poplistonClick(data, item) {
  d3.selectAll(".popup-text").html(null);
  showPopup();

  pageName = "region"

  if(item === "area"){
    prevPage = currPage
    currPage = data
    d3.select(".left-btn a")
      .style("display", "block")
    d3.select(".popup-header")
      .style("margin-left", "22px")
  }
  else{
    currPage = data
  }

  filteredOrigins = state.floodData.filter(d => (d.Country === data) || (data === d.Region))

  filteredOriginsRoll = d3.rollup(filteredOrigins, v => v.length, d=>d.country)

  d3.select(".popup-header")
    .html(data)

    const divlist = d3.select(".popup-text")
    
    divlist.each(function (d) {
      d3.select(this)
        .selectAll(".originName")
        .data(filteredOriginsRoll)
        .join("p")
        .attr("class", "originName")
        .attr("id", d => cleanword(d[0]))
        .text(d => (d[0] + " (Flood Myths: " + d[1]+")"))
    })
    
  d3.selectAll(".originName").on("mousemove", (ev, d) => {
    if (ev.target.id === currHoverpopList) {
      poplisthover(ev,d);
    }
    else {        
      d3.select(`#${currHoverpopList}`)
        .style("color", "black")
        .style("font-weight", "normal")
      currHoverpopList = ev.target.id
    }
  })

  d3.selectAll(".originName").on("click", (ev, d) => {
    originClick(d[0], item);
  })
}

// Origin Story Clicked
function originClick(data, item){
  d3.selectAll(".popup-text").html(null);

  pageName = "origin"

  if(item === "pin"){
    prevPage = currPage
    currPage = data
    d3.select(".left-btn a")
      .style("display", "block")
    d3.select(".popup-header")
      .style("margin-left", "22px")
  }
  else{
    prevPage = currPage
    currPage = data
  }
  filteredStories = state.floodData.filter(d => d.country === data)

  d3.select(".popup-header")
    .html(data)
    
  const divlist = d3.select(".popup-text")

  divlist.each(function(d){
    story = d3.select(this)
      .selectAll(".originStory")
      .data(filteredStories)
      .join("p")
      .attr("class", "originStory")
      .text(d => d.story_info_cleaned)
  })

  story.each(function(d){
    d3.select(this)
      .append("br")
  })

  story.each(function(d){
    d3.select(this)
      .append("cite")
      .text(function(d){
        return "Source: " + d.ref
      })
  })

  story.each(function(d){
    d3.select(this)
      .append("hr")
  })

}

// back nav on popup
function popupback(data, currPage){
  if (currPage === "region") {
    d3.selectAll(".popup-text").html(null);
    d3.selectAll(".popup-header").html(null)
      .style("margin-left", "10px");
    d3.select(".left-btn a")
      .style("display", "none")
    countryclicked();
  }
  else{
    d3.selectAll(".popup-text").html(null);
    d3.selectAll(".popup-header").html(null);
    poplistonClick(data, "other")
  }
}