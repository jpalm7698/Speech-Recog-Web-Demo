# Speech Recognition Web Demo
This project records voice input using [recorder.js](https://github.com/mattdiamond/Recorderjs) and sends the audio to the [SpeechRecognition](https://github.com/Uberi/speech_recognition) library to transcribe speech. The Speech-To-Text result is printed in the Flask Development console.

### Setup Instructions
1. Download or Clone project
1. Setup Python Venv
1. Install dependencies using `python -m pip install -r requirements.txt`
1. Set Flask Current App to webapp.py: 
    1. PowerShell: `$env:FLASK_APP='webapp'`
1. Run Flask App: `python -m flask run`

