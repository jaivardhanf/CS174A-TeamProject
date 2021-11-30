import {defs, tiny} from './examples/common.js';
import { Shape_From_File } from './examples/obj-file-demo.js';
import { Text_Line } from './examples/text-demo.js';


const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Shader, Texture, Material, Scene,
} = tiny;

class Base_Scene extends Scene {
     // Base_scene is a Scene that can be added to any display canvas.
     // Setup the shapes, materials, camera, and lighting here.

    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();
        this.hover = this.swarm = false;
        this.scratchpad = document.createElement('canvas');
        // A hidden canvas for re-sizing the real canvas to be square:
        this.scratchpad_context = this.scratchpad.getContext('2d');
        this.scratchpad.width = 256;
        this.scratchpad.height = 256;                // Initial image source: Blank gif file:
        this.texture = new Texture("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
        
        this.change_lighting_color = false;
        this.light_color = color(1,1,1,1);

        // Colors for Fish
        this.fish_color_array = [];
        this.set_fish_colors();

        // Save mouse x,y position when player clicks
        this.mousex;
        this.mousey;
       
        // Draw Object Flags + Queue 
        this.userdraw = "none"; 
        this.coral_queue = [];

        // Sounds
        this.background_sound = new Audio("assets/backgroundmusic.mp3"); 
        this.munch_sound = new Audio("assets/munch.mp3"); 

        const bump = new defs.Fake_Bump_Map(1);
        const textured = new defs.Textured_Phong(1);

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            box: new defs.Cube(),
            sphere: new defs.Subdivision_Sphere(4),
            square: new defs.Square(),
            fishbody: new defs.Subdivision_Sphere(4),
            turtlebody: new defs.Subdivision_Sphere(2),
            sharkbody: new defs.Subdivision_Sphere(2),
            egg: new defs.Subdivision_Sphere(4),
            rock: new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(2),
            waterbox: new defs.Subdivision_Sphere(4),
            tail: new defs.Triangle(),
            sand: new defs.Capped_Cylinder(50, 50, [[0, 2], [0, 1]]),
            coral1: new Shape_From_File("assets/coral1.obj"),
            coral2: new Shape_From_File("assets/coral2.obj"),
            coral3: new Shape_From_File("assets/coral3.obj"),
            coral4: new Shape_From_File("assets/coral4.obj"),
            coral5: new Shape_From_File("assets/coral5.obj"),
            coral6: new Shape_From_File("assets/coral6.obj"),
            shell1: new Shape_From_File("assets/shell2.obj"),
            snail: new Shape_From_File("assets/snail.obj"),
            starfish: new Shape_From_File("assets/starfish.obj"),
            seashell: new Shape_From_File("assets/swirlshell.obj"),
            jellyfish: new Shape_From_File("assets/jellyfish.obj"),
            treasurechest: new Shape_From_File("assets/treasurechest.obj"),
            nessy: new Shape_From_File("assets/nessy.obj"),
            poseidon: new Shape_From_File("assets/poseidon.obj"),
            temple: new Shape_From_File("assets/temple.obj"),
            hemi: new Shape_From_File("assets/hemi.obj"),
            squid: new Shape_From_File("assets/squid.obj"),
            text: new Text_Line(35),


        };
        
