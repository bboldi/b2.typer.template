// add date as version :)

const _index_text = `
{
    #   ###      #                  
    ###   #     ### # # ### ### ### 
    # # ###      #  ### # # ##  #   
    ### #        ##   # ### ### #   
        ###  #      ### #           
  
                          [OK=about] `;


const _submenu_text = `
Lorem Ipsum is simply dummy text of the
 printing and typesetting 
industry. Lorem Ipsum has been the 
industry's standard dummy text 
ever since the 1500s, when an unknown printer 
took a galley of 
type and scrambled it to make a type ... 

:) `;

const _about_text = `^About ...^^

b2.typer.template helps you create retro
terminal-like sites ... like this one ...

some stuff that you can do

pause the cursor ^^^
{force max speed for part of the text} ^^^
write a line ^^^
and another line ^^^
then delete them all ^^^
~~~~

combine it for some animation ^^^^^

{[...}^{...}^{...}^{...]}^^^~~~~

links will will be clickable https://bboldi.com

of add internal links like this [Internal Link=home]

no patience? click anywhere to speed it up 
( or press space ) ^^^

parts:

- content.js - put your content here
- main.js - content typing emulator script

feel free to use it for your own projects

please attribute the author

}/OK `;

let submenus = [
  {
    text: "submenu 1",
    link: "#submenu1",
    target: "",
  },
  {
    text: "submenu 2",
    link: "#submenu2",
    target: "",
  },
  {
    text: "submenu 3",
    link: "#submenu3",
    target: "",
  },
  {
    text: "external 1",
    link: "https://bboldi.com",
    target: "_blank",
  },
  {
    text: "external 2",
    link: "https://github.com/bboldi",
    target: "_blank",
  },
];

let content = {
  index: {
    title: " - index",
    image: null,
    submenu: [],
    text: _index_text,
  },
  submenus: {
    title: " - submenus",
    image: null,
    submenu: submenus,
    text: _submenu_text,
  },
  about: {
    title: " - about",
    image: {
      src: "res/placeholder.jpg",
      style: {
        left: "40em",
        top: "3em",
        transform: "rotate(44deg)",
      },
    },   
    submenu: [],
    text: _about_text,
  },
  submenu1: {
    title: " - submenu 1",
    image: {
      src: "res/placeholder.jpg",
      style: {
        left: "49em",
        top: "5em",
        transform: "rotate(30deg)",
      },
    },   
    submenu: submenus,
    text: "Submenu 1 example\n" + _submenu_text,
  },
  submenu2: {
    title: " - submenu 2",
    image: {
      src: "res/placeholder.jpg",
      style: {
        left: "46em",
        top: "6em",
        transform: "rotate(-30deg)",
      },
    },   
    submenu: submenus,
    text: "Submenu 2 example\n" + _submenu_text,
  },
  submenu3: {
    title: " - submenu 3",
    image: null,
    submenu: submenus,
    image: {
      src: "res/placeholder.jpg",
      style: {
        left: "46em",
        top: "6em",
        height: "200px",
        transform: "rotate(99deg)",
      },
    },   
    text: "Submenu 3 example\n" + _submenu_text,
  },
};
