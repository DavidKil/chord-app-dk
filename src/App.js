import React, { Component } from 'react'

import './reset.css'
import './defaults.css'
import './App.css'
import './Range.css'

import ReactPlayer from 'react-player'
import Duration from './Duration'
import songData from './songs.json'

const CHORDS = new Map([["intro",'./images/intro.png'],
                            ["D",'./images/d.png'],
                            ["A",'./images/a.png'],
                            ["G",'./images/g.png']]);

export default class App extends Component {
    state = {
        url: null,
        playing: true,
        seekingChord: false,
        currentBeatStartTime: 0,
        currentBeatDuration: 0,
        volume: 0.8,
        muted: false,
        played: 0,
        loaded: 0,
        duration: 0,
        playbackRate: 1.0,
        loop: false,
        progressFrequency: 10,
        controls: true,
        videoTitle: "Youtube Chords Demo",
        chordImage: null,
        chordImageNext: null,
        chordPercent: 0
    }
    load = song => {
        if (!song.song_events) {
            console.warn("Fatal exception: no song events found.")
            return;
        }
        //console.log("load: ", song)
        this.setSongEvents(song.song_events)
        var url = 'https://www.youtube.com/watch?v=' + song.source_id

        this.setState({
            url: url,
            videoTitle: song.title,
            played: 0,
            loaded: 0
        })
    }
    playPause = () => {
        this.setState({ playing: !this.state.playing })
    }
    doChordProgress = state => {
        let fromVal = this.state.currentBeatStartTime;
        let ToVal = this.state.currentBeatDuration
        let currentChordPercent = ((state.playedSeconds - fromVal) / ToVal).toFixed(4)
        this.setState({
            chordPercent: currentChordPercent
        })
    }
    showChord = state => {
        if (!this.state.seekingChord ) {
            let endOfBeat = this.state.currentBeatStartTime + this.state.currentBeatDuration
            if (state.playedSeconds >= endOfBeat) {
                this.doShowChord(state.playedSeconds)
            } 
            else if (state.playedSeconds < this.state.currentBeatStartTime) {
                // if the current time is changed to before the current beat start time
                // we need to determine where exactly we are
                this.findCurrentSegment(state.playedSeconds)
            }
            this.doChordProgress(state)
        }
    }
    findCurrentSegment = playedSeconds => {
        this.setState({
            seekingChord: true
        });
        for (let i = 0; i < this.songEvents.length; i++) {
            // omit the logic check against the state.currentBeat info as we have
            //already determined that it's no longer relevant.
            if (playedSeconds >= this.songEvents[i].beat_time && playedSeconds <= (this.songEvents[i].beat_time + this.songEvents[i].duration)) {
                let result = this.songEvents[i];
                let chordImageNext = null;
                if (this.songEvents[i+1]) {
                    chordImageNext = CHORDS.get(this.songEvents[i+1].name)
                } 
                this.setState({
                    chord: result.name,
                    chordImage: CHORDS.get(result.name),
                    chordImageNext: chordImageNext,
                    seekingChord: false,
                    currentBeatStartTime: this.songEvents[i].beat_time,
                    currentBeatDuration: this.songEvents[i].duration
                });
                return;
            }
        }
    }
    doShowChord = playedSeconds => {
        // set the state to show that we're trying to find the correct chord
        // this is to prevent the listener firing this while we're looking
        this.setState({
            seekingChord: true
        });
        // get the end timestamp of the end of the current segment
        let endOfBeat = this.state.currentBeatStartTime + this.state.currentBeatDuration;
        
        
        for (let i = 0; i < this.songEvents.length; i++) {
            // get the end timestamp of the segment we're looking for
            let endOfSearchBeat = this.songEvents[i].beat_time + this.songEvents[i].duration;
            // ensure that the current time is in the correct segment. 
            if (playedSeconds >= endOfBeat && this.songEvents[i].beat_time >= this.state.currentBeatStartTime && playedSeconds <= endOfSearchBeat) {
                let result = this.songEvents[i];
                let chordImageNext = null;
                if (this.songEvents[i+1]) {
                    // get the right image from the chord map
                    chordImageNext = CHORDS.get(this.songEvents[i+1].name)
                }
                // set the chord image and other time info 
                this.setState({
                    chord: result.name,
                    chordImage: CHORDS.get(result.name),
                    chordImageNext: chordImageNext,
                    seekingChord: false,
                    currentBeatStartTime: result.beat_time,
                    currentBeatDuration: result.duration
                });
                // return so we stop searching
                return;
            }
        }
    }
    setSongEvents = songEvents => {
        // set the song info to the state
        this.songEvents = songEvents
    }
    onPlay = () => {
        this.setState({ playing: true })
    }
    onPause = () => {
        this.setState({ playing: false })
    }
    onProgress = state => {
        //console.log(state)
        // We only want to update time slider if we are not currently seeking
        if (!this.state.seeking) {
            this.setState(state)
            this.showChord(state)
        }
    }
    render() {
        const {
      url, playing, volume, muted, loop,
            played, duration, chord,
            playbackRate, progressFrequency,
            youtubeConfig, controls,
            fileConfig, videoTitle, chordImage, 
            chordImageNext, chordPercent 
    } = this.state

    return (
      <div className='app'>
        <section className='section'>
          <h1>{videoTitle}</h1>
          <div className='player-wrapper'>
            <ReactPlayer
              ref={this.ref}
              className='react-player'
              width='100%'
              height='100%'
              url={url}
              playing={playing}
              loop={loop}
              playbackRate={playbackRate}
              volume={volume}
              muted={muted}
              progressFrequency={progressFrequency}
              controls={controls}
              youtubeConfig={youtubeConfig}
              fileConfig={fileConfig}
              onReady={() => console.log('onReady')}
              onStart={() => console.log('onStart')}
              onPlay={this.onPlay}
              onPause={this.onPause}
              onBuffer={() => console.log('onBuffer')}
              onSeek={e => console.log('onSeek', e)}
              onEnded={() => this.setState({ playing: loop })}
              onError={e => console.log('onError', e)}
              onProgress={this.onProgress}
              onDuration={duration => this.setState({ duration })}
            />
          </div>
          <div className='chord-img-container'> 
          <img className='chord-img' alt='' src={chordImage} />
          <img className='chord-img-next' alt='' src={chordImageNext} />
          </div>
             
          <table><tbody>
              <tr>
              <th>Current Chord</th>
              <td><progress className='chord-progress' max={1} value={chordPercent} /></td>
            </tr>
            <tr>
              <th>Controls</th>
              <td>
                <button onClick={this.playPause}>{playing ? 'Pause' : 'Play'}</button>
              </td>
            </tr>
            <tr>
              <th>Played</th>
              <td><progress className='chord-progress' max={1} value={played} /></td>
            </tr>
          </tbody></table>
        </section>
        <section className='section'>
          <table><tbody>
          </tbody></table>
          <h2>State</h2>
          <table><tbody>
            <tr>
              <th>Chord</th>
              <td>{chord}</td>
            </tr>
            <tr>
              <th>duration</th>
              <td><Duration seconds={duration} /></td>
            </tr>
            <tr>
              <th>elapsed</th>
              <td><Duration seconds={duration * played} /></td>
            </tr>
            <tr>
              <th>remaining</th>
              <td><Duration seconds={duration * (1 - played)} /></td>
            </tr>
          </tbody></table>
        </section>
      </div>
    )
  }
componentDidMount (){
    // when we can use a network file we use the below fetch command
     /*
     // for testing purposes
      fetch('https://play.riffstation.com/api/mir/songs?source=youtube&source_id=oKsxPW6i3pM').then(function(response) {
        console.log(response)  
        return response.json();
      }).then(function(json) {
          let song = json.song;
          this.load(song)
      }).catch(function(error) {
       console.log('There has been a problem with your fetch operation: ', error.message);
      });;
    */
    let song = songData.song;
    //console.log(this)
    // to do: create mapping for source type
    this.load(song)
}
}
