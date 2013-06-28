// Global Vars
var ghost;

var timeStep = 1.0 / 60.0;

var doDraw = true;
var cw_paused = false;

var box2dfps = 60;
var screenfps = 60;

var started = false;

var debugbox = document.getElementById("debug");

var canvas = document.getElementById("mainbox");
var ctx = canvas.getContext("2d");

var cameraspeed = 0.05;
var camera_y = 0;
var camera_x = 0;
var camera_target = -1; // which car should we follow? -1 = leader
var minimapcamera = document.getElementById("minimapcamera").style;

var graphcanvas = document.getElementById("graphcanvas");
var graphctx = graphcanvas.getContext("2d");
var graphheight = 200;
var graphwidth = 400;

var minimapcanvas = document.getElementById("minimap");
var minimapctx = minimapcanvas.getContext("2d");
var minimapscale = 3;
var minimapfogdistance = 0;
//var minimarkerdistance = document.getElementById("minimapmarker").style;
var fogdistance = document.getElementById("minimapfog").style;

var generationSize = 20;
var cw_carGeneration = [];
var cw_carScores = [];
var cw_topScores = [];
var cw_graphTop = [];
var cw_graphElite = [];
var cw_graphAverage = [];

var gen_champions = 1;
var gen_parentality = 0.2;
var gen_mutation = 0.05;
var gen_counter = 0;
var nAttributes = 14; // change this when genome changes

var gravity = new b2Vec2(0.0, -9.81);
var doSleep = true;

var world;

var zoom = 50;

var maxFloorTiles = 300;
var track = [0,-0.006845321204386959,-0.0036652705251082685,0.0012497102026081718,0.010987273097182034,0.010179825491609996,0.028839175620659734,0.035825204903316595,-0.04944361410117802,0.048808180151462995,0.03190776718867163,-0.047654001635517806,0.02915650661237297,0.09553985101682246,0.03418529267788679,0.07255019568870455,0.05164717001001776,-0.04057384352984412,0.03980957319843658,-0.046081405567115936,-0.05135480218473656,0.037446089847966005,0.14284250312291497,0.16694542880080276,0.09790447543897798,0.03699309453865346,0.12323883882707683,-0.09137638211340304,-0.09332105802516098,0.002258275308998323,-0.11432196511475276,-0.015545071327337286,-0.01853992962174065,0.08201040335460175,0.03524894564335594,-0.2307611010553984,0.10714518638249618,0.02186150250627267,0.08022082275495399,0.25575728324690045,-0.19524116601937067,0.27735088504338545,0.14871810720920933,0.10230688944507915,-0.26969681210757396,0.3069043599677029,-0.07836197510381115,-0.1007634849738056,0.3126462496873773,-0.1419555377162322,-0.024494004316344797,0.3350809880149116,0.2327918442119811,-0.01952978015364873,0.38664699006275177,-0.13628783877467263,0.18070014484955985,-0.23306372492888508,-0.0060287832912060855,0.18764844113956258,-0.36560605848862904,0.21102480370326218,0.36023586725228907,0.03257781320489497,-0.007981119499413722,-0.020074236432787506,-0.3670453325385205,0.3808071145315617,-0.2564295159870028,0.33950577728379217,-0.27461464301994526,0.21689743019676294,-0.5166532736463721,0.5387268946180388,0.09341719431290622,0.3404039765010581,0.22031784157174125,-0.43761599917524174,0.43463252052530693,-0.28083545946917987,0.2337536015621396,-0.550489870652748,0.19768917898508206,0.5728748819083891,0.07713443276481678,0.6312782042304221,0.5781990074380944,0.5757421774111402,0.2668855263188654,-0.11883012952417474,-0.29947746673416303,0.263441680776232,0.08317320478860439,0.3006378174364125,-0.31856448416158256,0.4453848534831237,-0.6123538902141015,0.17613176210140213,0.39029724932416915,0.38221149198327775,-0.27935926494848673,-0.4844327578625166,-0.4855546027580731,-0.4046741043344984,0.7763907699220789,-0.07431215143239721,-0.16508004179712432,-0.4571197158481253,-0.0033301994425567827,0.1734274640622902,0.5604366586953606,0.28181972743650513,-0.359115539548717,0.6284935988346169,0.7538417395945003,-0.03405496819583884,-0.20905720881493822,0.07281089864558322,0.45008157467366944,0.08796133524951724,0.7981057549437364,-0.35670309235143827,0.47926674108282885,0.4139418074878325,-0.3298672209345382,-0.1997856573931578,0.7098309331529891,-0.27172719715292787,-0.7700617964985348,0.7297065370871252,-0.3651688848493297,0.09900422994183218,0.1779461183070559,-0.6667736920605923,-0.4476893010322395,-0.8033618044245612,0.125087137266203,1.0183443984516065,-0.024989213385235826,0.16109016387487363,-0.6199451245624551,0.7682904590474069,-0.01048573803750028,-0.5012501243214024,-0.3636661643098625,-0.5119490618345679,-0.27045634850349376,-0.7666611532963024,0.36967876031295976,0.07939746070599736,-0.9375844779937446,0.11818678913544142,-1.0027626088199935,0.014898975486102832,0.8171901332468023,-0.021091327082950848,0.8533268989364212,0.6308576397210474,0.8812878412797954,0.555886903316057,-0.8078421441045102,0.4775365385287186,-0.23700024205653164,-0.0020926782933560484,-0.04015234485770062,0.6299028823654653,-0.5703190349346051,-0.9099528478108819,1.1320577503519818,1.02522355355265,-0.17192323149492267,0.0643227859689823,0.5815173157760575,1.0535634546608958,-0.03762148394392787,0.43046753941604093,-0.04473253178636785,-1.0121867422520043,0.3261033315087114,-0.2366799912827677,-0.0431104367737612,-0.3338017531888083,0.5038397648794667,-0.14970422078844556,1.3649504951617484,1.3858836590293269,1.2599258150684998,-0.6612212947816587,0.4957575417723182,-0.3028712075952635,-0.598073431252508,0.6158756397606379,1.365017119664122,0.10701778351073948,0.15698308398988212,0.3479940654016214,-0.7595342284590851,-0.5683226117267743,-0.2092689991726465,1.1314687360034819,-0.6997133576382901,1.4231127498195268,-0.04481574361241316,-0.7031107266727439,1.225778339556221,-0.7982346582821603,0.8514585142839192,-1.1596252331458035,0.9438806295472074,-0.2704687160046601,0.4218079694738717,-0.3172273364518117,0.6600101852510769,0.2998082407370228,-0.5860980474578391,1.5205007688274104,0.31445287611271094,1.1499568654829446,0.20710307398209787,0.29688679655660866,1.607934770440815,-1.4447008223250497,0.21546181409509632,-0.7511937793604331,0.862645208911317,-0.5818417314264088,0.48915952438593063,-1.115655040518449,0.8768668286597718,-0.036459458919895625,1.2054574166269194,0.8271540979793035,1.0224483107687856,0.5921103556912461,-0.2897292554518513,1.6699595709609854,-1.6373043132103526,-0.30548589285046024,-1.6360015761197801,-0.33367944650352543,0.3112708108290591,-1.072011951051326,1.1299926272159935,-0.9494931771570028,1.2897126220521504,1.5372211936440783,1.4835319666378504,-0.4927156114103331,-0.12254701608455391,-0.04302575660385645,-1.503783056270603,-0.8196167489357529,0.375621830098875,-0.6293044294248186,1.667389180988803,0.24658721650859694,0.1377691087456867,-1.1292723663450457,1.203974177737765,1.2441405119402018,1.671542495174147,1.9337583010804211,-1.4104315509389516,0.033484084989558245,-0.4503439477847049,1.3608560711102315,-0.2282729432248937,0.6372448052756942,1.0047168578254952,0.5384078388815561,-1.9282398031114951,0.6171772609718263,-0.7888875632116888,-1.6091379996613635,-0.7646695363307704,0.31784104795142115,1.148527479961589,-1.1187839324310775,-1.9102236012911469,2.0151029321866885,-0.5786609077156961,-0.9094965712708575,0.667941565302337,1.888251510383268,-0.9114850288628079,-0.09795986202112947,-1.3258594525461513,-0.6135808880100849,-1.2388452798839906,-0.5841502762378104,-1.28170591831657,0.992739592766059,-1.9146379425506124,0.26603760809045834,0.5510417950976729,-1.653826547341164,-0.6255054049199691,-0.10498586582776957,2.165696701521952,2.075954038864293];
var cw_floorTiles = [];
var last_drawn_tile = 0;

