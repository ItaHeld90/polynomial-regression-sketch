import * as tf from '@tensorflow/tfjs';
import { computed, observable, action } from 'mobx';
import { times } from 'lodash';
import { randomInRange } from './helper-utils';

const defaultNumParameters = 3;

export class RegressionCanvasState {
    x_vals: number[] = [];
    y_vals: number[] = [];
    @observable.ref thetas: tf.Variable<tf.Rank.R0>[] = times(
        defaultNumParameters,
        () => tf.scalar(randomInRange(-1, 1)).variable()
    );

    @action
    setNumThetas(numParams: number) {
        // dispose old thetas
        this.thetas.forEach(theta => theta.dispose());

        this.thetas = times(numParams, () =>
            tf.scalar(randomInRange(-1, 1)).variable()
        );
    }

    @computed
    get numParams(): number {
        return this.thetas.length;
    }

    @action
    reset() {
        this.setNumThetas(defaultNumParameters);
        this.resetDataPoints();
    }

    resetDataPoints() {
        this.x_vals = [];
        this.y_vals = [];
    }
}