        // Materials
        this.materials = {
            menu: new Material(textured,
                {ambient: 0.9, diffusivity: .9, texture: new Texture("assets/wood2.jpg")}),
            menubuttons: new Material(textured,
                {ambient: 0.9, diffusivity: 1, specularity: 1,  texture: new Texture("assets/bubble3.png")}),
            dollarsign: new Material(textured,
                {ambient: 1, diffusivity: 1, specularity: 1,  color: hex_color("#000000"), texture: new Texture("assets/dollarsign.png")}),
            eight: new Material(textured,
                {ambient: 1, diffusivity: 1, specularity: 1,  color: hex_color("#000000"), texture: new Texture("assets/eight.png")}),
            shark: new Material(new Gouraud_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#BFD8E0")}),
            eye: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#000000")}),
            turtle: new Material(new Gouraud_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#548a62")}),
            turtlelimbs: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#33573c")}),
            egg: new Material(new defs.Phong_Shader(),
                {ambient: .6, diffusivity: .6, specularity: 1, color: hex_color("#FFFFFF")}),
            guppies: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#FBAB7F")}),
            tails: new Material(new Tail_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#FBAB7F")}),
            sand: new Material(textured,
                {ambient: 0.3, diffusivity: .9, color: hex_color("#ffaf40")}),
            sand2: new Material(textured, 
                {ambient: 0.8, diffusivity: .9, texture: new Texture("assets/sand3.png")}),
            b: new Material(textured, {ambient: .5, texture: new Texture("assets/water.jpeg")}),
            coral1: new Material(new defs.Phong_Shader(), 
                {ambient: 0.3, diffusivity: .9, specularity: 1, color: hex_color("#f28dae")}),
            coral2: new Material(new defs.Phong_Shader(), 
                {ambient: 0.3, diffusivity: .9, specularity: 1, color: hex_color("#f28dae")}),
            jellyfish: new Material(new Jellyfish_Shader(), 
                {ambient: 0.3, diffusivity: .9, specularity: 1, color: hex_color("#f28dae")}),
            rock: new Material(new Gouraud_Shader(),
                {ambient: 0.6, diffusivity: .9, color: hex_color("#9c9c9c")}),
            shell1: new Material(new Gouraud_Shader(),
                {ambient: 0.3, diffusivity: .9, specularity: 1, color: hex_color("#ffc0ad")}),
            shelltexture: new Material(textured,
                {ambient: 1, color: hex_color("#000000"), texture: new Texture("assets/seashelltexture.jpg")}),
            snail: new Material(new Gouraud_Shader(),
                {ambient: 0.3, diffusivity: .6, specularity: 0, color: hex_color("#97ccb1")}),
         // To show text you need a Material like this one:
            gold: new Material(textured, 
                {ambient: 1, diffusivity: .9, specularity: 1, texture: new Texture("assets/gold.jpg")}),
            redwood: new Material(textured,
                {ambient: 0.9, diffusivity: .9, texture: new Texture("assets/redwood.jpg")}),
            text_image: new Material(textured, 
                {ambient: 1, diffusivity: 0, specularity: 0, texture: new Texture("assets/text.png")}),
            dash_board: new Material(textured,
                {ambient: 0.2, diffusivity: .9, color: hex_color("#000000")}),

        };

        /* Turtle coordinates */
        this.y_movement = 0;
        this.x_movement = 0;
        
        /* Coordinates and time offsets for fishes & sharks */
        this.x_spawn_left = Array.from({length: 5}, () => Math.floor(Math.random() * (-100 +30) -30));
        this.y_spawn_left = Array.from({length: 5}, () => Math.floor(Math.random() * 18));
        this.time_offsets_left = Array(5).fill(0);

        this.x_spawn_right = Array.from({length: 5}, () => Math.floor(Math.random() * (100 - 30) + 30));
        this.y_spawn_right = Array.from({length: 5}, () => Math.floor(Math.random() * 18));
        this.time_offsets_right = Array(5).fill(0);

        this.x_shark_spawn_left = Array.from({length: 5}, () => Math.floor(Math.random() * (-100 + 30) -30));
        this.y_shark_spawn_left = Array.from({length: 5}, () => Math.floor(Math.random() * 18));
        this.time_shark_offsets_left = Array(5).fill(0);

        this.x_shark_spawn_right = Array.from({length: 5}, () => Math.floor(Math.random() * (100 - 30) + 30));
        this.y_shark_spawn_right = Array.from({length: 5}, () => Math.floor(Math.random() * 18));
        this.time_shark_offsets_right = Array(5).fill(0);

        //Used to keep track of scaling of turtle during collision detection        
        this.turtle_body_global = Mat4.identity();
        this.turtle_head_global = Mat4.identity();
        this.turtle_larm_global = Mat4.identity();
        this.turtle_rarm_global = Mat4.identity();
        this.turtle_lleg_global = Mat4.identity();
        this.turtle_rleg_global = Mat4.identity();

        //Used to readjust sensitivity of collisoin detection when turtle grows/decreases
        this.collision_count = 0;
        this.sand_dollars = 0;
        this.total_spent = 0;
        this.lifes = 3;
        this.draw_in_prog = false;
        this.offset = 0;
        this.left_shark_count = 3;
        this.right_shark_count = 3;
;
    }
}

export class Assignment2 extends Base_Scene {  


    make_control_panel() {

        // Up Movement (arrow key up)
        this.key_triggered_button("Up", ['ArrowUp'], () => {
            this.y_movement = this.y_movement + 1;

        });
        // Down Movement (arrow key down)
        this.key_triggered_button("Down", ['ArrowDown'], () => {
            this.y_movement = this.y_movement - 1; 
        });
        
        // Left Movement (arrow key left)
        this.key_triggered_button("Left", ['ArrowLeft'], () => {
            this.x_movement = this.x_movement - 1; 
        });

        // Right Movement (arrow key right)
        this.key_triggered_button("Right", ['ArrowRight'], () => {
            this.x_movement = this.x_movement + 1; 
        });

        this.key_triggered_button("Change Lighting Color", ['c'], () => {
            this.change_lighting_color = true; 
        });

        this.key_triggered_button("Start Music/Game", ['0'], () => {
            // loop background audio
            if (typeof this.background_sound.loop == 'boolean')
            {
                this.background_sound.loop = true;
            }
            else
            {
                this.background_sound.addEventListener('ended', function() {
                    this.currentTime = 0;
                    this.play();
                }, false);
            }
            this.background_sound.play(); 
        });

        this.key_triggered_button("Stop Music/Pause Game", ['p'], () => {
            // loop background audio
            this.background_sound.pause(); 
        });
    }

    set_fish_colors() {
        // Fill two array with 50 random colors, for fishies
        for (var i = 0; i < 50; i++) {
            this.fish_color_array[i] = color(Math.random(), Math.random(), Math.random(), 1.0);
        }
    }

    set_light_color() {
        this.light_color = color(Math.random(), Math.random(), Math.random(), 1.0);
    }

    /* When called, the following functions give new coordinates to a specefic */
    new_fish_cord_left(fish_count, t){
        this.x_spawn_left[fish_count] = Math.floor(Math.random() * (-150 +30) -30);
        this.y_spawn_left[fish_count] = Math.floor(Math.random() * 18);
        this.time_offsets_left[fish_count] = t;
    }

    new_fish_cord_right(fish_count,t){
        this.x_spawn_right[fish_count] = Math.floor(Math.random() * (100 - 30) + 30);
        this.y_spawn_right[fish_count] = Math.floor(Math.random() * 18);
        this.time_offsets_right[fish_count] = t;

    }

    new_shark_cord_left(shark_count, t){
        this.x_shark_spawn_left[shark_count] = Math.floor(Math.random() * (-150 +50) -50);
        this.y_shark_spawn_left[shark_count] = Math.floor(Math.random() * 18);
        this.time_shark_offsets_left[shark_count] = t;

    }

    new_shark_cord_right(shark_count, t){
        this.x_shark_spawn_right[shark_count] = Math.floor(Math.random() * (150 - 50) + 50);
        this.y_shark_spawn_right[shark_count] = Math.floor(Math.random() * 18);
        this.time_shark_offsets_right[shark_count] = t;

    }

    /* Draws fishes coming from left*/
    draw_fishes_left(context, program_state, model_transform, fish_count, t, speed) { 
            let fish_color = this.fish_color_array[fish_count];
            var x_cord = this.x_spawn_left[fish_count];
            var y_cord = this.y_spawn_left[fish_count];
        /* Checks if current x-coord is offscreen, if its not it just keeps swimming :) */
        if(x_cord+((t-this.time_offsets_left[fish_count])*speed) < 25){             
            let fish_trans = model_transform.times(Mat4.translation(x_cord, y_cord, 0, 0))
                                              .times(Mat4.translation((t-this.time_offsets_left[fish_count])*speed,0,0,0))
                                              .times(Mat4.scale(0.8,0.6,0.5,1));
      
            this.shapes.fishbody.draw(context, program_state, fish_trans, this.materials.guppies.override({color:fish_color}));

            let max_angle = .1 * Math.PI;
            let tail_rot = ((max_angle/2) + (max_angle/2) * (Math.sin(Math.PI*(t*4))));

            let tail_trans = model_transform.times(Mat4.translation(x_cord-0.5, y_cord, 0, 0))
                                             .times(Mat4.translation((t-this.time_offsets_left[fish_count])*speed,0,0,0))
                                             .times(Mat4.scale(1,1,1,1))
                                             .times(Mat4.rotation(-73,0,0,1))
                                             .times(Mat4.rotation(tail_rot,0,1,0));
            this.shapes.tail.draw(context, program_state, tail_trans, this.materials.tails.override({color:fish_color}));
        /* If fish off screen, we update it the time offset since we use time to translate in above bracket
           Also updated coordinates so it looks more random
        */
        }else{
            this.new_fish_cord_left(fish_count, t);
        }
    }
    

    /* Draws fishes coming from right */    
    draw_fishes_right(context, program_state, model_transform, fish_count, t, speed){
        let fish_color = this.fish_color_array[fish_count * 5];
        var fish = [];
        var x_cord = this.x_spawn_right[fish_count];
        var y_cord = this.y_spawn_right[fish_count];
        /* Checks if current x-coord is offscreen, if its not it just keeps swimming :) */
        if(x_cord-((t-this.time_offsets_right[fish_count])*speed) > -35){
            let fish_trans = model_transform.times(Mat4.translation(x_cord, y_cord, 0, 0))
                                              .times(Mat4.translation(-(t-this.time_offsets_right[fish_count])*speed,0,0,0))
                                              .times(Mat4.scale(0.8,0.6,0.5,1));
      
            this.shapes.fishbody.draw(context, program_state, fish_trans, this.materials.guppies.override({color:fish_color}));

            let max_angle = .1 * Math.PI;
            let tail_rot = ((max_angle/2) + (max_angle/2) * (Math.sin(Math.PI*(t*4))));

            let tail_trans = model_transform.times(Mat4.translation(x_cord+0.5, y_cord, 0, 0))
                                             .times(Mat4.translation(-(t-this.time_offsets_right[fish_count])*speed,0,0,0))
                                             .times(Mat4.scale(1,1,1,1))
                                             .times(Mat4.rotation(74.61,0,0,1))
                                             .times(Mat4.rotation(-tail_rot,0,1,0));
            this.shapes.tail.draw(context, program_state, tail_trans, this.materials.tails.override({color:fish_color}));
        /* If fish off screen, we update it the time offset since we use time to translate in above bracket
           Also updated coordinates so it looks more random
        */
        }else{
            this.new_fish_cord_right(fish_count, t);
        }
        
    }
    draw_shark_left(context, program_state, model_transform, shark_count, t, speed){
        var x_cord = this.x_shark_spawn_left[shark_count];
        var y_cord = this.y_shark_spawn_left[shark_count];
        
        /* Checks if current x-coord is offscreen, if its not it just keeps swimming :) */

        if(x_cord+((t-this.time_shark_offsets_left[shark_count])*speed) < 25){
            let shark_transform = model_transform.times(Mat4.translation(x_cord, y_cord, 0, 0))
                                             .times(Mat4.translation((t-this.time_shark_offsets_left[shark_count])*speed,0,0,0))
                                             .times(Mat4.scale(3,1.5,1,1));
            this.shapes.sharkbody.draw(context, program_state, shark_transform, this.materials.shark);

            let eye_transform = model_transform.times(Mat4.translation(x_cord+2, y_cord, 0.8, 0))
                                             .times(Mat4.translation((t-this.time_shark_offsets_left[shark_count])*speed,0,0,0))
                                             .times(Mat4.scale(0.1,0.1,0.1,1));
            this.shapes.fishbody.draw(context, program_state, eye_transform, this.materials.eye);

            let tails_transform = model_transform.times(Mat4.translation(x_cord-3, y_cord, 0, 0))
                                             .times(Mat4.translation((t-this.time_shark_offsets_left[shark_count])*speed,0,0,0))
                                             .times(Mat4.scale(2,1.5,1,1))
                                             .times(Mat4.rotation(-74.7,0,0,1));
            this.shapes.tail.draw(context, program_state, tails_transform, this.materials.shark);

            let tails2_transform = model_transform.times(Mat4.translation(x_cord-3, y_cord, 0, 0))
                                             .times(Mat4.translation((t-this.time_shark_offsets_left[shark_count])*speed,0,0,0))
                                             .times(Mat4.scale(2,1.5,1,1))
                                             .times(Mat4.rotation(-27.4,0,0,1));
            this.shapes.tail.draw(context, program_state, tails2_transform, this.materials.shark);

            let fin_transform = model_transform.times(Mat4.translation(x_cord-0.5, y_cord+1.2, 0, 0))
                                             .times(Mat4.translation((t-this.time_shark_offsets_left[shark_count])*speed,0,0,0))
                                             .times(Mat4.scale(2,1.5,1,1))
                                             .times(Mat4.rotation(-145,0,0,1));
            this.shapes.tail.draw(context, program_state, fin_transform, this.materials.shark);

        /* 
           If shark off screen, we update it the time offset since we use time to translate in above above bracket
           Also updated coordinates so it looks more random
        */
        }else{
            this.new_shark_cord_left(shark_count, t);
        }

    }

    draw_shark_right(context, program_state, model_transform, shark_count, t, speed){
        var x_cord = this.x_shark_spawn_right[shark_count];
        var y_cord = this.y_shark_spawn_right[shark_count];
        
        /* Checks if current x-coord is offscreen, if its not it just keeps swimming :) */
        if(x_cord-((t-this.time_shark_offsets_right[shark_count])*speed) > -35){
            let shark_transform = model_transform.times(Mat4.translation(x_cord, y_cord, 0, 0))
                                             .times(Mat4.translation(-(t-this.time_shark_offsets_right[shark_count])*speed,0,0,0))
                                             .times(Mat4.scale(3,1.5,1,1));
            this.shapes.sharkbody.draw(context, program_state, shark_transform, this.materials.shark);

            let eye_transform = model_transform.times(Mat4.translation(x_cord-2, y_cord, 0.8, 0))
                                             .times(Mat4.translation(-(t-this.time_shark_offsets_right[shark_count])*speed,0,0,0))
                                             .times(Mat4.scale(0.1,0.1,0.1,1));
            this.shapes.fishbody.draw(context, program_state, eye_transform, this.materials.eye);

            let tails_transform = model_transform.times(Mat4.translation(x_cord+3.03, y_cord, 0, 0))
                                             .times(Mat4.translation(-(t-this.time_shark_offsets_right[shark_count])*speed,0,0,0))
                                             .times(Mat4.scale(2,1.5,1,1))
                                             .times(Mat4.rotation(20,0,0,1));
            this.shapes.tail.draw(context, program_state, tails_transform, this.materials.shark);

            let tails2_transform = model_transform.times(Mat4.translation(x_cord+3.03, y_cord, 0, 0))
                                             .times(Mat4.translation(-(t-this.time_shark_offsets_right[shark_count])*speed,0,0,0))
                                             .times(Mat4.scale(2,1.5,1,1))
                                             .times(Mat4.rotation(60,0,0,1));
            this.shapes.tail.draw(context, program_state, tails2_transform, this.materials.shark);

            let fin_transform = model_transform.times(Mat4.translation(x_cord-0.5, y_cord+1.3, 0, 0))
                                             .times(Mat4.translation(-(t-this.time_shark_offsets_right[shark_count])*speed,0,0,0))
                                             .times(Mat4.scale(2,1.5,1,1))
                                             .times(Mat4.rotation(-145,0,0,1));
            this.shapes.tail.draw(context, program_state, fin_transform, this.materials.shark);

        /* 
           If shark off screen, we update it the time offset since we use time to translate in above above bracket
           Also updated coordinates so it looks more random
        */
        }else{
            this.new_shark_cord_right(shark_count, t);
        }

    }

    /* Called when collision is detected with fish, scales turtle bigger */
    collision_scale(){
        this.turtle_body_global = this.turtle_body_global.times(Mat4.scale(1.015,1.015,1,0));
        this.turtle_head_global = this.turtle_head_global.times(Mat4.scale(1.015,1.015,1.015,0))
                                                         .times(Mat4.translation(0,0.025,0));
        

        this.turtle_larm_global = this.turtle_larm_global.times(Mat4.scale(1.015,1.015,1.015,0))
                                                         .times(Mat4.translation(-0.025,0.025,0));
    
        this.turtle_rarm_global = this.turtle_rarm_global.times(Mat4.scale(1.015,1.015,1.015,0))
                                                         .times(Mat4.translation(0.025,0.025,0));
        
        this.turtle_lleg_global = this.turtle_lleg_global.times(Mat4.scale(1.015,1.015,1.015,0))
                                                         .times(Mat4.translation(-0.025,-0.025,0));
        
        this.turtle_rleg_global = this.turtle_rleg_global.times(Mat4.scale(1.015,1.015,1.015,0))
                                                         .times(Mat4.translation(0.025,-0.025,0));
        //used for collision detection sensitivity
        this.collision_count = this.collision_count + 1;
    }


    
    detect_fish_collision_left(fish_count, t, speed){
        /* Gets current fishes coordinates with respect to time */
        let fish_x_cord = this.x_spawn_left[fish_count] + ((t-this.time_offsets_left[fish_count])*speed);
        let fish_y_cord = this.y_spawn_left[fish_count];
        let turtle_x = this.x_movement;
        let turtle_y = this.y_movement;
        /*Gets turtle and fishes coordinates on the same scale */
        //turtle_x bounds:[-36, 23] turtle_y bounds: [-6.5, 49] 
        //fish_x_cord bounds [-27,17] fish_y_cord bounds [-3.5 ,22]
        //fish_x_cord converted to turtle_x coords using equation: Turtle-X_cord = fish_x_cord(59/44) - 9/44
        //fish_x_cord converted to turtle_x coords using equation: Turtle-Y_cord = fish_y_cord(59/44) - 9/44
        let fish_to_turtle_x = fish_x_cord*(59/44) - 9/44;
        let fish_to_turtle_y = fish_y_cord*(37/17) + 19/17;
        if((Math.abs(fish_to_turtle_x - turtle_x) < 2 + this.collision_count*0.05) && (Math.abs(fish_to_turtle_y - this.y_movement) < 3.2 + this.collision_count*0.075)){
            this.munch_sound.play();
            this.new_fish_cord_left(fish_count, t);
            this.collision_scale();
            this.sand_dollars = this.sand_dollars + 2;         
        }
    }

    detect_fish_collision_right(fish_count, t, speed){
        /* Gets current fishes coordinates with respect to time */
        let fish_x_cord = this.x_spawn_right[fish_count] - ((t-this.time_offsets_right[fish_count])*speed);
        let fish_y_cord = this.y_spawn_right[fish_count];
        let turtle_x = this.x_movement;
        let turtle_y = this.y_movement;
        /*Gets turtle and fishes coordinates on the same scale */
        let fish_to_turtle_x = fish_x_cord*(59/44) - 9/44;
        let fish_to_turtle_y = fish_y_cord*(37/17) + 19/17;
        if((Math.abs(fish_to_turtle_x - turtle_x) < 2 + this.collision_count*0.05) && (Math.abs(fish_to_turtle_y - this.y_movement) < 3.2 + this.collision_count*0.075)){
            this.munch_sound.play();
            this.new_fish_cord_right(fish_count,t);
            this.collision_scale();
            this.sand_dollars = this.sand_dollars + 2; 
        }
    }

    detect_shark_collision_left(shark_count, t, speed){
        /* Gets current shark coordinates with respect to time */
        let shark_x_cord = this.x_shark_spawn_left[shark_count] + ((t-this.time_shark_offsets_left[shark_count])*speed);
        let shark_y_cord = this.y_shark_spawn_left[shark_count];
        let turtle_x = this.x_movement;
        let turtle_y = this.y_movement;
        
        /*Gets turtle and shark coordinates on the same scale */
        let shark_to_turtle_x = shark_x_cord*(59/44) - 9/44;
        let shark_to_turtle_y = shark_y_cord*(37/17) + 19/17;
        if((Math.abs(shark_to_turtle_x - turtle_x) < 6 + this.collision_count*0.05) && (Math.abs(shark_to_turtle_y - this.y_movement) < 6 + this.collision_count*0.075)){
            for(let i = 0; i < this.left_shark_count; i++){
                this.new_shark_cord_left(i, t);
            }
            for(let i = 0; i < this.right_shark_count; i++){
                this.new_shark_cord_right(i, t);
            }
            this.lifes = this.lifes - 1;
        }
    }

    detect_shark_collision_right(shark_count, t, speed){
        /* Gets current shark coordinates with respect to time */
        let shark_x_cord = this.x_shark_spawn_right[shark_count] - ((t-this.time_shark_offsets_right[shark_count])*speed);
        let shark_y_cord = this.y_shark_spawn_right[shark_count];
        let turtle_x = this.x_movement;
        let turtle_y = this.y_movement;
        /*Gets turtle and shark coordinates on the same scale */
        let shark_to_turtle_x = shark_x_cord*(59/44) - 9/44;
        let shark_to_turtle_y = shark_y_cord*(37/17) + 19/17;
        if((Math.abs(shark_to_turtle_x - turtle_x) < 6 + this.collision_count*0.05) && (Math.abs(shark_to_turtle_y - this.y_movement) < 6 + this.collision_count*0.075)){
            for(let i = 0; i < this.shark_left_count; i++){
                this.new_shark_cord_left(i, t);
            }
            for(let i = 0; i < this.shark_right_count; i++){
                this.new_shark_cord_right(i, t);
            }
            this.lifes = this.lifes - 1;
        }
    }

    mouse_draw_obj(context, program_state) {
        if (this.userdraw == "none"){
            return;
        }
        else {
            let obj_color = color(Math.random(), Math.random(), Math.random(), 1.0);
            let obj_scale = Math.random() * (3 - 1) + 1;
            let negorpos = 1 - 2 * Math.round(Math.random());
            let obj_rot = negorpos * Math.random() * (4 - 2) + 2;
            
            let z_coord = 0.97;
            
            if (this.mousey < -0.5)
            {
                z_coord = 0.95;
            }

            let pos_ndc_near = vec4(this.mousex, this.mousey, -1.0, 1.0);
            let pos_ndc_far  = vec4(this.mousex, this.mousey, z_coord, 1.0);
            let center_ndc_near = vec4(0.0, 0.0, -1.0, 1.0);
            let P = program_state.projection_transform;
            let V = program_state.camera_inverse;
            let pos_world_near = Mat4.inverse(P.times(V)).times(pos_ndc_near);
            let pos_world_far  = Mat4.inverse(P.times(V)).times(pos_ndc_far);
            let center_world_near  = Mat4.inverse(P.times(V)).times(center_ndc_near);
            pos_world_near.scale_by(1 / pos_world_near[3]);
            pos_world_far.scale_by(1 / pos_world_far[3]);
            center_world_near.scale_by(1 / center_world_near[3]);

            // Do whatever you want
            let obj = {
                pos: pos_world_far,
                color: obj_color,
                size: obj_scale,
                negorpos: negorpos,
                object: this.userdraw
            }
            this.userdraw = "none";
            this.sand_dollars = this.sand_dollars - this.offset;
            this.total_spent = this.total_spent + this.offset;
            this.offset = 0; 
            this.coral_queue.push(obj); 
        }
    }

    draw_menu_bar(context, program_state, model_transform, t){
        // draw menu bar (wood texture)
        let menubar_trans = model_transform.times(Mat4.translation(-26.4, 21, 0, 0))
                                                      .times(Mat4.scale(50, 2, 0, 0))
        this.shapes.square.draw(context, program_state, menubar_trans, this.materials.menu);

        // draw item 1: coral 1
        var item1_background_trans = model_transform.times(Mat4.translation(-23.5, 20.8, 0, 0))
                                                    .times(Mat4.scale(1.4, 1.4, .5, 0));

        let item1_trans = item1_background_trans.times(Mat4.translation(0.5, -0.25, 2, 0))
                                                .times(Mat4.scale(0.38, 0.38, 1, 0))
                                                .times(Mat4.rotation(-43.7, 0, 0, 1));
        this.shapes.coral1.draw(context, program_state, item1_trans, this.materials.coral1.override({color:hex_color("#e691bc")}));

        let item1_price_trans = model_transform.times(Mat4.translation(-26.1, 20.3, 1, 0))
                                               .times(Mat4.scale(0.75, 0.75, 1, 0))
        var price1 = 2;
        this.shapes.text.set_string("$"+ price1.toString(), context.context);
        this.shapes.text.draw(context, program_state, item1_price_trans, this.materials.text_image);
        
        // get position of item 1
        let button1x = ((item1_background_trans[0][3]) - (-5)) / 22.5;
        let button1y = (item1_background_trans[1][3] - (10.5)) / 12; 

        // check if mouse click on item 1
        if ((this.mousex < button1x + 0.1 && this.mousex > button1x - 0.1) && (this.mousey < button1y + 0.12 && this.mousey > button1y - 0.1) && (this.sand_dollars - price1 >= 0))
        {
            // if clicked --> animate item so that we know it is clicked
            let click_scale = (t/6) % 0.08; 
            let animate_click_transform = item1_background_trans.times(Mat4.scale(1 + click_scale, 1 + click_scale, 1, 0));
            this.shapes.sphere.draw(context, program_state, animate_click_transform, this.materials.menubuttons);  
            // draw item on next mouse click          
            this.userdraw = "coral1";
            this.offset = price1;
        }
        else {
            this.shapes.sphere.draw(context, program_state, item1_background_trans, this.materials.menubuttons);
        }

        // draw item 2: rock 
        let item2_background_trans = model_transform.times(Mat4.translation(-18.3, 20.8, 0, 0))
                                        .times(Mat4.scale(1.4, 1.4, .5, 0))

        let item2_trans = item2_background_trans.times(Mat4.translation(0.3, -0.25, 2, 0))
                                                .times(Mat4.scale(0.65, 0.65, 1, 0));
        this.shapes.rock.draw(context, program_state, item2_trans, this.materials.rock);

        let item2_price_trans = model_transform.times(Mat4.translation(-21, 20.3, 1, 0))
                                               .times(Mat4.scale(0.75, 0.75, 1, 0))
        var price2 = 1;
        this.shapes.text.set_string("$"+ price2.toString(), context.context);
        this.shapes.text.draw(context, program_state, item2_price_trans, this.materials.text_image);
        

        // get position of item 2 
        let button2x = ((item2_background_trans[0][3]) - (-5)) / 22.5;
        let button2y = (item2_background_trans[1][3] - (10.5)) / 12; 

        // check if item 2 is clicked 
        if ((this.mousex < button2x + 0.1 && this.mousex > button2x - 0.1) && (this.mousey < button2y + 0.12 && this.mousey > button2y - 0.1) && (this.sand_dollars - price2 >= 0))
        {
            var new_money = this.sand_dollars - price2;
            // if clicked --> animate item so that we know it is clicked
            let click_scale = (t/6) % 0.08; 
            let animate_click_transform = item2_background_trans.times(Mat4.scale(1 + click_scale, 1 + click_scale, 1, 0));
            this.shapes.sphere.draw(context, program_state, animate_click_transform, this.materials.menubuttons);  
            // draw item on next mouse click          
            this.userdraw = "rock";
            this.offset = price2;
        }
        else {
            this.shapes.sphere.draw(context, program_state, item2_background_trans, this.materials.menubuttons);
        }


        // draw item 3: coral 2 
        let item3_background_trans = model_transform.times(Mat4.translation(-13, 20.8, 0, 0))
                                                        .times(Mat4.scale(1.4, 1.4, .5, 0));

        let item3_trans = item3_background_trans.times(Mat4.translation(0.2, -0.25, 2, 0))
                                                    .times(Mat4.scale(0.5, 0.47, 1, 0));
        this.shapes.coral2.draw(context, program_state, item3_trans, this.materials.coral1.override({color: hex_color("#f59f49")}));

        let item3_price_trans = model_transform.times(Mat4.translation(-16, 20.3, 1, 0))
                                               .times(Mat4.scale(0.75, 0.75, 1, 0))
        var price3 = 3;
        this.shapes.text.set_string("$"+ price3.toString(), context.context);
        this.shapes.text.draw(context, program_state, item3_price_trans, this.materials.text_image);
        
        // get position of item 3 
        let button3x = ((item3_background_trans[0][3]) - (-5)) / 22.5;
        let button3y = (item3_background_trans[1][3] - (10.5)) / 12; 

        // check if item 3 is clicked 
        if ((this.mousex < button3x + 0.1 && this.mousex > button3x - 0.1) && (this.mousey < button3y + 0.12 && this.mousey > button3y - 0.1) && (this.sand_dollars - price3 >= 0))
        {
            // if clicked --> animate item so that we know it is clicked
            let click_scale = (t/6) % 0.08; 
            let animate_click_transform = item3_background_trans.times(Mat4.scale(1 + click_scale, 1 + click_scale, 1, 0));
            this.shapes.sphere.draw(context, program_state, animate_click_transform, this.materials.menubuttons);  
            // draw item on next mouse click          
            this.userdraw = "coral2";
            this.offset = price3;
        }
        else {
            this.shapes.sphere.draw(context, program_state, item3_background_trans, this.materials.menubuttons);
        }

        // draw item 4: coral 6  
        let item4_background_trans = model_transform.times(Mat4.translation(-7.6, 20.8, 0, 0))
                                                    .times(Mat4.scale(1.4, 1.4, .5, 0));

        let item4_trans = item4_background_trans.times(Mat4.translation(0.1, -0.25, 2, 0))
                                                .times(Mat4.scale(.7, .33, 1, 0))
        this.shapes.squid.draw(context, program_state, item4_trans, this.materials.gold);

        let item4_price_trans = model_transform.times(Mat4.translation(-10.8, 20.3, 1, 0))
                                               .times(Mat4.scale(0.75, 0.75, 1, 0))
        var price4 = 9;
        this.shapes.text.set_string("$"+ price4.toString(), context.context);
        this.shapes.text.draw(context, program_state, item4_price_trans, this.materials.text_image);
        

        // get position of item 4 
        let button4x = ((item4_background_trans[0][3]) - (-5)) / 22.5;
        let button4y = (item4_background_trans[1][3] - (10.5)) / 12; 

        // check if item 4 is clicked 
        if ((this.mousex < button4x + 0.1 && this.mousex > button4x - 0.1) && (this.mousey < button4y + 0.12 && this.mousey > button4y - 0.1) && (this.sand_dollars - price4 >= 0))
        {
            // if clicked --> animate item so that we know it is clicked
            let click_scale = (t/6) % 0.08; 
            let animate_click_transform = item4_background_trans.times(Mat4.scale(1 + click_scale, 1 + click_scale, 1, 0));
            this.shapes.sphere.draw(context, program_state, animate_click_transform, this.materials.menubuttons);  
            // draw item on next mouse click          
            this.userdraw = "squid";
            this.offset = price4;
        }
        else {
            this.shapes.sphere.draw(context, program_state, item4_background_trans, this.materials.menubuttons);
        }

        // draw item 5: starfish  
        let item5_background_trans = model_transform.times(Mat4.translation(-2.2, 20.8, 0, 0))
                                                    .times(Mat4.scale(1.4, 1.4, .5, 0));

        let item5_trans = item5_background_trans.times(Mat4.translation(-0.1, -0.25, 2, 0))
                                                .times(Mat4.scale(.5, .5, 1, 0))
        this.shapes.starfish.draw(context, program_state, item5_trans, this.materials.coral1.override({color: hex_color("#ff892e")}));

        let item5_price_trans = model_transform.times(Mat4.translation(-5.6, 20.3, 1, 0))
                                               .times(Mat4.scale(0.75, 0.75, 1, 0))
        var price5 = 5;
        this.shapes.text.set_string("$"+ price5.toString(), context.context);
        this.shapes.text.draw(context, program_state, item5_price_trans, this.materials.text_image);

        // get position of item 5 
        let button5x = ((item5_background_trans[0][3]) - (-5)) / 22.5;
        let button5y = (item5_background_trans[1][3] - (10.5)) / 12; 

        // check if item 5 is clicked 
        if ((this.mousex < button5x + 0.1 && this.mousex > button5x - 0.1) && (this.mousey < button5y + 0.12 && this.mousey > button5y - 0.1) && (this.sand_dollars - price5 >= 0))
        {
            // if clicked --> animate item so that we know it is clicked
            let click_scale = (t/6) % 0.08; 
            let animate_click_transform = item5_background_trans.times(Mat4.scale(1 + click_scale, 1 + click_scale, 1, 0));
            this.shapes.sphere.draw(context, program_state, animate_click_transform, this.materials.menubuttons);  
            // draw item on next mouse click          
            this.userdraw = "starfish";
            this.offset = price5;
        }
        else {
            this.shapes.sphere.draw(context, program_state, item5_background_trans, this.materials.menubuttons);
        }
        // draw item 6: shell  
        let item6_background_trans = model_transform.times(Mat4.translation(3, 20.8, 0, 0))
                                                    .times(Mat4.scale(1.4, 1.4, .5, 0));

        let item6_trans = item6_background_trans.times(Mat4.translation(0.2, -0.25, 2, 0))
                                                .times(Mat4.scale(.4, .4, 1, 0))
        this.shapes.shell1.draw(context, program_state, item6_trans, this.materials.coral1.override({color: hex_color("#f5988e")}));

        let item6_price_trans = model_transform.times(Mat4.translation(-0.5, 20.3, 1, 0))
                                               .times(Mat4.scale(0.75, 0.75, 1, 0))
        var price6 = 4;
        this.shapes.text.set_string("$"+ price6.toString(), context.context);
        this.shapes.text.draw(context, program_state, item6_price_trans, this.materials.text_image);

        // get position of item 6
        let button6x = ((item6_background_trans[0][3]) - (-5)) / 22.5;
        let button6y = (item6_background_trans[1][3] - (10.5)) / 12; 

        // check if item 6 is clicked 
        if ((this.mousex < button6x + 0.1 && this.mousex > button6x - 0.1) && (this.mousey < button6y + 0.12 && this.mousey > button6y - 0.1) && (this.sand_dollars - price6 >= 0))
        {
            // if clicked --> animate item so that we know it is clicked
            let click_scale = (t/6) % 0.08; 
            let animate_click_transform = item6_background_trans.times(Mat4.scale(1 + click_scale, 1 + click_scale, 1, 0));
            this.shapes.sphere.draw(context, program_state, animate_click_transform, this.materials.menubuttons);  
            // draw item on next mouse click          
            this.userdraw = "shell";
            this.offset = price6;
        }
        else {
            this.shapes.sphere.draw(context, program_state, item6_background_trans, this.materials.menubuttons);
        }

        // draw item 7: jellyfish  
        let item7_background_trans = model_transform.times(Mat4.translation(8.5, 20.8, 0, 0))
                                                    .times(Mat4.scale(1.4, 1.4, .5, 0));

        let item7_trans = item7_background_trans.times(Mat4.translation(-.35, -0.4, 2, 0))
                                                .times(Mat4.scale(.4, .35, 1, 0))
                                                .times(Mat4.rotation(-33, 1, 0, 0))
                                                .times(Mat4.rotation(-66, 0, 1, 0));
        this.shapes.jellyfish.draw(context, program_state, item7_trans, this.materials.coral1.override({color: hex_color("#6ee7f0")}));

        let item7_price_trans = model_transform.times(Mat4.translation(4.8, 20.3, 1, 0))
                                               .times(Mat4.scale(0.75, 0.75, 1, 0))
        var price7 = 7;
        this.shapes.text.set_string("$"+ price7.toString(), context.context);
        this.shapes.text.draw(context, program_state, item7_price_trans, this.materials.text_image);

        // get position of item 7
        let button7x = ((item7_background_trans[0][3]) - (-5)) / 22.5;
        let button7y = (item7_background_trans[1][3] - (10.5)) / 12; 

        // check if item 7 is clicked 
        if ((this.mousex < button7x + 0.1 && this.mousex > button7x - 0.1) && (this.mousey < button7y + 0.12 && this.mousey > button7y - 0.1) && (this.sand_dollars - price7 >= 0))
        {
            // if clicked --> animate item so that we know it is clicked
            let click_scale = (t/6) % 0.08; 
            let animate_click_transform = item7_background_trans.times(Mat4.scale(1 + click_scale, 1 + click_scale, 1, 0));
            this.shapes.sphere.draw(context, program_state, animate_click_transform, this.materials.menubuttons);  
            // draw item on next mouse click_scale          
            this.userdraw = "jellyfish";
            this.offset = price7;       
        }
        else {
            this.shapes.sphere.draw(context, program_state, item7_background_trans, this.materials.menubuttons);
        }

        // draw item 8: treasure chest  
        let item8_background_trans = model_transform.times(Mat4.translation(14, 20.8, 0, 0))
                                                    .times(Mat4.scale(1.4, 1.4, .5, 0));

        let item8_trans = item8_background_trans.times(Mat4.translation(-.35, -0.1, 2, 0))
                                                .times(Mat4.scale(0.4, 0.4, 0.4, 0));
        this.shapes.temple.draw(context, program_state, item8_trans, this.materials.redwood);

        let item8_price_trans = model_transform.times(Mat4.translation(10, 20.3, 1, 0))
                                               .times(Mat4.scale(0.75, 0.75, 1, 0))
        var price8 = 8;
        this.shapes.text.set_string("$"+ price8.toString(), context.context);
        this.shapes.text.draw(context, program_state, item8_price_trans, this.materials.text_image);

        // get position of item 8
        let button8x = ((item8_background_trans[0][3]) - (-5)) / 22.5;
        let button8y = (item8_background_trans[1][3] - (10.5)) / 12; 

        // check if item 8 is clicked 
        if ((this.mousex < button8x + 0.1 && this.mousex > button8x - 0.1) && (this.mousey < button8y + 0.12 && this.mousey > button8y - 0.1) && (this.sand_dollars - price8 >= 0))
        {
            // if clicked --> animate item so that we know it is clicked
            let click_scale = (t/6) % 0.08; 
            let animate_click_transform = item8_background_trans.times(Mat4.scale(1 + click_scale, 1 + click_scale, 1, 0));
            this.shapes.sphere.draw(context, program_state, animate_click_transform, this.materials.menubuttons);
            // draw item on next mouse click          
            this.userdraw = "temple";
            this.offset = price8;
        }
        else {
            this.shapes.sphere.draw(context, program_state, item8_background_trans, this.materials.menubuttons);
        }
        //draw money count
        let dash_model = Mat4.identity().times(Mat4.translation(11.5,16.8,4,0)).times(Mat4.scale(1.3,1.3,0.2,5));
        let point_string = this.sand_dollars;
        this.shapes.text.set_string("$" + point_string.toString(), context.context);
        this.shapes.text.draw(context, program_state, dash_model.times(Mat4.scale(.50, .50, .50)), this.materials.text_image);
        
        //draw lifes count
        let lifes_model = Mat4.identity().times(Mat4.translation(-23.5,16.8,4,0)).times(Mat4.scale(1.2,1.2,0.2,5));
        let lifes_string = this.lifes;
        this.shapes.text.set_string("lifes:" + lifes_string.toString(), context.context);
        this.shapes.text.draw(context, program_state, lifes_model.times(Mat4.scale(.50, .50, .50)), this.materials.text_image);
        
    }

    display(context, program_state) {                                 
    // display():  draw scene
        let model_transform = Mat4.identity();

        // time passed in seconds
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        // set lights
        const light_position = vec4(-5, 20, 5, 1);
        program_state.lights = [new Light(light_position, this.light_color, 1000)];     
           
        // allow player to change lighting color
        if (this.change_lighting_color){
            this.set_light_color();
            this.change_lighting_color = false;
        }

        // Set camera 
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.translation(5, -10, -30));
        }
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        // Two rendering passes: 

        // Draw Scene 1: erase, only use to generate texture
        this.scratchpad_context.drawImage(context.canvas, 0, 0, 256, 256);

        // Don't call copy to GPU until the event loop has had a chance
        // to act on SRC setting once:
        if (this.skipped_first_frame)
            
        // Update texture with current scene:
        this.texture.copy_onto_graphics_card(context.context, false);
        this.skipped_first_frame = true;

        // Draw scene 2, never display scene 1: 
        context.context.clear(context.context.COLOR_BUFFER_BIT | context.context.DEPTH_BUFFER_BIT);

        // Screen measurements 
        // length: -27.5 --> 17.5; midpoint = -5 ---> then 22.5 on either side
        // height: -1.5 --> 22.5; midpoint = 10.5 ---> then 12 on either side 

        let canvas = context.canvas;
            const mouse_position = (e, rect = canvas.getBoundingClientRect()) =>
                vec((e.clientX - (rect.left + rect.right) / 2) / ((rect.right - rect.left) / 2),
                    (e.clientY - (rect.bottom + rect.top) / 2) / ((rect.top - rect.bottom) / 2));

        // when user clicks --> draw object at mouse position (if enabled)
        canvas.addEventListener("mousedown", e => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect()
            this.mousex = mouse_position(e)[0];
            this.mousey = mouse_position(e)[1];
            // this.mouse_draw(context, program_state, model_transform);
            this.mouse_draw_obj(context, program_state);
            });


