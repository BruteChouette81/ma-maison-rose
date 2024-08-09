import menu from './css/menu.png'
import logo from './css/2021-10-27_15-41-18_1635363693.png'
import "./css/navbar.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'



function Navbar () {
    return (
        <div class="specialnavbar">
            <nav class="navbar navbar-expand-lg navbar-light" style={{"background-color": "#fffffff" , "height": "187px"}}>
        <div class="container" style={{"background-color": "#fffffff" , "height": "187px"}}>
            
                <div class="col">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <img src={menu} alt="" width="30" height="24" />
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/">Accueil</a>
              </li>
  
              
              <li class="nav-item">
                <a class="nav-link" href="/market">Tout magasiner</a>
  
              </li>
              
              <li class="nav-item">
                 <a class="nav-link" href="https://squareup.com/gift/ML9W0KFQCNJMJ/order"> Cartes cadeaux</a> 
  
              </li>
            
            </ul>
          </div>
                </div>
                <div class="col">
                <a className="navbar-brand" href="/" >
            <img src={logo} alt="" width="126" height="139" className="d-inline-block align-text-top" />
             
          </a>
                </div>
                <div class="col"><p>accounts</p></div>
         
         
          
           
          
        </div>
        
      </nav>
      
        </div>
    )
}

export default Navbar;