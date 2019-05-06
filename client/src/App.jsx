import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import AddTask from './components/AddTask';
import Archived from './components/Archive';
import HowTos from './components/HowTo';
import AddComment from './components/AddComment'

function Root() {
  return (
  <div className="LoginMessage">
    <center>
      <br/>
      <h2 >Welcome to <mark className="KaizenW">Kaizen</mark><br/><h6>Where Improvement is one click away!</h6></h2>
      <br/>
      <input placeholder="Enter User Name" type="text"/>
      <input placeholder="Password" type="password" id="pass" name="password"/>
      <button><Link className="LinksPW" to="/main/">Login</Link></button>
    </center>
    <AddComment />
  </div>
  )
}

function Main () {
  return (
  <div>
    <center>
      <AddTask />
    </center>
  </div>
  )
}

function Archive() {
  return (
    <center>
      <Archived/>
    </center>
  )
}

function HowTo() {
  return (
    <HowTos/>
  )
}

class App extends Component {
//renders data to the DOM
  render() {
    return (
      <Router>
      <div className="LinksGroup">
        <nav>
              <Link className="Links" to="/">Login|</Link>
              <Link className="Links" to="/main/">Main|</Link>
              <Link className="Links" to="/archive/">Archive|</Link>
              <Link className="Links" to="/howto/">How To|</Link>
        </nav>

        <Route path="/" exact component={Root} />
        <Route path="/main/" component={Main} />
        <Route path="/archive/" component={Archive} />
        <Route path="/howto/" component={HowTo} />
        <Route path="/add-comment/" component={AddComment} />
      </div>
    </Router> 
    )
  }
};

export default App;