        // Draw aquarium background (water)
        let background_transform = model_transform;
        background_transform = background_transform.times(Mat4.rotation(0, 0, 1, 0))
                                                   .times(Mat4.translation(0, 0, 0, 0))
                                                   .times(Mat4.rotation(Math.PI/1.8 , 1, 0, 0))
                                                   .times(Mat4.scale(60, 60, 60))
                                                   .times(Mat4.rotation(t/40, 0, 1, 0));

        this.shapes.waterbox.draw(context, program_state, background_transform, this.materials.b);

        // Draw aquarium floor (sand)
        let sand_transform = model_transform.times(Mat4.rotation(0, 0, 1, 0))
                                            .times(Mat4.translation(0,0,0,0))
                                            .times(Mat4.rotation(Math.PI / 2, 1, 0, 0))
                                            .times(Mat4.translation(0, 0, 2))
                                            .times(Mat4.scale(50, 25, 0.5));

        this.shapes.sand.draw(context, program_state, sand_transform, this.materials.sand);

        // Draw menu bar if lifes are not 0
        if(this.lifes != 0){
            this.draw_menu_bar(context, program_state, model_transform, t);
        }
        // If player has purchased decorations --> draw them here
        if (this.coral_queue.length > 0) {
            for (let i = 0; i < this.coral_queue.length; i++) {
                let obj = this.coral_queue[i];
                let position = obj.pos;
                let size = obj.size;
                let color = obj.color;
                let negorpos = obj.negorpos; 
                let transform = Mat4.translation(position[0], position[1], position[2])
                                    .times(Mat4.scale(size, size, size, 0));
 
                // If coral --> add sway effect 
                var coral_angle = .01 * Math.PI;
                var coral_sway = ((coral_angle/2) + (coral_angle/2) * (Math.sin(Math.PI*(t*1.2))));

                if (obj.object == "coral1") {
                    transform = transform.times(Mat4.rotation(coral_sway, 0,0,1))
                    // straighten up coral (it tilts due to perspective projection)
                    if (position[0] < 0){
                        transform = transform.times(Mat4.rotation(-0.1, 0,0,1))
                    }
                    if (position[0] > 0){
                        transform = transform.times(Mat4.rotation(0.1, 0,0,1))
                    }
                    this.shapes.coral1.draw(context, program_state, transform, this.materials.coral1.override({color:color}));
                }
                if (obj.object == "coral2") {
                    transform = transform.times(Mat4.rotation(coral_sway, 0,0,1))
                    this.shapes.coral2.draw(context, program_state, transform, this.materials.coral1.override({color:color}));
                }
                if (obj.object == "rock") {
                    this.shapes.rock.draw(context, program_state, transform, this.materials.rock);
                }
                if (obj.object == "squid") {                
                    let squid_movement = negorpos * (Math.sin(Math.PI * t/4));    
                    transform = transform.times(Mat4.scale(2,1.5,2,0))
                                         .times(Mat4.translation(0,squid_movement,0))
                                         .times(Mat4.rotation(squid_movement,0,1,0))
                    this.shapes.squid.draw(context, program_state, transform, this.materials.gold);
                }
                if (obj.object == "starfish") {
                    transform = transform.times(Mat4.rotation(-45,1,0,0))
                                         .times(Mat4.scale(0.4,0.4,0.4,0))
                    this.shapes.starfish.draw(context, program_state, transform, this.materials.coral1.override({color:color}));
                }

                if (obj.object == "shell") {
                    transform = transform.times(Mat4.scale(0.325,0.325,0.325,0))
                    this.shapes.shell1.draw(context, program_state, transform, this.materials.coral1.override({color:color}));
                }
                if (obj.object == "jellyfish") {
                    // animate jellyfish movement
                    let jelly_movement = negorpos * (Math.sin(Math.PI * t/4));
                    let max_angle = .07 * Math.PI;
                    let jelly_stretch = (1 + (max_angle/2) * (Math.sin(Math.PI*(t/1.2))));
                    transform = transform.times(Mat4.rotation(-33,1,0,0))
                                         .times(Mat4.rotation(-66,0,1,0))
                                         .times(Mat4.translation(0,0,jelly_movement,0))
                                         .times(Mat4.rotation(jelly_movement,0,0,1))
                                         .times(Mat4.scale(1,1,jelly_stretch,0))
                                         .times(Mat4.scale(0.8,0.8,0.8,0));
                    this.shapes.jellyfish.draw(context, program_state, transform, this.materials.jellyfish.override({color:color}));
                }
                if (obj.object == "temple") {
                    let temple_transform = Mat4.translation(position[0], position[1], position[2]);
                    temple_transform = temple_transform.times(Mat4.scale(3.5,3.5,3.5,0))
                    this.shapes.temple.draw(context, program_state, temple_transform, this.materials.redwood);
                }

            }
        }


