import p5 from 'p5';
import * as tf from '@tensorflow/tfjs';
import { zip, range } from 'lodash';
import { RegressionCanvasState } from './regression-canvas-state';
import { paramsToFunctionText } from './helper-utils';

export function getSketch(canvasState: RegressionCanvasState) {
    const x_vals: number[] = [];
    const y_vals: number[] = [];

    const learningRate = 0.1;
    const optimizer = tf.train.adam(learningRate);

    return (p5: p5) => {
        p5.setup = () => {
            p5.createCanvas(p5.windowWidth / 2, p5.windowHeight / 2);
        };

        p5.draw = () => {
            p5.background('black');

            p5.strokeWeight(8);
            p5.stroke('white');

            tf.tidy(() => {
                const ys = tf.tensor1d(y_vals);

                // train model
                const cost =
                    x_vals.length > 0
                        ? optimizer.minimize(
                              () => loss(predict(x_vals), ys),
                              true,
                              canvasState.thetas
                          )
                        : tf.scalar(0);

                // draw points
                (zip(x_vals, y_vals) as [number, number][]).forEach(
                    ([x, y]) => {
                        p5.point(denormalizeX(x), denormalizeY(y));
                    }
                );

                // draw curve
                const curveX = range(-1, 1.01, 0.01);
                const curveY = predict(curveX).dataSync();

                p5.strokeWeight(3);
                p5.noFill();
                p5.beginShape();

                curveY.forEach((y: number, idx: number) => {
                    const denormX = denormalizeX(curveX[idx]);
                    const denormY = denormalizeY(y);
                    p5.vertex(denormX, denormY);
                });

                p5.endShape();

                // draw cost
                if (cost != null) {
                    p5.push();
                    p5.translate(10, 30);

                    
                    p5.textSize(16);
                    p5.fill('red');
                    p5.noStroke();
                    p5.text(`Cost: ${(+cost.dataSync()).toFixed(4)}`, 0, 0);

                    p5.pop();
                }

                // draw function
                p5.push();
                p5.translate(10, p5.height - 10);

                p5.textSize(24);
                p5.noStroke();
                p5.fill('green');

                const parameters = canvasState.thetas.map(
                    theta => +theta.dataSync()
                );

                const funcText = paramsToFunctionText(parameters);
                p5.text(funcText, 0, 0);

                p5.pop();
            });
        };

        p5.mousePressed = () => {
            const x = normalizeX(p5.mouseX);
            const y = normalizeY(p5.mouseY);

            x_vals.push(x);
            y_vals.push(y);
        };

        function predict(x_vals: number[]): tf.Tensor<tf.Rank.R1> {
            const xs = tf.tensor1d(x_vals);

            return canvasState.thetas.reduce(
                (res, theta, idx) => res.add(xs.pow(idx).mul(theta)),
                tf.zeros([xs.size]) as tf.Tensor<tf.Rank.R1>
            );
        }

        function loss(
            pred: tf.Tensor<tf.Rank.R1>,
            label: tf.Tensor<tf.Rank.R1>
        ): tf.Tensor<tf.Rank.R0> {
            return pred
                .sub(label)
                .square()
                .mean();
        }

        function normalizeX(x: number): number {
            return p5.map(x, 0, p5.width, -1, 1);
        }

        function denormalizeX(x: number): number {
            return p5.map(x, -1, 1, 0, p5.width);
        }

        function normalizeY(y: number): number {
            return p5.map(y, 0, p5.height, 1, -1);
        }

        function denormalizeY(y: number): number {
            return p5.map(y, -1, 1, p5.height, 0);
        }
    };
}
