$(function() {
  var canvas = document.getElementById('draw');
  var ctx = canvas.getContext('2d');

  function toPoint(v) {
    return { x: v.offsetX, y: v.offsetY };
  }

  function toCoords(p) {
    return '(' + p.x + ',' + p.y + ')';
  }

  function drawPath(ctx, template) {
    p1 = template.points[0];
    p2 = template.points[1];
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = template.color;
    ctx.stroke();
  }

  function drawChiselTip() {
    // TODO: Implement a chisel tip brush
  }

  function draw(template) {
    template.brush(ctx, template);
  }

  var canvasMovement = $(canvas).asEventStream('mousemove');
  var points = canvasMovement.map(toPoint);

  var mouseDown = $(canvas).asEventStream('mousedown');
  var mouseUp = $(document).asEventStream('mouseup');

  points.map(toCoords).assign($('#coordinates'), 'text');

  var color = $('#color').asEventStream('input').map(function(v) {
    return v.target.value;
  }).toProperty('#000000');

  color.assign($('#colorSpan'), 'text');

  var brush = Bacon.constant(drawPath);

  var movement = mouseDown.flatMap(function() {
    return points.slidingWindow(2,2).takeUntil(mouseUp);
  });

  var drawMe = Bacon.combineTemplate({
    points: movement,
    color: color,
    brush: brush,
  }).skipDuplicates(function(oldValue, newValue) {
    return oldValue.points[0] === newValue.points[0] &&
           newVlaue.points[1] === newValue.points[1];
  });

  drawMe.onValue(draw);
});
