import React from "react";
import { env } from '../../env';
import "./Home.scss";
// import CookieConsent from "react-cookie-consent";
import Table from 'react-bootstrap/Table';
import hpinet from './hpinet.png';
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  openModel = () => this.setState({ isOpen: true });
  closeModel = () => this.setState({ isOpen: false });
  render() {
    return (
      
<div className="container main">
<div className="separator">
		<h1>About HPInet</h1>
		<div className="divider">&nbsp;</div>
	</div>
  <div className="row">
<div className="col-md-6">

<div className="purpose">
		<p>Cereal crops are essential for global food security, but they are threatened by a variety of biotic stresses, including phytopathogens. Protein-protein interactions (PPIs) play a crucial role in host-pathogen interactions, and a PPI database can help researchers to elucidate the molecular mechanisms underlying these interactions and identify potential targets for intervention. HPInet is a comprehensive database of cereal disease PPIs that encompasses eight prominent cereal crops and their corresponding major bacterial, fungal, and viral diseases. It uses a multifaceted computational framework to predict PPIs, integrating sequence-based algorithms and functional and evolutionary information. HPInet provides functional annotations of the host and pathogen proteins involved in the predicted interactions, offering insights into disease resistance strategies and the development of improved crop varieties. It also includes a network visualization tool that allows researchers to decipher regulatory nodes within candidate PPI pairs, thereby fortifying crop resilience. HPInet is an invaluable resource for the scientific community, aiding in the development of disease-resistant crop cultivars. 
		</p>
  </div>
</div>
<div className="col-md-6">
<img src={hpinet} alt="" width={600}/>

</div>

  </div>
	

	<div className="separator">
		<h1>Search by plants</h1>
		<div className="divider">&nbsp;</div>
	</div>
	
  <Table  responsive className="kbl-table table-borderless">
  <thead className="kbl-thead">
    <tr>
    <th >Crop Species</th><th>Common Name </th><th> Proteins</th> <th> Gene Ontology </th> <th> KEGG Pathways </th> <th> Transcription Factors </th> <th>Actions</th>
    </tr>
    </thead>
    <tbody>
    <tr>
     <td> <i>Homo sapiens</i> </td> <td>Human</td> <td>136,194</td><td>4895</td><td>139</td><td>5,833</td> <td><a href={`${env.BASE_URL}/hosts/?id=1`}>Get interactions</a></td>
    </tr>
    <tr>
     <td> <i>Canis lupus familiaris</i> </td> <td>Dog</td> <td>63,650</td><td>5983</td><td>139</td><td>3,425</td> <td><a href={`${env.BASE_URL}/hosts/?id=2`}>Get interactions</a></td>
    </tr>
    <tr>
     <td> <i>Felis catus</i> </td> <td>Cat</td><td>71,463</td><td>4991</td><td>138</td><td>2,190</td> <td><a href={`${env.BASE_URL}/hosts/?id=3`}>Get interactions</a></td>
    </tr>
    <tr>
     <td> <i>Sus scrofa</i> </td> <td>Pig</td> <td>63,575</td><td>2407</td><td>140</td><td>1,649</td> <td><a href={`${env.BASE_URL}/hosts/?id=4`}>Get interactions</a></td>
    </tr>
    <tr>
     <td> <i>Bos taurus</i> </td> <td>Cattle</td> <td>64,939</td><td>4010</td><td>139</td><td>1,959</td><td><a href={`${env.BASE_URL}/hosts/?id=5`}>Get interactions</a></td>
    </tr>
    <tr>
     <td> <i>Gallus gallus</i> </td> <td>Chicken</td> <td>68,683</td><td>6279</td><td>139</td><td>2,186</td> <td><a href={`${env.BASE_URL}/hosts/?id=6`}>Get interactions</a></td>
    </tr>
    <tr>
     <td> <i>Capra hircus</i> </td> <td>Goat</td> <td>42,653</td><td>2777</td><td>139</td><td>4,423</td> <td><a href={`${env.BASE_URL}/hosts/?id=7`}>Get interactions</a></td>
    </tr>
    <tr>
     <td> <i>Ovis aries</i> </td> <td>Sheep</td> <td>76,701</td><td>5948</td><td>139</td><td>1,886</td> <td><a href={`${env.BASE_URL}/hosts/?id=8`}>Get interactions</a></td>
    </tr>  
    <tr>
     <td> <i>Equus caballus</i> </td> <td>Horse</td> <td>60,900</td><td>5948</td><td>139</td><td>3,056</td> <td><a href={`${env.BASE_URL}/hosts/?id=9`}>Get interactions</a></td>
    </tr>   
    <tr>
     <td> <i>Bubalus bubalis</i> </td> <td>Water Buffalo</td> <td>64,378</td><td>5948</td><td>139</td><td>2,611</td> <td><a href={`${env.BASE_URL}/hosts/?id=10`}>Get interactions</a></td>
    </tr>                
    <tr>
     <td> <i>Apis melifera</i> </td> <td>Honey Bee</td> <td>23,471</td><td>5948</td><td>139</td><td>2,611</td> <td><a href={`${env.BASE_URL}/hosts/?id=11`}>Get interactions</a></td>
    </tr>                                   
  </tbody>
  </Table>



  <div className="row flex-lg-row justify-content-center g-2 my-2">
  <h1>Data Sources</h1>
  <div className="divider">&nbsp;</div>
          
        </div>

       
        <div className="row flex-lg-row justify-content-center g-2 my-2">
          <a
            href="https://hpidb.igbb.msstate.edu/"
            className="col-md-1 hpidb"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="../images/hpidb.png" alt="" />
            <figcaption>HPIDB</figcaption>
          </a>

          <a
            href="http://www.ebi.ac.uk/intact/"
            className="col-md-1 db"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src='../images/intact.png' height='40px' width='80px' alt="" />
            <figcaption>IntAct</figcaption>
          </a>

          <a
            href="http://mint.bio.uniroma2.it"
            className="col-md-1 db"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="../images/mint.png" alt="" />
            <figcaption>MINT</figcaption>
          </a>

          <a
            href="https://thebiogrid.org/"
            className="col-md-1 db"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="../images/biogrid.png" alt="" />
            <figcaption>BioGRID</figcaption>
          </a>
          <a
            href="https://string-db.org/"
            className="col-md-1 db"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="../images/string.png" alt="" />
            <figcaption>STRING</figcaption>
          </a>
          <a
            href="http://dip.doe-mbi.ucla.edu/"
            className="col-md-1 db"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="../images/dip.png" alt="dip" />
            <figcaption>DIP</figcaption>
          </a>
          <a
            href="https://manticore.niehs.nih.gov/cgi-bin/Domine"
            className="col-md-1 db2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="../images/domine.png" alt="dip" />
            <figcaption>DOMINE</figcaption>
          </a>
          <a
            href="https://3did.irbbarcelona.org/"
            className="col-md-1 hpidb"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="../images/3did.png" alt="" />
            <figcaption>3did</figcaption>
          </a>
          <a
            href="http://www.uniprot.org/"
            className="col-md-1 db"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="../images/uniprot.png" alt="" />
            <figcaption>UniProt</figcaption>
          </a>
          <a
            href="https://ensembl.org"
            className="col-md-1 hpidb"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="../images/ensembl.png" alt="" />
            <figcaption>ENSEMBL</figcaption>
          </a>
        </div>
        <div className="divider">&nbsp;</div>

    </div>

    )}

    }