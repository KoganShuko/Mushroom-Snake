import { Position } from '../types';

export function drawClock(
  position: Position,
  totalTime: number,
  ctx: CanvasRenderingContext2D,
  cb: Function
): Function {
  const startTime = new Date().getTime();
  const { x, y } = position;
  let markStart = 50;
  let markEnd = 60;
  let opacity = 1;
  return (isNeedToDelete: boolean): void => {
    const now = new Date().getTime();
    const time = now - startTime;
    if (time >= totalTime || isNeedToDelete) {
      markStart += (totalTime * 40) / (time - totalTime * 0.92) ** 1.75;
      markEnd += (totalTime * 40) / (time - totalTime * 0.92) ** 1.75;
      opacity -= 0.015;
      if (opacity <= 0) {
        cb();
      }
    }
    ctx.save();
    ctx.scale(0.5, 0.5);
    ctx.strokeStyle = `rgba(255,155,255,${opacity})`;
    ctx.lineCap = 'round';
    ctx.translate(x, y);
    ctx.lineWidth = 6;
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < 12; i += 1) {
      ctx.rotate(Math.PI / 6);
      ctx.moveTo(markStart, 0);
      ctx.lineTo(markEnd, 0);
    }
    ctx.stroke();
    ctx.restore();
    ctx.rotate(-Math.PI / 2);
    ctx.save();
    // fast arrow
    ctx.lineWidth = 4;
    ctx.rotate((-Math.PI / 1000) * time);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(40, 0);
    ctx.stroke();
    ctx.restore();
    ctx.save();
    // slow arrow
    ctx.lineWidth = 4;
    ctx.rotate((-Math.PI / 4000) * time);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(40, 0);
    ctx.stroke();
    ctx.restore();
    ctx.restore();
  };
}