var groundPieceWidth = 1.5;
var groundPieceHeight = 0.15;

var chassisMaxAxis = 1.1;
var chassisMinAxis = 0.1;

var wheelMaxRadius = 0.5;
var wheelMinRadius = 0.2;
var wheelMaxDensity = 100;
var wheelMinDensity = 40;
var wheelDensityRange = wheelMaxDensity + wheelMinDensity;

var velocityIndex = 0;
var deathSpeed = 0.1;
var max_car_health = box2dfps * 10;
var car_health = max_car_health;

var motorSpeed = 20;

var swapPoint1 = 0;
var swapPoint2 = 0;

var cw_ghostReplayInterval = null;

var distanceMeter = document.getElementById("distancemeter");

var leaderPosition = {};
var last_distance = 0;
var last_time = new Date().getTime();
var carmaxspeed = 0;
leaderPosition.x = 0;
leaderPosition.y = 0;

minimapcamera.width = 12*minimapscale+"px";
minimapcamera.height = 6*minimapscale+"px";

function debug(str, clear) {
    if (debug)console.info('debug');
    if(clear) {
        debugbox.innerHTML = "";
    }
    debugbox.innerHTML += str+"<br />";
}

function showDistance(distance, height) {
//    if (debug)console.info('showDistance');
    var time = new Date().getTime();
    var speed = Math.round(((distance - last_distance)) / (time - last_time) * 10000 * 3.6) / 10;
    distanceMeter.innerHTML = "distance: "+distance+" meters<br />";
    distanceMeter.innerHTML += "height: "+height+" meters<br />";
    distanceMeter.innerHTML += "speed: "+(speed)+" km/h";
    carmaxspeed = carmaxspeed < speed ? speed : carmaxspeed;
    last_distance = distance;
    last_time = time;
    //minimarkerdistance.left = Math.round((distance + 5) * minimapscale) + "px";
    if(distance > minimapfogdistance) {
        fogdistance.width = 800 - Math.round(distance + 15) * minimapscale + "px";
        minimapfogdistance = distance;
    }
}

/* ========================================================================= */
/* === Car ================================================================= */
var cw_Car = function() {
    if (debug)console.info('cw_Car');
    this.__constructor.apply(this, arguments);
};

cw_Car.prototype.chassis = null;
cw_Car.prototype.wheel1 = null;
cw_Car.prototype.wheel2 = null;

cw_Car.prototype.__constructor = function(car_def) {
    if (debug)console.info('cw_Car.prototype.__constructor');
    this.velocityIndex = 0;
    this.health = max_car_health;
    this.maxPosition = 0;
    this.maxPositiony = 0;
    this.minPositiony = 0;
    this.frames = 0;
    this.car_def = car_def;
    this.alive = true;
    this.is_elite = car_def.is_elite;
    this.healthBar = document.getElementById("health"+car_def.index).style;
    this.healthBarText = document.getElementById("health"+car_def.index).nextSibling.nextSibling;
    this.healthBarText.innerHTML = car_def.index;
    this.minimapmarker = document.getElementById("bar"+car_def.index).style;

    if(this.is_elite) {
        this.healthBar.backgroundColor = "#44c";
        document.getElementById("bar"+car_def.index).style.borderLeft = "1px solid #44c";
        document.getElementById("bar"+car_def.index).innerHTML = car_def.index;
    } else {
        this.healthBar.backgroundColor = "#c44";
        document.getElementById("bar"+car_def.index).style.borderLeft = "1px solid #c44";
        document.getElementById("bar"+car_def.index).innerHTML = car_def.index;
    }

    this.chassis = cw_createChassis(car_def.vertex_list);
    this.wheel1 = cw_createWheel(car_def.wheel_radius1, car_def.wheel_density1);
    this.wheel2 = cw_createWheel(car_def.wheel_radius2, car_def.wheel_density2);

    var carmass = this.chassis.GetMass() + this.wheel1.GetMass() + this.wheel2.GetMass();
    var torque1 = carmass * -gravity.y / car_def.wheel_radius1;
    var torque2 = carmass * -gravity.y / car_def.wheel_radius2;

    var joint_def = new b2RevoluteJointDef();
    var randvertex = this.chassis.vertex_list[car_def.wheel_vertex1];
    joint_def.localAnchorA.Set(randvertex.x, randvertex.y);
    joint_def.localAnchorB.Set(0, 0);
    joint_def.maxMotorTorque = torque1;
    joint_def.motorSpeed = -motorSpeed;
    joint_def.enableMotor = true;
    joint_def.bodyA = this.chassis;
    joint_def.bodyB = this.wheel1;

    var joint = world.CreateJoint(joint_def);

    randvertex = this.chassis.vertex_list[car_def.wheel_vertex2];
    joint_def.localAnchorA.Set(randvertex.x, randvertex.y);
    joint_def.localAnchorB.Set(0, 0);
    joint_def.maxMotorTorque = torque2;
    joint_def.motorSpeed = -motorSpeed;
    joint_def.enableMotor = true;
    joint_def.bodyA = this.chassis;
    joint_def.bodyB = this.wheel2;

    var joint = world.CreateJoint(joint_def);

    this.replay = ghost_create_replay();
    ghost_add_replay_frame(this.replay, this);
};

