import './App.css';
import Home from './component/home';
import Navbar from './component/navbar';
import 'bootstrap/dist/css/bootstrap.min.css'

import { Amplify } from 'aws-amplify';
import awsmobile from './aws-exports';

Amplify.configure(awsmobile);

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Home/>
    </div>
  );
}

export default App;
