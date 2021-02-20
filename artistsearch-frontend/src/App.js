import React, { Component } from 'react';
import axios from 'axios';

import './App.css';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

class App extends Component {
state = { artists:[], query:"", message:"" };

// input handle
handleChange=({currentTarget: input}) => {
  this.setState({query: input.value});
}

// submit request
handleSubmit = async (e) => {
  e.preventDefault();

  try{
    // show loading message
    this.setState({message:"Loading..."});
    const response = await axios.post(`/query/${this.state.query}`);
    
    // update artists array with data and hide loading message
    this.artistsReceived(response.data);
  } 
  catch(err){
    console.log(err.message);
    this.setState({message: "Server error: " + err.message});
  }
}


artistsReceived(data) {
  this.setState({artists: data, message:""});
}

  
render() { 
  return ( 

  // Using bootstrap to speed up frontend development
  <form>
    <div className="text-center" style={{marginTop: 150}}> 

      <h3 className="mb-4">Artist finder</h3>  

      {/* input for artist name*/}
      <input 
        className="rounded mr-1" 
        value={this.state.query}
        onChange={this.handleChange}  
        placeholder={"Search an artist"}
      />
      
      
      {/* search button */}
      <button onClick={this.handleSubmit} className="rounded bg-primary text-white">Search </button>
      
      <br />
      <br />
      
      {/* if loading is true, show loading message */}
      {/* {this.state.loading? <h5 className="text-secondary">Loading...</h5>: null} */}

      {/* show message: can be loading or error*/}
      {this.state.message? <h5 className="text-secondary">{this.state.message}</h5>: null}

      {/* show list of artists */}
      {this.state.artists.map(artist => <h6 key={artist._id}>{artist.rank + ". " + artist.name}</h6>)}

    </div> 
  </form>
  
  )}
}

export default App;