cw_Car.prototype.getPosition = function() {
//    if (debug)console.info('cw_Car.prototype.getPosition');
    return this.chassis.GetPosition();
};

cw_Car.prototype.draw = function() {
    if (debug)console.info('cw_Car.prototype.draw');
    drawObject(this.chassis);
    drawObject(this.wheel1);
    drawObject(this.wheel2);
};

cw_Car.prototype.kill = function() {
//    if (debug)console.info('cw_Car.prototype.kill');
    var avgspeed = (this.maxPosition / this.frames) * box2dfps;
    var position = this.maxPosition;
    var score = position + avgspeed;
    ghost_compare_to_replay(this.replay, ghost, score);
    cw_carScores.push({ car_def:this.car_def, v:score, s: avgspeed, x:position, y:this.maxPositiony, y2:this.minPositiony });
    world.DestroyBody(this.chassis);
    world.DestroyBody(this.wheel1);
    world.DestroyBody(this.wheel2);
    this.alive = false;
};

cw_Car.prototype.checkDeath = function() {
//    if (debug)console.info('cw_Car.prototype.checkDeath');
    // check health
    var position = this.getPosition();
    if(position.y > this.maxPositiony) {
        this.maxPositiony = position.y;
    }
    if(position .y < this.minPositiony) {
        this.minPositiony = position.y;
    }
    if(position.x > this.maxPosition + 0.02) {
        this.health = max_car_health;
        this.maxPosition = position.x;
    } else {
        if(position.x > this.maxPosition) {
            this.maxPosition = position.x;
        }
        if(Math.abs(this.chassis.GetLinearVelocity().x) < 0.001) {
            this.health -= 5;
        }
        this.health--;
        if(this.health <= 0) {
            this.healthBarText.innerHTML = "&#9760;";
            this.healthBar.width = "0";
            return true;
        }
    }
};

function cw_createChassisPart(body, vertex1, vertex2) {
    if (debug)console.info('cw_createChassisPart');
    var vertex_list = [];
    vertex_list.push(vertex1);
    vertex_list.push(vertex2);
    vertex_list.push(b2Vec2.Make(0,0));
    var fix_def = new b2FixtureDef();
    fix_def.shape = new b2PolygonShape();
    fix_def.density = 80;
    fix_def.friction = 10;
    fix_def.restitution = 0.2;
    fix_def.filter.groupIndex = -1;
    fix_def.shape.SetAsArray(vertex_list,3);

    body.CreateFixture(fix_def);
}

function cw_createChassis(vertex_list) {
    if (debug)console.info('cw_createChassis');
    var body_def = new b2BodyDef();
    body_def.type = b2Body.b2_dynamicBody;
    body_def.position.Set(0.0, 4.0);

    var body = world.CreateBody(body_def);

    cw_createChassisPart(body, vertex_list[0],vertex_list[1]);
    cw_createChassisPart(body, vertex_list[1],vertex_list[2]);
    cw_createChassisPart(body, vertex_list[2],vertex_list[3]);
    cw_createChassisPart(body, vertex_list[3],vertex_list[4]);
    cw_createChassisPart(body, vertex_list[4],vertex_list[5]);
    cw_createChassisPart(body, vertex_list[5],vertex_list[6]);
    cw_createChassisPart(body, vertex_list[6],vertex_list[7]);
    cw_createChassisPart(body, vertex_list[7],vertex_list[0]);

    body.vertex_list = vertex_list;

    return body;
}

function cw_createWheel(radius, density) {
    if (debug)console.info('cw_createWheel');
    var body_def = new b2BodyDef();
    body_def.type = b2Body.b2_dynamicBody;
    body_def.position.Set(0, 0);

    var body = world.CreateBody(body_def);

    var fix_def = new b2FixtureDef();
    fix_def.shape = new b2CircleShape(radius);
    fix_def.density = density;
    fix_def.friction = 1;
    fix_def.restitution = 0.2;
    fix_def.filter.groupIndex = -1;

    body.CreateFixture(fix_def);
    return body;
}
/**
 *
 * @param vertex_list {Array}
 * @param wheel_density1 {Number}
 * @param wheel_density2 {Number}
 * @param wheel_radius1 {Number}
 * @param wheel_radius2 {Number}
 * @param wheel_vertex1 {Number}
 * @param wheel_vertex2 {Number}
 * @return {Object}
 */
var createcar = function (vertex_list,wheel_density1,wheel_density2,wheel_radius1,wheel_radius2,wheel_vertex1,wheel_vertex2) {
//    if (debug)console.info('createcar');

    var car_def = {};
    car_def.wheel_radius1 = wheel_radius1;
    car_def.wheel_radius2 = wheel_radius2;
    car_def.wheel_density1 = wheel_density1;
    car_def.wheel_density2 = wheel_density2;

    car_def.vertex_list = [];
    for (var i = 0; i < vertex_list.length; i++) {
        var vertex_list2 = vertex_list[i];
        car_def.vertex_list[i] = new b2Vec2(vertex_list2.x,vertex_list2.y);
    }

    car_def.wheel_vertex1 = wheel_vertex1;
    car_def.wheel_vertex2 = wheel_vertex2;

    return car_def;


};
function cw_createRandomCar() {

    var v2;
    var vertexpoly = [];
    vertexpoly.push({x:Math.random()*chassisMaxAxis + chassisMinAxis,y:0});
    vertexpoly.push({x:Math.random()*chassisMaxAxis + chassisMinAxis,y:Math.random()*chassisMaxAxis + chassisMinAxis});
    vertexpoly.push({x:0,y:Math.random()*chassisMaxAxis + chassisMinAxis});
    vertexpoly.push({x:-Math.random()*chassisMaxAxis - chassisMinAxis,y:Math.random()*chassisMaxAxis + chassisMinAxis});
    vertexpoly.push({x:-Math.random()*chassisMaxAxis - chassisMinAxis,y:0});
    vertexpoly.push({x:-Math.random()*chassisMaxAxis - chassisMinAxis,y:-Math.random()*chassisMaxAxis - chassisMinAxis});
    vertexpoly.push({x:0,y:-Math.random()*chassisMaxAxis - chassisMinAxis});
    vertexpoly.push({x:Math.random()*chassisMaxAxis + chassisMinAxis,y:-Math.random()*chassisMaxAxis - chassisMinAxis});

    var wheel_radius1 = Math.random()*wheelMaxRadius+wheelMinRadius;
    var wheel_radius2 = Math.random()*wheelMaxRadius+wheelMinRadius;
    var wheel_density1 = Math.random()*wheelMaxDensity+wheelMinDensity;
    var wheel_density2 = Math.random()*wheelMaxDensity+wheelMinDensity;

    var wheel_vertex1 = Math.floor(Math.random()*8)%8;
    v2 = wheel_vertex1;
    while(v2 == wheel_vertex1) {
        v2 = Math.floor(Math.random()*8)%8
    }
    var wheel_vertex2 = v2;

    return createcar(vertexpoly, wheel_density1, wheel_density2, wheel_radius1, wheel_radius2, wheel_vertex1, wheel_vertex2);
}

