//@ts-ignore
import P5Wrapper from 'react-p5-wrapper';
import React from 'react';
import { getSketch } from './sketch';

function App() {
    return (
        <div className="App">
            <P5Wrapper sketch={getSketch({})} />
        </div>
    );
}

export default App;
