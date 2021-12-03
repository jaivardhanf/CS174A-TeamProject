# CS174A-TeamProject: Turtle Mania

**Introduction**	

Our project is a one-player game situated in a virtual aquarium, in which the player controls/moves a turtle through a series of key interactions. The goal is to eat as many little fish as possible to earn "sand dollars" (points) used to decorate the aquarium, all while avoiding the sharks. The more fish the player eats, the more sand dollars they have earned to buy accessories, which are displayed on the menu bar at the top. The turtle has three lives and each time it is "eaten" by a shark, the turtle loses one life and the sharks will spawn faster.

**How to run the game:**	
1) Download file
2) MacOS: ./host.command
   Windows: host.bat
3) Open browser and go to http://localhost:8080

**How to Play**	

- Press ENTER to start
- Use up, down, left, right arrow keys to navigate the turtle
- Navigate turtle around sharks and have contact with fish to each them
- Click on the accessory you want from the menu bar on top and then click on the screen where you want to place it
- For additional functions such as lighting color change, off/on sound, and pause refer to bottom control panel 
- Players are encouraged to take a picture of your aquarium design once the game is over!
 
**Features**

1) User Interaction (Movement Control): player will navigate the turtle up, down, left, and right using the arrow keys
2) Collision detection: turtle interacting with prey and predator
   - 1st instance: turtle “eats” fish → remove fish and earn points/sand dollars
   - 2nd instance: shark “eats” turtle → lose 1 life 
3) Dynamic Object Instantiation: as game progresses sharks spawn at faster speeds 
4) Mouse Picking/Detection: player is able to decorate the aquarium by clicking the the item they want to buy and clicking an area on the screen where they want to place the item 
5) Shadows: the animals swimming in the water casts shadows onto the sandy aquarium floor
6) Texture & Shading: the fishes have stripes and gradient-colored tails, the sharks have shark-like skin, the water has swirls of different shades of blue to represent water. Jellyfish (purchasable item) have custom shading to mimic their transparency. 
7) Sound: a chomping sound each time a turtle eats a fish and there is background music which can be toggled on and off
8) Lighting: Light source from above that illuminates the entire tank, can change color when ‘c’ is pressed to mimic color-changing features of real life fish tanks
9) Night and Day Mode: Users are able to toggle between night and day mode by pressing the 'n' button

**Bugs**
- Sharks at times swim through each other 
- Sounds lag when triggered too immediately after another sound
- Placement of decorations/items often collides with other objects 
- Turtle movement is not very smooth

**Contributors**

Rachel Nguyen // rachelnguyn@gmail.com // rachnguyn // 205213689

Kimberly Sung // wansung186@gmail.com // kimsung12 // 805089045

Daniel Medina // dmedinag@g.ucla.edu // dmedinag29 // 204971333

Jai Fatehpuria // jaivardhan.f@gmail.com // jaivardhanf // 804817306
