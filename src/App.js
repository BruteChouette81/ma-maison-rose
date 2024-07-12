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
const existingConfig = Amplify.getConfig(); // <=== the initialized config should now be returned to existingConfig

Amplify.configure({
  ...existingConfig, // <=== existingConfig instead of awsconfig
  API: {
    ...existingConfig.API,
    REST: {
      ...existingConfig.API?.REST,
      'serverv2': {
       endpoint: "https://f5auzuxklj.execute-api.ca-central-1.amazonaws.com/dev",
        region: "ca-central-1"
      }
    }
  },
  Storage: {
    S3: {
      bucket: "didtransfer",
      level: "public",
      region: "ca-central-1",
      identityPoolId: 'ca-central-1:85ca7a33-46b1-4827-ae75-694463376952'
    }
  }
});


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
