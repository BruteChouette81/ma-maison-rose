
import "./css/home.css"
import 'bootstrap/dist/css/bootstrap.min.css'
function Home() {
    return (
        <div>
            <div class="mainBanner">
                <h1 id="title2">Ma Maison Rose</h1>
                <br />
                <br />
                <br />
                <a class="btn btn-primary" style={{"backgroundColor": "#ffe7e3", "color": "black", "borderColor": "#ffe7e3"}} href="/market">Magasiner</a>
                
            </div>
            <br />
            <br />
            <iframe
              src="https://www.editmysite.com/ajax/apps/generateMap.php?elementid=99517140-2e44-11ef-8b52-696f0b55a779&map=google&ineditor=0&width=auto&point=1&control=3&scalecontrol=1&height=350px&zoom=10&zoomScale=70&lat=46.66364&long=-71.57153&pincolor=%23ffe7e3&pincontrastcolor=%23000000&styles=%5B%7B%22featureType%22%3A%22poi%22%2C%22elementType%22%3A%22labels.text%22%2C%22stylers%22%3A%5B%7B%22visibility%22%3A%22off%22%7D%5D%7D%2C%7B%22featureType%22%3A%22poi.business%22%2C%22stylers%22%3A%5B%7B%22visibility%22%3A%22off%22%7D%5D%7D%2C%7B%22featureType%22%3A%22road%22%2C%22elementType%22%3A%22labels.icon%22%2C%22stylers%22%3A%5B%7B%22visibility%22%3A%22off%22%7D%5D%7D%2C%7B%22featureType%22%3A%22transit%22%2C%22stylers%22%3A%5B%7B%22visibility%22%3A%22off%22%7D%5D%7D%5D&touch=1&forcemapdrag=1"
              width="1240"
              height="350"
              style={{"border": "0"}}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
            />
            <div class="row" style={{"margin": "200px"}}>
                <div class="col">
                    <div class="address">
                        <h2>
                            3849 Chemin de Tilly <br />
                            Saint-Antoine-de-Tilly <br />
                            QC , G0S 2C0 <br />
                            418-609-2475
                        </h2>
                        <a href="https://www.google.com/maps/dir/?api=1&destination=3849+Chemin+de+Tilly+Saint-Antoine-de-Tilly+QC+G0S+2C0">Obtenir un itinéraire</a>
                    </div>
                </div>
                <div class="col">
                    <div class="ouverture">
                    <p>Mercredi : 11 à 17h</p>
                    <p>Jeudi : 11 à 17h</p>
                    <p>Vendredi : 11 à 17h</p>
                    <p>Samedi : 10 à 17h</p>
                    <p>Dimanche : 10 à 17h</p>
                    </div>
                </div>
            </div>
           
            
        </div>
    )
}

export default Home;