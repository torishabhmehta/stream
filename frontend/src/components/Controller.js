import React, {Component} from 'react';
import './Controller.css'
import { streamSocket } from './websocket.js';

const API='AIzaSyALsePfmVRgtvFqd7eSjBOSM7UL_Ti2YW4'
var resultNo=10;

export class Controller extends React.Component {
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
    queue: [],
  };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMore = this.handleMore.bind(this);
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
          played: data['played']
        })
    }
  }

  load = url => {
    this.setState({
      url,
      played: 0,
      loaded: 0
    })
  }

  playPause = () => {
    this.setState({ playing: !this.state.playing });
    this.send_data();
  }

  stop = () => {
    this.setState({ url: null, playing: false });
    this.send_data();
  }

  toggleLoop = () => {
    this.setState({ loop: !this.state.loop });
    this.send_data();
  }

  send_data = e =>{
    let data = {
          url: this.state.url,
          played: this.state.played,
          muted: this.state.muted,
          duration: this.state.duration,
          volume: this.state.volume,
          seeking: this.state.seeking,
        }
        streamSocket.send(JSON.stringify(data));
  }

  onVolumeChange = e => {
    this.setState({ volume: parseFloat(e.target.value) });
  }

  onVolumeMouseUp = e => {
    this.send_data();
  }

  toggleMuted = () => {
    this.setState({ muted: !this.state.muted });
    this.send_data();
  }

  setPlaybackRate = e => {
    this.setState({ playbackRate: parseFloat(e.target.value) });
    this.send_data();
  }

  onPlay = () => {
    console.log('onPlay')
    this.setState({ playing: true });
    this.send_data();
  }

  onPause = () => {
    console.log('onPause')
    this.setState({ playing: false });
    this.send_data();
  }

  onSeekMouseDown = e => {
    this.setState({ seeking: true });
  }

  onSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) });
  }

  onSeekMouseUp = e => {
    this.setState({ seeking: false });
    this.send_data();
  }

  onEnded = () => {
    this.setState({ playing: this.state.loop })
  }

  onDuration = (duration) => {
    console.log('onDuration', duration)
    this.setState({ duration })
  }

  renderLoadButton = (url, label) => {
    return (
      <button onClick={() => this.load(url)}>
        {label}
      </button>
    )
  }

  ref = player => {
    this.player = player
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    resultNo=10;
  }

  handleSubmit(event) {
    var message=this.state.value
    var finalURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&order=viewCount&q=${message}&type=video&videoDefinition=high&key=${API}&maxResults=${resultNo}`;
    fetch(finalURL)
      .then((response) => response.json())
      .then((responseJson) => {
        const searchQuery= responseJson.items.map(obj =>  <li>
          <a href="javascript:void();"
          onClick={function (e){
            this.setState({
              url : `"https://www.youtube.com/watch?v=${obj.id.videoId}"`,
              played: 0,},
              () =>{
              this.send_data();
              }
             );
           }.bind(this)}>
                <span className="vid-thumb"><img width="72" src={`https://img.youtube.com/vi/${obj.id.videoId}/default.jpg`} /></span>
                <div className="desc">{obj.snippet.title}</div>
            </a>
          </li>
        );
       this.setState({searchQuery});
      })
      document.getElementById('SearchResults').style.visibility="visible";
      document.getElementById('GetMore').style.visibility="visible";
      document.getElementById('searchbar').value='';
      event.preventDefault();
    }

handleMore(event){
  resultNo=resultNo+10;
  document.getElementById('GetVideos').click();
  }


render() {
  const {playing, volume, muted, loop, played, loaded, duration, playbackRate } = this.state
  const SEPARATOR = ' · '
  return (
    <div>
      <h1>Welcome to X-stream</h1>
      <div className="SearchBar">
        <form>
          <input type="text" value={this.state.value} onChange={this.handleChange} size="50" id="searchbar" />
        </form>
      </div>
      <div className="GetVideos">
        <button onClick={this.handleSubmit} id="GetVideos">Get Videos</button>
      </div>
      <div className="vid-container">
            <input
                type='range' min={0} max={1} step='any'
                value={played}
                onMouseDown={this.onSeekMouseDown}
                onChange={this.onSeekChange}
                onMouseUp={this.onSeekMouseUp}
              />
            <input type='range' min={0} max={2} step='any' value={volume}
            onMouseDown={this.onVolumeMouseDown}
            onChange={this.onVolumeChange}
            onMouseUp={this.onVolumeMouseUp}
            />
      </div>
      <div id="SearchResults">
        <h1>Results</h1>
        <ul>{this.state.searchQuery}</ul>
        <button id="GetMore" onClick={this.handleMore}>Get More</button>
      </div>
    </div>


  );
}
}

export default Controller

//<li><button className="results" onClick={function(e){
//  window.open(`https://www.youtube.com/watch?v=${obj.id.videoId}`, "myWindow");
//}}>{obj.snippet.title}</button><span class="vid-thumb"><img width="72" src="https://img.youtube.com/vi/cOSEOYi9JS4/default.jpg" /></span></li>);