/* === END Car ============================================================= */
/* ========================================================================= */

/* ========================================================================= */
/* ==== Floor ============================================================== */

function cw_createFloor() {
    if (debug)console.info('cw_createFloor');
    var last_tile = null;
    var tile_position = new b2Vec2(-5,0);
    cw_floorTiles = [];
//    var x = [];
    Math.seedrandom(floorseed);
    for(var k = 0; k < maxFloorTiles; k++) {
//        var angle = (Math.random()*3 - 1.5) * 1.5*k/maxFloorTiles;
        var angle = track[k];
//        x.push(angle);
        last_tile = cw_createFloorTile(tile_position, angle);
        cw_floorTiles.push(last_tile);
        last_fixture = last_tile.GetFixtureList();
        last_world_coords = last_tile.GetWorldPoint(last_fixture.GetShape().m_vertices[3]);
        tile_position = last_world_coords;

    }
//    if (debug)console.info('cw_floorTiles', x.toString());
}

var createtrack = function () {
    if (debug)console.info('createtrack');
    var x = [];
    for(var k = 0; k < maxFloorTiles; k++) {
        x.push((Math.random()*3 - 1.5) * 1.5*k/maxFloorTiles);
    }
    console.info(x.toString());
};

function cw_createFloorTile(position, angle) {
    if (debug)console.info('cw_createFloorTile');
    body_def = new b2BodyDef();

    body_def.position.Set(position.x, position.y);
    var body = world.CreateBody(body_def);
    fix_def = new b2FixtureDef();
    fix_def.shape = new b2PolygonShape();
    fix_def.friction = 0.5;

    var coords = [];
    coords.push(new b2Vec2(0,0));
    coords.push(new b2Vec2(0,-groundPieceHeight));
    coords.push(new b2Vec2(groundPieceWidth,-groundPieceHeight));
    coords.push(new b2Vec2(groundPieceWidth,0));

    var center = new b2Vec2(0,0);

    var newcoords = cw_rotateFloorTile(coords, center, angle);

    fix_def.shape.SetAsArray(newcoords);

    body.CreateFixture(fix_def);
    return body;
}

function cw_rotateFloorTile(coords, center, angle) {
    if (debug)console.info('cw_rotateFloorTile');
    var newcoords = [];
    for(var k = 0; k < coords.length; k++) {
        nc = new Object();
        nc.x = Math.cos(angle)*(coords[k].x - center.x) - Math.sin(angle)*(coords[k].y - center.y) + center.x;
        nc.y = Math.sin(angle)*(coords[k].x - center.x) + Math.cos(angle)*(coords[k].y - center.y) + center.y;
        newcoords.push(nc);
    }
    return newcoords;
}

/* ==== END Floor ========================================================== */
/* ========================================================================= */

/* ========================================================================= */
/* ==== Generation ========================================================= */

function cw_generationZero() {
    if (debug)console.info('cw_generationZero');
    for(var k = 0; k < generationSize; k++) {
        var car_def = cw_createRandomCar();
        car_def.index = k;
        cw_carGeneration.push(car_def);
    }
    gen_counter = 0;
    cw_deadCars = 0;
    leaderPosition = {};
    leaderPosition.x = 0;
    leaderPosition.y = 0;
    cw_materializeGeneration();
    document.getElementById("generation").innerHTML = "generation 0";
    document.getElementById("population").innerHTML = "cars alive: "+generationSize;
    ghost = ghost_create_ghost();
}

function cw_materializeGeneration() {
    if (debug)console.info('cw_materializeGeneration', cw_carGeneration);
    cw_carArray = [];
    for(var k = 0; k < generationSize; k++) {
        var blipcar = new cw_Car(cw_carGeneration[k]);
        cw_carArray.push(blipcar);
    }
}

// function cw_createNextCar() {
//   car_health = max_car_health;
//   document.getElementById("cars").innerHTML += "Car #"+(current_car_index+1)+": ";
//   var newcar = new cw_Car(cw_carGeneration[current_car_index]);
//   newcar.maxPosition = 0;
//   newcar.maxPositiony = 0;
//   newcar.minPositiony = 0;
//   replay = ghost_create_replay();
//   ghost_reset_ghost(ghost);
//   ghost_add_replay_frame(replay, newcar);
//   newcar.frames = 0;
//   return newcar;
// }

function cw_nextGeneration() {
    if (debug)console.info('cw_nextGeneration');
    var newGeneration = [];
    var newborn;
    cw_getChampions();
    cw_topScores.push({i:gen_counter,v:cw_carScores[0].v,x:cw_carScores[0].x,y:cw_carScores[0].y,y2:cw_carScores[0].y2,ms:carmaxspeed});
    plot_graphs();
    for(var k = 0; k < gen_champions; k++) {
        cw_carScores[k].car_def.is_elite = true;
        cw_carScores[k].car_def.index = k;
        newGeneration.push(cw_carScores[k].car_def);
        //document.getElementById("bar"+k).src = "bluedot.png";
    }
    for(k = gen_champions; k < generationSize; k++) {
        var parent1 = cw_getParents();
        var parent2 = parent1;
        while(parent2 == parent1) {
            parent2 = cw_getParents();
        }
        newborn = cw_makeChild(cw_carGeneration[parent1],cw_carGeneration[parent2]);
        newborn = cw_mutate(newborn);
        newborn.is_elite = false;
        newborn.index = k;
        //document.getElementById("bar"+k).src = "reddot.png";
        newGeneration.push(newborn);
    }
    cw_carScores = [];
    cw_carGeneration = newGeneration;
    gen_counter++;
    cw_materializeGeneration();
    cw_deadCars = 0;
    leaderPosition = new Object();
    leaderPosition.x = 0;
    leaderPosition.y = 0;
    document.getElementById("generation").innerHTML = "generation "+gen_counter;
    document.getElementById("cars").innerHTML = "";
    document.getElementById("population").innerHTML = "cars alive: "+generationSize;
}

