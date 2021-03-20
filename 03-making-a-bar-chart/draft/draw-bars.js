async function drawBars() {
  const data = await d3.json('../../my_weather_data.json');

  const xAccessor = (d) => d.humidity;
  const yAccessor = (d) => d.length;

  const width = 600;

  let dimensions = {
    width,
    height: width * 0.6,
    margin: {
      top: 30,
      right: 10,
      bottom: 50,
      left: 50,
    },
  };

  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;

  const wrapper = d3
    .select('#wrapper')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height)
    .style('border', '1px solid');

  const bounds = wrapper
    .append('g')
    .style(
      'transform',
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();

  const binGenerator = d3
    .histogram()
    .domain(xScale.domain())
    .value(xAccessor)
    .thresholds(12);

  const bins = binGenerator(data);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bins, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice();

  const binsGroup = bounds.append('g');
  const binGroups = binsGroup.selectAll('g').data(bins).join('g');

  const barPadding = 1;
  const barRects = binGroups
    .append('rect')
    .attr('x', (d) => xScale(d.x0) + barPadding / 2)
    .attr('y', (d) => yScale(yAccessor(d)))
    .attr('width', (d) =>
      d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding])
    )
    .attr('height', (d) => dimensions.boundedHeight - yScale(yAccessor(d)))
    .attr('fill', 'cornflowerblue');

  const barText = binGroups
    .filter(yAccessor)
    .append('text')
    .text(yAccessor)
    .attr('x', (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
    .attr('y', (d) => yScale(yAccessor(d) + 1))
    .style('text-anchor', 'middle')
    .style('fill', '#667')
    .style('font-size', '12px')
    .style('font-family', 'sans-serif');

  const mean = d3.mean(data, xAccessor);
  const meanLine = bounds
    .append('line')
    .attr('x1', xScale(mean))
    .attr('x2', xScale(mean))
    .attr('y1', -15)
    .attr('y2', dimensions.boundedHeight)
    .attr('stroke', 'maroon')
    .style('stroke-dasharray', '2px 4px');

  const meanLabel = bounds
    .append('text')
    .attr('x', xScale(mean))
    .attr('y', -20)
    .text('mean')
    .style('text-anchor', 'middle')
    .style('font-family', 'sans-serif')
    .style('fill', 'maroon')
    .style('font-size', '12px');

  const xAxisGenerator = d3.axisBottom().scale(xScale);

  const xAxis = bounds
    .append('g')
    .call(xAxisGenerator)
    .style('transform', `translateY(${dimensions.boundedHeight}px)`);

  const xAxisLabel = xAxis
    .append('text')
    .attr('x', dimensions.boundedWidth / 2)
    .attr('y', dimensions.margin.bottom - 10)
    .attr('fill', 'black')
    .style('font-size', '1.4em')
    .text('Humidity')
    .style('text-transform', 'capitalize');
}
drawBars();