        // Fill scene with fish & shark 
        let left_fish_count = 1;
        let right_fish_count = 5;
        let shark_left_count = this.left_shark_count;
        let shark_right_count = this.right_shark_count;
        let fish_speed = 3;
        let shark_speed = 3 + (3 - this.lifes)*4;
        
        /*These for loops draw fishes and sharks and call collsion detection functions*/
        if(this.lifes != 0){
            for(let i = 0; i < left_fish_count; i++){
                this.draw_fishes_left(context, program_state, model_transform, i, t, fish_speed);
                this.detect_fish_collision_left(i, t, fish_speed);
            }
            for(let i = 0; i < right_fish_count; i++){
                this.draw_fishes_right(context, program_state, model_transform, i, t, fish_speed);
                this.detect_fish_collision_right(i, t, fish_speed);
            }
            for(let i = 0; i < shark_left_count; i++){
                this.draw_shark_left(context, program_state, model_transform, i, t, shark_speed);
                this.detect_shark_collision_left(i, t, shark_speed);
            }
            for(let i = 0; i < shark_right_count; i++){
                this.draw_shark_right(context, program_state, model_transform, i, t, shark_speed);
                this.detect_shark_collision_right(i, t, shark_speed);
            }
       }


        // X,Y for turtle position --> controlled by player using arrow keys 
        var y = this.y_movement;
        var x = this.x_movement;
        let max_flipper_angle = .05 * Math.PI;
        let flipper_rot = ((max_flipper_angle/2) + (max_flipper_angle/2) * (Math.sin(Math.PI*(t*1.2))));

