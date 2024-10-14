import React from "react";
import { env } from '../../env';
import { Radio, Divider, Input, Button } from "antd";
import "./Plant.scss";
import '../../scss/components/buttons.scss';
import '../../scss/style.scss'
import Data from './plants.json';
import { pathogen } from './pathogen.js';
import scientific from "./pscientific.json"
import { disease } from "./disease";
import { fungi } from "./pathdata";
import { bacteria } from "./pathdata";
import { virus } from "./pathdata";
import { Form } from "react-bootstrap";
import FileInput from '../../components/FileInput/FileInput';
import { host_genes } from "./genes";

const urlParams = new URLSearchParams(window.location.search);

const id = urlParams.get("id");



let fd = Data.filter(function (i) {
  // // console.log(i)
  return i.id === id;
});


export default class Plant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      species: fd[0].name,
      pathogen: fd[0].pathogen[0],
      disease: 'Select a Disease',
      plantMap: {},
      currentPathogens: fd[0].pathogen,
      diseaseMap: {},
      currentdisease: [],
      showAdavanced: false,
      idtype: 'host',
      keyword: '',
      anotType: 'go',
      genes: '',
      searchType: 'protein'
    };

    const plantMap = {}
    for (let plant of Data) {
      plantMap[plant.name] = plant.pathogen
    }
    const diseaseMap = {}

    for (let plant of Data) {
      diseaseMap[plant.name] = plant.disease
    }

    this.state.plantMap = plantMap
    this.state.diseaseMap = diseaseMap

    this.handleSpecies = this
      .handleSpecies
      .bind(this);
    this.handlePathogen = this
      .handlePathogen
      .bind(this);
    this.handleDisease = this
      .handleDisease
      .bind(this);
    this.handlAdvanced = this.handlAdvanced.bind(this);
    this.handleKeywordChange = this.handleKeywordChange.bind(this)
    this.annotHandler = this.annotHandler.bind(this)
    this.fileSelected = this.fileSelected.bind(this);
    this.handleGeneChange = this.handleGeneChange.bind(this);
    this.setGeneHint = this.setGeneHint.bind(this);
  }
  setGeneHint(hint) {
    this.setState({ geneHintOn: hint });
  }

  fileSelected(fileText) {
    const protein = fileText.trim().split("\n");
    this.setState({ genes: protein });

  }
  handleGeneChange(e) {
    const input = e.target.value;

    // Split the input based on commas, new lines, and tabs
    const genesArray = input
      .split(/,|\n|\t/)
      .map((gene) => gene.trim()) // Trim each gene
      .filter((gene) => gene); // Remove empty entries

    const genesString = genesArray.join(',')



    this.setState({ genes: genesString });
  }
  annotHandler(e) {
    this.setState({ anotType: e.target.value })
  }


  handleKeywordChange(e) {
    this.setState({ keyword: e.target.value })
  };

  handlAdvanced() {
    this.setState(prevState => ({
      showAdavanced: !prevState.showAdavanced,
    }));
  };

  accessionHandler = (e) => {
    this.setState({ idtype: e.target.value, genes: '' })

  };

  searchHandler = (e) => {
    this.setState({ searchType: e.target.value })

  };

  handleSpecies(e) {
    // console.log(e.target.value)
    const species = e.target.value
    if (species === '') {
      this.setState({
        species: '',
        currentPathogens: [],
        currentdisease: []
      })
      return
    }
    this.setState({
      species: e.target.value,
      currentPathogens: this.state.plantMap[species],
      currentdisease: this.state.diseaseMap[species],
      pathogen: this.state.plantMap[species][0]
    })

  }
  handlePathogen(e) {
    this.setState({
      pathogen: e.target.value

    })
  }

  handleDisease(e) {
    this.setState({
      disease: e.target.value

    })
  }

  render() {
    // // console.log(this.state.currentPathogens[0])
    localStorage.setItem(
      "param",
      JSON.stringify({
        host: this.state.species,
        pathogen: this.state.pathogen,
        searchType:this.state.searchType,
        idtype:this.state.idtype,
        keyword:this.state.keyword,
        genes:this.state.genes,
        anotType:this.state.anotType
        
      })
    );

    let genePlaceholder 
    let geneSample;
    let hostgeneSample = host_genes['Cattle']
    let pathogenGeneSample = host_genes['Babortus']

    if (this.state.idtype === 'host') {
      geneSample = hostgeneSample
      genePlaceholder = 'Example NCBI-IDs: NP_001001141.1,NP_001001158.1,NP_001001441.1,NP_001007811.2,XP_059737260.1';
    }
    else {
      geneSample = pathogenGeneSample
      genePlaceholder = 'Example NCBI-IDs: WP_002963495.1,WP_002963560.1,WP_002963614.1,WP_002963758.1';
    }
    console.log(disease)
    const ddata = disease[`${this.state.species}_${this.state.pathogen}`]
    // console.log(this.state.anotType)
    return (
      <div className="container">


        <div className="row mt-2">
          <Divider />
          <div className="col-md-6">
            <h4>Host:&nbsp;&nbsp; {this.state.species}</h4>
          </div>
          <div className="col-md-3 ">
            <h5>OR select other species:</h5>
          </div>
          <div className="col-md-3">

            <select className="form-select ditem" onChange={this.handleSpecies} defaultValue={this.state.species}>
              {/* <option value={fd[0].name}>{fd[0].sname}</option> */}
              {Data.map((sp, index) => {
                return (
                  <option key={index} value={sp.name}>
                    {sp.sname}
                  </option>

                )
              })}
            </select>
          </div>
          <Divider />
        </div>

        <div className="row  mb-4">
          <div className="col-md-6 ">
            <h4>Pathogen: &nbsp;&nbsp; <i>{pathogen[this.state.pathogen]}</i></h4>
          </div>
          <div className="col-md-3 ">
            <h5>OR select other species:</h5>
          </div>
          <div className="col-md-3">
            <select className="form-select ditem" onChange={this.handlePathogen} defaultValue={this.state.currentPathogens[0]}>
              <optgroup label="Fungi" hidden={this.state.currentPathogens.filter(sp => fungi.includes(sp)).length === 0}>
                {this.state.currentPathogens.map((sp, index) => {
                  if (fungi.includes(sp)) {
                    return (
                      <option key={index} value={sp} className="op">
                        {pathogen[sp]}

                      </option>
                    );
                  }
                  else {
                    return ''
                  }
                })}
              </optgroup>
              <optgroup label="Bacteria" hidden={this.state.currentPathogens.filter(sp => bacteria.includes(sp)).length === 0}>
                {this.state.currentPathogens.map((sp, index) => {
                  if (bacteria.includes(sp)) {
                    return (
                      <option key={index} value={sp} style={{ fontStyle: 'italic' }}>
                        {pathogen[sp]}
                      </option>
                    );
                  }
                  else {
                    return ''
                  }
                })}
              </optgroup>
              <optgroup label="Virus" hidden={this.state.currentPathogens.filter(sp => virus.includes(sp)).length === 0}>
                {this.state.currentPathogens.map((sp, index) => {
                  if (virus.includes(sp)) {
                    return (
                      <option key={index} value={sp} style={{ fontStyle: 'italic' }}>
                        {pathogen[sp]}

                      </option>
                    );
                  }
                  else {
                    return ''
                  }
                })}
              </optgroup>

            </select>
          </div>
        </div>


        <Divider />
        <div className="row  mb-4">
          <div className="col-md-6 ">
            <h4>Disease: {ddata} </h4>
          </div>
          <div className="col-md-6 ">
            <h4>Pathogen Type: {scientific[0][`${this.state.pathogen}`][0]} </h4>
          </div>
        </div>

        <Divider />
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div className="card cardd mb-3">
              <h5 className="heading">Scientific Classification</h5>
              <div className="row text-left cr">
                <div className="col-md-4">
                  <ul className="list list-inline ">
                    <li>Kingdom: </li>
                    <li>Division: </li>
                    <li>Class: </li>
                    <li>Order:</li>
                    <li>Family: </li>
                    <li>Genus: </li>
                    <li>Species: </li>
                  </ul>
                </div>
                <div className="col-md-8">
                  <ul className="list list-inline ">
                    {scientific[0][`${this.state.pathogen}`].map((sp, index) => {
                      if (index !== 6) {
                        return (<li key={index}>{sp}</li>)
                      }
                      else {
                        return (<li className="scname" key={index}>{sp}</li>)
                      }

                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>


          <div className="col-md-3">
            <div className="card cardd mb-3">
              <h5 className="heading">Pathogen Annotations </h5>
              {/* <p className="heading2">
                <i>{pathogen[this.state.pathogen]}</i>
                <hr className="line"></hr>
              </p> */}
              <ul className="list list-inline cr ">
                <li>
                  <a className="linked" href={`${env.BASE_URL}/kegg/?id=${this.state.pathogen}&class=pathogen`}>
                    KEGG Pathways
                  </a>
                </li>
                <li>
                  <a className="linked" href={`${env.BASE_URL}/go/?id=${this.state.pathogen}&class=pathogen`}>
                    Gene Ontology
                  </a>
                </li>

                <li>
                  <a className="linked" href={`${env.BASE_URL}/interpro/?id=${this.state.pathogen}&class=pathogen`}>
                    Functional Domains
                  </a>
                </li>
                <li>
                  <a className="linked" href={`${env.BASE_URL}/local/?id=${this.state.pathogen}&class=pathogen`}>
                    Subcellular Localization
                  </a>
                </li>
                <li>
                  <a className="linked" href={`${env.BASE_URL}/virulence/?id=effector_and_secretory&species=${this.state.pathogen}`}>
                    Effector and Secretory Proteins
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card cardd mb-3">
              <h5 className="heading">Host Annotations </h5>

              <ul className="list list-inline cr">
                <li>
                  <a className="linked" href={`${env.BASE_URL}/kegg/?id=${this.state.species}&class=host`}>
                    KEGG Pathways
                  </a>
                </li>
                <li>
                  {" "}
                  <a className="linked" href={`${env.BASE_URL}/go/?id=${this.state.species}&class=host`}>
                    Gene Ontology
                  </a>
                </li>

                <li>
                  <a className="linked" href={`${env.BASE_URL}/interpro/?id=${this.state.species}&class=host`}>
                    Functional Domains{" "}
                  </a>
                </li>
                <li>
                  <a className="linked" href={`${env.BASE_URL}/local/?id=${this.state.species}&class=host`}>
                    Subcellular Localization{" "}
                  </a>
                </li>
                <li>
                  <a className="linked" href={`${env.BASE_URL}/tf/?id=${this.state.species}&class=host`}>
                    Transcription Factors{" "}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <Divider />
        </div>
        <div className="row justify-content-center">
          <div className="col-md-3">
            <a className="btn kbl-btn-1" href={`${env.BASE_URL}/interactome/?host=${this.state.species}&pathogen=${this.state.pathogen}`} >
              Search All Interactome
            </a>
          </div>

          <div className="col-md-2">
            OR
          </div>
          <div className="col-md-3">
            <Button
              type="primary"
              shape="square"
              size="large"
              onClick={this.handlAdvanced}
            >
              Advanced Search{" "}
            </Button>
          </div>

        </div>

        {this.state.showAdavanced && (
          <>
            <div className="row flex-lg-row justify-content-center g-2">
              <Divider />
              <div className="col-md-3">
                <h5>Select Species Type</h5>
                <Radio.Group name="radiogroup" defaultValue={"host"}>
                  <Radio value="host" onChange={this.accessionHandler}>
                    Host
                  </Radio>
                  <Radio value="pathogen" onChange={this.accessionHandler}>
                    Pathogen
                  </Radio>

                </Radio.Group>
              </div>
              <div className="col-md-3">
                <h5>Select Search Type</h5>
                <Radio.Group name="radiogroup" defaultValue={"protein"}>
                  <Radio value="protein" onChange={this.searchHandler}>
                    Protein ID
                  </Radio>
                  <Radio value="keyword" onChange={this.searchHandler}>
                    Keyword
                  </Radio>


                </Radio.Group>
              </div>
              <Divider />
            </div>
            {this.state.searchType === 'keyword' && (
              <>
                <div className="row flex-lg-row align-items-center g-2">

                  <h5>Select Annotation</h5>
                  <Radio.Group name="radiogroup" defaultValue={"go"}>
                    <Radio value="go" onChange={this.annotHandler}>
                      Gene Ontology
                    </Radio>
                    <Radio value="pathway" onChange={this.annotHandler}>
                      KEGG Pathways
                    </Radio>
                    <Radio value="local" onChange={this.annotHandler}>
                      Subcellular Localization
                    </Radio>
                    {this.state.idtype === 'host' && (
                      <>
                        <Radio value="tf" onChange={this.annotHandler}>
                          Transcription Factors
                        </Radio>
                      </>
                    )}
                    {this.state.idtype === 'pathogen' && (
                      <>
                        <Radio value="virulence" onChange={this.annotHandler}>
                          Virulence Proteins
                        </Radio>
                      </>
                    )}

                    <Radio value="interpro" onChange={this.annotHandler}>
                      Functional Domains
                    </Radio>


                  </Radio.Group>
                  <Divider />
                </div>

                <div className="row flex-lg-row justify-content-center g-2">

                  <div className="col-md-2"></div>
                  <div className="col-md-6">
                    <h6>Enter a Keyword (e.g: Ubiquitin)</h6>
                    <Input placeholder="keyword" value={this.state.keyword} onChange={this.handleKeywordChange} />
                  </div>
                  <div className="col-md-2 mt-4">
                    <Button className="kbl-btn-3" onClick={e => {
                      this.setState({ keyword: "" })
                    }}>Clear Data</Button>
                  </div>

                  <Divider />
                </div>
              </>
            )}

            {this.state.searchType === 'protein' && (
              <>
                <div className="row flex-lg-row justify-content-center">


                  <div className="col-md-5">
                    <h5>Enter protein or protein IDs here.</h5>
                    <Form.Control className="kbl-form mb-4" as="textarea" rows={4} placeholder={genePlaceholder} onChange={this.handleGeneChange}
                      value={this.state.genes} onMouseEnter={() => this.setGeneHint(true)} onMouseLeave={() => this.setGeneHint(false)} spellCheck={false} />
                    <Button className="kbl-btn-1 mx-3" onClick={e => {
                      this.setState({ genes: geneSample });
                    }}>Sample Data</Button>
                    <Button className="kbl-btn-3" onClick={e => {
                      this.setState({ genes: "" })
                    }}>Clear Data</Button>
                  </div>
                  <div className="col-md-1 mt-5"><b>OR</b></div>
                  <div className="col-md-3 mb-5">
                    <h5 className="mt-5 pl-2"> Upload Protein IDs List</h5>

                    <FileInput handler={this.fileSelected} />
                  </div>
                  <Divider />
                </div>

              </>
            )}
            <div className="row flex-lg-row justify-content-center g-2">
              <div className="col-md-3">
                <a className="btn kbl-btn-1" href={`${env.BASE_URL}/interactome/?host=${this.state.species}&pathogen=${this.state.pathogen}`} >

                  Search Keyword-based Interactome

                </a>
              </div>
            </div>
          </>
        )}

        <Divider />

      </div>
    )
  }
}