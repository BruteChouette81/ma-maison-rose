import './App.css';
import Home from './component/home';
import Market from './component/market';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

import Navbar from './component/navbar';
import 'bootstrap/dist/css/bootstrap.min.css'

import { Amplify } from 'aws-amplify';
import awsmobile from './aws-exports';
import Item from './component/items'

Amplify.configure(awsmobile);
//
Amplify.configure({
  Auth: {
    identityPoolId: 'ca-central-1:85ca7a33-46b1-4827-ae75-694463376952',
    region: 'ca-central-1',
    userPoolId: 'ca-central-1_PpgocuiOa',
    userPoolWebClientId: '3e5qk8i1f53cp415ou2h26lpn9'
    
  },
  Storage: {
    AWSS3: {
      bucket: "clientbc6cabec04d84d318144798d9000b9b3205313-dev",
      region: "ca-central-1",
    }
    
  }, 
  API: {
    endpoints: [
      {
        name: "server",
        endpoint: "https://6pvpjdu5ue.execute-api.ca-central-1.amazonaws.com/dev",
        region: "ca-central-1"
    },
    {
        name: "serverv2",
        endpoint: "https://f5auzuxklj.execute-api.ca-central-1.amazonaws.com/dev",
        region: "ca-central-1"
    }
    ]
  }

})


function App() {
  return (
    <div className="App">
      
      <Router>
            <Navbar/>
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/market" element={<Market/>}/>
              <Route path="/item/:id" element={<Item/>} />

            </Routes>
      </Router>      
           
    </div>
  );
}

export default App;
