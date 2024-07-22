import React from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "./Results.scss";
import '../../scss/components/buttons.scss';
import '../../scss/style.scss'
import { Divider, Button } from "antd";
import { DownloadOutlined } from '@ant-design/icons';
import { env } from 'env';
import { downloadCsv } from "components/CSVDownload/CSVDownload";
// import ReactLoading from 'react-loading';
import { sorghum_genes } from "./sorghum";
import { foxtail_genes } from "./foxtail";
import { disease } from "pages/Hosts/disease";
import { data } from "../Annotation/data";
import test from "../Interactome/test.gif"
const urlParams = new URLSearchParams(window.location.search);

const tdata = urlParams.get("id");
// const tdata = 'hpinet1696211121764results'

const pdata = JSON.parse(localStorage.getItem("param"));
// console.log(pdata)
// const domsp = `${pdata.species}_${pdata.pathogen}`




let category;
let species;
let genes;
let dgenes;
let idt;
if (pdata) {

  category = pdata.category
  species = pdata.species
  idt = pdata.ids

  if (category === 'domain') {


    if (pdata.genes === '') {
      // console.log("yes")
      genes = []
    }
    if (pdata.genes !== '') {
      
      genes = pdata.genes.split(", ")

      dgenes = genes['0'].split(",")
      
    }

  }


  // console.log(typeof(genes))


}

function onlyNumbers(str) {
  return /^[0-9]+$/.test(str);
}


export default class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      List: [],
      dList: [],
      MasterChecked: false,
      SelectedList: [],
      offset: 0,
      perPage: 500,
      currentPage: 0,
      pageCount: 20,
      hostp: 0,
      pathogenp: 0,
      dResult: [],
      isOpen: false,
      species: species,
      domsp: '',
      category: category,
      idt: idt,
      genes: genes,
      dgenes:dgenes,
      resultid: tdata
    };
    this.handlePageClick = this.handlePageClick.bind(this);
    // this.handleChangeMotif = this.handleChangeMotif.bind(this);
    // this.downloadResults = this.downloadResults.bind(this)

  }

  openModel = () => this.setState({ isOpen: true, dList: [] });
  closeModel = () => this.setState({ isOpen: false });
 
  fetchResults() {
  
    // console.log(this.state.dgenes)
    if (category === 'domain') {
      const postBody = {
        species: `${pdata.species}_${pdata.pathogen}`,
        page: this.state.currentPage,
        size: this.state.perPage,
        genes: this.state.dgenes,
        idt: this.state.idt,
        intdb: pdata.domdb,
        keyword:pdata.keyword,
        searchType:pdata.searchType
  
      }
      // console.log(postBody)
      this.openModel();
      axios
        .post(
          `${env.BACKEND}/api/domain_results/`, postBody, { crossDomain: true }
        )
        .then((res) => {
          this.closeModel();
          const dList = res.data.results;
          
          const dl = Math.ceil(res.data.total / this.state.perPage);
          console.log(res.data)
          this.setState({
            dList,
            pageCount: dl,
            total: parseInt(res.data.total),
            hostp: res.data.hostcount,
            pathogenp: res.data.pathogencount,
            dResult: res.data.results,
            resultid: res.data.resultid
          });
        }).catch(e => {
          console.log(e);
        });
    }
    else {
      axios
        .get(
          `${env.BACKEND}/api/results/?results=${tdata}&category=${category}&page=${this.state.currentPage}&size=${this.state.perPage}`
        )
        .then((res) => {
          const List = res.data.results;
          const dl = Math.ceil(res.data.total / this.state.perPage);
          // console.log(res.data)
          this.setState({
            List,
            pageCount: dl,
            total: parseInt(res.data.total),
            hostp: res.data.hostcount,
            pathogenp: res.data.pathogencount,
            dResult: res.data.results
          });
        });
    }
  }

  // handleChangeMotif(event) {
  //   event.preventDefault();
  //   const select = event.target;
  //   const selectedOption = select.options[select.selectedIndex];
  //   const choice = selectedOption.value
  //   this.setState({
  //     perPage: choice,
  //     currentPage: 0,

  //   }, () => {
  //     this.fetchResults()
     
  // });


