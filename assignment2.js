import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Shader, Texture, Material, Scene,
} = tiny;


class Cube extends Shape {
    constructor() {
        super("position", "normal",);
        // Loop 3 times (for each axis), and inside loop twice (for opposing cube sides):
        this.arrays.position = Vector3.cast(
            [-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
            [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, -1], [-1, 1, -1]);
        this.arrays.normal = Vector3.cast(
            [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
            [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
            [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]);
        // Arrange the vertices into a square shape in texture space too:
        this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
            14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22);
    }
}

class Cube_Outline extends Shape {
    constructor() {
        super("position", "color");
        // TODO (Requirement 5).
        // When a set of lines is used in graphics, you should think of the list entries as
        // broken down into pairs; each pair of vertices will be drawn as a line segment.
        // Note: since the outline is rendered with Basic_shader, you need to redefine the position and color of each vertex

        // Draw each cube’s outline (the edges) in white
        this.arrays.position.push(...Vector3.cast(
            [1,1,-1], [1,-1,-1], [-1,1,1], [-1,-1,1], [1,1,-1],  [-1,1,-1],  [1,1,1],  [-1,1,1],
            [-1,-1,-1], [-1,-1,1], [-1,1,-1], [-1,1,1], [1,-1,1],  [1,-1,-1],  [1,1,1],  [1,1,-1],
            [1,-1,1],  [-1,-1,1],  [1,-1,1],  [1,1,1], [1,-1,-1], [-1,-1,-1], [-1,-1,-1], [-1,1,-1]));

        const white = color(1, 1, 1, 1);
        for (let i = 0; i < 24; i++) {
            this.arrays.color.push(white);
        }

        this.indexed = false;
    }
}

class Cube_Single_Strip extends Shape {
    constructor() {
        super("position", "normal");
        // TODO (Requirement 6)

        this.arrays.position.push(...Vector3.cast(
            [-1,-1,-1], [1,-1,-1], [-1,-1,1], [1,-1,1], 
            [-1,1,-1], [1,1,-1], [-1,1,1], [1,1,1]));
            
        this.arrays.normal.push(...Vector3.cast(
            [-1,-1,-1], [1,-1,-1], [-1,-1,1], [1,-1,1], 
            [-1,1,-1], [1,1,-1], [-1,1,1], [1,1,1]));

        this.indices.push(0, 1, 2, 3, 7, 2, 5, 0, 4, 2, 6, 7, 4, 5);
    }
}


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

        const bump = new defs.Fake_Bump_Map(1);
        const textured = new defs.Textured_Phong(1);

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            box: new defs.Cube(),
            fishbody: new defs.Subdivision_Sphere(4),
            box_2: new defs.Cube(),
            axis: new defs.Axis_Arrows(),
            waterbox: new defs.Subdivision_Sphere(4),
            tail: new defs.Triangle(),
        };
        
