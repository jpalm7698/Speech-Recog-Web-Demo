from flask import Flask
from flask import render_template, request, redirect, url_for
import os
import speech_recognition as sr

app = Flask(__name__)

@app.route('/')
def go_to_index():
    return render_template('index.html')

@app.route('/process-voice-command', methods = ['POST'])
def process_voice_command():
    
    # POST request
    if request.method == 'POST':
        print('Incoming file..')
         
        with open(os.path.join(os.getcwd(), request.files['voice_request'].filename), "w+b") as voiceRecording:
            voiceRecording.write(request.files['voice_request'].read())
            voiceRecording.close()

        # obtain path to recorded audio file on server/project directory
        AUDIO_FILE = os.path.join(os.getcwd(), 'voice_request.wav')
        text_result = None

        # use the audio file as the audio source
        r = sr.Recognizer()

        print('Processing WAV Audio..')

        with sr.AudioFile(AUDIO_FILE) as source:
            audio = r.record(source) # read the entire audio file

            try:
                response = r.recognize_google(audio)
            except sr.RequestError:
                response = "Failed"
            except sr.UnknownValueError:
                response = "Failed"

            text_result = response.lower()

        
        print('Audio successfully processed. Rendering template to user.')

        # main.js will not render template to user. Maybe a html form tag ("<form>") should be used instead of fetch api?
        return render_template('result_recording.html', text_result=text_result)

@app.route('/result-recording/', methods=['GET'])
def result_recording(text_result):
    return 'Text Result %s' %text_result