function cw_getChampions() {
    if (debug)console.info('cw_getChampions');
    var ret = [];
    cw_carScores.sort(function(a,b) {if(a.v > b.v) {return -1} else {return 1}});
    for(var k = 0; k < generationSize; k++) {
        ret.push(cw_carScores[k].i);
    }
    return ret;
}

function cw_getParents() {
    if (debug)console.info('cw_getParents');
    var parentIndex = -1;
    for(var k = 0; k < generationSize; k++) {
        if(Math.random() <= gen_parentality) {
            parentIndex = k;
            break;
        }
    }
    if(parentIndex == -1) {
        parentIndex = Math.round(Math.random()*(generationSize-1));
    }
    return parentIndex;
}

function cw_makeChild(car_def1, car_def2) {
    if (debug)console.info('cw_makeChild');
    var newCarDef = new Object();
    swapPoint1 = Math.round(Math.random()*(nAttributes-1));
    swapPoint2 = swapPoint1;
    while(swapPoint2 == swapPoint1) {
        swapPoint2 = Math.round(Math.random()*(nAttributes-1));
    }
    var parents = [car_def1, car_def2];
    var curparent = 0;

    curparent = cw_chooseParent(curparent,0);
    newCarDef.wheel_radius1 = parents[curparent].wheel_radius1;
    curparent = cw_chooseParent(curparent,1);
    newCarDef.wheel_radius2 = parents[curparent].wheel_radius2;

    curparent = cw_chooseParent(curparent,2);
    newCarDef.wheel_vertex1 = parents[curparent].wheel_vertex1;
    curparent = cw_chooseParent(curparent,3);
    newCarDef.wheel_vertex2 = parents[curparent].wheel_vertex2;

    newCarDef.vertex_list = [];
    curparent = cw_chooseParent(curparent,4);
    newCarDef.vertex_list[0] = parents[curparent].vertex_list[0];
    curparent = cw_chooseParent(curparent,5);
    newCarDef.vertex_list[1] = parents[curparent].vertex_list[1];
    curparent = cw_chooseParent(curparent,6);
    newCarDef.vertex_list[2] = parents[curparent].vertex_list[2];
    curparent = cw_chooseParent(curparent,7);
    newCarDef.vertex_list[3] = parents[curparent].vertex_list[3];
    curparent = cw_chooseParent(curparent,8);
    newCarDef.vertex_list[4] = parents[curparent].vertex_list[4];
    curparent = cw_chooseParent(curparent,9);
    newCarDef.vertex_list[5] = parents[curparent].vertex_list[5];
    curparent = cw_chooseParent(curparent,10);
    newCarDef.vertex_list[6] = parents[curparent].vertex_list[6];
    curparent = cw_chooseParent(curparent,11);
    newCarDef.vertex_list[7] = parents[curparent].vertex_list[7];

    curparent = cw_chooseParent(curparent,12);
    newCarDef.wheel_density1 = parents[curparent].wheel_density1;
    curparent = cw_chooseParent(curparent,13);
    newCarDef.wheel_density2 = parents[curparent].wheel_density2;

    return newCarDef;
}

function cw_mutate(car_def) {
    if (debug)console.info('cw_mutate');
    if(Math.random() < gen_mutation)
        car_def.wheel_radius1 = Math.random()*wheelMaxRadius+wheelMinRadius;
    if(Math.random() < gen_mutation)
        car_def.wheel_radius2 = Math.random()*wheelMaxRadius+wheelMinRadius;
    if(Math.random() < gen_mutation)
        car_def.wheel_vertex1 = Math.floor(Math.random()*8)%8;
    if(Math.random() < gen_mutation)
        car_def.wheel_vertex2 = Math.floor(Math.random()*8)%8;
    if(Math.random() < gen_mutation)
        car_def.wheel_density1 = Math.random()*wheelMaxDensity+wheelMinDensity;
    if(Math.random() < gen_mutation)
        car_def.wheel_density2 = Math.random()*wheelMaxDensity+wheelMinDensity;

    if(Math.random() < gen_mutation)
        car_def.vertex_list.splice(0,1,new b2Vec2(Math.random()*chassisMaxAxis + chassisMinAxis,0));
    if(Math.random() < gen_mutation)
        car_def.vertex_list.splice(1,1,new b2Vec2(Math.random()*chassisMaxAxis + chassisMinAxis,Math.random()*chassisMaxAxis + chassisMinAxis));
    if(Math.random() < gen_mutation)
        car_def.vertex_list.splice(2,1,new b2Vec2(0,Math.random()*chassisMaxAxis + chassisMinAxis));
    if(Math.random() < gen_mutation)
        car_def.vertex_list.splice(3,1,new b2Vec2(-Math.random()*chassisMaxAxis - chassisMinAxis,Math.random()*chassisMaxAxis + chassisMinAxis));
    if(Math.random() < gen_mutation)
        car_def.vertex_list.splice(4,1,new b2Vec2(-Math.random()*chassisMaxAxis - chassisMinAxis,0));
    if(Math.random() < gen_mutation)
        car_def.vertex_list.splice(5,1,new b2Vec2(-Math.random()*chassisMaxAxis - chassisMinAxis,-Math.random()*chassisMaxAxis - chassisMinAxis));
    if(Math.random() < gen_mutation)
        car_def.vertex_list.splice(6,1,new b2Vec2(0,-Math.random()*chassisMaxAxis - chassisMinAxis));
    if(Math.random() < gen_mutation)
        car_def.vertex_list.splice(7,1,new b2Vec2(Math.random()*chassisMaxAxis + chassisMinAxis,-Math.random()*chassisMaxAxis - chassisMinAxis));
    return car_def;
}

function cw_chooseParent(curparent, attributeIndex) {
    if (debug)console.info('cw_chooseParent');
    var ret;
    if((swapPoint1 == attributeIndex) || (swapPoint2 == attributeIndex)) {
        if(curparent == 1) {
            ret = 0;
        } else {
            ret = 1;
        }
    } else {
        ret = curparent;
    }
    return ret;
}

function cw_setMutation(mutation) {
    if (debug)console.info('cw_setMutation');
    gen_mutation = parseFloat(mutation);
}

function cw_setEliteSize(clones) {
    if (debug)console.info('cw_setEliteSize');
    gen_champions = parseInt(clones, 10);
}

/* ==== END Genration ====================================================== */
/* ========================================================================= */

/* ========================================================================= */
/* ==== Drawing ============================================================ */

