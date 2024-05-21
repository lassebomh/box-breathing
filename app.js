        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('./sw.js')
                .then((registration) => {
                    registration.update()
                })
        };

        window.addEventListener('load', () => {

            var startTime = Date.now();
            
            const dot = document.getElementById('dot')
            const guideArrow = document.getElementById("guide-arrow")
            const audio = document.getElementById('audio-player')

            const toggleGuideText = document.querySelector('#toggle-guide-text-setting > input')
            const toggleSessionTime = document.querySelector('#toggle-session-time-setting > input')

            const guideTextContainer = document.getElementById('guide-text')
            const sessionTime = document.getElementById('session-time')
            const sessionTimeExtra = document.getElementById('session-time-extra')

            const boxSizeInput = document.querySelector("#box-size-setting .incrementer-value")

            window.shiftBoxSize = (x) => {
                let size = Math.round((parseFloat(localStorage.getItem("box_size") || "1") + x) * 100);
                size = Math.min(300, Math.max(40, size))

                localStorage.setItem("box_size", size / 100)
                boxSizeInput.textContent = size + '%';

                document.body.style.setProperty('--box-size-width', size / 100);
            }

            shiftBoxSize(0)

            const revealSessionTimeInput = document.querySelector("#reveal-timer-setting .incrementer-value")

            function getSessionTimeDelay() {
                return Math.round(parseFloat(localStorage.getItem("reveal_session_time_after") || "0"));
            }
            let sessionRevealTimeout;

            window.shiftRevealSessionTime = (x) => {
                console.log(x);
                let minutes = Math.round(getSessionTimeDelay() + x);
                minutes = Math.max(0, minutes)

                localStorage.setItem("reveal_session_time_after", minutes)

                if (minutes > 0) {
                    toggleSessionTime.checked = true;
                    localStorage.setItem("show_session_time", true)
                    refreshSessionVisibility(minutes);
                }

                revealSessionTimeInput.textContent = minutes + 'm';

                return minutes
            }

            shiftRevealSessionTime(0)


            function refreshGuideVisibility() {
                let enabled = localStorage.getItem("show_guide_text") !== "false";
                guideTextContainer.style.opacity = enabled ? '1' : '0';

                return enabled;
            }

            toggleGuideText.addEventListener('change', (e) => {
                let enabled = toggleGuideText.checked;
                localStorage.setItem("show_guide_text", enabled)
                refreshGuideVisibility()
            })

            toggleGuideText.checked = refreshGuideVisibility();

            function refreshSessionVisibility(delay) {
                if (sessionRevealTimeout) clearTimeout(sessionRevealTimeout)
                    sessionTime.style.transitionProperty = "initial";
                    sessionTime.style.transitionDuration = "initial";

                let enabled = localStorage.getItem("show_session_time") == "true";

                if (enabled) {
                    if (delay > 0) {
                        sessionTime.style.opacity = '0';
                        sessionTime.style.transitionProperty = "opacity";
                        sessionTime.style.transitionDuration = "0.5s";

                        sessionRevealTimeout = setTimeout(() => {
                            sessionTime.style.opacity = '1';
                        }, 60000 * delay)
                    } else {
                        sessionTime.style.opacity = '1';
                    }

                } else {
                    shiftRevealSessionTime(-99999999)
                    sessionTime.style.opacity = '0';

                }

                return enabled;
            }

            toggleSessionTime.addEventListener('change', (e) => {
                let enabled = toggleSessionTime.checked;
                localStorage.setItem("show_session_time", enabled)
                refreshSessionVisibility(getSessionTimeDelay())
            })

            toggleSessionTime.checked = refreshSessionVisibility(getSessionTimeDelay());


            function pad(number) {
                return number < 10 ? '0' + number : number;
            }

            function updateTimer() {
                var elapsedTime = Date.now() - startTime;
                
                var hours = Math.floor(elapsedTime / 3600000);
                elapsedTime %= 3600000;
                
                var minutes = Math.floor(elapsedTime / 60000);
                elapsedTime %= 60000;
                
                var seconds = Math.floor(elapsedTime / 1000);

                var timerStr = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
                sessionTime.textContent = timerStr;
                sessionTimeExtra.textContent = "(" + timerStr + ")"

            }

            updateTimer()
            setInterval(updateTimer, 1000);


            function hideGuideArrow(event) {
                guideArrow.style.opacity = '0'
                window.removeEventListener('scroll', hideGuideArrow, { passive: true })

            }
        
            function showGuideArrow(event) {
                guideArrow.style.opacity = '1'
                window.addEventListener('scroll', hideGuideArrow)
                localStorage.setItem("arrow_shown", "true")

                toggleGuideText.checked = false;
                localStorage.setItem("show_guide_text", false)
                refreshGuideVisibility(true)

            }
            
            if (window.scrollY == 0 && localStorage.getItem("arrow_shown") != 'true') {
                
                toggleGuideText.checked = true;
                localStorage.setItem("show_guide_text", true)
                refreshGuideVisibility(true)

                setTimeout(showGuideArrow, 16000)
                setTimeout(hideGuideArrow, 20000)
            }

            audio.addEventListener('play', () => {
                localStorage.setItem('audio_autoplay', 'true')
            })

            audio.addEventListener('pause', () => {
                localStorage.setItem('audio_autoplay', 'false')
            })

            audio.addEventListener('volumechange', () => {
                localStorage.setItem('audio_volume', audio.volume)
            })
            
            if (localStorage.getItem('audio_volume') == null) {
                localStorage.setItem('audio_volume', 1)
            } else {
                audio.volume = parseFloat(localStorage.getItem('audio_volume'))
            }

            if (localStorage.getItem('audio_autoplay') == 'true') {
                audio.play().catch(() => {})
            }
        })
