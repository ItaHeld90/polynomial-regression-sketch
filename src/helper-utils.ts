export function randomInRange(min: number, max: number): number {
    return min + Math.floor(Math.random() * (max - min + 1));
}

export function paramsToFunctionText(thetas: number[]): string {
    const funcText = thetas.reduce((funcText, theta, idx) => {
        const fixedTheta = theta.toFixed(2);

        const componentText =
            idx === 0
                ? fixedTheta
                : idx === 1
                ? `${fixedTheta}x`
                : `${fixedTheta}x^${idx}`;

        return idx === 0 ? componentText : `${componentText} + ${funcText}`;
    }, '');

    return `f(x) = ${funcText}`;
}