        //Draws turtle after drawing sharks and fishes
        var turtle_body = model_transform.times(Mat4.scale(1.5,1.8,1,0))
                                               .times(Mat4.translation(x/2,y/4,0,0))
                                               .times(this.turtle_body_global);

        let turtle_head = model_transform.times(Mat4.translation(0, 1.9, 0, 0))
                                               .times(Mat4.scale(0.5,0.5,0.2,0))
                                               .times(Mat4.translation(x*1.5,y/1.1,0,0))
                                               .times(this.turtle_head_global);
        
        let turtle_leg_tl_transform = model_transform.times(Mat4.translation(0, 1, 0, 0))
                                               .times(Mat4.scale(0.8,0.4,0.2,0))
                                               .times(Mat4.translation(x*0.94,y*1.1,0,0))
                                               .times(Mat4.rotation(flipper_rot, 0,1,1))
                                               .times(Mat4.translation(-1.9, 0.5, 0.2, 0))
                                               .times(this.turtle_larm_global);
    
        let turtle_leg_bl_transform = model_transform.times(Mat4.translation(0, -0.4, 0, 0))
                                               .times(Mat4.scale(0.8,0.4,0.2,0))
                                               .times(Mat4.translation(x*0.94,y*1.1,0,0))
                                               .times(Mat4.rotation(flipper_rot, 0,1,1))
                                               .times(Mat4.translation(-1.9, -0.5, 0.2, 0))
                                               .times(this.turtle_lleg_global);

