
/********************************* 

Copyright (c) Bednárik Boldizsár
      https://bboldi.com

*********************************/

(function() {

    // const -------------------------------------------

    const NORMAL_SPEED = 1;
    const FAST_SPEED = 100;

    // variables ---------------------------------------

    let doInterrupt = false;
    let wasSkipped = false;
    let $ = document;
    let animOver = true;
    let actualPage = "";
    let interruptCallback = ()=>{};
    let isMuted = false;
    let canPlayAudio = false;

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

    // audio -------------------------------------------

    let audio = new Audio('./res/typing.mp3');
    audio.volume = maxVolume;
    audio.loop = true;

    // code --------------------------------------------

    isMuted = getCookie('isMuteOn')=='yes';
    mute(isMuted);
    setMuteSpan();

    /**
     * Set mute span
     */
    function setMuteSpan()
    {
        mutedSpan.innerHTML = isMuted ? mutedOn : mutedOff;
    }

    /**
     * Toggle mute state
     */
    function toggleMute()
    {
        isMuted = !isMuted;
        setCookie('isMuteOn', isMuted ? 'yes' : 'no');
        mute(isMuted);
        setMuteSpan();
    }

    // expose function
    document.toggleMute = toggleMute;

    /**
     * Mute/Unmute audio
     * 
     * @param {bool} doMute 
     */
    function mute(doMute)
    {
        if(doMute){
            audio.pause();
        }
    }

    // allow playing audio only when user interacted with site

    document.body.addEventListener('click', ()=>{
        canPlayAudio = true;
    });

    // add listeners if we want to allow skip

    if(allowSkip)
    {
        document.addEventListener('keypress', (e)=>{

            // speed up page when enter or space pressed
            if(["Enter","Space"].indexOf(e.code)>=0)
            {
                wasSkipped = true;
                speedDivider = FAST_SPEED;
            }

        });

        // document click

        container.addEventListener('click', (event)=>{
            // speed up page when clicked
            wasSkipped = true;
            speedDivider = FAST_SPEED;
        }, true);
    }

    /**
     * Set interrupt
     * 
     * @param {Function} callback 
     */
    function interrupt(callback)
    {
        doInterrupt = true;
        interruptCallback = callback;
    }

    /**
     * Delay
     * 
     * @param {number} ms 
     * @returns 
     */
    function delay(ms)
    {
        return new Promise(r => setTimeout(r, Math.round(ms/speedDivider)));
    }

    /**
     * Replaces links in text when typer animation is done
     * 
     * @param {string} inputText 
     * @returns modified text
     */
    function linkify(inputText) {
        var replacedText, replacePattern1, replacePattern2, replacePattern3;
    
        //URLs starting with http://, https://, or ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
    
        //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
    
        //Change email addresses to mailto:: links.
        replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
        replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1" target="_blank">$1</a>');

        // change [text=local_anchor] to #text that links to #local_anchor
        replacePattern4 = /\[([^\]]*)=([^\]]*)\]/gmi;
        replacedText = replacedText.replace(replacePattern4, '<a href="#$2">#$1</a>');
    
        return replacedText;
    }    

    /**
     * Set cookie key value pair
     * 
     * @param {string} key 
     * @param {*} value 
     */
    function setCookie(key, value) {
        var expires = new Date();
        expires.setTime(expires.getTime() + 1 * 24 * 60 * 60 * 1000);
        document.cookie =
        key + "=" + value + ";expires=" + expires.toUTCString();
    }

    /**
     * Get cookie value
     * 
     * @param {string} key 
     * @returns value
     */
    function getCookie(key) {
        var keyValue = document.cookie.match(
        "(^|;) ?" + key + "=([^;]*)(;|$)"
        );
        return keyValue ? keyValue[2] : null;
    }

    /**
     * Typer Object
     */
    let Typer = () => {

        /**
         * Start playback
         * 
         * @param {boolean} doReset 
         */
        function playAudio(doReset = true)
        {
            if(doReset) { audio.currentTime = Math.random()*4; }
            if(canPlayAudio && !isMuted)
            {
                audio.play();
            }
        }

        /**
         * Stop audio playback
         */
        function stopAudio()
        {
            audio.pause();
        }

        // object for exposing public functions
        let obj = {};

        /**
         * Add cursor
         */
        function addAnimCursor()
        {
            container.innerHTML += animCursor;
        }

        /**
         * Remove cursor
         */
        function removeAnimCursor()
        {
            container.innerHTML = container.innerHTML.slice(0, - animCursor.length);
        }

        /**
         * Add a character from text
         * 
         * @param {string} ch 
         * @returns null
         */
        async function addChar(ch)
        {
            // pause character? delay
            if(ch==pauseChar)
            {
                addAnimCursor();
                stopAudio();
                await delay(pauseDelay);
                playAudio(false);
                removeAnimCursor();

                return;
            }

            if(ch==deleteLineChar)
            {
                container.innerHTML = container.innerHTML.substring(0, container.innerHTML.lastIndexOf("\n"));
                return;
            }

            if(ch==speedUpChar)
            {
                if(!wasSkipped)
                {
                    speedDivider = FAST_SPEED;
                }
                return;
            }

            if(ch==slowDownChar)
            {
                if(!wasSkipped)
                {
                    speedDivider = NORMAL_SPEED;
                }
                return;
            }

            container.innerHTML += ch;
            addAnimCursor();

            let dt = Math.random()*writeMaxDelay;
            if([" ", "/n"].indexOf(ch)>=0) dt = spaceDelay;

            await delay(dt);

            removeAnimCursor();

            if(Math.random()*100 > 100-errorPorbability && ["\n","\r"," ",".","-","="].indexOf(ch)<0 && speedDivider==NORMAL_SPEED)
            {
                let cnt = Math.round(Math.random()*errorCharMaxCnt)+1;

                await error(cnt);
                await delay(Math.random()*deleteMaxDelay);
                await removeChar(cnt);

            }

        }

        /**
         * Removes cnt characters
         * 
         * @param {number} cnt 
         */
        async function removeChar(cnt)
        {
            for(let i=0;i<cnt;i++)
            {
                container.innerHTML = container.innerHTML.slice(0, -1);
                addAnimCursor();
                let dt = Math.random()*deleteMaxDelay;
                await delay(dt);
                removeAnimCursor();
            }
        }

        /**
         * Adds few random characters to the text emulating typo
         * 
         * @param {number} charNum 
         */
        async function error(charNum)
        {
            for(let i=0;i<charNum;i++)
            {
                await addChar(String.fromCharCode(97+Math.round(Math.random()*25)));
            }
        }

        /**
         * Create typer object public stuff
         * 
         * @param {string} text 
         * @returns 
         */
        obj.animate = async (text)=>{
            animOver = false;

            // reset display
            container.innerHTML = '';

            // split text
            let tarr = text.split('');

            playAudio();

            for(let i=0;i<tarr.length && !doInterrupt;i++)
            {
                await addChar(tarr[i]);
            }

            if(doInterrupt)
            {
                doInterrupt = false;
                interruptCallback();
                return;
            }

            stopAudio();
            addAnimCursor();
            doInterrupt = false;
            animOver = true;

            // convert text to links

            container.innerHTML = linkify(container.innerHTML);
        };

        return obj;
    };

    // initialize Typer
    let typer = Typer();

    /**
     * Load page
     * 
     * @param {string} page which page to load from content object
     * @param {number} speedDiv set speed divider to set loading speed
     * @param {boolean} skipped did user skip the animation
     */
    function loadPage(page, speedDiv = NORMAL_SPEED, skipped=false)
    {
        wasSkipped = skipped;
        speedDivider = speedDiv;
        _page = content[page]['text'];
        actualPage = page;

        // set title

        titleSpan.innerHTML = content[page]['title'];

        // set submenu

        submenuContainer.innerHTML = '';

        for(let cnt = 0; cnt<content[page]['submenu'].length;cnt++)
        {
            let mnu = content[page]['submenu'][cnt];
            submenuContainer.innerHTML += '<a class="menuBtn" target="'+mnu['target']+'" href="' + mnu['link'] + '">/' + mnu['text'] + '</a> ';
        }

        // set and display image

        if(content[page]['image'])
        {
            img.classList.add('hide');
            let imgData = content[page]['image'];
            img.src = imgData['src'];

            let style = '';

            for(let [key,value] of Object.entries(imgData['style']))
            {
                style += key+': '+value+';';
            }

            img.style = style;

            img.classList.remove('hide');
            img.classList.remove('show');
            img.classList.add('show');
        }
        else
        {
            img.classList.add('hide');
            img.classList.remove('show');
        }

        // set content, start animation

        if(animOver)
        {
            typer.animate(_page);
        } else if(!doInterrupt)
        {
            interrupt(function(){
                typer.animate(_page);
            });
        }
    }

    /**
     * Get current page object
     * 
     * @returns object
     */
    function getCurrentPage()
    {
        let page = window.location.hash;
        page = page.slice(1);

        if(!content[page])
        {
            page = 'index';
        }

        return page;
    }

    /**
     * Function to change the page
     * 
     * @param {number} speedDiv speed divider
     * @param {boolean} skipped did user skipp page?
     */
    function changePage(speedDiv = NORMAL_SPEED, skipped = false)
    {
        // set navigation
        let _as = $.querySelectorAll('.menuBtn');
        for( let i = 0;i<_as.length;i++) {
            _as[i].classList.remove("activeMenuBtn");
            if(_as[i].href.indexOf('#'+getCurrentPage())>0)
            {
                _as[i].classList.add("activeMenuBtn");
            }
        }

        // load page
        loadPage(getCurrentPage(), speedDiv, skipped);
    }

    // on page navigation
    window.onhashchange = () => {
        changePage();
    }

    // initial page load - fast
    changePage(FAST_SPEED, true);

})();
