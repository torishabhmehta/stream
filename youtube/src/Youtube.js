import React, {Component} from 'react';

const API='AIzaSyALsePfmVRgtvFqd7eSjBOSM7UL_Ti2YW4'

var finalURL = ``;

var resultNo=10;

var remember='';

var ad='';

export class Youtube extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: '',
    searchQuery: [],
  };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMore = this.handleMore.bind(this);
;
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    var message=this.state.value
    console.log(message);
    finalURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&order=viewCount&q=${message}&type=video&videoDefinition=high&key=${API}&maxResults=${resultNo}`;
    fetch(finalURL)
      .then((response) => response.json())
      .then((responseJson) => {
       console.log(responseJson);
       const searchQuery= responseJson.items.map(obj => <li><button className="results" onClick={function(e){window.open(`https://www.youtube.com/watch?v=${obj.id.videoId}`)}}>{obj.snippet.title}</button></li>);
       this.setState({searchQuery});
      })
    .catch((error) => {
        console.error(error);
      });
    document.getElementById('SearchResults').style.visibility="visible";
    document.getElementById('GetMore').style.visibility="visible";
    document.getElementById('abc').value='';
    event.preventDefault();

  }

  handleMore(event){
    resultNo=resultNo+10;
    document.getElementById('GetVideos').click();

  }


  render() {
    return (
      <div>
      <h1>Welcome to X-stream</h1>
        <div className="SearchBar">
          <form>
            <input type="text" value={this.state.value} onChange={this.handleChange} size="50" id="abc" />
          </form>
        </div>
        <div className="GetVideos">
          <button onClick={this.handleSubmit} id="GetVideos">Get Videos</button>
        </div>
        <div id="SearchResults">
          <ul>{this.state.searchQuery}</ul>
          <button id="GetMore" onClick={this.handleMore}>Get More</button>
        </div>
      </div>


    );
  }
}

export default Youtube
