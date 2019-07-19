import React from 'react';
import languages from './constant';
import recognition from './recognition';
import './app.scss';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLanguage: languages[0][1],
            isRecording: false,
            texts: [],
        }

        this.startRecording = this.startRecording.bind(this);
        this.updateCountry = this.updateCountry.bind(this);
        this.onResult = this.onResult.bind(this);
    }

    startRecording() {
        let isRecording = !this.state.isRecording;
        this.setState({isRecording});

        if (isRecording) {
            recognition.startRecognize(this.state.selectedLanguage, this.onResult);
        }
    }

    onResult(text) {
        let texts = this.state.texts;
        texts.push(text);
        this.setState({texts, isRecording: false});
    }

    updateCountry(event) {
        let selectedLanguage = event.target.value;
        this.setState({
            selectedLanguage,
            isRecording: false
        }, () => {
            recognition.stopRecognize();
        });
    }

    serialize(obj, prefix) {
        let str = [], p;
        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                let k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
                str.push((v !== null && typeof v === "object") ?
                    serialize(v, k) :
                    encodeURIComponent(k) + "=" + encodeURIComponent(v)
                );
            }
        }
        return str.join("&");
    }

    render () {
        return (
            <div id="content" className="app__content">
                <div id="info">
                    <p id="info_speak_now">Speak now.</p>
                    <p id="info_no_speech">No speech was detected. You may need to adjust your <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892"> microphone settings</a>.</p>
                    <p id="info_no_microphone">No microphone was found. Ensure that a microphone is installed and that <a href="//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892"> microphone settings</a> are configured correctly.</p>
                    <p id="info_allow">Click the "Allow" button above to enable your microphone.</p>
                    <p id="info_denied">Permission to use microphone was denied.</p>
                    <p id="info_blocked">Permission to use microphone is blocked. To change, go to chrome://settings/contentExceptions#media-stream</p>
                    <p id="info_upgrade">Web Speech API is not supported by this browser. Upgrade to <a href="//www.google.com/chrome">Chrome</a> version 25 or later.</p>
                </div>
                <div id="div_language">
                    <div id="start_button" className={this.state.isRecording ? 'listening' : ''} onClick={this.startRecording}>
                        {this.state.isRecording ?  <span>Listening...</span> : <span>Start</span>}
                    </div>
                    <div className="language">
                        Select input language:  &nbsp;&nbsp;
                        <select id="select_language" onChange={this.updateCountry}>
                            {languages.map((language, index) => <option key={index} value={language[1]}>{language[0]}</option>)}
                        </select>
                    </div>
                </div>
                <div id="results">
                    {this.state.texts.map((text, index) => <p key={index}>{text}</p>)}
                    <span id="interim_span" className="interim"></span>
                </div>
            </div>
        )
    }
}