        let turtle_leg_tr_transform = model_transform.times(Mat4.translation(0, 1, 0, 0))
                                               .times(Mat4.scale(0.8,0.4,0.2,0))
                                               .times(Mat4.translation(x*0.94,y*1.1,0,0))
                                               .times(Mat4.rotation(-flipper_rot, 0,1,1))
                                               .times(Mat4.translation(1.9, 0.5, 0.1, 0))
                                               .times(this.turtle_rarm_global);
        
        let turtle_leg_br_transform = model_transform.times(Mat4.translation(0, -0.4, 0, 0))
                                               .times(Mat4.scale(0.8,0.4,0.2,0))
                                               .times(Mat4.translation(x*0.94,y*1.1,0,0))
                                               .times(Mat4.rotation(-flipper_rot, 0,1,1))
                                               .times(Mat4.translation(1.9, -0.5, 0.1, 0))
                                               .times(this.turtle_rleg_global);

        if(this.lifes != 0){
            this.shapes.turtlebody.draw(context, program_state, turtle_body, this.materials.turtle);
            this.shapes.fishbody.draw(context, program_state, turtle_head, this.materials.turtlelimbs);
            this.shapes.fishbody.draw(context, program_state, turtle_leg_tl_transform, this.materials.turtlelimbs);
            this.shapes.fishbody.draw(context, program_state, turtle_leg_bl_transform, this.materials.turtlelimbs);
            this.shapes.fishbody.draw(context, program_state, turtle_leg_tr_transform, this.materials.turtlelimbs);
            this.shapes.fishbody.draw(context, program_state, turtle_leg_br_transform, this.materials.turtlelimbs);
        }
        const max_coral_angle = .01 * Math.PI;
        var coral_sway = ((max_coral_angle/2) + (max_coral_angle/2) * (Math.sin(Math.PI*(t*1.2))));


        
        let pink_coral_transform = model_transform.times(Mat4.translation(-22,0,-17,0))
                                              .times(Mat4.scale(4,4,4,0))
                                              .times(Mat4.rotation(-coral_sway, 0,0,1))
        this.shapes.coral1.draw(context, program_state, pink_coral_transform, this.materials.coral1);

        let lightgreen_coral_transform = model_transform.times(Mat4.translation(-18,0,-17,0))
                                              .times(Mat4.scale(4,4,3,0))
                                              .times(Mat4.rotation(coral_sway, 0,0,1));    
        this.shapes.coral2.draw(context, program_state, lightgreen_coral_transform, this.materials.coral1.override({color:hex_color("#8df2aa")}));

        let purple_coral_transform = model_transform.times(Mat4.translation(-27,0,-17,0))
                                              .times(Mat4.scale(4,6,4,0))
                                              .times(Mat4.rotation(360,0,0,1))
                                              .times(Mat4.rotation(coral_sway, 0,0,1));
        this.shapes.coral2.draw(context, program_state, purple_coral_transform, this.materials.coral1.override({color:hex_color("#947fb8")}));

        let orange_coral_transform = model_transform.times(Mat4.translation(15,0,-16,0))
                                              .times(Mat4.scale(2,3,3,0))
                                              .times(Mat4.rotation(-33,1,0,0))
                                              .times(Mat4.rotation(coral_sway, 0,0,1));
        this.shapes.coral6.draw(context, program_state, orange_coral_transform, this.materials.coral1.override({color:hex_color("#ffaf6e")}));

        let periwinkle_coral_transform = model_transform.times(Mat4.translation(16,0,-22,0))
                                              .times(Mat4.scale(5,6,3,0))
                                              .times(Mat4.rotation(-coral_sway, 0,0,1));
        this.shapes.coral1.draw(context, program_state, periwinkle_coral_transform, this.materials.coral1.override({color:hex_color("#6d85c2")}));

        let green_coral_transform = model_transform.times(Mat4.translation(22,6,-16,0))
                                              .times(Mat4.scale(3,4,3,0))
                                              .times(Mat4.rotation(-33,1,0,0))
                                              .times(Mat4.rotation(-coral_sway, 1,0,0));
        this.shapes.coral4.draw(context, program_state, green_coral_transform, this.materials.coral1.override({color:hex_color("#a2e677")}));

        let rock1_transform = model_transform.times(Mat4.translation(-34,0,-17,0))
                                             .times(Mat4.scale(4,5,4,0));
        this.shapes.rock.draw(context, program_state, rock1_transform, this.materials.rock);

