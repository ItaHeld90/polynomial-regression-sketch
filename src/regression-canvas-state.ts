import * as tf from '@tensorflow/tfjs';
import { times } from 'lodash';
import { randomInRange } from './helper-utils';

const defaultNumParameters = 3;

export class RegressionCanvasState {
    thetas: tf.Variable<tf.Rank.R0>[] = times(defaultNumParameters, () =>
        tf.scalar(randomInRange(-1, 1)).variable()
    );

    setNumThetas(numParams: number) {
        this.thetas = times(numParams, () =>
            tf.scalar(randomInRange(-1, 1)).variable()
        );
    }

    get numParams(): number {
        return this.thetas.length;
    }
}
