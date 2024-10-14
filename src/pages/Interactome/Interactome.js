import React from "react";
import { Divider, Radio, Checkbox, Button, Slider } from "antd";
import "./Interactome.scss";
import '../../scss/components/buttons.scss';
import '../../scss/style.scss'
import { InfoCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import hosts from '../Hosts/plants.json';
import { env } from "../../env";
import { pathogen } from "../Hosts/pathogen";
import { host_genes } from "./genes";
import { Modal, Form } from "react-bootstrap";
import FileInput from '../../components/FileInput/FileInput';
import test from './test.gif';

const pdata = JSON.parse(localStorage.getItem("param"));

const urlParams = new URLSearchParams(window.location.search);

const mhost = urlParams.get("host");
const mpath = urlParams.get("pathogen");

const CheckboxGroup = Checkbox.Group;
const interologOptions = [
  "HPIDB",
  "MINT",
  "BioGRID",
  "IntAct",
  "VirHostNet",
];

const domainOptions = ["3DID", "IDDI", "DOMINE"];

const interologCheckedList = ["HPIDB", "MINT"];
const domainCheckedList = ["3DID", "IDDI"];

export default class Interactome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interactomeType: "interactome",
      searchType: "proteome",
      idType: 'host',
      ostype: "unique",
      checkedList: interologCheckedList,
      dcheckedList: domainCheckedList,
      checkAll: false,
      dcheckAll: false,
      status: "interolog",
      species: mhost,
      pathogen: mpath,
      identity: 80,
      coverage: 80,
      evalue: 1e-20,
      pidentity: 80,
      pcoverage: 80,
      pevalue: 1e-20,
      resultid: "",
      isOpen: false,
      ppiOpen: false,
      genomePool: 'UP82',
      phylothreshold: 0.98,
      genes: pdata.genes,
      hgenes: '',
      pgenes: '',
      gomethod: 'wang',
      goscore: 'max',
      gothreshold: 0.5,
      geneHintOn: false,
    };
    this.radioHandler = this.radioHandler.bind(this);
    this.speciesHandler = this.speciesHandler.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCheckAllChange = this.onCheckAllChange.bind(this);
    this.onChange2 = this.onChange2.bind(this);
    this.onCheckAllChange2 = this.onCheckAllChange2.bind(this);
    this.identityHandler = this.identityHandler.bind(this);
    this.coverageHandler = this.coverageHandler.bind(this);
    this.evalueHandler = this.evalueHandler.bind(this);
    this.pidentityHandler = this.pidentityHandler.bind(this);
    this.pcoverageHandler = this.pcoverageHandler.bind(this);
    this.pevalueHandler = this.pevalueHandler.bind(this);
    this.interactomeHandler = this.interactomeHandler.bind(this);
    this.intHandler = this.intHandler.bind(this);
    this.fileSelected = this.fileSelected.bind(this);
    this.handleGeneChange = this.handleGeneChange.bind(this);
    this.getInteractions = this.getInteractions.bind(this);
    this.setGeneHint = this.setGeneHint.bind(this);
    this.idHandler = this.idHandler.bind(this);
    this.accessionHandler = this.accessionHandler.bind(this);
    this.goMethodradioHandler = this.goMethodradioHandler.bind(this);
    this.goScoreradioHandler = this.goScoreradioHandler.bind(this);
    this.handleHostGeneChange = this.handleHostGeneChange.bind(this);
    this.handlePathogenGeneChange = this.handlePathogenGeneChange.bind(this);
    this.getValue = this.getValue.bind(this);
    this.pgHandler = this.pgHandler.bind(this);
    this.phyloThresholdHandler = this.phyloThresholdHandler.bind(this)

  }

  radioHandler(e) {
    this.setState({
      status: e.target.value,
    });
  }
  goMethodradioHandler(e) {
    this.setState({
      gomethod: e.target.value,
    });
  }
  goScoreradioHandler(e) {
    this.setState({
      goscore: e.target.value,
    });
  }
  getValue = (value) => {

    this.setState({ gothreshold: (value / 100) },)
  };


  speciesHandler = (e) => {
    this.setState({ species: e.target.value });
  };

  idHandler = (e) => {
    this.setState({ searchType: e.target.value })
  }
  pgHandler = (e) => {
    this.setState({ genomePool: e.target.value })
  }

  accessionHandler = (e) => {
    this.setState({ idType: e.target.value })
  }

  identityHandler(e) {
    this.setState({ identity: e.target.value });
  }
  phyloThresholdHandler(e) {
    this.setState({ phylothreshold: e.target.value });
  }
  coverageHandler(e) {
    this.setState({ coverage: e.target.value });
  }
  evalueHandler(e) {
    this.setState({ evalue: e.target.value });
  }

  pidentityHandler(e) {
    this.setState({ pidentity: e.target.value });
  }
  pcoverageHandler(e) {
    this.setState({ pcoverage: e.target.value });
  }
  pevalueHandler(e) {
    this.setState({ pevalue: e.target.value });
  }

  onChange(list) {
    this.setState({
      checkedList: list,

      checkAll: list.length === interologOptions.length,
    });
  }

  onChange2(list) {
    this.setState({
      dcheckedList: list,

      dcheckAll: list.length === domainOptions.length,
    });
  }

  onCheckAllChange(e) {
    this.setState({
      checkedList: e.target.checked ? interologOptions : [],

      checkAll: e.target.checked,
    });
  }
  onCheckAllChange2(e) {
    this.setState({
      dcheckedList: e.target.checked ? domainOptions : [],

      dcheckAll: e.target.checked,
    });
  }

  openModel = () => this.setState({ isOpen: true });
  closeModel = () => this.setState({ isOpen: false });

  ppiModalopen = () => this.setState({ ppiOpen: true });
  ppiModalclose = () => this.setState({ ppiOpen: false });

  interactomeHandler(e) {
    this.setState({ interactomeType: e.target.value });
  }

  intHandler(e) {
    this.setState({ ostype: e.target.value });
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

  handleHostGeneChange(e) {
    const input = e.target.value;

    // Split the input based on commas, new lines, and tabs
    const genesArray = input
      .split(/,|\n|\t/)
      .map((gene) => gene.trim()) // Trim each gene
      .filter((gene) => gene); // Remove empty entries

    const genesString = genesArray.join(',')
    this.setState({ hgenes: genesString });
  }

  handlePathogenGeneChange(e) {
    const input = e.target.value;

    // Split the input based on commas, new lines, and tabs
    const genesArray = input
      .split(/,|\n|\t/)
      .map((gene) => gene.trim()) // Trim each gene
      .filter((gene) => gene); // Remove empty entries

    const genesString = genesArray.join(',')

    this.setState({ pgenes: genesString });
  }


  setGeneHint(hint) {
    this.setState({ geneHintOn: hint });
  }
  getInteractions() {


    const intdb = this.state.checkedList.map((element) => {
      return element.toLowerCase();
    });
    const intdbd = intdb.toString()

    const domdb = this.state.dcheckedList.map((element) => {
      return element.toLowerCase();
    });


    let pspecies = this.state.pathogen
    let hspecies = hosts.find(item => item.name === this.state.species).sname.replaceAll(' ', '_').replaceAll('.', '').replaceAll('(', '_').replaceAll(')', '_')
    let postBody = {
      category: this.state.status,
      hspecies: hspecies,
      pspecies: pspecies,
      ids: pdata.idtype,
      genes: pdata.genes,
      stype: this.state.searchType,
      hi: this.state.identity,
      hc: this.state.coverage,
      he: this.state.evalue,
      pi: this.state.pidentity,
      pc: this.state.pcoverage,
      pe: this.state.pevalue,
      intdb: intdbd,
      domdb: domdb,
      keyword:pdata.keyword,
      searchType:pdata.searchType,
      anotType:pdata.anotType,
      host:this.state.species,
      pathogen:this.state.pathogen
    };
   
    // console.log(postBody)

    if (this.state.status === 'domain') {
      window.location.replace(`${env.BASE_URL}/results`);
    }
    if (this.state.status === 'gosim') {
      this.openModel();
      hspecies = hosts.find(item => item.name === this.state.species).sname.replaceAll(' ', '_').replaceAll('.', '').replaceAll('(', '_').replaceAll(')', '_')
      let postBody = {
        category: this.state.status,
        hspecies: hspecies,
        pspecies: this.state.pathogen,
        host_genes: this.state.hgenes,
        pathogen_genes: this.state.pgenes,
        method: this.state.gomethod,
        score: this.state.goscore,
        threshold: this.state.gothreshold
      }
      // console.log(postBody)
      axios
        .post(
          `${env.BACKEND}/api/goppi/`,
          postBody
        )
        .then((res) => {
          const rid = res.data;
          // console.log(rid);
          this.setState({ resultid: rid });

          this.closeModel();
          window.location.replace(`${env.BASE_URL}/results/?id=${rid}`);
        })
        .catch((err) => console.log(err.response));

    }
    if (this.state.status === 'phylo') {
      this.openModel();
      hspecies = hosts.find(item => item.name === this.state.species).sname.replaceAll(' ', '_').replaceAll('.', '').replaceAll('(', '_').replaceAll(')', '_')
      let postBody = {
        category: this.state.status,
        hspecies: hspecies,
        pspecies: this.state.pathogen,
        host_genes: this.state.hgenes,
        pathogen_genes: this.state.pgenes,
        method: this.state.genomePool,
        threshold: this.state.phylothreshold,
        hi: this.state.identity,
        hc: this.state.coverage,
        he: this.state.evalue,
        pi: this.state.pidentity,
        pc: this.state.pcoverage,
        pe: this.state.pevalue,
      }
      // console.log(postBody)
      axios
        .post(
          // `${env.BACKEND}/api/ppi/?species=${this.state.species}&identity=${this.state.identity}&coverage=${this.state.coverage}&evalue=${this.state.evalue}&intdb=${intdb}`
          `${env.BACKEND}/api/phyloppi/`,
          postBody
        )
        .then((res) => {
          const rid = res.data;
          console.log('RID ' + rid)
          // console.log(rid);
          this.setState({ resultid: rid });

          this.closeModel();
          window.location.replace(`${env.BASE_URL}/results/?id=${rid}`);
        })
        .catch((err) => console.log(err.response));

    }
    if (this.state.status === 'interolog') {
      this.openModel();
      axios
        .post(
          // `${env.BACKEND}/api/ppi/?species=${this.state.species}&identity=${this.state.identity}&coverage=${this.state.coverage}&evalue=${this.state.evalue}&intdb=${intdb}`
          `${env.BACKEND}/api/ppi/`,
          postBody
        )
        .then((res) => {
          const rid = res.data;
          // console.log(rid);
          this.setState({ resultid: rid });

          this.closeModel();
          window.location.replace(`${env.BASE_URL}/results/?id=${rid}`);
        })
        .catch((err) => console.log(err));
    }

    if (this.state.status === 'consensus') {
      let ipostBody = {
        category: this.state.status,
        hspecies: hspecies,
        pspecies: pspecies,
        ids: this.state.idType,
        genes: pdata.genes,
        stype: this.state.searchType,
        hi: this.state.identity,
        hc: this.state.coverage,
        he: this.state.evalue,
        pi: this.state.pidentity,
        pc: this.state.pcoverage,
        pe: this.state.pevalue,
        intdb: intdbd,
        domdb: domdb,
        keyword:pdata.keyword,
        searchType:pdata.searchType
      };
       // console.log(ipostBody)
      this.openModel();
      axios
        .post(
          // `${env.BACKEND}/api/ppi/?species=${this.state.species}&identity=${this.state.identity}&coverage=${this.state.coverage}&evalue=${this.state.evalue}&intdb=${intdb}`
          `${env.BACKEND}/api/ppi/`,
          ipostBody
        )
        .then((res) => {
          const rid = res.data;
          // console.log(rid);
          this.setState({ resultid: rid });

          this.closeModel();
          window.location.replace(`${env.BASE_URL}/results/?id=${rid}`);
        })
        .catch((err) => console.log(err));
    }
  }


  render() {
    localStorage.setItem(
      "param",
      JSON.stringify({
        he: this.state.evalue,
        hi: this.state.identity,
        hc: this.state.coverage,
        pe: this.state.pevalue,
        pi: this.state.pidentity,
        pc: this.state.pcoverage,
        resultid: this.state.resultid,
        category: this.state.status,
        species: this.state.species,
        pathogen: this.state.pathogen,
        domdb: this.state.dcheckedList,
        ids: this.state.idType,
        genes: this.state.genes,
        hgenes: this.state.hgenes,
        pgenes: this.state.pgenes,
        gomethod: this.state.gomethod,
        goscore: this.state.goscore,
        gothreshold: this.state.gothreshold,
        keyword:pdata.keyword,
        searchType:pdata.searchType
      })
    );
    let genePlaceholder = 'Example NCBI-IDs: NP_001001141.1,NP_001001158.1,NP_001001441.1,NP_001007811.2,XP_059737260.1';
    // let geneSample = 'TraesCS6A02G059000, TraesCS5A02G216600, TraesCS2A02G417800, TraesCS7A02G408100, TraesCS7A02G434500, TraesCS2A02G203000, TraesCS7A02G178900, TraesCS4B02G350800';
    let geneSample = host_genes['Cattle']
    let pathogenGeneSample = host_genes['Babortus']
    // if (this.state.idType === 'pathogen') {
    //   genePlaceholder = 'Example NCBI-IDs: OAJ02622, OAI99867, OAJ05030';
    //   geneSample = 'OAJ02622, OAI99867, OAJ05030, OAI99147';
    // }
    // // console.log(this.state.resultid)
    return (
      <div className="container">
        {localStorage.setItem("resultid", JSON.stringify(this.state.resultid))}
        <Divider />
        <div className="row justify-content-center">
          <div className="col-md-4">
            <h5>Select Host: {mhost}</h5>
          </div>

          <div className="col-md-4">
            <h5>Selected Pathogen: <i>{pathogen[mpath]}</i></h5>
          </div>

        </div>
        <Modal show={this.state.ppiOpen} onHide={this.ppiModalclose}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Title>
            <h5 className="my-2 text-center">About PPI Databases</h5>
          </Modal.Title>
          <Modal.Body>
            <p className="info">
              The International Molecular Exchange Consortium{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.imexconsortium.org"
              >
                (IMEX)
              </a>{" "}
              had the initiative to cluster the largest public interaction data
              providers. From those we have selected five (HPIDB, MINT, DIP,
              BioGRID and IntAct), as we think these are most comprehensive for
              the studying the interactions, althought these databases can be
              used for general purposes (any dataset can be used in this
              service). Additionally, we also implemented PHI-base, and the
              plant experimental interactions from STRING database.{" "}
            </p>
            <hr></hr>
            <p className="info">
              HPIDB is the default database, because it is the only one solely
              made by host-pathogen interactions. Others include any kind of
              protein-protein interactions.
            </p>
            <hr></hr>
            <p className="info">
              Summary of the databases version running on this service:
            </p>
            <p className="info">
              <a
                target="_blank"
                rel="noreferrer"
                href="http://hpidb.igbb.msstate.edu/"
              >
                HPIDB
              </a>{" "}
              have 69,787 sequences with 389,910 interactions.
            </p>
            <p className="info">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://mint.bio.uniroma2.it/"
              >
                MINT
              </a>{" "}
              have 26,344 sequences with 131,695 interactions.
            </p>
            <p className="info">
              <a
                target="_blank"
                rel="noreferrer"
                href="http://dip.mbi.ucla.edu/dip/"
              >
                DIP
              </a>{" "}
              have 28,404 sequences with 81,923 interactions.
            </p>
            <p className="info">
              <a target="_blank" rel="noreferrer" href="https://string-db.org/">
                STRING
              </a>{" "}
              have 97,483 sequences with 4,944,287 interactions.
            </p>
            <p className="info">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://thebiogrid.org/"
              >
                BioGRID
              </a>{" "}
              have 82,751 sequences with 1,565,084 interactions.
            </p>
            <p className="info">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.ebi.ac.uk/intact/"
              >
                IntAct
              </a>{" "}
              have 121,387 sequences with 1,156,385 interactions.
            </p>
            <p className="info">
              <a
                target="_blank"
                rel="noreferrer"
                href="http://www.phi-base.org/"
              >
                PHI-base
              </a>{" "}
              have 6,776 sequences with 15,849 interactions.
            </p>
            <hr></hr>
            <p className="info" style={{ color: "tomato" }}>
              Note: There can be overlapping data between databases.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button type="danger" shape="round" onClick={this.ppiModalclose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Divider />

        <div className="row flex-lg-row justify-content-center">

          <div className="col-md-6">
            <Radio.Group name="radiogroup" defaultValue={"interolog"}>
              <h5>Select Interaction Method</h5>
              <Radio value="interolog" onClick={this.radioHandler}>
                Interolog
              </Radio>
              <Radio value="domain" onClick={this.radioHandler}>
                Domain
              </Radio>
              <Radio value="consensus" onClick={this.radioHandler}>
                Interolog & Domain Consensus
              </Radio>
              <Radio value="gosim" onClick={this.radioHandler}>
                GOsim
              </Radio>
              <Radio value="phylo" onClick={this.radioHandler}>

                Phylo-profiling

              </Radio>

            </Radio.Group>
          </div>
          {/* {this.state.status !== 'phylo' && this.state.status !== 'gosim' && (
            <div className="col-md-4">
              <Radio.Group name="radiogroup" defaultValue={"proteome"}>
                <h5>Select Search Type</h5>
                <Radio value="proteome" onClick={this.idHandler}>
                  Whole Proteome
                </Radio>
                <Radio value="accession" onClick={this.idHandler}>
                  Provide Accessions
                </Radio>
              </Radio.Group>
            </div>
          )} */}
          <Divider />
        </div>
        {this.state.searchType === 'accession' && this.state.status !== 'gosim' && this.state.status !== 'phylo' && (
          <div className="row flex-lg-row align-items-center">

            <div className="col-md-3">
              <h5>Select IDs Type</h5>
              <Radio.Group name="radiogroup" defaultValue={"host"}>
                <Radio value="host" onChange={this.accessionHandler}>
                  Host
                </Radio>
                <Radio value="pathogen" onChange={this.accessionHandler}>
                  Pathogen
                </Radio>

              </Radio.Group>
            </div>

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
            <div className="col-md-1"><b>OR</b></div>
            <div className="col-md-3 mb-5">
              <h5 className="mt-5 pl-2"> Upload Protein IDs List</h5>

              <FileInput handler={this.fileSelected} />
            </div>
            <Divider />
          </div>

        )}
        {this.state.status === "interolog" &&
          this.state.status !== "domain" &&
          this.state.status !== "gosim" &&
          this.state.status !== "phylo" &&
          this.state.status !== "consensus" && (
            <div>
              <div className="row flex-lg-row justify-content-center ">
                <h5>
                  Select Interaction Databases{" "}
                  <InfoCircleOutlined onClick={this.ppiModalopen} />
                </h5>
                <div className="col-md-6">
                  <CheckboxGroup
                    options={interologOptions}
                    value={this.state.checkedList}
                    onChange={this.onChange}
                  />
                </div>
                <div className="col-md-2">
                  <Checkbox
                    onChange={this.onCheckAllChange}
                    checked={this.state.checkAll}
                  >
                    Check all
                  </Checkbox>
                </div>
                <Divider />
              </div>
              <div className="row flex-lg-row justify-content-center">
                <div className="col-md-6">
                  <div className="row flex-lg-row justify-content-center">
                    <h5>Host Alignment Filtering Options</h5>
                    <div className="col-sm-4">
                      <div className="form-inline">
                        <label className="label-text">Identity %</label>
                        <input
                          className="form-control"
                          type="text"
                          value={this.state.identity}
                          onChange={this.identityHandler}
                        ></input>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="form-inline">
                        <label className="label-text">Coverage %</label>
                        <input
                          className="form-control"
                          type="text"
                          value={this.state.coverage}
                          onChange={this.coverageHandler}
                        ></input>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="form-inline">
                        <label className="label-text">Evalue</label>
                        <input
                          className="form-control"
                          type="text"
                          value={this.state.evalue}
                          onChange={this.evalueHandler}
                        ></input>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row flex-lg-row justify-content-center">
                    <h5>Pathogen Alignment Filtering Options</h5>
                    <div className="col-sm-4">
                      <div className="form-inline">
                        <label className="label-text">Identity %</label>
                        <input
                          className="form-control"
                          type="text"
                          value={this.state.pidentity}
                          onChange={this.pidentityHandler}
                        ></input>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="form-inline">
                        <label className="label-text">Coverage %</label>
                        <input
                          className="form-control"
                          type="text"
                          value={this.state.pcoverage}
                          onChange={this.pcoverageHandler}
                        ></input>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="form-inline">
                        <label className="label-text">Evalue</label>
                        <input
                          className="form-control"
                          type="text"
                          value={this.state.pevalue}
                          onChange={this.pevalueHandler}
                        ></input>
                      </div>
                    </div>
                  </div>
                </div>
                <Divider />
              </div>

            </div>
          )}

        {this.state.status !== "interolog" &&
          this.state.status !== "gosim" &&
          this.state.status !== "phylo" &&
          this.state.status !== "consensus" && (
            <div>
              <div className="row flex-lg-row justify-content-center g-2 my-3">
                <h5>Select Domain Databases</h5>
                <div className="col-md-6">
                  <CheckboxGroup
                    options={domainOptions}
                    value={this.state.dcheckedList}
                    onChange={this.onChange2}
                  />
                </div>
                <div className="col-md-2">
                  <Checkbox
                    onChange={this.onCheckAllChange2}
                    checked={this.state.dcheckAll}
                  >
                    Check all
                  </Checkbox>
                </div>

                <Divider />
              </div>
            </div>
          )}

        {this.state.status !== "interolog" && this.state.status !== "domain" && this.state.status !== "gosim" && this.state.status !== "phylo" && (
          <div>
            <div className="row flex-lg-row justify-content-center">
              <h5>Select Interaction Databases</h5>
              <div className="col-md-6">
                <CheckboxGroup
                  options={interologOptions}
                  value={this.state.checkedList}
                  onChange={this.onChange}
                />
              </div>
              <div className="col-md-2">
                <Checkbox
                  onChange={this.onCheckAllChange}
                  checked={this.state.checkAll}
                >
                  Check all
                </Checkbox>
              </div>
              <Divider />
            </div>
            <div className="row flex-lg-row justify-content-center">
              <h5>Select Domain Databases</h5>
              <div className="col-md-6">
                <CheckboxGroup
                  options={domainOptions}
                  value={this.state.dcheckedList}
                  onChange={this.onChange2}
                />
              </div>
              <div className="col-md-2">
                <Checkbox
                  onChange={this.onCheckAllChange2}
                  checked={this.state.dcheckAll}
                >
                  Check all
                </Checkbox>
              </div>
              <Divider />
            </div>
            <div className="row flex-lg-row justify-content-center">
              <div className="col-md-6">
                <div className="row flex-lg-row justify-content-center">
                  <h5>Host Alignment Filtering Options</h5>
                  <div className="col-sm-4">
                    <div className="form-inline">
                      <label className="label-text">Identity %</label>
                      <input
                        className="form-control"
                        type="text"
                        value={this.state.identity}
                        onChange={this.identityHandler}
                      ></input>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-inline">
                      <label className="label-text">Coverage %</label>
                      <input
                        className="form-control"
                        type="text"
                        value={this.state.coverage}
                        onChange={this.coverageHandler}
                      ></input>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-inline">
                      <label className="label-text">Evalue</label>
                      <input
                        className="form-control"
                        type="text"
                        value={this.state.evalue}
                        onChange={this.evalueHandler}
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row flex-lg-row justify-content-center">
                  <h5>Pathogen Alignment Filtering Options</h5>
                  <div className="col-sm-4">
                    <div className="form-inline">
                      <label className="label-text">Identity %</label>
                      <input
                        className="form-control"
                        type="text"
                        value={this.state.pidentity}
                        onChange={this.pidentityHandler}
                      ></input>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-inline">
                      <label className="label-text">Coverage %</label>
                      <input
                        className="form-control"
                        type="text"
                        value={this.state.pcoverage}
                        onChange={this.pcoverageHandler}
                      ></input>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-inline">
                      <label className="label-text">Evalue</label>
                      <input
                        className="form-control"
                        type="text"
                        value={this.state.pevalue}
                        onChange={this.pevalueHandler}
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
              <Divider />
            </div>
          </div>
        )}
        {this.state.status !== "interolog" && this.state.status !== "domain" && this.state.status !== "consensus" && this.state.status !== "phylo" && (
          <div>
            <div className="row flex-lg-row justify-content-center g-2 my-3">

              <div className="col-md-4">

                <Radio.Group name="radiogroup" defaultValue={"wang"}>
                  <h5>Select GO Sem Similarity Method</h5>
                  <Radio value="wang" onClick={this.radioHandler}>
                    Wang
                  </Radio>
                  <Radio value="lowest_common_ancestor" onClick={this.goMethodradioHandler}>
                    LCA
                  </Radio>
                  <Radio value="resnik" onClick={this.goMethodradioHandler}>
                    Resnik
                  </Radio>
                  <Radio value="lin" onClick={this.goMethodradioHandler}>
                    Lin
                  </Radio>
                  <Radio value="pekar" onClick={this.goMethodradioHandler}>
                    Pekar
                  </Radio>

                </Radio.Group>

              </div>
              <div className="col-md-4">
                <Radio.Group name="radiogroup" defaultValue={"max"}>
                  <h5>Select GO Sem Similarity Scoring</h5>
                  <Radio value="bma" onClick={this.goScoreradioHandler}>
                    Best-match average
                  </Radio>
                  <Radio value="max" onClick={this.goScoreradioHandler}>
                    Maximum
                  </Radio>
                  <Radio value="avg" onClick={this.goScoreradioHandler}>
                    Average
                  </Radio>


                </Radio.Group>
              </div>
              <div className="col-md-3">
                <h5>Select Threshold (Min Similarity)</h5>
                <Slider defaultValue={50} marks={{ 0: '0', 100: '100' }} disabled={false} min={0} max={100} onChange={this.getValue} />
              </div>

              <Divider />

            </div>
            <div className="row flex-lg-row justify-content-center g-2 my-3">
              <div className="col-md-5">
                <h5>Enter Host Protein IDs</h5>
                <Form.Control className="kbl-form mb-4" as="textarea" rows={4} placeholder={genePlaceholder} onChange={this.handleHostGeneChange}
                  value={this.state.hgenes} onMouseEnter={() => this.setGeneHint(true)} onMouseLeave={() => this.setGeneHint(false)} spellCheck={false} />

              </div>
              <div className="col-md-5">
                <h5>Enter Pathogen Protein IDs</h5>
                <Form.Control className="kbl-form mb-4" as="textarea" rows={4} placeholder={genePlaceholder} onChange={this.handlePathogenGeneChange}
                  value={this.state.pgenes} onMouseEnter={() => this.setGeneHint(true)} onMouseLeave={() => this.setGeneHint(false)} spellCheck={false} />

              </div>
            </div>
            <div className="row flex-lg-row justify-content-center my-3">
              <div className="col-md-4">

                <Button className="kbl-btn-1 mx-3" onClick={e => {
                  this.setState({ pgenes: pathogenGeneSample });
                  this.setState({ hgenes: geneSample });
                }}>Sample Data</Button>
                <Button className="kbl-btn-2" onClick={e => {
                  this.setState({ pgenes: "" })
                  this.setState({ hgenes: "" })
                }}>Clear Data</Button>
              </div>

            </div>
            <Divider />
          </div>

        )}

        {this.state.status !== "interolog" &&
          this.state.status !== "domain" &&
          this.state.status !== "gosim" &&

          this.state.status !== "consensus" && (
            <div>
              <div className="row flex-lg-row justify-content-center">
                <div className="col-md-6">
                  <Radio.Group name="radiogroup" defaultValue={"UP82"}>
                    <h5>Select Genome Pool</h5>
                    <Radio value="UP82" onClick={this.pgHandler}>
                      UP82
                    </Radio>
                    <Radio value="BC18" onClick={this.pgHandler}>
                      BC18
                    </Radio>
                    <Radio value="protphylo490" onClick={this.pgHandler}>
                      ProtPhylo490
                    </Radio>
                  </Radio.Group>
                </div>
                <div className="col-md-4">

                  <h5>Threshold (Min Similarity)</h5>
                  <div className="form-inline">
                    {/* <label className="label-text">Identity %</label> */}
                    <input
                      className="form-control"
                      type="text"
                      value={this.state.phylothreshold}
                      onChange={this.phyloThresholdHandler}
                    ></input>
                  </div>

                </div>
              </div>
              <Divider />
              <div className="row flex-lg-row justify-content-center">
                <div className="col-md-6">
                  <div className="row flex-lg-row justify-content-center">
                    <h5>Host Alignment Filtering Options</h5>
                    <div className="col-sm-4">
                      <div className="form-inline">
                        <label className="label-text">Identity %</label>
                        <input
                          className="form-control"
                          type="text"
                          value={this.state.identity}
                          onChange={this.identityHandler}
                        ></input>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="form-inline">
                        <label className="label-text">Coverage %</label>
                        <input
                          className="form-control"
                          type="text"
                          value={this.state.coverage}
                          onChange={this.coverageHandler}
                        ></input>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="form-inline">
                        <label className="label-text">Evalue</label>
                        <input
                          className="form-control"
                          type="text"
                          value={this.state.evalue}
                          onChange={this.evalueHandler}
                        ></input>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row flex-lg-row justify-content-center">
                    <h5>Pathogen Alignment Filtering Options</h5>
                    <div className="col-sm-4">
                      <div className="form-inline">
                        <label className="label-text">Identity %</label>
                        <input
                          className="form-control"
                          type="text"
                          value={this.state.pidentity}
                          onChange={this.pidentityHandler}
                        ></input>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="form-inline">
                        <label className="label-text">Coverage %</label>
                        <input
                          className="form-control"
                          type="text"
                          value={this.state.pcoverage}
                          onChange={this.pcoverageHandler}
                        ></input>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="form-inline">
                        <label className="label-text">Evalue</label>
                        <input
                          className="form-control"
                          type="text"
                          value={this.state.pevalue}
                          onChange={this.pevalueHandler}
                        ></input>
                      </div>
                    </div>
                  </div>
                </div>
                <Divider />
              </div>
              <div className="row flex-lg-row justify-content-center g-2 my-3">
                <div className="col-md-5">
                  <h5>Enter Host Protein IDs</h5>
                  <Form.Control className="kbl-form mb-4" as="textarea" rows={4} placeholder={genePlaceholder} onChange={this.handleHostGeneChange}
                    value={this.state.hgenes} onMouseEnter={() => this.setGeneHint(true)} onMouseLeave={() => this.setGeneHint(false)} spellCheck={false} />

                </div>
                <div className="col-md-5">
                  <h5>Enter Pathogen Protein IDs</h5>
                  <Form.Control className="kbl-form mb-4" as="textarea" rows={4} placeholder={genePlaceholder} onChange={this.handlePathogenGeneChange}
                    value={this.state.pgenes} onMouseEnter={() => this.setGeneHint(true)} onMouseLeave={() => this.setGeneHint(false)} spellCheck={false} />

                </div>
              </div>
              <div className="row flex-lg-row justify-content-center my-3">
                <div className="col-md-4">

                  <Button className="kbl-btn-1 mx-3" onClick={e => {
                    this.setState({ pgenes: pathogenGeneSample });
                    this.setState({ hgenes: geneSample });
                  }}>Sample Data</Button>
                  <Button className="kbl-btn-2" onClick={e => {
                    this.setState({ pgenes: "" })
                    this.setState({ hgenes: "" })
                  }}>Clear Data</Button>
                </div>

              </div>
              <Divider />
            </div>


          )}

        <div className="row flex-lg-row justify-content-center g-2 my-3">
          {this.state.isOpen && (

            <div className="col-md-8">
              <h5 className="mb-3">Please wait your query is processing</h5>
              <img
                src={test}
                className="loading"
                height="50px"
                alt=""
              ></img>
            </div>
          )}
          {this.state.isOpen === false && (
            <div className="col-md-2">
              <Button
                type="primary"
                shape="square"
                size="large"
                onClick={this.getInteractions}
              >
                Show Interactions{" "}
              </Button>
            </div>
          )}
        </div>
        <Divider />
      </div>
    );
  }
}