        let snail_transform = model_transform.times(Mat4.translation(-28,-1,-1,0))    
                                             .times(Mat4.rotation(-33,1,0,0))
                                             .times(Mat4.rotation(33,0,0,1))
                                             .times(Mat4.translation(0,-t/8,0,0))
        this.shapes.snail.draw(context, program_state, snail_transform, this.materials.snail);


//         let coral1_transform = model_transform.times(Mat4.translation(-22,3.5,0,0));
//         this.shapes.coral1.draw(context, program_state, coral1_transform, this.materials.coral1);

//         let coral1_transform = model_transform.times(Mat4.translation(-22,3.5,0,0));
//         this.shapes.coral1.draw(context, program_state, coral1_transform, this.materials.coral1);
        //game over message
        if(this.lifes == 0){
            let score_transform = Mat4.identity().times(Mat4.translation(-8.5,17.8,4,0)).times(Mat4.scale(1.2,1.2,0.2,5));
            let total_score = this.total_spent;
            this.shapes.text.set_string("Total Spent:" + total_score.toString(), context.context);
            this.shapes.text.draw(context, program_state, score_transform.times(Mat4.scale(.35, .35, .50)), this.materials.text_image);
            let game_over = score_transform.times(Mat4.translation(-1.5,1,1,0));
            this.shapes.text.set_string("GAME OVER", context.context);
            this.shapes.text.draw(context, program_state, game_over.times(Mat4.scale(.75, .75, .50)), this.materials.text_image);
        }
    }

}

class Jellyfish_Shader extends Shader {
    // This is a Shader using Phong_Shader as template
    // TODO: Modify the glsl coder here to create a Gouraud Shader (Planet 2)

    constructor(num_lights = 2) {
        super();
        this.num_lights = num_lights;
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return ` 
        precision mediump float;
        const int N_LIGHTS = ` + this.num_lights + `;
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS], light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 squared_scale, camera_center;

        // Specifier "varying" means a variable's final value will be passed from the vertex shader
        // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the
        // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
        varying vec3 N, vertex_worldspace;
        varying vec4 vertex_color;
        varying vec4 point_position;
        varying vec4 center;

        // ***** PHONG SHADING HAPPENS HERE: *****                                       
        vec3 phong_model_lights( vec3 N, vec3 vertex_worldspace ){                                        
            // phong_model_lights():  Add up the lights' contributions.
            vec3 E = normalize( camera_center - vertex_worldspace );
            vec3 result = vec3( 0.0 );
            for(int i = 0; i < N_LIGHTS; i++){
                // Lights store homogeneous coords - either a position or vector.  If w is 0, the 
                // light will appear directional (uniform direction from all points), and we 
                // simply obtain a vector towards the light by directly using the stored value.
                // Otherwise if w is 1 it will appear as a point light -- compute the vector to 
                // the point light's location from the current surface point.  In either case, 
                // fade (attenuate) the light as the vector needed to reach it gets longer.  
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                                               light_positions_or_vectors[i].w * vertex_worldspace;                                             
                float distance_to_light = length( surface_to_light_vector );

                vec3 L = normalize( surface_to_light_vector );
                vec3 H = normalize( L + E );
                // Compute the diffuse and specular components from the Phong
                // Reflection Model, using Blinn's "halfway vector" method:
                float diffuse  =      max( dot( N, L ), 0.0 );
                float specular = pow( max( dot( N, H ), 0.0 ), smoothness );
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light );
                
                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                                          + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        } `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
            attribute vec3 position, normal;    
                        
            // Position is expressed in object coordinates.
            
            uniform mat4 model_transform;
            uniform mat4 projection_camera_model_transform;
    
            void main(){                                                                   
                // The vertex's final resting place (in NDCS):
                gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
                // The final normal vector in screen space.
                N = normalize( mat3( model_transform ) * normal / squared_scale);
                vertex_worldspace = ( model_transform * vec4( position, 1.0 ) ).xyz;
                
                center = model_transform * vec4(0.0, 0.0, 2.5, 1.0);
                point_position = model_transform * vec4(position, 1.0);

                vertex_color = vec4(shape_color.xyz * ambient, shape_color.w);
                vertex_color.xyz += phong_model_lights(N, vertex_worldspace);
            } `;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // A fragment is a pixel that's overlapped by the current triangle.
        // Fragments affect the final image or get discarded due to depth.
        return this.shared_glsl_code() + `
            void main(){
                 float scalar = 0.40 + 0.3 * sin(distance(point_position.xyz, center.xyz));
                 gl_FragColor = scalar * vertex_color;
            } `;
    }

    send_material(gl, gpu, material) {
        // send_material(): Send the desired shape-wide material qualities to the
        // graphics card, where they will tweak the Phong lighting formula.
        gl.uniform4fv(gpu.shape_color, material.color);
        gl.uniform1f(gpu.ambient, material.ambient);
        gl.uniform1f(gpu.diffusivity, material.diffusivity);
        gl.uniform1f(gpu.specularity, material.specularity);
        gl.uniform1f(gpu.smoothness, material.smoothness);
    }

    send_gpu_state(gl, gpu, gpu_state, model_transform) {
        // send_gpu_state():  Send the state of our whole drawing context to the GPU.
        const O = vec4(0, 0, 0, 1), camera_center = gpu_state.camera_transform.times(O).to3();
        gl.uniform3fv(gpu.camera_center, camera_center);
        // Use the squared scale trick from "Eric's blog" instead of inverse transpose matrix:
        const squared_scale = model_transform.reduce(
            (acc, r) => {
                return acc.plus(vec4(...r).times_pairwise(r))
            }, vec4(0, 0, 0, 0)).to3();
        gl.uniform3fv(gpu.squared_scale, squared_scale);
        // Send the current matrices to the shader.  Go ahead and pre-compute
        // the products we'll need of the of the three special matrices and just
        // cache and send those.  They will be the same throughout this draw
        // call, and thus across each instance of the vertex shader.
        // Transpose them since the GPU expects matrices as column-major arrays.
        const PCM = gpu_state.projection_transform.times(gpu_state.camera_inverse).times(model_transform);
        gl.uniformMatrix4fv(gpu.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        gl.uniformMatrix4fv(gpu.projection_camera_model_transform, false, Matrix.flatten_2D_to_1D(PCM.transposed()));

        // Omitting lights will show only the material color, scaled by the ambient term:
        if (!gpu_state.lights.length)
            return;

        const light_positions_flattened = [], light_colors_flattened = [];
        for (let i = 0; i < 4 * gpu_state.lights.length; i++) {
            light_positions_flattened.push(gpu_state.lights[Math.floor(i / 4)].position[i % 4]);
            light_colors_flattened.push(gpu_state.lights[Math.floor(i / 4)].color[i % 4]);
        }
        gl.uniform4fv(gpu.light_positions_or_vectors, light_positions_flattened);
        gl.uniform4fv(gpu.light_colors, light_colors_flattened);
        gl.uniform1fv(gpu.light_attenuation_factors, gpu_state.lights.map(l => l.attenuation));
    }

    update_GPU(context, gpu_addresses, gpu_state, model_transform, material) {
        // update_GPU(): Define how to synchronize our JavaScript's variables to the GPU's.  This is where the shader
        // recieves ALL of its inputs.  Every value the GPU wants is divided into two categories:  Values that belong
        // to individual objects being drawn (which we call "Material") and values belonging to the whole scene or
        // program (which we call the "Program_State").  Send both a material and a program state to the shaders
        // within this function, one data field at a time, to fully initialize the shader for a draw.

        // Fill in any missing fields in the Material object with custom defaults for this shader:
        const defaults = {color: color(0, 0, 0, 1), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40};
        material = Object.assign({}, defaults, material);

        this.send_material(context, gpu_addresses, material);
        this.send_gpu_state(context, gpu_addresses, gpu_state, model_transform);
    }
}


class Tail_Shader extends Shader {
    // This is a Shader using Phong_Shader as template
    // TODO: Modify the glsl coder here to create a Gouraud Shader (Planet 2)

    constructor(num_lights = 2) {
        super();
        this.num_lights = num_lights;
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return ` 
        precision mediump float;
        const int N_LIGHTS = ` + this.num_lights + `;
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS], light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 squared_scale, camera_center;

        // Specifier "varying" means a variable's final value will be passed from the vertex shader
        // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the
        // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
        varying vec3 N, vertex_worldspace;
        varying vec4 vertex_color;
        varying vec4 point_position;
        varying vec4 center;

