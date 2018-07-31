import React, { Component } from 'react';
import './Player.css'
import { streamSocket } from './websocket.js';
import ReactPlayer from 'react-player'

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {value: '',
    searchQuery: [],
    url: null ,
    playing: true,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    seeking: 0,
    };
    this.send_data = this.send_data.bind(this);
  }

  componentDidMount() {
      streamSocket.onmessage = (e) => {
        let data = JSON.parse(e.data);
        this.setState({
          url: data['url'],
          muted: data['muted'],
          duration: data['duration'],
          volume: data['volume'],
          seeking: data['seeking'],
          playing: data['playing'],
      })
        if(this.state.seeking){
          this.setState({played: data['played'],})
          this.player.seekTo(this.state.played);
        }

    }}

  send_data = e =>{
    let data = {
          url: this.state.url,
          played: this.state.played,
          muted: this.state.muted,
          duration: this.state.duration,
          volume: this.state.volume,
          seeking: this.state.seeking,
          playing: this.state.playing
      }
            streamSocket.send(JSON.stringify(data));
  }

  onProgress = state => {
    if (!this.state.seeking) {
      this.setState(state);
      this.send_data();
    }
  }


  ref = player => {
    this.player = player
      }
  render() {
    const { url, playing, volume, muted, loop, played, loaded, duration, playbackRate } = this.state
    const SEPARATOR = ' · '

    return (
      <body>
        <div id="player_wrapper">
           <div id="player">
             <ReactPlayer
             id="r_player"
             ref={this.ref}
                 url={url}
                 playbackRate={playbackRate}
                 volume={volume}
                 muted={muted}
                 onEnded={console.log("ended")}
                 onError={e => console.log('onError', e)}
                 onProgress={this.onProgress}
      //             onDuration={this.onDuration}
                 playing = {playing} />
                <div class="overlay"></div>
           </div>
          </div>
        </body>
        );
      }
    }
export default Player;
