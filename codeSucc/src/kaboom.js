import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs"


export const k = kaboom({
    width: 1088,
    height: 672,
    font: "sinko",
    canvas: document.querySelector("#mycanvas"),
    background: [ 100, 100, 100 ],
    global: true,
});
