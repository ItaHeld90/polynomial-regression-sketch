import p5 from 'p5';
import * as tf from '@tensorflow/tfjs';
import { zip, times } from 'lodash';

export function getSketch(canvasState: any) {
    const x_vals: number[] = [];
    const y_vals: number[] = [];
    const thetas = times(2, () => tf.scalar(Math.random()).variable());

    const learningRate = 0.1;
    const optimizer = tf.train.sgd(learningRate);

    return (p5: p5) => {
        p5.setup = () => {
            p5.createCanvas(p5.windowWidth, p5.windowHeight);
        };

        p5.draw = () => {
            p5.background('grey');

            p5.strokeWeight(8);

            tf.tidy(() => {
                const ys = tf.tensor1d(y_vals);

                // train model
                if (x_vals.length > 0) {
                    const cost = optimizer.minimize(
                        () => loss(predict(x_vals), ys),
                        true,
                        thetas
                    );

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

                // draw line
                const lineY = predict([0, 1]).dataSync();

                p5.strokeWeight(4);
                p5.line(
                    0,
                    p5.map(lineY[0], 0, 1, p5.height, 0),
                    p5.width,
                    p5.map(lineY[1], 0, 1, p5.height, 0)
                );
            });
        };

        p5.mousePressed = () => {
            const x = p5.map(p5.mouseX, 0, p5.width, 0, 1);
            const y = p5.map(p5.mouseY, 0, p5.height, 1, 0);

            x_vals.push(x);
            y_vals.push(y);
        };

        function predict(x_vals: number[]): tf.Tensor<tf.Rank.R1> {
            const [b, m] = thetas;
            return tf
                .tensor1d(x_vals)
                .mul(m)
                .add(b);
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
