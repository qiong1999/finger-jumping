import React, { CanvasHTMLAttributes } from 'react';
export default function PaintNote() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    console.log(canvas.width);
    return (
        <>
            <canvas id="canvas"></canvas>
        </>
    );
}