        // Materials
        this.materials = {
            plastic: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#BFD8E0")}),
            eye: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#000000")}),
            turtle: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#548a62")}),
            turtlehead: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#33573c")}),
            guppies: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#FBAB7F")}),
            blue: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: .6, color: hex_color("#2596be")}),
            a: new Material(bump, {ambient: .5, texture: new Texture("assets/background2.jpg")}),
            b: new Material(textured, {ambient: .5, texture: new Texture("assets/water.jpeg")}),
            c: new Material(bump, {ambient: 1, texture: this.texture})
        };

        /* Turtle coordinates */
        this.y_movement = 0;
        this.x_movement = 0;
        
        /* Coordinates and time offsets for fishes & sharks */
        this.x_spawn_left = Array.from({length: 5}, () => Math.floor(Math.random() * (-100 +30) -30));
        this.y_spawn_left = Array.from({length: 5}, () => Math.floor(Math.random() * 20));
        this.time_offsets_left = Array(5).fill(0);

        this.x_spawn_right = Array.from({length: 5}, () => Math.floor(Math.random() * (100 - 30) + 30));
        this.y_spawn_right = Array.from({length: 5}, () => Math.floor(Math.random() * 20));
        this.time_offsets_right = Array(5).fill(0);

        this.x_shark_spawn_left = Array.from({length: 5}, () => Math.floor(Math.random() * (-100 + 30) -30));
        this.y_shark_spawn_left = Array.from({length: 5}, () => Math.floor(Math.random() * 20));
        this.time_shark_offsets_left = Array(5).fill(0);

        this.x_shark_spawn_right = Array.from({length: 5}, () => Math.floor(Math.random() * (50 - 30) + 30));
        this.y_shark_spawn_right = Array.from({length: 5}, () => Math.floor(Math.random() * 20));
        this.time_shark_offsets_right = Array(5).fill(0);        

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
    
    }

    

    /* Drwas fishes coming from left*/
    draw_fishes_left(context, program_state, model_transform, fish_count, t) { 
            var x_cord = this.x_spawn_left[fish_count];
            var y_cord = this.y_spawn_left[fish_count];
            let speed = 3;
        /* Checks if current x-coord is offscreen, if its not it just keeps swimming :) */
        if(x_cord+((t-this.time_offsets_left[fish_count])*speed) < 25){
            let fish_trans = model_transform.times(Mat4.translation(x_cord, y_cord, 0, 0))
                                              .times(Mat4.translation((t-this.time_offsets_left[fish_count])*speed,0,0,0))
                                              .times(Mat4.scale(0.8,0.6,0.5,1));
      
            this.shapes.fishbody.draw(context, program_state, fish_trans, this.materials.guppies);

            let tail_trans = model_transform.times(Mat4.translation(x_cord-0.5, y_cord, 0, 0))
                                             .times(Mat4.translation((t-this.time_offsets_left[fish_count])*speed,0,0,0))
                                             .times(Mat4.scale(1,1,1,1))
                                             .times(Mat4.rotation(-73,0,0,1))
            this.shapes.tail.draw(context, program_state, tail_trans, this.materials.guppies);
        /* If fish off screen, we update it the time offset since we use time to translate in above bracket
           Also updated coordinates so it looks more random
        */
        }else{
            this.time_offsets_left[fish_count] = t;
            this.x_spawn_left[fish_count] = Math.floor(Math.random() * (-100 +30) -30);
            this.y_spawn_left[fish_count] = Math.floor(Math.random() * 20);
        }
    }
    

    /* Draws fishes coming from right */    
    draw_fishes_right(context, program_state, model_transform, fish_count, t){
        var x_cord = this.x_spawn_right[fish_count];
        var y_cord = this.y_spawn_right[fish_count];
        let speed = 3;
        /* Checks if current x-coord is offscreen, if its not it just keeps swimming :) */
        if(x_cord-((t-this.time_offsets_right[fish_count])*speed) > -35){
            let fish_trans = model_transform.times(Mat4.translation(x_cord, y_cord, 0, 0))
                                              .times(Mat4.translation(-(t-this.time_offsets_right[fish_count])*speed,0,0,0))
                                              .times(Mat4.scale(0.8,0.6,0.5,1));
      
            this.shapes.fishbody.draw(context, program_state, fish_trans, this.materials.guppies);

            let tail_trans = model_transform.times(Mat4.translation(x_cord+0.5, y_cord, 0, 0))
                                             .times(Mat4.translation(-(t-this.time_offsets_right[fish_count])*speed,0,0,0))
                                             .times(Mat4.scale(1,1,1,1))
                                             .times(Mat4.rotation(74.61,0,0,1))
            this.shapes.tail.draw(context, program_state, tail_trans, this.materials.guppies);
        /* If fish off screen, we update it the time offset since we use time to translate in above bracket
           Also updated coordinates so it looks more random
        */
        }else{
            this.time_offsets_right[fish_count] = t;
            this.x_spawn_right[fish_count] = Math.floor(Math.random() * (100 - 30) + 30);
            this.y_spawn_right[fish_count] = Math.floor(Math.random() * 20);
        }
        
    }

    draw_shark_left(context, program_state, model_transform, shark_count, t){
        var x_cord = this.x_shark_spawn_left[shark_count];
        var y_cord = this.y_shark_spawn_left[shark_count];
        let speed = 1;
        
        /* Checks if current x-coord is offscreen, if its not it just keeps swimming :) */

        if(x_cord+((t-this.time_shark_offsets_left[shark_count])*speed) < 25){
            let shark_transform = model_transform.times(Mat4.translation(x_cord, y_cord, 0, 0))
                                             .times(Mat4.translation((t-this.time_shark_offsets_left[shark_count])*speed,0,0,0))
                                             .times(Mat4.scale(3,1.5,1,1));
            this.shapes.fishbody.draw(context, program_state, shark_transform, this.materials.plastic);

            let eye_transform = model_transform.times(Mat4.translation(x_cord+2, y_cord, 0.8, 0))
                                             .times(Mat4.translation((t-this.time_shark_offsets_left[shark_count])*speed,0,0,0))
                                             .times(Mat4.scale(0.1,0.1,0.1,1));
            this.shapes.fishbody.draw(context, program_state, eye_transform, this.materials.eye);

            let tails_transform = model_transform.times(Mat4.translation(x_cord-3.03, y_cord, 0, 0))
                                             .times(Mat4.translation((t-this.time_shark_offsets_left[shark_count])*speed,0,0,0))
                                             .times(Mat4.scale(2,1.5,1,1))
                                             .times(Mat4.rotation(-74.7,0,0,1));
            this.shapes.tail.draw(context, program_state, tails_transform, this.materials.plastic);

            let tails2_transform = model_transform.times(Mat4.translation(x_cord-3.03, y_cord, 0, 0))
                                             .times(Mat4.translation((t-this.time_shark_offsets_left[shark_count])*speed,0,0,0))
                                             .times(Mat4.scale(2,1.5,1,1))
                                             .times(Mat4.rotation(-27.4,0,0,1));
            this.shapes.tail.draw(context, program_state, tails2_transform, this.materials.plastic);

            let fin_transform = model_transform.times(Mat4.translation(x_cord-0.5, y_cord+1.5, 0, 0))
                                             .times(Mat4.translation((t-this.time_shark_offsets_left[shark_count])*speed,0,0,0))
                                             .times(Mat4.scale(2,1.5,1,1))
                                             .times(Mat4.rotation(-145,0,0,1));
            this.shapes.tail.draw(context, program_state, fin_transform, this.materials.plastic);

        /* 
           If shark off screen, we update it the time offset since we use time to translate in above above bracket
           Also updated coordinates so it looks more random
        */
        }else{
            this.time_shark_offsets_left[shark_count] = t;
            this.x_shark_spawn_left[shark_count] = Math.floor(Math.random() * (-100 + 30) - 30);
            this.y_shark_spawn_left[shark_count] = Math.floor(Math.random() * 20);
        }

    }
    

    display(context, program_state) {                                 // display():  Draw both scenes, clearing the buffer in between.
        let model_transform = Mat4.identity();
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        const light_position = vec4(0, 5, 5, 1);
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];        

        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.translation(5, -10, -30));
        }
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        // Perform two rendering passes.  The first one we erase and
        // don't display after using to it generate our texture.
        // Draw Scene 1:

        this.scratchpad_context.drawImage(context.canvas, 0, 0, 256, 256);

        // Don't call copy to GPU until the event loop has had a chance
        // to act on our SRC setting once:
        if (this.skipped_first_frame)
            // Update the texture with the current scene:
        this.texture.copy_onto_graphics_card(context.context, false);
        this.skipped_first_frame = true;

        // Start over on a new drawing, never displaying the prior one:
        context.context.clear(context.context.COLOR_BUFFER_BIT | context.context.DEPTH_BUFFER_BIT);


        let background_transform = model_transform;
        background_transform = background_transform.times(Mat4.rotation(0, 0, 1, 0))
                                                   .times(Mat4.translation(0, 0, 0, 0))
                                                   .times(Mat4.rotation(Math.PI / 2, 1, 0, 0))
                                                   .times(Mat4.scale(60, 60, 60))
                                                   .times(Mat4.rotation(t/50, 0, 1, 0));

        // Draw Background
        this.shapes.waterbox.draw(context, program_state, background_transform, this.materials.b);
        // this.shapes.box.draw(context, program_state, model_transform, this.materials.plastic);

        // Up Count (movement control) 
        var y = this.y_movement;
        var x = this.x_movement;

        //Turtle Draw Body
        let turtle_transform = model_transform.times(Mat4.scale(1.5,1.8,1,0))
                                               .times(Mat4.translation(x/2,y/4,0,0));
        this.shapes.fishbody.draw(context, program_state, turtle_transform, this.materials.turtle);

        let turtle2_transform = model_transform.times(Mat4.translation(0, 1.9, 0, 0))
                                               .times(Mat4.scale(0.5,0.5,0.2,0))
                                               .times(Mat4.translation(x*1.5,y/1.1,0,0));
        this.shapes.fishbody.draw(context, program_state, turtle2_transform, this.materials.turtlehead);

        
        let turtle3_transform = model_transform.times(Mat4.translation(-1.6, 1, 0, 0))
                                               .times(Mat4.scale(0.8,0.4,0.2,0))
                                               .times(Mat4.translation(x*0.94,y*1.1,0,0));
        this.shapes.fishbody.draw(context, program_state, turtle3_transform, this.materials.turtlehead);
        
        let turtle4_transform = model_transform.times(Mat4.translation(-1.6, -0.7, 0, 0))
                                               .times(Mat4.scale(0.8,0.4,0.2,0))
                                               .times(Mat4.translation(x*0.94,y*1.1,0,0));
        this.shapes.fishbody.draw(context, program_state, turtle4_transform, this.materials.turtlehead);
        
        let turtle5_transform = model_transform.times(Mat4.translation(1.55, 1, 0, 0))
                                               .times(Mat4.scale(0.8,0.4,0.2,0))
                                               .times(Mat4.translation(x*0.94,y*1.1,0,0));
        this.shapes.fishbody.draw(context, program_state, turtle5_transform, this.materials.turtlehead);
        
        let turtle6_transform = model_transform.times(Mat4.translation(1.55, -0.7, 0, 0))
                                               .times(Mat4.scale(0.8,0.4,0.2,0))
                                               .times(Mat4.translation(x*0.94,y*1.1,0,0));
        this.shapes.fishbody.draw(context, program_state, turtle6_transform, this.materials.turtlehead);

