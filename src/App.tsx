//@ts-ignore
import P5Wrapper from 'react-p5-wrapper';
import React from 'react';
import { getSketch } from './sketch';
import { RegressionCanvasState } from './regression-canvas-state';

const canvasState = new RegressionCanvasState();

function App() {
    return (
        <div className="App">
            <P5Wrapper sketch={getSketch(canvasState)} />
        </div>
    );
}

export default App;
