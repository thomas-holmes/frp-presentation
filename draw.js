$(function() {
  var canvas = document.getElementById('draw');
  var ctx = canvas.getContext('2d');

  function toPoint(v) {
    return { x: v.offsetX, y: v.offsetY };
  }

  function toCoords(p) {
    return '(' + p.x + ',' + p.y + ')';
  }

  var color = $('#color').asEventStream('input').map(function(v) {
    return v.target.value;
  }).toProperty('#000000');

  function drawLine(template) {
    var points = template.points
    var p1 = points[0];
    var p2 = points[1];
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = template.color;
    ctx.stroke();
  }

  var canvasMovement = $(canvas).asEventStream('mousemove');
  var points = canvasMovement.map(toPoint);

  var mouseDown = $(canvas).asEventStream('mousedown');
  var mouseUp = $(document).asEventStream('mouseup');

  points.map(toCoords).assign($('#coordinates'), 'text');
  color.assign($('#colorSpan'), 'text');

  var movement = mouseDown.flatMap(function() {
    return points.slidingWindow(2,2).takeUntil(mouseUp);
  });

  var drawMe = Bacon.combineTemplate({
    points: movement,
    color: color
  }).skipDuplicates(function(oldValue, newValue) {
    return oldValue.points[0] === newValue.points[0] &&
           newVlaue.points[1] === newValue.points[1];
  });

  drawMe.onValue(drawLine);
});