// }

  // downloadResults() {
   
  //   if (category === 'domain') {
    
  //     const postBody = {
  //       species: `${pdata.species}_${pdata.pathogen}`,
  //       page: this.state.currentPage,
  //       size: this.state.perPage,
  //       genes:this.state.dgenes,
  //       idt: this.state.idt,
  //       intdb: pdata.domdb,
  //       keyword:pdata.keyword,
  //       searchType:pdata.searchType
  
  //     }
  //     axios
  //       .post(
  //         `${env.BACKEND}/api/domain_download/`, postBody, { crossDomain: true }
  //       )
  //       .then((res) => {
  //         const dResult = res.data.results
  //         this.setState({ dResult })
  //         // console.log(dResult)
  //       })
  //   }
  //   else {
  //     axios
  //       .get(
  //         `${env.BACKEND}/api/download/?results=${tdata}`
  //       )
  //       .then((res) => {
  //         const dResult = res.data.results
  //         this.setState({ dResult })

  //       })
  //   }
  // }

  componentDidMount() {

    this.fetchResults();
    // this.downloadResults();


  }

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    // console.log(selectedPage)
    const offset = selectedPage * this.state.perPage;

    this.setState(
      {
        currentPage: selectedPage,
        offset: offset,
      },
      () => {
        this.fetchResults();
      }
    );
  };

  // Select/ UnSelect Table rows
  onMasterCheck(e) {
    let tempList = this.state.List;
    // Check/ UnCheck All Items
    tempList.map((user) => (user.selected = e.target.checked));

    //Update State
    this.setState({
      MasterChecked: e.target.checked,
      List: tempList,
      SelectedList: this.state.List.filter((e) => e.selected),
    });
  }

  // Update List Item's state and Master Checkbox State
  onItemCheck(e, item) {
    let tempList = this.state.List;
    tempList.map((user) => {
      if (user._id === item._id) {
        user.selected = e.target.checked;
      }
      return user;
    });

    //To Control Master Checkbox State
    const totalItems = this.state.List.length;
    const totalCheckedItems = tempList.filter((e) => e.selected).length;

    // Update State
    this.setState({
      MasterChecked: totalItems === totalCheckedItems,
      List: tempList,
      SelectedList: this.state.List.filter((e) => e.selected),
    });
  }

  // Event to get selected rows(Optional)
  getSelectedRows() {
    this.setState({
      SelectedList: this.state.List.filter((e) => e.selected),
    });
  }
  render() {
    let results;
    let ddata;
    let middle = '';
    if (tdata) {
      localStorage.setItem("resultid", JSON.stringify({
        ttdata: tdata,
      stype:pdata.category}))

      ddata = disease[`${pdata.species}_${pdata.pathogen}`]
      // console.log(ddata)
    }

    console.log(this.state)

    const csvButton = <Button type="primary" shape="round" icon={<DownloadOutlined />} size="large" onClick={() => downloadCsv(this.state.dResult, this.state.category)}> <b>Download CSV</b></Button>;

    if (this.state.List.length > 1 || this.state.dList.length > 1) {
      let st = this.state.offset + 1;
      let en;
      if (en > this.state.total) {
        en =  this.state.total;
      }
      else{
        en = this.state.offset + this.state.perPage;
      }
      console.log(this.state.resultid)
    
      middle = (
        <span>
          <div className="row flex-lg-row align-items-center g-2 my-2 mx-2">
            <div className="col-md-2">{csvButton}</div>
            <div className="col-md-8">
              <h5 style={{ fontSize: '16px' }}>
                Showing {st} to {en} of <b>{this.state.total}</b> interactions (Host Protein: {this.state.hostp} and Pathogen Protein: {this.state.pathogenp})
              </h5>
            </div>
            <div className="col-md-2">
              <a href={`${env.BASE_URL}/network/?resultid=${this.state.resultid}&rtype=${pdata.category}`} target="_blank" rel="noopener noreferrer">
                <Button type="primary" shape="round" size="large">
                  <b>Visualize Network</b>
                </Button>
              </a>
            </div>
          </div>
          <Divider />
        </span>
      );
    }

   
    
    
    if (this.state.List.length > 1) {

      results = (<>
          {middle}
        <Table responsive className="kbl-table table-borderless">
          <thead className="kbl-thead">
            <tr>
              {/* <th scope="col">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={this.state.MasterChecked}
                  id="mastercheck"
                  onChange={(e) => this.onMasterCheck(e)}
                />
              </th> */}
              {this.state.category === 'interolog' && (
                <>
                  <th>Host</th>
                  <th>Expression</th>
                  <th>Pathogen</th>
                  <th>Annotation</th>
                  <th>InteractorA</th>
                  <th>InteractorB</th>
                  <th>Source</th>
                  <th>Method</th>
                  <th>Type</th>
                  <th>Confidence</th>
                  <th>PMID</th>
                </>
              )}
              {this.state.category === 'domain' && (
                <>
                  <th>Host</th>
                  <th>Expression</th>
                  <th>Pathogen</th>
                  <th>Annotation</th>
                  <th>InteractorA</th>
                  <th>InteractorB</th>
                  <th>Source</th>
                  <th>InteractoA Name</th>
                  <th>InteractorA Interpro</th>
                  <th>InteractoB Name</th>
                  <th>InteractorB Interpro</th>
                  <th>Confidence</th>
                </>
              )}
              {this.state.category === 'gosim' && (
                <>
                  <th>Host</th>
                  <th>Expression</th>
                  <th>Pathogen</th>
                  <th>Annotation</th>
                  <th>Host GO Terms</th>
                  <th>Pathogen Go Terms</th>
                  <th>Score</th>

                </>
              )}
              {this.state.category === 'phylo' && (
                <>
                  <th>Host</th>
                  <th>Expression</th>
                  <th>Pathogen</th>
                  <th>Annotation</th>
                  <th>Score</th>
                  <th>Host Pattern</th>
                  <th>Pathogen Pattern</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {this.state.isOpen && (
              <tr>
                <td colSpan={6}></td>
                <td >
                  {/* <ReactLoading type={'spokes'} color={'#bff1de'} /> */}
                  <img
                src={test}
                className="loading"
                height="50px"
                alt=""
              ></img>
                </td>
              </tr>

            )}
            {this.state.List.map((result, index) => (
              <tr key={index + 1} className={result.selected ? "selected" : ""}>
             
                <td>
                  <a
                    href={`https://plants.ensembl.org/Multi/Search/Results?species=all;idx=;q=${result["Host_Protein"]};site=ensemblunit`}
                    target="_blank"
                    rel="noreferrer"
                    className="host"
                  >
                    {result["Host_Protein"]}
                  </a>
                </td>
                {pdata.species === 'Maize' && (<>

                  <td>
                    <a
                      href={`https://www.ebi.ac.uk/gxa/genes/${result["Host_Protein"].split("_")[0]}?bs={"zea mays"%3A["ORGANISM_PART"%2C"CULTIVAR"%2C"DEVELOPMENTAL_STAGE"%2C"SAMPLING_SITE"%2C"SAMPLING_TIME_POINT"]%2C"sorghum bicolor"%3A["ORGANISM_PART"%2C"CELL_TYPE"]}&ds={"kingdom"%3A["plants"]}#differential`}
                      target="_blank"
                      rel="noreferrer"
                      className="button"
                    >
                      <Button type="link" shape="round" size={'small'}>Exp Atlas</Button>
                    </a>
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/?term=${pdata.species}+AND+${ddata}+AND+expression`}
                      target="_blank"
                      rel="noreferrer"

                    >
                      <Button type="link" shape="round" size={'small'}>PubMed</Button>
                    </a>
                  </td>
                </>)}
                {pdata.species === 'Rice' && (<>

                  <td>
                    <a
                      href={`https://www.ebi.ac.uk/gxa/genes/${result["Host_Protein"].split("-")[0].replace('t', 'g')}?bs={"oryza sativa"%3A["ORGANISM_PART"%2C"CULTIVAR"%2C"DEVELOPMENTAL_STAGE"%2C"SAMPLING_SITE"%2C"SAMPLING_TIME_POINT"]%2C"sorghum bicolor"%3A["ORGANISM_PART"%2C"CELL_TYPE"]}&ds={"kingdom"%3A["plants"]}#differential`}
                      target="_blank"
                      rel="noreferrer"
                      className="host"
                    >
                      <Button type="link" shape="round" size={'small'}>Exp Atlas</Button>
                    </a>
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/?term=${pdata.species}+AND+${ddata}+AND+expression`}
                      target="_blank"
                      rel="noreferrer"

                    >
                      <Button type="link" shape="round" size={'small'}>PubMed</Button>
                    </a>
                  </td>
                </>)}
                {pdata.species === 'Sorghum' && (<>

                  <td>
                    <a
                      href={`https://www.ebi.ac.uk/gxa/genes/${sorghum_genes[result["Host_Protein"].split("-")[0]]}?bs={"Sorghum bicolor"%3A["ORGANISM_PART"%2C"CULTIVAR"%2C"DEVELOPMENTAL_STAGE"%2C"SAMPLING_SITE"%2C"SAMPLING_TIME_POINT"]%2C"sorghum bicolor"%3A["ORGANISM_PART"%2C"CELL_TYPE"]}&ds={"kingdom"%3A["plants"]}#differential`}
                      target="_blank"
                      rel="noreferrer"
                      className="host"
                    >
                      <Button type="link" shape="round" size={'small'}>Exp Atlas</Button>
                    </a>
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/?term=${pdata.species}+AND+${ddata}+AND+expression`}
                      target="_blank"
                      rel="noreferrer"

                    >
                      <Button type="link" shape="round" size={'small'}>PubMed</Button>
                    </a>
                  </td>
                </>)}
                {pdata.species === 'Foxtail' && (<>

                  <td>
                    <a
                      href={`https://www.ebi.ac.uk/gxa/genes/${foxtail_genes[result["Host_Protein"].split("-")[0]]}?bs={"Setaria italica"%3A["ORGANISM_PART"%2C"CULTIVAR"%2C"DEVELOPMENTAL_STAGE"%2C"SAMPLING_SITE"%2C"SAMPLING_TIME_POINT"]%2C"sorghum bicolor"%3A["ORGANISM_PART"%2C"CELL_TYPE"]}&ds={"kingdom"%3A["plants"]}#differential`}
                      target="_blank"
                      rel="noreferrer"
                      className="host"
                    >
                      <Button type="link" shape="round" size={'small'}>Exp Atlas</Button>
                    </a>
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/?term=${pdata.species}+AND+${ddata}+AND+expression`}
                      target="_blank"
                      rel="noreferrer"

                    >
                      <Button type="link" shape="round" size={'small'}>PubMed</Button>
                    </a>
                  </td>
                </>)}

                {pdata.species === 'Barley' && (<>

                  <td>
                    <a
                      href={`https://www.ebi.ac.uk/gxa/genes/${result["Host_Protein"].split(".")[0]}${result["Host_Protein"].split(".")[3].split("G")[0]}r1G${result["Host_Protein"].split(".")[3].split('G')[1]}?bs={"Hordeum vulgare"%3A["ORGANISM_PART"%2C"CULTIVAR"%2C"DEVELOPMENTAL_STAGE"%2C"SAMPLING_SITE"%2C"SAMPLING_TIME_POINT"]%2C"sorghum bicolor"%3A["ORGANISM_PART"%2C"CELL_TYPE"]}&ds={"kingdom"%3A["plants"]}#differential`}
                      target="_blank"
                      rel="noreferrer"
                      className="host"
                    >
                      <Button type="link" shape="round" size={'small'}>Exp Atlas</Button>
                    </a>
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/?term=${pdata.species}+AND+${ddata}+AND+expression`}
                      target="_blank"
                      rel="noreferrer"

                    >
                      <Button type="link" shape="round" size={'small'}>PubMed</Button>
                    </a>
                  </td>
                </>)}
                {pdata.species === 'Wheat' && (<>

                  <td>
                    <a
                      href={`http://wheat-expression.com/genes/show?gene_set=RefSeq1.1&name=${result["Host_Protein"].split(".")[0]}&search_by=gene`}
                      target="_blank"
                      rel="noreferrer"

                    >
                      <Button type="link" shape="round" size={'small'}>Exp Atlas</Button>
                    </a>
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/?term=${pdata.species}+AND+${ddata}+AND+expression`}
                      target="_blank"
                      rel="noreferrer"

                    >
                      <Button type="link" shape="round" size={'small'}>PubMed</Button>
                    </a>
                  </td>
                </>)}
                {pdata.species !== 'Wheat' && pdata.species !== 'Maize' && pdata.species !== 'Rice' && pdata.species !== 'Sorghum' && pdata.species !== 'Foxtail' && pdata.species !== 'Barley' && (

                  <>

                    <td>
                      <a
                        href={`https://plants.ensembl.org/Multi/Search/Results?species=all;idx=;q=${result["Host_Protein"]};site=ensemblunit`}
                        target="_blank"
                        rel="noreferrer"
                        className="host"
                      >
                        {result["Host_Protein"]}
                      </a>
                    </td>
                  </>)}
                <td>
                  <a
                    href={`https://www.ncbi.nlm.nih.gov/search/all/?term=${result["Pathogen_Protein"]}%09`}
                    target="_blank"
                    rel="noreferrer"
                    className="pathogen"
                  >
                    {result["Pathogen_Protein"]}
                  </a>
                </td>
                <td>
                <a
                      href={`${env.BASE_URL}/annotation/?host=${pdata.species}&pathogen=${pdata.pathogen}&hid=${result["Host_Protein"]}&pid=${result["Pathogen_Protein"]}`}
                      target="_blank"
                      rel="noreferrer"

                    >
                      <Button type="link" shape="round" size={'small'}>View</Button>
                    </a>
                </td>
                {this.state.category !== 'gosim' && this.state.category !=='phylo' && (
                  <>
                    <td>
                      {/* {console.log(result["ProteinA"])} */}

                      {(() => {
                        if (onlyNumbers(result['ProteinA'])) {
                          return (
                            <a
                              href={` https://www.ncbi.nlm.nih.gov/protein/${result["ProteinA"]}`}
                              target="_blank"
                              rel="noreferrer"
                              className="interactor"
                            >
                              {result["ProteinA"]}
                              {/* {console.log(result["ProteinA"])} */}
                            </a>
                          )
                        }
                        else {
                          return (
                            <a
                              href={` https://www.uniprot.org/uniprot/${result["ProteinA"]}`}
                              target="_blank"
                              rel="noreferrer"
                              className="interactor"
                            >
                              {result["ProteinA"]}

                            </a>
                          )
                        }


                      })()}


                    </td>
                    <td>
                      {(() => {
                        if (onlyNumbers(result['ProteinB'])) {
                          return (
                            <a
                              href={` https://www.ncbi.nlm.nih.gov/protein/${result["ProteinB"]}`}
                              target="_blank"
                              rel="noreferrer"
                              className="interactor"
                            >
                              {result["ProteinB"]}

                            </a>
                          )
                        }
                        else {
                          return (
                            <a
                              href={` https://www.uniprot.org/uniprot/${result["ProteinB"]}`}
                              target="_blank"
                              rel="noreferrer"
                              className="interactor"
                            >
                              {result["ProteinB"]}

                            </a>
                          )
                        }


                      })()}
                    </td>
                  </>)}
                {this.state.category === 'interolog' && (
                  <>
                    <td>{result["intdb_x"]}</td>
                    <td>{result["Method"]}</td>
                    <td>{result["Type"]}</td>
                    <td>{result["Confidence"]}</td>
                    <td>
                    {(() => {
                        if (onlyNumbers(result['PMID'])) {
                          return (
                            <a
                              href={` https://pubmed.ncbi.nlm.nih.gov/${result["PMID"]}/`}
                              target="_blank"
                              rel="noreferrer"
                              className="interactor"
                            >
                      {result["PMID"]}
                      </a>
                    )}
                        else{
                       return(
                        <>
                         {result["PMID"]}
                        </>
                       )
                           
                          
                        }
                      })()}
                      </td>
                  </>
                )}
                {this.state.category === 'domain' && (
                  <>
                    <td>{result["intdb"]}</td>
                    <td>{result["DomainA_name"]}</td>
                    <td>{result["DomainA_interpro"]}</td>
                    <td>{result["DomainB_name"]}</td>
                    <td>{result["DomainB_interpro"]}</td>
                    <td>{result["Score"]}</td>
                  </>
                )}
                {this.state.category === 'gosim' && (
                  <>
                    <td>{result["Host_GO"]}</td>
                    <td>{result["Pathogen_GO"]}</td>
                    <td>{result["Score"] * 100}</td>
                  </>
                )}
                {this.state.category === 'phylo' && (
                  <>
                    <td>{parseFloat(result["Score"]).toFixed(2)}</td>
                    <td className="tdd">{result["Host_Pattern"].match(/.{1,10}/g)}</td>
                    <td>{result["Pathogen_Pattern"]}</td>
                  </>
                )}


              </tr>
            ))}
          </tbody>
        </Table>
        <Divider />

        <ReactPaginate
          forcePage={this.state.currentPage}
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={this.state.pageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          onPageChange={this.handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
          ellipsisItem={null}
        />
      </>)
    }
    else {
      results = (
        <>
          <h5> No interactions found on based on these parameters. Try modifying your search parameters.</h5>
        </>
      )
    }

    return (
      <div className="container">
        {this.state.category === 'interolog' && (
          <>
            <Divider />
            <div className="row flex-lg-row align-items-center ">
              <h5> <b>Host:</b> <i>{data[pdata.species]}</i> ({pdata.species})&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; <b>Pathogen:</b> <i>{data[pdata.pathogen]}</i>&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;<b>Method:</b>  Interolog</h5>
              <Divider />
              <div className="col-md-2">
                <b>Parameters:</b>
              </div>
              <div className="col-md-5">
                <div className="row mx-4">
                  <div className="col-md-2 heading2">
                    <b>Host:</b>
                  </div>
                  <div className="col-md-10">
                    <p className="heading2">
                      {" "}
                      Evalue:&nbsp; {pdata.he}&nbsp; &nbsp; Identity:&nbsp;{" "}
                      {pdata.hi} &nbsp; &nbsp; Coverage:&nbsp; {pdata.hc}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-5">
                <div className="row mx-4">
                  <div className="col-md-2 heading2">
                    <b>Pathogen:</b>
                  </div>
                  <div className="col-md-10">
                    <p className="heading2">
                      {" "}
                      evalue:&nbsp; {pdata.pe}&nbsp; &nbsp; identity:&nbsp;{" "}
                      {pdata.pi} &nbsp; &nbsp; coverage:&nbsp; {pdata.pc}
                    </p>
                  </div>
                </div>
              </div>

              <Divider />
            </div>
            {results}
          </>
        )}
        {this.state.category === 'gosim' && (
          <>
            <Divider />
            <div className="row flex-lg-row align-items-center ">
              <h5> <b>Host:</b> <i>{data[pdata.species]}</i> ({pdata.species})&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; <b>Pathogen:</b> <i>{data[pdata.pathogen]}</i>&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;<b>Method:</b>  Gene Ontology Sementic Similarity </h5>
              <Divider />
              <div className="col-md-3">
                <b>Parameters:</b>
              </div>
              <div className="col-md-3">
                <b>Method:</b>&nbsp;&nbsp;{pdata.gomethod}
              </div>
              <div className="col-md-3">
                <b>Scoring:</b>&nbsp;&nbsp;{pdata.goscore}
              </div>
              <div className="col-md-3">
                <b>Score Threashold:</b>&nbsp;&nbsp;{pdata.gothreshold}
              </div>
              <Divider/>
            </div>
           
            {results}
          </>

        )}
         {this.state.category === 'phylo' && (
          <>
            <Divider />
            <div className="row flex-lg-row align-items-center ">
              <h5> <b>Host:</b> <i>{data[pdata.species]}</i> ({pdata.species})&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; <b>Pathogen:</b> <i>{data[pdata.pathogen]}</i>&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;<b>Method:</b>  Phylogenetic Profiling</h5>
              <Divider />
              <div className="col-md-2">
                <b>Parameters:</b>
              </div>
              <div className="col-md-5">
                <div className="row mx-4">
                  <div className="col-md-2 heading2">
                    <b>Host:</b>
                  </div>
                  <div className="col-md-10">
                    <p className="heading2">
                      {" "}
                      Evalue:&nbsp; {pdata.he}&nbsp; &nbsp; Identity:&nbsp;{" "}
                      {pdata.hi} &nbsp; &nbsp; Coverage:&nbsp; {pdata.hc}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-5">
                <div className="row mx-4">
                  <div className="col-md-2 heading2">
                    <b>Pathogen:</b>
                  </div>
                  <div className="col-md-10">
                    <p className="heading2">
                      {" "}
                      evalue:&nbsp; {pdata.pe}&nbsp; &nbsp; identity:&nbsp;{" "}
                      {pdata.pi} &nbsp; &nbsp; coverage:&nbsp; {pdata.pc}
                    </p>
                  </div>
                </div>
              </div>

              <Divider />
            </div>
            {results}
          </>

        )}

        {this.state.category === 'domain' && (

          <>
            <Divider />
            <div className="row flex-lg-row align-items-center ">
              <h5> <b>Host:</b> <i>{data[pdata.species]}</i> ({pdata.species})&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; <b>Pathogen:</b> <i>{data[pdata.pathogen]}</i></h5>

              <Divider />
              <p className="heading2"> Your selected domain databases: &nbsp;{pdata.domdb.toString()}</p>
            </div>

            {middle}
          
            <Table responsive className="kbl-table table-borderless">
              <thead className="kbl-thead">
                <tr>
                 
                  <th>Host</th>
                  <th>Expression</th>
                  <th>Pathogen</th>
                  <th>Annotation</th>
                  <th>InteractorA</th>
                  <th>InteractorB</th>
                  <th>Interaction Source</th>
                  <th>InteractoA Name</th>
                  <th>InteractorA Interpro</th>
                  <th>InteractoB Name</th>
                  <th>InteractorB Interpro</th>
                  <th>Confidence</th>

                </tr>
              </thead>
              <tbody>
                {this.state.isOpen && (
                  <>
                    <tr>
                      <td colSpan={6}></td>
                      <td >
                        {/* <ReactLoading type={'spokes'} color={'#bff1de'} /> */}
                        <img
                src={test}
                className="loading"
                height="50px"
                alt=""
              ></img>
                      </td>
                    </tr>
                  </>
                )}

                {this.state.dList.map((result, index) => (
                  <tr key={index + 1} className={result.selected ? "selected" : ""}>
              

                <td>
                  <a
                    href={`https://plants.ensembl.org/Multi/Search/Results?species=all;idx=;q=${result["Host_Protein"]};site=ensemblunit`}
                    target="_blank"
                    rel="noreferrer"
                    className="host"
                  >
                    {result["Host_Protein"]}
                  </a>
                </td>
                {pdata.species === 'Maize' && (<>

                  <td>
                    <a
                      href={`https://www.ebi.ac.uk/gxa/genes/${result["Host_Protein"].split("_")[0]}?bs={"zea mays"%3A["ORGANISM_PART"%2C"CULTIVAR"%2C"DEVELOPMENTAL_STAGE"%2C"SAMPLING_SITE"%2C"SAMPLING_TIME_POINT"]%2C"sorghum bicolor"%3A["ORGANISM_PART"%2C"CELL_TYPE"]}&ds={"kingdom"%3A["plants"]}#differential`}
                      target="_blank"
                      rel="noreferrer"
                      className="button"
                    >
                      <Button type="link" shape="round" size={'small'}>Exp Atlas</Button>
                    </a>
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/?term=${pdata.species}+AND+${ddata}+AND+expression`}
                      target="_blank"
                      rel="noreferrer"

                    >
                      <Button type="link" shape="round" size={'small'}>PubMed</Button>
                    </a>
                  </td>
                </>)}
                {pdata.species === 'Rice' && (<>

                  <td>
                    <a
                      href={`https://www.ebi.ac.uk/gxa/genes/${result["Host_Protein"].split("-")[0].replace('t', 'g')}?bs={"oryza sativa"%3A["ORGANISM_PART"%2C"CULTIVAR"%2C"DEVELOPMENTAL_STAGE"%2C"SAMPLING_SITE"%2C"SAMPLING_TIME_POINT"]%2C"sorghum bicolor"%3A["ORGANISM_PART"%2C"CELL_TYPE"]}&ds={"kingdom"%3A["plants"]}#differential`}
                      target="_blank"
                      rel="noreferrer"
                      className="host"
                    >
                      <Button type="link" shape="round" size={'small'}>Exp Atlas</Button>
                    </a>
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/?term=${pdata.species}+AND+${ddata}+AND+expression`}
                      target="_blank"
                      rel="noreferrer"

                    >
                      <Button type="link" shape="round" size={'small'}>PubMed</Button>
                    </a>
                  </td>
                </>)}
                {pdata.species === 'Sorghum' && (<>

                  <td>
                    <a
                      href={`https://www.ebi.ac.uk/gxa/genes/${sorghum_genes[result["Host_Protein"].split("-")[0]]}?bs={"Sorghum bicolor"%3A["ORGANISM_PART"%2C"CULTIVAR"%2C"DEVELOPMENTAL_STAGE"%2C"SAMPLING_SITE"%2C"SAMPLING_TIME_POINT"]%2C"sorghum bicolor"%3A["ORGANISM_PART"%2C"CELL_TYPE"]}&ds={"kingdom"%3A["plants"]}#differential`}
                      target="_blank"
                      rel="noreferrer"
                      className="host"
                    >
                      <Button type="link" shape="round" size={'small'}>Exp Atlas</Button>
                    </a>
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/?term=${pdata.species}+AND+${ddata}+AND+expression`}
                      target="_blank"
                      rel="noreferrer"

                    >
                      <Button type="link" shape="round" size={'small'}>PubMed</Button>
                    </a>
                  </td>
                </>)}
                {pdata.species === 'Foxtail' && (<>

                  <td>
                    <a
                      href={`https://www.ebi.ac.uk/gxa/genes/${foxtail_genes[result["Host_Protein"].split("-")[0]]}?bs={"Setaria italica"%3A["ORGANISM_PART"%2C"CULTIVAR"%2C"DEVELOPMENTAL_STAGE"%2C"SAMPLING_SITE"%2C"SAMPLING_TIME_POINT"]%2C"sorghum bicolor"%3A["ORGANISM_PART"%2C"CELL_TYPE"]}&ds={"kingdom"%3A["plants"]}#differential`}
                      target="_blank"
                      rel="noreferrer"
                      className="host"
                    >
                      <Button type="link" shape="round" size={'small'}>Exp Atlas</Button>
                    </a>
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/?term=${pdata.species}+AND+${ddata}+AND+expression`}
                      target="_blank"
                      rel="noreferrer"

                    >
                      <Button type="link" shape="round" size={'small'}>PubMed</Button>
                    </a>
                  </td>
                </>)}

                {pdata.species === 'Barley' && (<>

                  <td>
                    <a
                      href={`https://www.ebi.ac.uk/gxa/genes/${result["Host_Protein"].split(".")[0]}${result["Host_Protein"].split(".")[3].split("G")[0]}r1G${result["Host_Protein"].split(".")[3].split('G')[1]}?bs={"Hordeum vulgare"%3A["ORGANISM_PART"%2C"CULTIVAR"%2C"DEVELOPMENTAL_STAGE"%2C"SAMPLING_SITE"%2C"SAMPLING_TIME_POINT"]%2C"sorghum bicolor"%3A["ORGANISM_PART"%2C"CELL_TYPE"]}&ds={"kingdom"%3A["plants"]}#differential`}
                      target="_blank"
                      rel="noreferrer"
                      className="host"
                    >
                      <Button type="link" shape="round" size={'small'}>Exp Atlas</Button>
                    </a>
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/?term=${pdata.species}+AND+${ddata}+AND+expression`}
                      target="_blank"
                      rel="noreferrer"

                    >
                      <Button type="link" shape="round" size={'small'}>PubMed</Button>
                    </a>
                  </td>
                </>)}
                {pdata.species === 'Wheat' && (<>

                  <td>
                    <a
                      href={`http://wheat-expression.com/genes/show?gene_set=RefSeq1.1&name=${result["Host_Protein"].split(".")[0]}&search_by=gene`}
                      target="_blank"
                      rel="noreferrer"

                    >
                      <Button type="link" shape="round" size={'small'}>Exp Atlas</Button>
                    </a>
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/?term=${pdata.species}+AND+${ddata}+AND+expression`}
                      target="_blank"
                      rel="noreferrer"

                    >
                      <Button type="link" shape="round" size={'small'}>PubMed</Button>
                    </a>
                  </td>
                </>)}
                {pdata.species !== 'Wheat' && pdata.species !== 'Maize' && pdata.species !== 'Rice' && pdata.species !== 'Sorghum' && pdata.species !== 'Foxtail' && pdata.species !== 'Barley' && (

                  <>

                    <td>
                      <a
                        href={`https://plants.ensembl.org/Multi/Search/Results?species=all;idx=;q=${result["Host_Protein"]};site=ensemblunit`}
                        target="_blank"
                        rel="noreferrer"
                        className="host"
                      >
                        {result["Host_Protein"]}
                      </a>
                    </td>
                  </>)}
                <td>
                      <a
                        href={`https://www.ncbi.nlm.nih.gov/search/all/?term=${result["Pathogen_Protein"]}%09`}
                        target="_blank"
                        rel="noreferrer"
                        className="pathogen"
                      >
                        {result["Pathogen_Protein"]}
                      </a>
                    </td>

                    <td>
                <a
                      href={`${env.BASE_URL}/annotation/?host=${pdata.species}&pathogen=${pdata.pathogen}&hid=${result["Host_Protein"]}&pid=${result["Pathogen_Protein"]}`}
                      target="_blank"
                      rel="noreferrer"

                    >
                      <Button type="link" shape="round" size={'small'}>View</Button>
                    </a>
                </td>

                    <td>
                      <a
                        href={` https://www.uniprot.org/uniprot/${result["ProteinA"]}`}
                        target="_blank"
                        rel="noreferrer"
                        className="interactor"
                      >
                        {result["ProteinA"]}
                      </a>
                    </td>
                    <td>
                      <a
                        href={` https://www.uniprot.org/uniprot/${result["ProteinB"]}`}
                        target="_blank"
                        rel="noreferrer"
                        className="interactor"
                      >
                        {result["ProteinB"]}
                      </a>
                    </td>

                    <td>{result["intdb"]}</td>
                    <td>{result["DomainA_name"]}</td>
                    <td>{result["DomainA_interpro"]}</td>
                    <td>{result["DomainB_name"]}</td>
                    <td>{result["DomainB_interpro"]}</td>
                    <td>{result["Score"]}</td>

                  </tr>
                ))}
              </tbody>
            </Table>

            <ReactPaginate
              forcePage={this.state.currentPage}
              previousLabel={"<"}
              nextLabel={">"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={this.state.pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={3}
              onPageChange={this.handlePageClick}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
              ellipsisItem={null}
            />
          </>)}

      </div>
    );
  }
}