function cw_drawScreen() {
//    if (debug)console.info('cw_drawScreen');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    cw_setCameraPosition();
    ctx.translate(200-(camera_x*zoom), 200+(camera_y*zoom));
    ctx.scale(zoom, -zoom);
    cw_drawFloor();
    ghost_draw_frame(ctx, ghost);
    cw_drawCars();
    ctx.restore();
}

function cw_minimapCamera(x, y) {
//    if (debug)console.info('cw_minimapCamera');
    minimapcamera.left = Math.round((2+camera_x) * minimapscale) + "px";
    minimapcamera.top = Math.round((31-camera_y) * minimapscale) + "px";
}

function cw_setCameraTarget(k) {
    if (debug)console.info('cw_setCameraTarget');
    camera_target = k;
}

function cw_setCameraPosition() {
//    if (debug)console.info('cw_setCameraPosition');
    if(camera_target >= 0) {
        var cameraTargetPosition = cw_carArray[camera_target].getPosition();
    } else {
        var cameraTargetPosition = leaderPosition;
    }
//   var diff_y = camera_y - leaderPosition.y;
//   var diff_x = camera_x - leaderPosition.x;
    var diff_y = camera_y - cameraTargetPosition.y;
    var diff_x = camera_x - cameraTargetPosition.x;
    camera_y -= cameraspeed * diff_y;
    camera_x -= cameraspeed * diff_x;
    var zoomto = 100 - (20 * Math.abs(diff_x));
    zoomto = zoomto > 90 ? 90 : zoomto < 30 ? 30 : zoomto;
    zoom = zoomto;
    cw_minimapCamera(camera_x, camera_y);
}

function cw_drawGhostReplay() {
    if (debug)console.info('cw_drawGhostReplay');
    carPosition = ghost_get_position(ghost);
    camera_x = carPosition.x;
    camera_y = carPosition.y;
    cw_minimapCamera(camera_x, camera_y);
    showDistance(Math.round(carPosition.x*100)/100, Math.round(carPosition.y*100)/100);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    ctx.translate(200-(carPosition.x*zoom), 200+(carPosition.y*zoom));
    ctx.scale(zoom, -zoom);
    ghost_draw_frame(ctx, ghost);
    ghost_move_frame(ghost);
    cw_drawFloor();
    ctx.restore();
}

function cw_drawFloor() {
//    if (debug)console.info('cw_drawFloor');
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#777";
    ctx.lineWidth = 1/zoom;
    ctx.beginPath();

    outer_loop:
        for(var k = Math.max(0,last_drawn_tile-20); k < cw_floorTiles.length; k++) {
            var b = cw_floorTiles[k];
            for (f = b.GetFixtureList(); f; f = f.m_next) {
                var s = f.GetShape();
                var shapePosition = b.GetWorldPoint(s.m_vertices[0]).x;
                if((shapePosition > (camera_x - 5)) && (shapePosition < (camera_x + 10))) {
                    cw_drawVirtualPoly(b, s.m_vertices, s.m_vertexCount);
                }
                if(shapePosition > camera_x + 10) {
                    last_drawn_tile = k;
                    break outer_loop;
                }
            }
        }
    ctx.fill();
    ctx.stroke();
}

function cw_drawCars() {
//    if (debug)console.info('cw_drawCars');
    for(var k = (cw_carArray.length-1); k >= 0; k--) {
        myCar = cw_carArray[k];
        if(!myCar.alive) {
            continue;
        }
        myCarPos = myCar.getPosition();

        if(myCarPos.x < (camera_x - 5)) {
            // too far behind, don't draw
            continue;
        }

        ctx.strokeStyle = "#444";
        ctx.lineWidth = 1/zoom;

        b = myCar.wheel1;
        for (f = b.GetFixtureList(); f; f = f.m_next) {
            var s = f.GetShape();
            var color = Math.round(255 - (255 * (f.m_density - wheelMinDensity)) / wheelMaxDensity).toString();
            var rgbcolor = "rgb("+color+","+color+","+color+")";
            cw_drawCircle(b, s.m_p, s.m_radius, b.m_sweep.a, rgbcolor);
        }
        b = myCar.wheel2;
        for (f = b.GetFixtureList(); f; f = f.m_next) {
            var s = f.GetShape();
            var color = Math.round(255 - (255 * (f.m_density - wheelMinDensity)) / wheelMaxDensity).toString();
            var rgbcolor = "rgb("+color+","+color+","+color+")";
            cw_drawCircle(b, s.m_p, s.m_radius, b.m_sweep.a, rgbcolor);
        }
        if(myCar.is_elite) {
            ctx.strokeStyle = "#44c";
            ctx.fillStyle = "#ddf";
        } else {
            ctx.strokeStyle = "#c44";
            ctx.fillStyle = "#fdd";
        }
        ctx.beginPath();
        var b = myCar.chassis;
        for (f = b.GetFixtureList(); f; f = f.m_next) {
            var s = f.GetShape();
            cw_drawVirtualPoly(b, s.m_vertices, s.m_vertexCount);
        }
        ctx.fill();
        ctx.stroke();
    }
}

var changezoom = function (button) {
    if (debug)console.info('changezoom');
    zoom = button.value >> 0;
};

function toggleDisplay() {
    if (debug)console.info('toggleDisplay');
    if(cw_paused) {
        return;
    }
    canvas.width = canvas.width;
    if(doDraw) {
        doDraw = false;
        cw_stopSimulation();
        cw_runningInterval = setInterval(simulationStep, 1); // simulate 1000x per second when not drawing
    } else {
        doDraw = true;
        clearInterval(cw_runningInterval);
        cw_startSimulation();
    }
}

function cw_drawVirtualPoly(body, vtx, n_vtx) {
//    if (debug)console.info('cw_drawVirtualPoly');
    // set strokestyle and fillstyle before call
    // call beginPath before call

    var p0 = body.GetWorldPoint(vtx[0]);
    ctx.moveTo(p0.x, p0.y);
    for (var i = 1; i < n_vtx; i++) {
        p = body.GetWorldPoint(vtx[i]);
        ctx.lineTo(p.x, p.y);
    }
    ctx.lineTo(p0.x, p0.y);
}

function cw_drawPoly(body, vtx, n_vtx) {
    if (debug)console.info('cw_drawPoly');
    // set strokestyle and fillstyle before call
    ctx.beginPath();

    var p0 = body.GetWorldPoint(vtx[0]);
    ctx.moveTo(p0.x, p0.y);
    for (var i = 1; i < n_vtx; i++) {
        p = body.GetWorldPoint(vtx[i]);
        ctx.lineTo(p.x, p.y);
    }
    ctx.lineTo(p0.x, p0.y);

    ctx.fill();
    ctx.stroke();
}