/*
        let turtle_transform = model_transform.times(Mat4.scale(1.5,1.8,1,0))
                                               .times(Mat4.translation(x/2,y/4,0,0));
        this.shapes.fishbody.draw(context, program_state, turtle_transform, this.materials.turtle);

        let turtle2_transform = model_transform.times(Mat4.translation(0, 1.9, 0, 0))
                                               .times(Mat4.scale(0.5,0.5,0.2,0))
                                               .times(Mat4.translation(x*1.5,y/1.1,0,0));
        this.shapes.fishbody.draw(context, program_state, turtle2_transform, this.materials.turtlehead);

        let turtle3_transform = model_transform.times(Mat4.translation(-1.6, 1, 0, 0))
                                               .times(Mat4.scale(0.8,0.4,0.2,0))
                                               .times(Mat4.translation(x/1.1,y,0,0));
        this.shapes.fishbody.draw(context, program_state, turtle3_transform, this.materials.turtlehead);

        let turtle4_transform = model_transform.times(Mat4.translation(-1.5, -0.7, 0, 0))
                                               .times(Mat4.scale(0.8,0.4,0.2,0))
                                               .times(Mat4.translation(x/1.1,y,0,0));
        this.shapes.fishbody.draw(context, program_state, turtle4_transform, this.materials.turtlehead);

        let turtle5_transform = model_transform.times(Mat4.translation(1.6, 1, 0, 0))
                                               .times(Mat4.scale(0.8,0.4,0.2,0))
                                               .times(Mat4.translation(x/1.1,y,0,0));
        this.shapes.fishbody.draw(context, program_state, turtle5_transform, this.materials.turtlehead);
        
        let turtle6_transform = model_transform.times(Mat4.translation(1.5, -0.7, 0, 0))
                                               .times(Mat4.scale(0.8,0.4,0.2,0))
                                               .times(Mat4.translation(x/1.1,y,0,0));
        this.shapes.fishbody.draw(context, program_state, turtle6_transform, this.materials.turtlehead);
*/
        //Turtle End Draw
        /*
        let shark_transform = model_transform.times(Mat4.translation(-30, 15, 0, 0))
                                             .times(Mat4.translation(t,0,0,0))
                                             .times(Mat4.scale(3,1.5,1,1));
        this.shapes.fishbody.draw(context, program_state, shark_transform, this.materials.plastic);

        let eye_transform = model_transform.times(Mat4.translation(-28, 15, 0.8, 0))
                                             .times(Mat4.translation(t,0,0,0))
                                             .times(Mat4.scale(0.1,0.1,0.1,1));
        this.shapes.fishbody.draw(context, program_state, eye_transform, this.materials.eye);

        let tails_transform = model_transform.times(Mat4.translation(-33.03, 15, 0, 0))
                                             .times(Mat4.translation(t,0,0,0))
                                             .times(Mat4.scale(2,1.5,1,1))
                                             .times(Mat4.rotation(-74.7,0,0,1));
        this.shapes.tail.draw(context, program_state, tails_transform, this.materials.plastic);

        let tails2_transform = model_transform.times(Mat4.translation(-33.03, 15, 0, 0))
                                             .times(Mat4.translation(t,0,0,0))
                                             .times(Mat4.scale(2,1.5,1,1))
                                             .times(Mat4.rotation(-27.4,0,0,1));
        this.shapes.tail.draw(context, program_state, tails2_transform, this.materials.plastic);

        let fin_transform = model_transform.times(Mat4.translation(-30.5, 16.5, 0, 0))
                                             .times(Mat4.translation(t,0,0,0))
                                             .times(Mat4.scale(2,1.5,1,1))
                                             .times(Mat4.rotation(-145,0,0,1));
        this.shapes.tail.draw(context, program_state, fin_transform, this.materials.plastic);
        */

        
        let left_fish_count = 5;
        let right_fish_count = 5;
        let shark_left_count = 3;
        let shark_right_count = 5;
        
        for(let i = 0; i < left_fish_count; i++){
            this.draw_fishes_left(context, program_state, model_transform, i, t);
        }
        for(let i = 0; i < right_fish_count; i++){
            this.draw_fishes_right(context, program_state, model_transform, i, t);
        }
        for(let i = 0; i < shark_left_count; i++){
            this.draw_shark_left(context, program_state, model_transform, i, t);
        }


    }

     getRandomInt(min, max) {
          min = Math.ceil(min);
          max = Math.floor(max);
          return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is exclusive and the minimum is inclusive
    }

}
