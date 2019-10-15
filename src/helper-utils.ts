export function randomInRange(min: number, max: number): number {
    return min + Math.floor(Math.random() * (max - min + 1));
}

export function paramsToFunctionText(thetas: number[]): string {
    const funcText = thetas.reduce((funcText, theta, idx) => {
        const fixedTheta = theta.toFixed(2);
        const thetaText = theta < 0 ? `(${fixedTheta})` : fixedTheta;

        const componentText =
            idx === 0
                ? thetaText
                : idx === 1
                ? `${thetaText}x`
                : `${thetaText}x^${idx}`;

        return idx === 0 ? componentText : `${componentText} + ${funcText}`;
    }, '');

    return `f(x) = ${funcText}`;
}
