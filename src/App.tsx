//@ts-ignore
import P5Wrapper from 'react-p5-wrapper';
import React from 'react';
import { observer } from 'mobx-react';
import { Slider, InputNumber } from 'antd';
import { getSketch } from './sketch';
import { RegressionCanvasState } from './regression-canvas-state';

import 'antd/dist/antd.css';

const canvasState = new RegressionCanvasState();

const minNumParams = 2;
const maxNumParams = 20;

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <P5Wrapper sketch={getSketch(canvasState)} />
                <AppControllers />
            </div>
        );
    }
}

@observer
class AppControllers extends React.Component {
    render() {
        return (
            <div style={{ margin: 10 }}>
                <div style={{ fontStyle: 'bold' }}>Number of Parameters:</div>
                <div style={{ display: 'flex' }}>
                    <div style={{ width: 200 }}>
                        <Slider
                            min={minNumParams}
                            max={maxNumParams}
                            value={canvasState.numParams}
                            onChange={val => {
                                typeof val === 'number' &&
                                    canvasState.setNumThetas(val);
                            }}
                        />
                    </div>
                    <div style={{ width: 20 }}>
                        <InputNumber
                            min={minNumParams}
                            max={maxNumParams}
                            value={canvasState.numParams}
                            onChange={val => {
                                typeof val === 'number' &&
                                    canvasState.setNumThetas(val);
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