function cw_drawCircle(body, center, radius, angle, color) {
//    if (debug)console.info('cw_drawCircle');
    var p = body.GetWorldPoint(center);
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, 2*Math.PI, true);

    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + radius*Math.cos(angle), p.y + radius*Math.sin(angle));

    ctx.fill();
    ctx.stroke();
}

function cw_drawMiniMap() {
    if (debug)console.info('cw_drawMiniMap');
    var last_tile = null;
    var tile_position = new b2Vec2(-5,0);
    minimapfogdistance = 0;
    fogdistance.width = "800px";
    minimapcanvas.width = minimapcanvas.width;
    minimapctx.strokeStyle = "#000";
    minimapctx.beginPath();
    minimapctx.moveTo(0,35 * minimapscale);
    for(var k = 0; k < cw_floorTiles.length; k++) {
        last_tile = cw_floorTiles[k];
        last_fixture = last_tile.GetFixtureList();
        last_world_coords = last_tile.GetWorldPoint(last_fixture.GetShape().m_vertices[3]);
        tile_position = last_world_coords;
        minimapctx.lineTo((tile_position.x + 5) * minimapscale, (-tile_position.y + 35) * minimapscale);
    }
    minimapctx.stroke();
}

/* ==== END Drawing ======================================================== */
/* ========================================================================= */


/* ========================================================================= */
/* ==== Graphs ============================================================= */

function cw_storeGraphScores() {
    if (debug)console.info('cw_storeGraphScores');
    cw_graphAverage.push(cw_average(cw_carScores));
    cw_graphElite.push(cw_eliteaverage(cw_carScores));
    cw_graphTop.push(cw_carScores[0].v);
}

function cw_plotTop() {
    if (debug)console.info('cw_plotTop');
    var graphsize = cw_graphTop.length;
    graphctx.strokeStyle = "#f00";
    graphctx.beginPath();
    graphctx.moveTo(0,0);
    for(var k = 0; k < graphsize; k++) {
        graphctx.lineTo(400*(k+1)/graphsize,cw_graphTop[k]);
    }
    graphctx.stroke();
}

function cw_plotElite() {
    if (debug)console.info('cw_plotElite');
    var graphsize = cw_graphElite.length;
    graphctx.strokeStyle = "#0f0";
    graphctx.beginPath();
    graphctx.moveTo(0,0);
    for(var k = 0; k < graphsize; k++) {
        graphctx.lineTo(400*(k+1)/graphsize,cw_graphElite[k]);
    }
    graphctx.stroke();
}

function cw_plotAverage() {
    if (debug)console.info('cw_plotAverage');
    var graphsize = cw_graphAverage.length;
    graphctx.strokeStyle = "#00f";
    graphctx.beginPath();
    graphctx.moveTo(0,0);
    for(var k = 0; k < graphsize; k++) {
        graphctx.lineTo(400*(k+1)/graphsize,cw_graphAverage[k]);
    }
    graphctx.stroke();
}

function plot_graphs() {
    if (debug)console.info('plot_graphs');
    cw_storeGraphScores();
    cw_clearGraphics();
    cw_plotAverage();
    cw_plotElite();
    cw_plotTop();
    cw_listTopScores();
    carmaxspeed = 0;
}


function cw_eliteaverage(scores) {
    if (debug)console.info('cw_eliteaverage');
    var sum = 0;
    for(var k = 0; k < Math.floor(generationSize/2); k++) {
        sum += scores[k].v;
    }
    return sum/Math.floor(generationSize/2);
}

function cw_average(scores) {
    if (debug)console.info('cw_average');
    var sum = 0;
    for(var k = 0; k < generationSize; k++) {
        sum += scores[k].v;
    }
    return sum/generationSize;
}

function cw_clearGraphics() {
    if (debug)console.info('cw_clearGraphics');
    graphcanvas.width = graphcanvas.width;
    graphctx.translate(0,graphheight);
    graphctx.scale(1,-1);
    graphctx.lineWidth = 1;
    graphctx.strokeStyle="#888";
    graphctx.beginPath();
    graphctx.moveTo(0,graphheight/2);
    graphctx.lineTo(graphwidth, graphheight/2);
    graphctx.moveTo(0,graphheight/4);
    graphctx.lineTo(graphwidth, graphheight/4);
    graphctx.moveTo(0,graphheight*3/4);
    graphctx.lineTo(graphwidth, graphheight*3/4);
    graphctx.stroke();
}

function cw_listTopScores() {
    var ts = document.getElementById("topscores");
    ts.innerHTML = "Top Scores:<br />";
    cw_topScores.sort(function(a,b) {if(a.v > b.v) {return -1} else {return 1}});
    for(var k = 0; k < Math.min(10,cw_topScores.length); k++) {
        var cw_topScore = cw_topScores[k];
        var topscoretext = "#"+(k+1)+": "+Math.round(cw_topScore.v*100)/100+" " +
            "d:"+Math.round(cw_topScore.x*100)/100+" " +
            "h:"+Math.round(cw_topScore.y2*100)/100+"/"+Math.round(cw_topScore.y*100)/100+"m " +
            "speed:"+cw_topScore.ms + "km/h " +

            "(gen "+cw_topScore.i+")<br />";
        document.getElementById("topscores").innerHTML += topscoretext;
    }
}

/* ==== END Graphs ========================================================= */
/* ========================================================================= */

function simulationStep() {
//    if (debug)console.info('simulationStep', generationSize);
    world.Step(1/box2dfps, 20, 20);
    ghost_move_frame(ghost);
    for(var k = 0; k < generationSize; k++) {
//        if (debug)console.info('simulationStep', k);
        if(!cw_carArray[k].alive) {
            continue;
        }
        ghost_add_replay_frame(cw_carArray[k].replay, cw_carArray[k]);
        cw_carArray[k].frames++;
        position = cw_carArray[k].getPosition();
        cw_carArray[k].minimapmarker.left = Math.round((position.x+5) * minimapscale) + "px";
        cw_carArray[k].healthBar.width = Math.round((cw_carArray[k].health/max_car_health)*100) + "%";
        if(cw_carArray[k].checkDeath()) {
            cw_carArray[k].kill();
            cw_deadCars++;
            document.getElementById("population").innerHTML = "cars alive: " + (generationSize-cw_deadCars);
            if(cw_deadCars >= generationSize) {
                cw_newRound();
            }
            if(leaderPosition.leader == k) {
                // leader is dead, find new leader
                cw_findLeader();
            }
            continue;
        }
        if(position.x > leaderPosition.x) {
            leaderPosition = position;
            leaderPosition.leader = k;
        }
    }
    showDistance(Math.round(leaderPosition.x*100)/100, Math.round(leaderPosition.y*100)/100);
}

