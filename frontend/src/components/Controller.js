import React, {Component} from 'react';
import './Controller.css'
import { streamSocket } from './websocket.js';
import Button from '@material-ui/core/Button';
import 'typeface-roboto'
import AddIcon from '@material-ui/icons/Add';
import volume_off from '@material-ui/icons';
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
    this.logout=this.logout.bind(this);
    this.toggleMuted=this.toggleMuted.bind(this);
    this.playToggle=this.playToggle.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
}

  componentDidMount() {
    streamSocket.onmessage = (e) => {
        let data = JSON.parse(e.data);
        this.setState({
          url: data['url'],
          muted: data['muted'],
          duration: data['duration'],
          volume: data['volume'],
          played: data['played'],
          playing: data['playing'],
        })
    }
  }



  send_data = e =>{
    let data = {
          url: this.state.url,
          played: this.state.played,
          muted: this.state.muted,
          duration: this.state.duration,
          volume: this.state.volume,
          seeking: this.state.seeking,
          playing: this.state.playing,
        }
        streamSocket.send(JSON.stringify(data));
  }

  onVolumeChange = e => {
    this.setState({ volume: parseFloat(e.target.value) });
  }

  logout = e => {
    localStorage.clear();
    document.location.reload();
  }

  onVolumeMouseUp = e => {
    this.send_data();
  }

  toggleMuted = () => {
    this.setState({ muted: !this.state.muted },()=>
    {this.send_data()});
    if(this.state.muted){
    document.getElementById('mute').innerHTML='<i class="material-icons">volume_off</i>'; 
    document.getElementById('mute1').innerHTML='mute'}
    else{
      document.getElementById('mute').innerHTML='<i class="material-icons">volume_up</i>';
      document.getElementById('mute1').innerHTML='unmute'
    }
  }

   playToggle = () => {
    this.setState({ playing: !this.state.playing }, ()=>
    {this.send_data()});
    if(this.state.playing){
    document.getElementById('play').innerHTML='<i class="material-icons">play_circle_filled</i>';
    document.getElementById('pause1').innerHTML='play' }
    else{
      document.getElementById('play').innerHTML='<i class="material-icons">pause_circle_filled</i>';
      document.getElementById('pause1').innerHTML='pause' 
    }
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

  

  ref = player => {
    this.player = player
  }
  handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('GetVideos').click();

    }
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    resultNo=10;
  }

  handleSubmit(event) {
    document.getElementById('searchbar').value='';
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
                <div className="desc">{obj.snippet.title}</ div>
            </a>
          </li>
        );
       this.setState({searchQuery});
      })
      document.getElementById('SearchResults').style.visibility="visible";
      document.getElementById('GetMore').style.visibility="visible";
      
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
    <div className="vid-main-wrapper clearfix">
      <h1 style={{ fontSize : '72px'}}><i>Streams in the ocean</i></h1>
      <div className="SearchBar">
        <form>
          <input type="text" value={this.state.value} onChange={this.handleChange} size="50" id="searchbar" onKeyPress={this.handleKeyPress} />
        </form>
      </div>
      <div className="GetVideos">
        <Button onClick={this.handleSubmit}  variant="contained" color="primary" id="GetVideos">Get Videos</Button>
      </div>
      <div className="vid-container">
          <div id="seeker">
            <input
                type='range' min={0} max={1} step='any'
                value={played}
                onMouseDown={this.onSeekMouseDown}
                onChange={this.onSeekChange}
                onMouseUp={this.onSeekMouseUp} 
                id="seeker1"
              />
              <p>seeker</p>
              </div>
            <input type='range' min={0} max={2} step='any' value={volume}
            onMouseDown={this.onVolumeMouseDown}
            onChange={this.onVolumeChange}
            onMouseUp={this.onVolumeMouseUp}
            id="volume"
            />
            <p>volume</p>
            <Button variant="fab" color="primary" onClick={this.toggleMuted} id="mute">
        <i class="material-icons">volume_off</i>
      </Button>
      <p id="mute1">mute</p>
      <Button variant="fab" color="primary" onClick={this.playToggle} id="play">
        <i class="material-icons">pause_circle_filled</i>
      </Button>
      <p id="pause1">pause</p>        
      </div>
      <div id="SearchResults">
        <h1>Results</h1>
        <ul>{this.state.searchQuery}</ul>
        <Button id="GetMore" color="Primary" variant="contained" onClick={this.handleMore}>Get More</Button>
      </div>
      <div id="logout">
            <Button onClick={this.logout} color="Primary" variant="contained">Logout</Button>
            </div>
    </div>


  );
}
}

export default Controller

//<li><button className="results" onClick={function(e){
//  window.open(`https://www.youtube.com/watch?v=${obj.id.videoId}`, "myWindow");
//}}>{obj.snippet.title}</button><span class="vid-thumb"><img width="72" src="https://img.youtube.com/vi/cOSEOYi9JS4/default.jpg" /></span></li>);
