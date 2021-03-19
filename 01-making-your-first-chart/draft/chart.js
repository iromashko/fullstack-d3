/// <reference types="d3" />

async function drawLineChart() {
  const data = await d3.json('../../my_weather_data.json');

  const yAccessor = (d) => d['temperatureMax'];
  const parseDate = d3.timeParse('%Y-%m-%d');
  const xAccessor = (d) => parseDate(d['date']);

  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margins: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
    },
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margins.left - dimensions.margins.right;

  dimensions.boundedHeight =
    dimensions.height - dimensions.margins.top - dimensions.margins.bottom;

  const wrapper = d3
    .select('#wrapper')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height);
    
  console.log(svg);
}

drawLineChart();
