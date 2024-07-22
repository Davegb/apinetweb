import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { env } from "../../env";
import './HNavbar.scss';
import '../../scss/style.scss';
import lablogo from './lab_logo_red.png';
import usulogo from './usulogo2.png';
import dblogo from './hpinet.png';

class HNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.active
    };
    this.activeLink = this.activeLink.bind(this);
  }

  activeLink(link) {
    
    
    if (link === this.props.active) {
      return true;
    }

    return false;
  }

    render() {
        let className = 'mx-1'
        let active = 'mx-1 current'
        console.log(env.BASE_URL)
return(
  <div className="container contain">
  <div className="row flex-lg-row align-items-center g-2 mt-2">

    <div className="col-md-2 imglab">
      <img className="imglab" src={lablogo} height={50} alt=''></img>
    </div>
    <div className="col-md-2">
    <img src={dblogo} height={60} alt=''></img>

    </div>
    <div className=" col-md-6 mt-2 nav-wrapper mx-auto">
        <Navbar className="justify-content-center">
          
          <Nav className="">
            <Nav.Link href= {`${env.BASE_URL}/`} className={'/' === this.props.active ? active : className}>
              Home
            </Nav.Link>
            <NavDropdown title="Species" id="basic-nav-dropdown">
                  <NavDropdown.Item href={`${env.BASE_URL}/hosts/?id=1`} className={'species' === this.props.active ? active : className}>
                    <i>Homo Sapiens</i> (Human)
                  </NavDropdown.Item>
                  <NavDropdown.Item href={`${env.BASE_URL}/hosts/?id=2`} className={'species' === this.props.active ? active : className}>
                    <i>Canis lupus familiaris</i> (Dog)
                  </NavDropdown.Item>
                  <NavDropdown.Item href={`${env.BASE_URL}/hosts/?id=3`} className={'species' === this.props.active ? active : className}>
                    <i>Felis catus</i> (Cat)
                  </NavDropdown.Item>
                  <NavDropdown.Item href={`${env.BASE_URL}/hosts/?id=4`} className={'species' === this.props.active ? active : className}>
                    <i>Sus scrofa</i> (Pig)
                  </NavDropdown.Item>
                  <NavDropdown.Item href={`${env.BASE_URL}/hosts/?id=5`} className={'species' === this.props.active ? active : className}>
                    <i>Bos taurus</i> (Cattle)
                  </NavDropdown.Item>
                  <NavDropdown.Item href={`${env.BASE_URL}/?id=6`} className={'species' === this.props.active ? active : className}>
                    <i>Gallus gallus</i> (Chicken)
                  </NavDropdown.Item>
                  <NavDropdown.Item href={`${env.BASE_URL}/hosts/?id=7`} className={'species' === this.props.active ? active : className}>
                    <i>Capra hircus</i> (Goat)
                  </NavDropdown.Item>
                  <NavDropdown.Item href={`${env.BASE_URL}/hosts/?id=8`} className={'species' === this.props.active ? active : className}>
                    <i>Ovis aries</i> (Sheep)
                  </NavDropdown.Item>
                  <NavDropdown.Item href={`${env.BASE_URL}/hosts/?id=9`} className={'species' === this.props.active ? active : className}>
                    <i>Equus caballus</i> (Horse)
                  </NavDropdown.Item>
                  <NavDropdown.Item href={`${env.BASE_URL}/hosts/?id=10`} className={'species' === this.props.active ? active : className}>
                    <i>Bubalus bubalis</i> (Water Buffalo)
                  </NavDropdown.Item>
                  <NavDropdown.Item href={`${env.BASE_URL}/hosts/?id=11`} className={'species' === this.props.active ? active : className}>
                    <i>Apis melifera</i> (Honey Bee)
                  </NavDropdown.Item>
</NavDropdown>
            <Nav.Link href={`${env.BASE_URL}/datasets`} className={'datasets' === this.props.active ? active : className}>
              Datasets
            </Nav.Link>
            <Nav.Link href={`${env.BASE_URL}/help`} className={'help' === this.props.active ? active : className}>
              Help
            </Nav.Link>
          </Nav>

        </Navbar>
      </div>
      <div className="col-md-2">
      <img src={usulogo} height={50} alt=''></img>
    </div>
    </div>
    
      </div>

)

    }
}
export {HNavbar};