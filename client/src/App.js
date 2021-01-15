import "./App.css";
import {BrowserRouter, Route,Redirect, Switch} from 'react-router-dom'
import Auth  from './pages/Auth/Auth'
import Events from './pages/Events/Events'
import Bookings from './pages/Booking/Bookings'
import NavBar from './Components/Navbar/NavBar'

function App() {
  return (    
    <BrowserRouter>
    <NavBar/>
     <main className="main-content">
      <Switch>
          <Redirect from="/" to="/auth" exact/>
          <Route path="/" component={Auth}  exact/>
          <Route path="/auth" component={Auth} exact />
          <Route path="/events" component={Events} exact />
          <Route path="/bookings" component={Bookings} exact />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default App;
