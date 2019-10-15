import p5 from 'p5';
import * as tf from '@tensorflow/tfjs';
import { zip, times, range } from 'lodash';

export function getSketch(canvasState: any) {
    const x_vals: number[] = [];
    const y_vals: number[] = [];
    const thetas = times(3, () => tf.scalar(Math.random()).variable());

    const learningRate = 0.2;
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
                if (x_vals.length > 0) {
                    const cost = optimizer.minimize(
                        () => loss(predict(x_vals), ys),
                        true,
                        thetas
                    );

                    // log the cost
                    if (cost) {
                        console.log(cost.dataSync());
                    }
                }

                // draw points
                (zip(x_vals, y_vals) as [number, number][]).forEach(
                    ([x, y]) => {
                        p5.point(
                            p5.map(x, 0, 1, 0, p5.width),
                            p5.map(y, 0, 1, p5.height, 0)
                        );
                    }
                );

                // draw curve
                const curveX = range(0, 1.05, 0.01);
                const curveY = predict(curveX).dataSync();

                p5.strokeWeight(3);
                p5.noFill();
                p5.beginShape();

                curveY.forEach((y: number, idx: number) => {
                    const denormX = p5.map(curveX[idx], 0, 1, 0, p5.width);
                    const denormY = p5.map(y, 0, 1, p5.height, 0);
                    p5.vertex(denormX, denormY);
                });

                p5.endShape();
            });
        };

        p5.mousePressed = () => {
            const x = p5.map(p5.mouseX, 0, p5.width, 0, 1);
            const y = p5.map(p5.mouseY, 0, p5.height, 1, 0);

            x_vals.push(x);
            y_vals.push(y);
        };

        function predict(x_vals: number[]): tf.Tensor<tf.Rank.R1> {
            const xs = tf.tensor1d(x_vals);

            const [a, b, c] = thetas;

            return xs
                .square()
                .mul(a)
                .add(xs.mul(b))
                .add(c);
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
    };
}
