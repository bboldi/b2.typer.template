# b2.typer.template

This is a starter template to help you make a home page that looks and feels like a Retro Terminal. It's pure javascript, html and css - nothing fancy, simple static stuff.

There are some special characters that will affect how the content is displayed - see the `content.js` file for more info.

Feel free to modify or use this script as you feel, but please attribute the author.

The script was put together in a few hours, so don't expect anything fancy :)

I put some variables to the beginning of the main.js file, so you can fine-tune it to your liking

```javascript
    // const -------------------------------------------

    const NORMAL_SPEED = 1;
    const FAST_SPEED = 100;

    ...

    // config ------------------------------------------

    let crsr = '█';
    let container = $.getElementById('main_container');
    let titleSpan = $.getElementById('titleSpan');
    let mutedSpan = $.getElementById('muteSpan');
    let mutedOff = '/sound';
    let mutedOn = '/<strike>sound</strike>';
    let img = $.getElementById('img');
    let submenuContainer = $.getElementById('submenu');
    let writeMaxDelay = 50;
    let spaceDelay = 10;
    let deleteMaxDelay = 100;
    let errorCharMaxCnt = 2;
    let errorPorbability = 5;
    let pauseDelay = 300;
    let pauseChar = "^";
    let deleteLineChar = "~";
    let speedUpChar = "{";
    let slowDownChar = "}";
    let animCursor = "<span id=\"crsr\">"+crsr+"</span>";
    let speedDivider = NORMAL_SPEED;
    let allowSkip = true;
    let maxVolume = 0.5;

    ```

the content configuration can be modified in content.js , but here's an example of some things that you can use:

```
^ - this character will make the cursor pause
~ - this will make it delete a line back
whatever you put in between { and } will be written out full speed
you can add internal links usign this syntax [LINK TEXT=link_target]
```

user can speed up the animation by clicking/tapping on the page, or pressing the space button

that's all from the top of my head :) have fun!
