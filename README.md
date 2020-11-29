# Speech Recognition Web Demo
This project contains a Flask Web Server that hosts a web page for recording voice input via [recorder.js](https://github.com/mattdiamond/Recorderjs). After recording voice input, the webpage sends the audio to the Flask Server. When received, the server invokes the [SpeechRecognition](https://github.com/Uberi/speech_recognition) library to transcribe speech. The Speech-To-Text result is then printed in the Flask Development console.

`index.html` and `main.js` is derived from [blog.addpipe.com](https://blog.addpipe.com/using-recorder-js-to-capture-wav-audio-in-your-html5-web-site/).

### Setup Instructions
1. Download or Clone project
1. Setup and Activate Python Venv
1. Install dependencies using `python -m pip install -r requirements.txt`
1. Set Flask Current App to webapp.py: 
    * PowerShell: `$env:FLASK_APP='webapp'`
1. Run Flask App: `python -m flask run`
