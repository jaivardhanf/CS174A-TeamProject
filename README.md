# CS174A-TeamProject

***Turtle Mania***

**Introduction**	

Our project is a one-player game situated in an aquarium, in which the player controls/moves a turtle through a series of key interactions. The goal is to eat as many little fish as possible to earn "sand dollars" (points) to decorate the aquarium while avoiding the sharks. The more fish the player eats, the more sand dollars they have to buy accessories which are displayed on the menu bar on top. The turtle has three lives and each time it is "eaten", the turtle loses one life and the sharks will spawn faster.

**How to run the game:**	
1) MacOS: ./host.command
   Windows: host.bat
2) Open browser and go to http://localhost:8080

**How to Play**	

- Press ENTER to start
- Use up, down, left, right arrow keys to navigate the turtle
- Navigate turtle around sharks and have contact with fish to each them
- Click on the accessory you want from the menu bar on top and then click on the screen where you want to place it
- For additional functions such as lighting change, off/on sound, and pause refer to bottom 
- Take a picture of your aquarium design once the game is over!
 
**Features**

1) User Interaction (Movement Control): player will navigate the turtle up, down, left, and right using the arrow keys
2) Collision detection: turtle interacting with prey and predator
   - 1st instance: turtle “eats” → remove fish and earn points
   - 2nd instance: shark “eats” turtle → lose 1 life 
3) Dynamic Object Instantiation: as game progresses sharks spawn at faster speeds 
4) Sound: a chomping sound each time a turtle eats a fish and there is background music which can be toggled on and off
5) Shadows: the animals swimming in the water casts shadows onto the aquarium floor
6) Texture: the fishes have stripes and the sharks have shark-like skin, the water has swirls of different shades of blue
7) Mouse Picking/Detection: player is able to decorate the aquarium by clicking the the item they want to buy and clicking an area on the screen where they want to place the item 
8) Lighting: Light source from above that illuminates the entire tank, can change color when ‘c’ is pressed to mimic color-changing features of real life fish tanks

**Bugs**
- Turtle is able to "sink" into the sand, so player could technically hide there to avoid sharks. 
- 

**Contributors**
Rachel Nguyen // rachelnguyn@gmail.com // rachnguyn // 205213689

Kimberly Sung // wansung186@gmail.com // kimsung12 // 805089045

Daniel Medina // dmedinag@g.ucla.edu // dmedinag29 // 204971333

Jai Fatehpuria // jaivardhan.f@gmail.com // jaivardhanf // 804817306