function cw_findLeader() {
//    if (debug)console.info('cw_findLeader');
    var lead = 0;
    for(var k = 0; k < cw_carArray.length; k++) {
        if(!cw_carArray[k].alive) {
            continue;
        }
        position = cw_carArray[k].getPosition();
        if(position.x > lead) {
            leaderPosition = position;
            leaderPosition.leader = k;
        }
    }
}

function cw_newRound() {
    if (debug)console.info('cw_newRound');
//  cw_stopSimulation();
//   for (b = world.m_bodyList; b; b = b.m_next) {
//     world.DestroyBody(b);
//   }
//   // world = new b2World(gravity, doSleep);
//   cw_createFloor();
    cw_nextGeneration();
    ghost_reset_ghost(ghost);
    camera_x = camera_y = 0;
    cw_setCameraTarget(-1);
//  cw_startSimulation();
}

function cw_startSimulation() {
    if (debug)console.info('cw_startSimulation');
    if(!started){
        started = true;
        cw_runningInterval = setInterval(simulationStep, Math.round(1000/box2dfps));
        cw_drawInterval = setInterval(cw_drawScreen, Math.round(1000/screenfps));
    }
}

function cw_stopSimulation() {
    clearInterval(cw_runningInterval);
    clearInterval(cw_drawInterval);
}

function cw_kill() {
    if (debug)console.info('cw_kill');
    var avgspeed = (myCar.maxPosition / myCar.frames) * box2dfps;
    var position = myCar.maxPosition;
    var score = position + avgspeed;
    document.getElementById("cars").innerHTML += Math.round(position*100)/100 + "m + " +" "+Math.round(avgspeed*100)/100+" m/s = "+ Math.round(score*100)/100 +"pts<br />";
    ghost_compare_to_replay(replay, ghost, score);
    cw_carScores.push({ i:current_car_index, v:score, s: avgspeed, x:position, y:myCar.maxPositiony, y2:myCar.minPositiony });
    current_car_index++;
    cw_killCar();
    if(current_car_index >= generationSize) {
        cw_nextGeneration();
        current_car_index = 0;
    }
    myCar = cw_createNextCar();
    last_drawn_tile = 0;
}

function cw_resetPopulation() {
    if (debug)console.info('cw_resetPopulation');
    document.getElementById("generation").innerHTML = "";
    document.getElementById("cars").innerHTML = "";
    document.getElementById("topscores").innerHTML = "";
    cw_clearGraphics();
    cw_carArray = [];
    cw_carGeneration = [];
    cw_carScores = [];
    cw_topScores = [];
    cw_graphTop = [];
    cw_graphElite = [];
    cw_graphAverage = [];
    lastmax = 0;
    lastaverage = 0;
    lasteliteaverage = 0;
    swapPoint1 = 0;
    swapPoint2 = 0;
    cw_generationZero();
}

function cw_resetWorld() {
    if (debug)console.info('cw_resetWorld');
    doDraw = true;
    cw_stopSimulation();
    for (b = world.m_bodyList; b; b = b.m_next) {
        world.DestroyBody(b);
    }
    floorseed = document.getElementById("newseed").value;
    Math.seedrandom(floorseed);
    cw_createFloor();
    cw_drawMiniMap();
    Math.seedrandom();
    cw_resetPopulation();
    cw_startSimulation();
}

function cw_confirmResetWorld() {
    if (debug)console.info('cw_confirmResetWorld');
    if(confirm('Really reset world?')) {
        cw_resetWorld();
    } else {
        return false;
    }
}

// ghost replay stuff

var togglePause = function (button) {
    if (debug)console.info('togglePause');
    var value = '';
    if(cw_paused){
        cw_resumeSimulation();
        value = 'pause';
    }
    else{
        cw_pauseSimulation();
        value = 'play';
    }
    button.value = value;

};
function cw_pauseSimulation() {
    if (debug)console.info('cw_pauseSimulation');
    cw_paused = true;
    clearInterval(cw_runningInterval);
    clearInterval(cw_drawInterval);
    old_last_drawn_tile = last_drawn_tile;
    last_drawn_tile = 0;
    ghost_pause(ghost);
}

function cw_resumeSimulation() {
    if (debug)console.info('cw_resumeSimulation');
    cw_paused = false;
    ghost_resume(ghost);
    last_drawn_tile = old_last_drawn_tile;
    cw_runningInterval = setInterval(simulationStep, Math.round(1000/box2dfps));
    cw_drawInterval = setInterval(cw_drawScreen, Math.round(1000/screenfps));
}

function cw_startGhostReplay() {
    if (debug)console.info('cw_startGhostReplay');
    if(!doDraw) {
        toggleDisplay();
    }
    cw_pauseSimulation();
    cw_ghostReplayInterval = setInterval(cw_drawGhostReplay,Math.round(1000/screenfps));
}

function cw_stopGhostReplay() {
    if (debug)console.info('cw_stopGhostReplay');
    clearInterval(cw_ghostReplayInterval);
    cw_ghostReplayInterval = null;
    cw_findLeader();
    camera_x = leaderPosition.x;
    camera_y = leaderPosition.y;
    cw_resumeSimulation();
}

function cw_toggleGhostReplay(button) {
    if (debug)console.info('cw_toggleGhostReplay');
    if(cw_ghostReplayInterval == null) {
        cw_startGhostReplay();
        button.value = "Resume simulation";
    } else {
        cw_stopGhostReplay();
        button.value = "View top replay";
    }
}
// ghost replay stuff END

// initial stuff, only called once (hopefully)
function cw_init() {
    if (debug)console.info('cw_init');
    // clone silver dot and health bar
    var mmm = document.getElementsByName('minimapmarker')[0];
    var hbar = document.getElementsByName('healthbar')[0];

    for(var k = 0; k < generationSize; k++) {

        // minimap markers
        var newbar = mmm.cloneNode(true);
        newbar.id = "bar"+k;
        newbar.style.paddingTop = k*9+"px";
        minimapholder.appendChild(newbar);

        // health bars
        var newhealth = hbar.cloneNode(true);
        newhealth.getElementsByTagName("DIV")[0].id = "health"+k;
        newhealth.car_index = k;
        document.getElementById("health").appendChild(newhealth);
    }
    mmm.parentNode.removeChild(mmm);
    hbar.parentNode.removeChild(hbar);
    floorseed = Math.seedrandom();
    world = new b2World(gravity, doSleep);
    cw_createFloor();
    cw_drawMiniMap();
    cw_generationZero();
//  cw_runningInterval = setInterval(simulationStep, Math.round(1000/box2dfps));
//  cw_drawInterval = setInterval(cw_drawScreen, Math.round(1000/screenfps));
}

cw_init();