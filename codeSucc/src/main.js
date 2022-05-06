import { playerInit } from "./player.js";


scene("game", () => {
    let player = add(playerInit());

})

go("game")