/*
   This extension was made with TurboBuilder!
   https://turbobuilder-steel.vercel.app/
*/
(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = {};


    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    function doSound(ab, cd, runtime) {
        const audioEngine = runtime.audioEngine;

        const fetchAsArrayBufferWithTimeout = (url) =>
            new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                let timeout = setTimeout(() => {
                    xhr.abort();
                    reject(new Error("Timed out"));
                }, 5000);
                xhr.onload = () => {
                    clearTimeout(timeout);
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(`HTTP error ${xhr.status} while fetching ${url}`));
                    }
                };
                xhr.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error(`Failed to request ${url}`));
                };
                xhr.responseType = "arraybuffer";
                xhr.open("GET", url);
                xhr.send();
            });

        const soundPlayerCache = new Map();

        const decodeSoundPlayer = async (url) => {
            const cached = soundPlayerCache.get(url);
            if (cached) {
                if (cached.sound) {
                    return cached.sound;
                }
                throw cached.error;
            }

            try {
                const arrayBuffer = await fetchAsArrayBufferWithTimeout(url);
                const soundPlayer = await audioEngine.decodeSoundPlayer({
                    data: {
                        buffer: arrayBuffer,
                    },
                });
                soundPlayerCache.set(url, {
                    sound: soundPlayer,
                    error: null,
                });
                return soundPlayer;
            } catch (e) {
                soundPlayerCache.set(url, {
                    sound: null,
                    error: e,
                });
                throw e;
            }
        };

        const playWithAudioEngine = async (url, target) => {
            const soundBank = target.sprite.soundBank;

            let soundPlayer;
            try {
                const originalSoundPlayer = await decodeSoundPlayer(url);
                soundPlayer = originalSoundPlayer.take();
            } catch (e) {
                console.warn(
                    "Could not fetch audio; falling back to primitive approach",
                    e
                );
                return false;
            }

            soundBank.addSoundPlayer(soundPlayer);
            await soundBank.playSound(target, soundPlayer.id);

            delete soundBank.soundPlayers[soundPlayer.id];
            soundBank.playerTargets.delete(soundPlayer.id);
            soundBank.soundEffects.delete(soundPlayer.id);

            return true;
        };

        const playWithAudioElement = (url, target) =>
            new Promise((resolve, reject) => {
                const mediaElement = new Audio(url);

                mediaElement.volume = target.volume / 100;

                mediaElement.onended = () => {
                    resolve();
                };
                mediaElement
                    .play()
                    .then(() => {
                        // Wait for onended
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });

        const playSound = async (url, target) => {
            try {
                if (!(await Scratch.canFetch(url))) {
                    throw new Error(`Permission to fetch ${url} denied`);
                }

                const success = await playWithAudioEngine(url, target);
                if (!success) {
                    return await playWithAudioElement(url, target);
                }
            } catch (e) {
                console.warn(`All attempts to play ${url} failed`, e);
            }
        };

        playSound(ab, cd)
    }
    class Extension {
        getInfo() {
            return {
                "id": "switches",
                "name": "Switches",
                "color1": "#ff0000",
                "color2": "#b80000",
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    setInterval(async () => {
        if (Boolean((localStorage.getItem('isswitchon') == 'true'))) {
            Scratch.vm.runtime.startHats(`${Extension.prototype.getInfo().id}_switch`)
        };
    }, (0.01 * 1000));

    blocks.push({
        opcode: "switch",
        blockType: Scratch.BlockType.EVENT,
        text: "Switch",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["switch"] = async (args, util) => {};

    blocks.push({
        opcode: "callswitch",
        blockType: Scratch.BlockType.COMMAND,
        text: "Turn Switch [onoroff]",
        arguments: {
            "onoroff": {
                type: Scratch.ArgumentType.STRING,
                menu: 'powersettings'
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["callswitch"] = async (args, util) => {
        if (Boolean((args["onoroff"] == 'ON'))) {
            localStorage.setItem('isswitchon', 'true')

        } else {
            localStorage.setItem('isswitchon', 'false')

        };
    };

    menus["powersettings"] = {
        acceptReporters: true,
        items: [...[...[], 'ON'], 'OFF']
    }

    blocks.push({
        opcode: "switchbutton",
        blockType: Scratch.BlockType.EVENT,
        text: "Button",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["switchbutton"] = async (args, util) => {};

    blocks.push({
        opcode: "callswitchbutton",
        blockType: Scratch.BlockType.COMMAND,
        text: "Call Button",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["callswitchbutton"] = async (args, util) => {
        Scratch.vm.runtime.startHats(`${Extension.prototype.getInfo().id}_switchbutton`)
    };

    Scratch.extensions.register(new Extension());
})(Scratch);
