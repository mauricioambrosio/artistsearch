import React, { Component } from 'react';
import axios from 'axios';

import './App.css';

axios.defaults.baseURL = 'http://localhost:3000/api';

class App extends Component {
state = { artists:[], query:"", loading:false };


handleChange=({currentTarget: input}) => {
  this.setState({query: input.value});
}

handleSubmit = async (e) => {
  e.preventDefault();

  try{
    this.setState({loading:true});
    const response = await axios.post(`/query/${this.state.query}`);
    

    this.artistsReceived(response.data);
  } 
  catch(err){
    console.log(err.message);
  }
}

artistsReceived(data) {
  this.setState({artists: data, loading:false});
}

  
render() { 
  return ( 

  <form>
    <div className="text-center" style={{marginTop: 150}}> 

      <h3 className="mb-4">Find an Artist</h3>  

      <input 
        className="rounded mr-1" 
        value={this.state.query}
        onChange={this.handleChange}  
      />

      <button onClick={this.handleSubmit} className="rounded bg-primary text-white">Search </button>
      
      <br />
      <br />
      
      {this.state.loading? <h5 className="text-secondary">Loading...</h5>: null}

      {this.state.artists.map(artist => <h6 key={artist._id}>{artist.rank+". "+artist.name}</h6>)}

    </div> 
  </form>
  
  )}
}

export default App;