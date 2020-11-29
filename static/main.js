//webkitURL is deprecated but nevertheless 
URL = window.URL || window.webkitURL;
var gumStream;
//stream from getUserMedia() 
var rec;
//Recorder.js object 
var input;
//MediaStreamAudioSourceNode we'll be recording 
// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = null;
//new audio context to help us record 
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
//add events to those 3 buttons 
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);

//Additional log elements
logElement = document.getElementById("log");
function log (msg) {
   logElement.innerHTML += msg + "\n";
}

// Wait function for adding audio length constraint
// 1000ms == 1second
let recordingTimeMS = 15000;
function wait(delayInMS) {
    return new Promise(resolve => setTimeout(resolve, delayInMS));
}


function startRecording() { 
    
    console.log("recordButton clicked"); 

    // AudioContext objects must be resumed or created after a user gesture on the page.
    // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio

    audioContext = new AudioContext;
    audioContext.resume();
    
    /* Simple constraints object, for more advanced audio features see

    https://addpipe.com/blog/audio-constraints-getusermedia/ */

    var constraints = {
        audio: true,
        video: false
    } 
    /* Disable the record button until we get a success or fail from getUserMedia() */

    recordButton.disabled = true;
    stopButton.disabled = false;

    /* We're using the standard promise based getUserMedia()

    https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia */

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ..."); 
        /* assign to gumStream for later use */
        gumStream = stream;
        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);
        /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
        rec = new Recorder(input, {
            numChannels: 1
        }) 
        //start the recording process 
        rec.record()
        console.log("Recording started");
    }).catch(function(err) {
        //enable the record button if getUserMedia() fails 
        recordButton.disabled = false;
        stopButton.disabled = true;
    });

    // If the Recorder is still recording:
    // Stop the recording after specified amount of Milliseconds
    let recorded = wait(recordingTimeMS).then(function () {
        if (rec.recording) {
            stopRecording();
        }
    });
}

function stopRecording() {
    console.log("stopButton clicked");
    //disable the stop button, enable the record too allow for new recordings 
    stopButton.disabled = true;
    recordButton.disabled = false;
    //tell the recorder to stop the recording 
    rec.stop(); //stop microphone access 
    gumStream.getAudioTracks()[0].stop();
    //create the wav blob and pass it on to createDownloadLink 
    rec.exportWAV(createDownloadLink);
    //create the wav blob and pass it on to sendRecordingToServer 
    rec.exportWAV(sendRecordingToServer);
}

function sendRecordingToServer(recordedBlob) {

    console.log("sendRecordingToServer called");

    //Recording file to upload
    let fd = new FormData();
    fd.append('voice_request', recordedBlob, 'voice_request.wav');


    // POST Request - Voice Input
    return fetch('/process-voice-command', {

        // Specify the method
        method: 'POST',

        // A file payload
        body: fd,
    }).then((response) => console.log(response)).catch(log);

    //}).then((response) => window.location = response).then(console.log(response)).catch(log);

}

function createDownloadLink(blob) {
    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');
    //add controls to the <audio> element 
    au.controls = true;
    au.src = url;
    //link the a element to the blob 
    link.href = url;
    link.download = new Date().toISOString() + '.wav';
    link.innerHTML = link.download;
    //add the new audio and a elements to the li element 
    li.appendChild(au);
    li.appendChild(link);

    var filename = new Date().toISOString();
    //filename to send to server without extension 
    //upload link 
    var upload = document.createElement('a');
    upload.href = "#";
    upload.innerHTML = "Upload";
    upload.addEventListener("click", function(event) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function(e) {
            if (this.readyState === 4) {
                console.log("Server returned: ", e.target.responseText);
            }
        };
        var fd = new FormData();
        fd.append("voice_recording", blob, "voice_recording.wav");
        xhr.open("POST", "upload.php", true);
        xhr.send(fd);
    })
    li.appendChild(document.createTextNode(" ")) //add a space in between 
    li.appendChild(upload) //add the upload link to li

    //add the li element to the ordered list 
    recordingsList.appendChild(li);
}
