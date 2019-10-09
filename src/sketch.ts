import p5 from 'p5';

export function getSketch(canvasState: any) {
    return (p5: p5) => {
        p5.setup = () => {
            p5.createCanvas(p5.windowWidth, p5.windowHeight);
        };

        p5.draw = () => {
            p5.background('black');
        };
    };
}
