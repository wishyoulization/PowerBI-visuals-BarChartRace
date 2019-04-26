
import * as d3 from "d3";
import "d3-selection-multi";
import './styles/main.scss';

var intervalKeeper;
var top_n, tickDuration, brandData, width, height, yearSlice, autoPlay, fontFamily, fontSize, hideGrid, hideNumbers, hidePeriod,periodSize;
var svg, barPadding, yearSlice, x, y, xAxis, yearText;
var initialFlag = false;
const margin = {
  top: 30, right: 8, bottom: 5, left: 10
};


function initialSetup() {
  if (initialFlag) {
    return
  }
  initialFlag = true;

  svg = d3.select('svg').classed('noselect', true);

  x = d3.scaleLinear()
    .domain([0, 1])
    .range([margin.left, width - margin.right - 65]);

  xAxis = d3.axisTop()
    .scale(x)
    .ticks(width > 500 ? 5 : 2)
    .tickSize(-(height - margin.top - margin.bottom))
    .tickFormat(d => d3.format(',')(d));

  svg.append('g')
    .attrs({
      class: 'axis xAxis',
      transform: `translate(0, ${margin.top})`
    })
    .call(xAxis)
    .selectAll('.tick line')
    .classed('origin', d => d == 0);

  yearText = svg.append('text')
    .attrs({
      class: 'yearText',
      x: width - margin.right,
      y: height - 25
    })
    .styles({
      'text-anchor': 'end'
    })
    .call(halo, 10)
}


function updateChart() {
  yearSlice = brandData
    .sort((a, b) => b.value - a.value)
    .slice(0, top_n);

  yearSlice.forEach((d, i) => d.rank = i);

  svg.attr("width", width).attr("height", height)
  barPadding = (height - (margin.bottom + margin.top)) / (top_n * 5);

  x = d3.scaleLinear()
    .domain([0, d3.max(yearSlice, d => d.value)])
    .range([margin.left, width - margin.right - 65]);
  y = d3.scaleLinear()
    .domain([top_n, 0])
    .range([height - margin.bottom, margin.top]);

  xAxis = d3.axisTop()
    .scale(x)
    .ticks(width > 500 ? 5 : 2)
    .tickSize(-(height - margin.top - margin.bottom))
    .tickFormat(d => d3.format(',')(d));




  svg.select('.xAxis')
    .styles({
      display: hideGrid ? "none" : "block"
    })
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .call(xAxis);

  let bars = svg.selectAll('.bar').data(yearSlice, d => d.name);

  bars
    .enter()
    .append('rect')
    .attrs({
      class: d => `bar ${d.name.replace(/\s/g, '_')}`,
      x: x(0) + 1,
      width: d => x(d.value) - x(0) - 1,
      y: d => y(top_n + 1) + 5,
      height: y(1) - y(0) - barPadding
    })
    .styles({
      fill: d => d.colour
    })
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attrs({
      y: d => y(d.rank) + 5
    });

  bars
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attrs({
      width: d => x(d.value) - x(0) - 1,
      y: d => y(d.rank) + 5,
      height: y(1) - y(0) - barPadding
    });

  bars
    .exit()
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attrs({
      width: d => x(d.value) - x(0) - 1,
      y: d => y(top_n + 1) + 5
    })
    .remove();

  let labels = svg.selectAll('.label').data(yearSlice, d => d.name);

  labels
    .enter()
    .append('text')
    .attrs({
      class: 'label',
      x: d => x(d.value) - 8,
      y: d => y(top_n + 1) + 5 + ((y(1) - y(0)) / 2),
      'text-anchor': 'end',
    })
    .styles({
      "font-family": fontFamily,
      "font-size": fontSize
    })
    .html(d => d.name)
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attrs({
      y: d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1,
    });

  labels
    .styles({
      "font-family": fontFamily,
      "font-size": fontSize
    })
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attrs({
      x: d => x(d.value) - 8,
      y: d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1
    })

  labels
    .exit()
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attrs({
      x: d => x(d.value) - 8,
      y: d => y(top_n + 1) + 5
    })
    .remove();

  let valueLabels = svg.selectAll('.valueLabel').data(yearSlice, d => d.name);

  valueLabels
    .enter()
    .append('text')
    .attrs({
      class: 'valueLabel',
      x: d => x(d.value) + 5,
      y: d => y(top_n + 1) + 5,
    })
    .styles({
      "font-family": fontFamily,
      "font-size": fontSize - 2,
      display: hideNumbers ? "none" : "block"
    })
    .text("0")//d => d3.format(',.0f')(d.lastValue))
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attrs({
      y: d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1
    })
    .tween("text", valueLabelTextGen);

  valueLabels
    .styles({
      "font-family": fontFamily,
      "font-size": fontSize - 2,
      display: hideNumbers ? "none" : "block"
    })
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attrs({
      x: d => x(d.value) + 5,
      y: d => y(d.rank) + 5 + ((y(1) - y(0)) / 2) + 1
    })
    .tween("text", valueLabelTextGen);

  valueLabels
    .exit()
    .transition()
    .duration(tickDuration)
    .ease(d3.easeLinear)
    .attrs({
      x: d => x(d.value) + 5,
      y: d => y(top_n + 1) + 5
    })
    .remove();

  function valueLabelTextGen(d) {
    let oldValue = +d3.select(this).attr('oldValue') || 0
    let i = d3.interpolateRound(oldValue, d.value);
    d3.select(this).attr('oldValue', d.value);
    return function (t) {
      var val = i(t);
      if (val > 1000000) {
        this.textContent = d3.format(".3~s")(val);
      } else {
        this.textContent = d3.format(",")(val);
      }
    };
  }
  yearText
    .attrs({
      x: width - margin.right,
      y: height - margin.bottom
    })
    .styles({
      "font-family": fontFamily,
      "font-size": periodSize,
      display: hidePeriod ? "none" : "block"
    })
    .text(~~yearSlice[0].year)
}

function halo(text, strokeWidth) {
  text.select(function () { return this.parentNode.insertBefore(this.cloneNode(true), this); })
    .styles({
      fill: '#ffffff',
      stroke: '#ffffff',
      'stroke-width': strokeWidth,
      'stroke-linejoin': 'round',
      opacity: 1
    });
}

function updateVisual(data, config) {
  clearInterval(intervalKeeper);

  top_n = config.topN
  tickDuration = config.duration;
  width = config.width;
  height = config.height;

  autoPlay = config.autoPlay;
  fontFamily = config.fontFamily;
  fontSize = config.fontSize;
  hideGrid = config.hideGrid;
  hideNumbers = config.hideNumbers;
  hidePeriod = config.hidePeriod;
  periodSize = config.periodSize;

  var listOfYears = {}
  data.map(d => listOfYears[d.year] = true)
  listOfYears = d3.keys(listOfYears);

  if (!autoPlay) {
    brandData = data.filter(d => d.year == listOfYears[0])
    initialSetup()
    updateChart()
  } else {
    brandData = data;
    var currentIndex = 0;
    function runStep() {
      if (currentIndex < listOfYears.length) {
        brandData = data.filter(d => d.year == listOfYears[currentIndex])
        initialSetup()
        updateChart()
      }
      currentIndex++;
    }
    function resetSteps() {
      currentIndex = 0;
    }
    runStep()//first load the first period..
    intervalKeeper = setInterval(runStep, tickDuration);
    svg.on("dblclick", resetSteps)
  }
}


window.constructPage = updateVisual;