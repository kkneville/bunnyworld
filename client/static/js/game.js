var game = new Phaser.Game(640, 512, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
	
	game.load.tilemap('map', 'maps/grass6.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('grass6', 'img/grass6.png');
	game.load.image('player', 'img/singlebunny.png', 32, 32);

    game.load.spritesheet('carrot', 'img/carrotsprite.png', 32, 32);
    game.load.spritesheet('potato', 'img/potatosprite.png', 32, 32);
    game.load.spritesheet('water', 'img/water_dropsprite.png', 32, 32);
    game.load.spritesheet('pepper', 'img/peppersprite.png', 32, 32);
    game.load.spritesheet('turnip', 'img/turnipsprite.png', 32, 32);
    game.load.spritesheet('lightning', 'img/lightningsprite.png', 32, 32);
}

var cursors;
var map;
var tileset;
var player;
var backgroundLayer;
var platformLayer;
var groundLayer;
var foregroundLayer;
var sprite;
var carrots;
var potatoes;
var water;
var turnips;
var peppers;
var lightning;


function create() {

	game.physics.startSystem(Phaser.Physics.ARCADE);

	map = game.add.tilemap('map');
	map.addTilesetImage('grass6', 'grass6');


	backgroundLayer = map.createLayer('backgroundLayer');
    foregroundLayer = map.createLayer('foregroundLayer');
	groundLayer = map.createLayer('groundLayer');
    
	groundLayer.resizeWorld();

    map.setCollisionBetween(1,6000, true, groundLayer, true)


	player = game.add.sprite(0, 1700, 'player');
    player.frame = 1


    function getObjects(spritename){
    var results = []   
    console.log(map.objects.objectsLayer) 
    console.log(map.objects.objectsLayer[0])
    for (var a = 0; a < map.objects.objectsLayer.length; a ++){
        if (map.objects.objectsLayer[a].properties.sprite == spritename) {
            map.objects.objectsLayer[a].y -= map.tileHeight
            results.push(map.objects.objectsLayer[a])
            console.log(map.objects.objectsLayer[a])
        }
    }
    console.log("these are the objects ", results)
    return results

    }

    carrots = game.add.group()
    var findCarrots = getObjects("food")  
    for (var a = 0; a < findCarrots.length; a ++){
        var s = carrots.create(findCarrots[a].x, findCarrots[a].y, 'carrot')
    }    
    carrots.callAll("animations.add", "animations", "hover", [0,1,0,1,0,1,0,1], 5, true)

    turnips = game.add.group()
    var findturnips = getObjects("flower")  
    for (var b = 0; b < findturnips.length; b ++){
        var t = turnips.create(findturnips[b].x, findturnips[b].y, 'turnip')
    }
    turnips.callAll("animations.add", "animations", "hover", [1,2,3,4,5,6,7,8], 5, true)    

    water = game.add.group()
    var findWater = getObjects("water")  
    for (var c = 0; c < findWater.length; c ++){
        var u = water.create(findWater[c].x, findWater[c].y, 'water')
    }    
    water.callAll("animations.add", "animations", "hover", [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], 5, true)
    
    


    potatoes = game.add.group()
    var findPotatoes = getObjects("cavern_enemy")  
    for (var a = 0; a < findPotatoes.length; a ++){
        var s = potatoes.create(findPotatoes[a].x, findPotatoes[a].y, 'potato')
    }
    var findP3 = getObjects("boss")  
    for (var a = 0; a < findP3.length; a ++){
        var s = potatoes.create(findP3[a].x, findP3[a].y, 'potato')
    }    
    potatoes.callAll("animations.add", "animations", "hover", [1,1,0,0], 1, true)

    peppers = game.add.group()
    var findpeppers = getObjects("earth_enemy")  
    for (var a = 0; a < findpeppers.length; a ++){
        var s = peppers.create(findpeppers[a].x, findpeppers[a].y, 'pepper')
    }
    peppers.callAll("animations.add", "animations", "hover", [1,2,3,4,5,6,7], 5, true)

    lightning = game.add.group()
    var findlightning = getObjects("sky_enemy")  
    for (var a = 0; a < findlightning.length; a ++){
        var s = lightning.create(findlightning[a].x, findlightning[a].y, 'lightning')
    }
    lightning.callAll("animations.add", "animations", "hover", [1,2,3,4,5,6,7,8], 5, true)


    game.physics.enable(player);
    game.physics.enable(carrots);
    game.physics.enable(potatoes);
    game.physics.enable(turnips);
    game.physics.enable(peppers);
    game.physics.enable(lightning);
    game.physics.enable(water);


    game.physics.arcade.gravity.y = 250;

    player.body.bounce.y = 0.2;
    player.body.linearDamping = 1;
    player.body.collideWorldBounds = true;

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {


carrots.callAll('play', null, 'hover')
potatoes.callAll('play', null, 'hover')
peppers.callAll('play', null, 'hover')
turnips.callAll('play', null, 'hover')
lightning.callAll('play', null, 'hover')
water.callAll('play', null, 'hover')

game.physics.arcade.collide(carrots, groundLayer);
game.physics.arcade.collide(player, groundLayer);
game.physics.arcade.collide(potatoes, groundLayer);
game.physics.arcade.collide(turnips, groundLayer);
game.physics.arcade.collide(peppers, groundLayer);
game.physics.arcade.collide(lightning, groundLayer);
game.physics.arcade.collide(water, groundLayer);

    player.body.velocity.x = 0;

    if (cursors.up.isDown)
    {
        if (player.body.onFloor())
        {
            player.body.velocity.y = -200;
        }
    }

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;
    }


    game.physics.arcade.overlap(player, carrots, collectCarrot, null)

    function collectCarrot(player, carrots){
        console.log('overlap with carrot')
        // score += 1
        // scoreText = score
        var x = carrots.x
        var y = carrots.y
        carrots.kill()
        bubble = game.add.sprite(x,y, "carrot")
        bubble.animations.add('pop', [2,2,3,3,4,4,5,5], 5, false)
        bubble.animations.play('pop', 10, false, true);
    } 

    game.physics.arcade.overlap(player, turnips, collectturnip, null)

    function collectturnip(player, turnips){
        console.log('overlap with turnip')
        // score += 1
        // scoreText = score
        var x = turnips.x
        var y = turnips.y
        turnips.kill()
        bubble = game.add.sprite(x,y, "turnip")
        bubble.animations.add('pop', [8,9,10,11,12], 5, false)
        bubble.animations.play('pop', 10, false, true);
    } 
    
    game.physics.arcade.overlap(player, water, collectwater, null)

    function collectwater(player, water){
        console.log('overlap with water')
        // score += 1
        // scoreText = score
        var x = water.x
        var y = water.y
        water.kill()
        bubble = game.add.sprite(x,y, "water")
        bubble.animations.add('pop', [14,16,17,18,19], 3, false)
        bubble.animations.play('pop', 10, false, true);
    } 



}

// function render() {

//     game.debug.body(sprite);

// }

function render() {

    // game.debug.body(p);
    // game.debug.bodyInfo(player, 32, 320);

}