        // ***** PHONG SHADING HAPPENS HERE: *****                                       
        vec3 phong_model_lights( vec3 N, vec3 vertex_worldspace ){                                        
            // phong_model_lights():  Add up the lights' contributions.
            vec3 E = normalize( camera_center - vertex_worldspace );
            vec3 result = vec3( 0.0 );
            for(int i = 0; i < N_LIGHTS; i++){
                // Lights store homogeneous coords - either a position or vector.  If w is 0, the 
                // light will appear directional (uniform direction from all points), and we 
                // simply obtain a vector towards the light by directly using the stored value.
                // Otherwise if w is 1 it will appear as a point light -- compute the vector to 
                // the point light's location from the current surface point.  In either case, 
                // fade (attenuate) the light as the vector needed to reach it gets longer.  
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                                               light_positions_or_vectors[i].w * vertex_worldspace;                                             
                float distance_to_light = length( surface_to_light_vector );

                vec3 L = normalize( surface_to_light_vector );
                vec3 H = normalize( L + E );
                // Compute the diffuse and specular components from the Phong
                // Reflection Model, using Blinn's "halfway vector" method:
                float diffuse  =      max( dot( N, L ), 0.0 );
                float specular = pow( max( dot( N, H ), 0.0 ), smoothness );
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light );
                
                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                                          + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        } `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
            attribute vec3 position, normal;    
                        
            // Position is expressed in object coordinates.
            
            uniform mat4 model_transform;
            uniform mat4 projection_camera_model_transform;
    
            void main(){                                                                   
                // The vertex's final resting place (in NDCS):
                gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
                // The final normal vector in screen space.
                N = normalize( mat3( model_transform ) * normal / squared_scale);
                vertex_worldspace = ( model_transform * vec4( position, 1.0 ) ).xyz;
                
                center = model_transform * vec4(0.0, 0.0, 0.0, 1.0);
                point_position = model_transform * vec4(position, 1.0);

                vertex_color = vec4(shape_color.xyz * ambient, shape_color.w);
                vertex_color.xyz += phong_model_lights(N, vertex_worldspace);
            } `;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // A fragment is a pixel that's overlapped by the current triangle.
        // Fragments affect the final image or get discarded due to depth.
        return this.shared_glsl_code() + `
            void main(){
                 float scalar = cos(distance(point_position.xyz, center.xyz));
                 gl_FragColor = scalar * vertex_color;
            } `;
    }

    send_material(gl, gpu, material) {
        // send_material(): Send the desired shape-wide material qualities to the
        // graphics card, where they will tweak the Phong lighting formula.
        gl.uniform4fv(gpu.shape_color, material.color);
        gl.uniform1f(gpu.ambient, material.ambient);
        gl.uniform1f(gpu.diffusivity, material.diffusivity);
        gl.uniform1f(gpu.specularity, material.specularity);
        gl.uniform1f(gpu.smoothness, material.smoothness);
    }

    send_gpu_state(gl, gpu, gpu_state, model_transform) {
        // send_gpu_state():  Send the state of our whole drawing context to the GPU.
        const O = vec4(0, 0, 0, 1), camera_center = gpu_state.camera_transform.times(O).to3();
        gl.uniform3fv(gpu.camera_center, camera_center);
        // Use the squared scale trick from "Eric's blog" instead of inverse transpose matrix:
        const squared_scale = model_transform.reduce(
            (acc, r) => {
                return acc.plus(vec4(...r).times_pairwise(r))
            }, vec4(0, 0, 0, 0)).to3();
        gl.uniform3fv(gpu.squared_scale, squared_scale);
        // Send the current matrices to the shader.  Go ahead and pre-compute
        // the products we'll need of the of the three special matrices and just
        // cache and send those.  They will be the same throughout this draw
        // call, and thus across each instance of the vertex shader.
        // Transpose them since the GPU expects matrices as column-major arrays.
        const PCM = gpu_state.projection_transform.times(gpu_state.camera_inverse).times(model_transform);
        gl.uniformMatrix4fv(gpu.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        gl.uniformMatrix4fv(gpu.projection_camera_model_transform, false, Matrix.flatten_2D_to_1D(PCM.transposed()));

        // Omitting lights will show only the material color, scaled by the ambient term:
        if (!gpu_state.lights.length)
            return;

        const light_positions_flattened = [], light_colors_flattened = [];
        for (let i = 0; i < 4 * gpu_state.lights.length; i++) {
            light_positions_flattened.push(gpu_state.lights[Math.floor(i / 4)].position[i % 4]);
            light_colors_flattened.push(gpu_state.lights[Math.floor(i / 4)].color[i % 4]);
        }
        gl.uniform4fv(gpu.light_positions_or_vectors, light_positions_flattened);
        gl.uniform4fv(gpu.light_colors, light_colors_flattened);
        gl.uniform1fv(gpu.light_attenuation_factors, gpu_state.lights.map(l => l.attenuation));
    }

    update_GPU(context, gpu_addresses, gpu_state, model_transform, material) {
        // update_GPU(): Define how to synchronize our JavaScript's variables to the GPU's.  This is where the shader
        // recieves ALL of its inputs.  Every value the GPU wants is divided into two categories:  Values that belong
        // to individual objects being drawn (which we call "Material") and values belonging to the whole scene or
        // program (which we call the "Program_State").  Send both a material and a program state to the shaders
        // within this function, one data field at a time, to fully initialize the shader for a draw.

        // Fill in any missing fields in the Material object with custom defaults for this shader:
        const defaults = {color: color(0, 0, 0, 1), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40};
        material = Object.assign({}, defaults, material);

        this.send_material(context, gpu_addresses, material);
        this.send_gpu_state(context, gpu_addresses, gpu_state, model_transform);
    }
}


class Gouraud_Shader extends Shader {
    // This is a Shader using Phong_Shader as template
    // TODO: Modify the glsl coder here to create a Gouraud Shader (Planet 2)

    constructor(num_lights = 2) {
        super();
        this.num_lights = num_lights;
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return ` 
        precision mediump float;
        const int N_LIGHTS = ` + this.num_lights + `;
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS], light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 squared_scale, camera_center;

        // Specifier "varying" means a variable's final value will be passed from the vertex shader
        // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the
        // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
        varying vec3 N, vertex_worldspace;
        varying vec4 vertex_color;

        // ***** PHONG SHADING HAPPENS HERE: *****                                       
        vec3 phong_model_lights( vec3 N, vec3 vertex_worldspace ){                                        
            // phong_model_lights():  Add up the lights' contributions.
            vec3 E = normalize( camera_center - vertex_worldspace );
            vec3 result = vec3( 0.0 );
            for(int i = 0; i < N_LIGHTS; i++){
                // Lights store homogeneous coords - either a position or vector.  If w is 0, the 
                // light will appear directional (uniform direction from all points), and we 
                // simply obtain a vector towards the light by directly using the stored value.
                // Otherwise if w is 1 it will appear as a point light -- compute the vector to 
                // the point light's location from the current surface point.  In either case, 
                // fade (attenuate) the light as the vector needed to reach it gets longer.  
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz - 
                                               light_positions_or_vectors[i].w * vertex_worldspace;                                             
                float distance_to_light = length( surface_to_light_vector );

                vec3 L = normalize( surface_to_light_vector );
                vec3 H = normalize( L + E );
                // Compute the diffuse and specular components from the Phong
                // Reflection Model, using Blinn's "halfway vector" method:
                float diffuse  =      max( dot( N, L ), 0.0 );
                float specular = pow( max( dot( N, H ), 0.0 ), smoothness );
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light );
                
                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                                          + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        } `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
            attribute vec3 position, normal;                            
            // Position is expressed in object coordinates.
            
            uniform mat4 model_transform;
            uniform mat4 projection_camera_model_transform;
    
            void main(){                                                                   
                // The vertex's final resting place (in NDCS):
                gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
                // The final normal vector in screen space.
                N = normalize( mat3( model_transform ) * normal / squared_scale);
                vertex_worldspace = ( model_transform * vec4( position, 1.0 ) ).xyz;

                vertex_color = vec4(shape_color.xyz * ambient, shape_color.w);
                vertex_color.xyz += phong_model_lights(N, vertex_worldspace);
            } `;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // A fragment is a pixel that's overlapped by the current triangle.
        // Fragments affect the final image or get discarded due to depth.
        return this.shared_glsl_code() + `
            void main(){
                gl_FragColor = vertex_color;
                return;
            } `;
    }

    send_material(gl, gpu, material) {
        // send_material(): Send the desired shape-wide material qualities to the
        // graphics card, where they will tweak the Phong lighting formula.
        gl.uniform4fv(gpu.shape_color, material.color);
        gl.uniform1f(gpu.ambient, material.ambient);
        gl.uniform1f(gpu.diffusivity, material.diffusivity);
        gl.uniform1f(gpu.specularity, material.specularity);
        gl.uniform1f(gpu.smoothness, material.smoothness);
    }

    send_gpu_state(gl, gpu, gpu_state, model_transform) {
        // send_gpu_state():  Send the state of our whole drawing context to the GPU.
        const O = vec4(0, 0, 0, 1), camera_center = gpu_state.camera_transform.times(O).to3();
        gl.uniform3fv(gpu.camera_center, camera_center);
        // Use the squared scale trick from "Eric's blog" instead of inverse transpose matrix:
        const squared_scale = model_transform.reduce(
            (acc, r) => {
                return acc.plus(vec4(...r).times_pairwise(r))
            }, vec4(0, 0, 0, 0)).to3();
        gl.uniform3fv(gpu.squared_scale, squared_scale);
        // Send the current matrices to the shader.  Go ahead and pre-compute
        // the products we'll need of the of the three special matrices and just
        // cache and send those.  They will be the same throughout this draw
        // call, and thus across each instance of the vertex shader.
        // Transpose them since the GPU expects matrices as column-major arrays.
        const PCM = gpu_state.projection_transform.times(gpu_state.camera_inverse).times(model_transform);
        gl.uniformMatrix4fv(gpu.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        gl.uniformMatrix4fv(gpu.projection_camera_model_transform, false, Matrix.flatten_2D_to_1D(PCM.transposed()));

        // Omitting lights will show only the material color, scaled by the ambient term:
        if (!gpu_state.lights.length)
            return;

        const light_positions_flattened = [], light_colors_flattened = [];
        for (let i = 0; i < 4 * gpu_state.lights.length; i++) {
            light_positions_flattened.push(gpu_state.lights[Math.floor(i / 4)].position[i % 4]);
            light_colors_flattened.push(gpu_state.lights[Math.floor(i / 4)].color[i % 4]);
        }
        gl.uniform4fv(gpu.light_positions_or_vectors, light_positions_flattened);
        gl.uniform4fv(gpu.light_colors, light_colors_flattened);
        gl.uniform1fv(gpu.light_attenuation_factors, gpu_state.lights.map(l => l.attenuation));
    }

    update_GPU(context, gpu_addresses, gpu_state, model_transform, material) {
        // update_GPU(): Define how to synchronize our JavaScript's variables to the GPU's.  This is where the shader
        // recieves ALL of its inputs.  Every value the GPU wants is divided into two categories:  Values that belong
        // to individual objects being drawn (which we call "Material") and values belonging to the whole scene or
        // program (which we call the "Program_State").  Send both a material and a program state to the shaders
        // within this function, one data field at a time, to fully initialize the shader for a draw.

        // Fill in any missing fields in the Material object with custom defaults for this shader:
        const defaults = {color: color(0, 0, 0, 1), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40};
        material = Object.assign({}, defaults, material);

        this.send_material(context, gpu_addresses, material);
        this.send_gpu_state(context, gpu_addresses, gpu_state, model_transform);
    }
}
