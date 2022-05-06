

export function playerInit(){
    return [
        pos(width()/2, height()/2),
        circle(32),
        
        outline(5),
        color(255, 0,0),
        area(),
    ]
}


function playerControl(){
    return {
        id: "playerControl",
        require:["area", "pos"],

        add() {

        },

        update() {

        },

        init(){

        }
        

    }

}