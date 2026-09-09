export {drawAxes}

function drawAxes(c: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, shortEdge: number, longEdge: number) {
  c.save()
  c.strokeStyle = "white";
  c.lineWidth = 1;
  c.beginPath()
  c.moveTo(canvasWidth/2, 0);
  c.lineTo(canvasWidth/2, canvasHeight);
  c.stroke();
  c.beginPath()
  c.moveTo(0, canvasHeight/2);
  c.lineTo(canvasWidth, canvasHeight/2);
  c.stroke();
  c.beginPath()
  c.moveTo(canvasWidth/2 - shortEdge/2 + shortEdge*0.05, canvasHeight/2 - longEdge*0.01);
  c.lineTo(canvasWidth/2 - shortEdge/2 + shortEdge*0.05, canvasHeight/2 + longEdge*0.01);
  c.stroke();
  c.beginPath()
  c.moveTo(canvasWidth/2 + shortEdge/2 - shortEdge*0.05, canvasHeight/2 - longEdge*0.01);
  c.lineTo(canvasWidth/2 + shortEdge/2 - shortEdge*0.05, canvasHeight/2 + longEdge*0.01);
  c.stroke();
  c.beginPath()
  c.moveTo(canvasWidth/2 - longEdge*0.01, canvasHeight/2 - shortEdge/2 + shortEdge*0.05);
  c.lineTo(canvasWidth/2 + longEdge*0.01, canvasHeight/2 - shortEdge/2 + shortEdge*0.05);
  c.stroke();
  c.beginPath()
  c.moveTo(canvasWidth/2 - longEdge*0.01, canvasHeight/2 + shortEdge/2 - shortEdge*0.05);
  c.lineTo(canvasWidth/2 + longEdge*0.01, canvasHeight/2 + shortEdge/2 - shortEdge*0.05);
  c.stroke();
  c.restore()
}