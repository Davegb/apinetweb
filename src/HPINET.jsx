import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { env } from './env';

import { HNavbar } from './components/Navbar/HNavbar';
import Footer from 'components/Footer/Footer';
import Home from './pages/Home/Home';
import Hosts from 'pages/Hosts/Plant';
import Interactome from 'pages/Interactome/Interactome';
import Results from 'pages/Result/Results';
import GO from './pages/Annotation/GO';
import VisPage from './pages/VisPage/VisPage';
import KEGG from './pages/Annotation/KEGG';
import Interpro from './pages/Annotation/Interpro';
import Local from './pages/Annotation/Local';
import TF from './pages/Annotation/TF';
import Virulence from './pages/Annotation/Virulence';
import Datasets from './pages/Datasets/Datasets';
import Help from './pages/Help/Help';
import ANNOT from 'pages/Annotation/Annot';
import Search from 'pages/Hosts/Search';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom';

export class HPINET extends Component {
    constructor(props){
        super(props);
        this.state = {
            baseUrlLen: env.BASE_URL.split('/').length
        }
    }

    render(){
        return(
			<Router>
			<Container fluid className='App px-4'>
			<HNavbar active={document.location.pathname.split('/')[this.state.baseUrlLen]}/>
		   <Routes>
			   <Route path={`${env.BASE_URL}/`} element={<Home />} />
               <Route path={`${env.BASE_URL}/hosts/`} element={<Hosts />}/>
               <Route path={`${env.BASE_URL}/interactome/`} element={<Interactome />}/>
               <Route path={`${env.BASE_URL}/results/`} element={<Results/>}/>
               <Route path={`${env.BASE_URL}/go/`}  element={<GO />}>
                    
                    </Route>

                    <Route path={`${env.BASE_URL}/kegg/`}  element={<KEGG />}>
                    
                    </Route>
                    <Route path={`${env.BASE_URL}/interpro/`}  element={<Interpro />}>
                    
                    </Route>
                    <Route path={`${env.BASE_URL}/local/`}  element={<Local />}>
                    
                    </Route>
                    <Route path={`${env.BASE_URL}/tf/`}  element={<TF />}>
                    
                    </Route>
                    <Route path={`${env.BASE_URL}/virulence/`}  element={<Virulence />}>
                    
                    </Route>
                

                    <Route path={`${env.BASE_URL}/network`}  element={<VisPage />}>
                    
                    </Route>
                    <Route path={`${env.BASE_URL}/datasets`}  element={<Datasets />}>
                    
                    </Route>
                    <Route path={`${env.BASE_URL}/help`}  element={<Help />} />
                    <Route path={`${env.BASE_URL}/annotation`}  element={<ANNOT />} />
                    <Route path={`${env.BASE_URL}/search`}  element={<Search />} />
            </Routes>
            <Footer />
            </Container>
            </Router>
        )
    }
}