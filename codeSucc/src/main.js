
// Start kaboom 
import {k} from "./kaboom.js"

// Load assets
loadSprite("blurbyWalk", "/sprites/walk+idletransparent.png", {
	sliceX: 6,
	anims: {
		"run": {
			from: 1,
			to: 5,
			speed: 10,
			loop: true,
		},
		"idle": 0
	},
})

loadSprite("enemy", "/sprites/enemy.png", {
	sliceX: 2,
	anims: {
		walk: {
			from: 0, 
			to: 1, 
			speed: 10,
			loop: true,
		},
		"idle": 0
	},
})

loadSprite("floor", "/sprites/cobbletext.png")
loadSprite("background", "/sprites/background.png")
loadSprite("door", "/sprites/door.png")

var SPEED = 320
const JUMP_FORCE = 600
var checkpoint = 0
var gameTime = 0
const LEVELS = [
	[
        "                                                                               ",
        "                                                                               ",
        "                                                                               ",
        "                                                                               ",
        "                                                                               ",
        "                                                                               ",
        "                                                                               ",
        "                                                                               ",
        "                                                                               ",
	],
	

	]



scene("title", () => {
	function addButton(txt, p, f) {

		const btn = add([
			text(txt),
			pos(p),
			area({ cursor: "pointer", }),
			scale(1),
			origin("center"),
		])
	
		btn.onClick(f)
	
		btn.onUpdate(() => {
			if (btn.isHovering()) {
				const t = time() * 10
				btn.color = rgb(
					wave(128, 0, t),
					wave(128, 0, t + 2),
					wave(128, 0, t + 4),
				)
				btn.scale = vec2(1.2)
			} else {
				btn.scale = vec2(1)
				btn.color = rgb()
			}
		})
	
	}

	addButton("play", vec2(200, 100), () => go("game", {
		levelIdx: 0,
		score: 0,
	}))
	
})

scene("game", ({ levelIdx, score }) => {
	gravity(2400)
	
	layers(["background",
	"game",
	"ui",
	], "game")
	
	const level = addLevel(LEVELS[levelIdx || 0], {
		width: 64,
		height: 64,
		"@": () => [
			sprite("blurbyWalk"),
			area(),
			body({ jumpForce: JUMP_FORCE, }),
			origin("bot"),
			"player",
		],
		"^": () => [
			sprite("enemy"),
			area(),
			body(),
			origin("bot"),
			"ghost",
		],
			"&": () => [
			sprite("door"),
			area(),
			solid(),
			scale(0.25),
			"door",
			origin("bot"),
		],
		"=": () => [
			sprite("floor"),
			area(),
			solid(),
			origin("bot"),
		],
	})

	const player = get("player")[0]

add([
	sprite("background"),
		layer("background"),
		scale(6),
	follow(player, vec2(-500, -600)),
		pos(0,0)
])
	
	let timer = add([
    text('0'),
        pos(width() - 100, 25),
		scale(2),
		follow(player, vec2(-150, -125)),
        layer("ui"),
        {
            time: gameTime,
        },
        "timer",
])
timer.onUpdate(()=>{
    timer.time += dt();
    timer.text = timer.time.toFixed(2);
});
	
	onCollide("ghost", "player", (g, p) => {
		gameTime = gameTime + 5
		go("game", {
			levelIdx: checkpoint
		})
		})

	player.play("idle")

	player.onUpdate(() => {
		camPos(player.pos)
		if (player.pos.y >= 3000) {
			gameTime = timer.time
			go("game", {
				levelIdx: checkpoint
			})
		}
	
	})
	
	player.onCollide("door", () => {
				go("win")
})
	
player.onGround(() => {
	if (!isKeyDown("left") && !isKeyDown("right")) {
		player.play("idle")
	} else {
		player.play("run")
	}
})
	
onKeyRelease(["left", "right"], () => {
	if (player.isGrounded() && !isKeyDown("left") && !isKeyDown("right")) {
		player.play("idle")
	}
})

player.onAnimEnd("idle", () => {
	// You can also register an event that runs when certain anim ends
})
  
	onKeyPress("shift", () => {
		SPEED = 1200
		wait(0.1, () => {
			SPEED = 320
		})
	})

	onKeyDown("left", () => {
	player.move(-SPEED, 0)
	player.flipX(true)
	if (player.isGrounded() && player.curAnim() !== "run") {
		player.play("run")
	}
})

	onKeyDown("right", () => {
	player.move(SPEED, 0)
		player.flipX(false)
	if (player.isGrounded() && player.curAnim() !== "run") {
		player.play("run")
	}
})

	onKeyPress("up", () => {
		
			player.doubleJump()
	})

	onKeyDown("down", () => {
		player.move(0, SPEED)
	})

	scene("lose", () => {
		gameTime = 0
		timer.time = 0
		add([
			text("You Lose"),
			pos((width()/2) - 50 , (height()/2) - 50),
		])

			add([
				text("Press any key to return to the title screen"),
			pos((width()/2) - 155 , (height()/2) + 50),
		])
		
		onKeyPress(start)
		onClick(start)

	})

	scene("win", () => {

		add([
			text("Blurby succeeded in his incomprehensible objective!", {
				width: width(),
			}),
			pos((width()/2) - 200 , (height()/2) - 50),
		])

			add([
			text("Your time was: " + timer.time.toFixed(2)),
			pos((width()/2) - 100 , (height()/2) + 50),
		])
		gameTime = 0
		timer.time = 0
		onKeyPress(start)

	})

	})

	function start() {
		// Start with the "title" scene, with initial parameters
		go("title")
	}

	start()
