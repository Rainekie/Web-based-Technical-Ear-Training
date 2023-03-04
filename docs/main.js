let sources;
let isPlaying = false;

let t_pad = 2; // second
let dB_pad = 3; // dB down

let trialarray = [
    [0, 1, 0, 0],
    [0, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 0, 0, 1]
];
let answerArray = ['A', 'B'];
let answerTxt = document.getElementById("result");

let btns = [document.getElementById('p_a'), document.getElementById('p_b'), document.getElementById('p_x')];

let gainArray = [0, -2, -4, -6, -10, -20];
let freqArray = [125, 250, 500, 1000, 2000, 4000, 8000];
let filtTypeArray = ["allpass", "peaking"];
let filtGainArray = [12, 6];

let dBGain; // dB
let filtType;
let freq; // Hz
let filterGain; //dB

let answer;

let ctx;

function getRandom(min, max) {
    var random = Math.floor(Math.random() * (max + 1 - min)) + min;

    return random;
}

async function setupSample() {
    var songNum = getRandom(0, 4);
    const response = await fetch(`./audio/${songNum}.wav`);
    console.log("Selected song is %s." , `./audio/${songNum}.wav`)
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

function detineCondition(condition) {
    let randparams = [getRandom(1, gainArray.length - 1), getRandom(0, freqArray.length - 1)]

    if (condition[0]) { // Gain change mode
        dBGain = gainArray[randparams[0]];

        freq = freqArray[0]; // 125
        filtType = filtTypeArray[0]; // allpass
        filterGain = filtGainArray[0]; // -12

        console.log('Condition: Gain Change || dBGain: %d', dBGain);
    } else if (condition[1]) { // Frequency change -12dB mode
        dBGain = gainArray[0]; // 0

        freq = freqArray[randparams[1]];
        filtType = filtTypeArray[1];
        filterGain = filtGainArray[0];

        console.log('Condition: Frequency change || freq: %d, filterGain: %d', freq, filterGain);
    } else if (condition[2]) {

        dBGain = gainArray[0]; // 0

        freq = freqArray[randparams[1]];
        filtType = filtTypeArray[1];
        filterGain = filtGainArray[1];

        console.log('Condition: Frequency change || freq: %d, filterGain:', freq, filterGain);
    }
}

document.querySelector("#play").addEventListener("click", async () => {
    ctx = new AudioContext();

    // avoid to play the sound multiply
    if (isPlaying) {
        console.log('now playing something');
        return;
    }

    answerTxt.innerHTML = '<p>  </p>';

    // random number generator
    let trial = getRandom(0, 3);
    answer = answerArray[trialarray[trial][3]];

    console.log('Amswer: %s', answer);

    //condition selector
    let elements = document.getElementsByName('conditionSelect');
    let len = elements.length;
    let checkValue;

    for (let i = 0; i < len; i++) {
        if (elements.item(i).checked) {
            checkValue = elements.item(i).value;
        }
    }

    let condition;
    switch (checkValue) {
        case "Gain":
            condition = [1, 0, 0];
            break;
        case "-12dB":
            condition = [0, 1, 0];
            break;
        case "-6dB":
            condition = [0, 0, 1];
            break;
        default:
        console.log("error");
    }

    detineCondition(condition);

    isPlaying = true;

    const sample = await setupSample();

    // gain 
    let gainNode = [new GainNode(ctx, { gain: Math.pow(10, ((dB_pad * -1) / 20)) }), new GainNode(ctx, { gain: Math.pow(10, ((dBGain - dB_pad) / 20)) })];

    // filter
    let filterNode = [new BiquadFilterNode(ctx, { type: "allpass" }), new BiquadFilterNode(ctx, { type: filtType, frequency: freq, q: 2, gain: filterGain })];

    // player
    let count = 1;
    sources = [ctx.createBufferSource(), ctx.createBufferSource(), ctx.createBufferSource()];

    let mx = 3;
    for (let i = 0; i < mx; i++) {
        sources[i].buffer = sample;
        sources[i].connect(gainNode[trialarray[trial][i]]).connect(filterNode[trialarray[trial][i]]).connect(ctx.destination);

        var dt_s = ( (sources[0].buffer.duration) * i ) + ( ( t_pad ) * i ) + 1;
        var dt_e = ( ( (sources[0].buffer.duration) * ( i + 1 ) ) + ( ( t_pad ) * i ) + 1 ) + 1

        sources[i].start(dt_s);
        sources[i].stop(dt_e);

        console.log('# %d, start: %d, end: %d.',i, dt_s, dt_e);

        sources[i].onended = function () {
            console.log('Finish: %d time(s)', count);
            if (count != 3){
                btns[count -1].className = btns[count -1].className.replace("btn btn-outline-success active", "btn btn-outline-success");
                btns[count].className += " active";
            } else {
                btns[count -1].className = btns[count -1].className.replace("btn btn-outline-success active", "btn btn-outline-success");
            }
            count++;
        };
    }

    // reset isPlaying flag
    window.setTimeout(function () {
        isPlaying = false;
        console.log('Finish all');
    }, (dt_e + 1) * 1000) // ms to sec

});

document.querySelector("#stop").addEventListener("click", async () => {
    console.log("stop");

    sources[0].stop();
    sources[1].stop();
    sources[2].stop();

    isPlaying = false;

    let elements = document.getElementsByName('responseSelect');
    let len = elements.length;
    let checkValue;

    for (let i = 0; i < len; i++) {
        if (elements.item(i).checked) {
            checkValue = elements.item(i).value;
        }
    }

    let result;
    if (checkValue == answer){
        result = '<b>Correct 🎉</b>';
    } else {
        result = '<b>Wrong 😭</b>';
    }

    answerTxt.innerHTML = result;

});