import React from "react";
import {Table} from "react-bootstrap";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "./Results.scss";
import '../../scss/components/buttons.scss';
import '../../scss/style.scss'
import { Divider, Button } from "antd";
import { env } from 'env';
import { downloadCsv } from "components/CSVDownload/CSVDownload";
import ReactLoading from 'react-loading';
import { sorghum_genes } from "./sorghum";
import { foxtail_genes } from "./foxtail";
import { disease } from "pages/Plant/disease";

const urlParams = new URLSearchParams(window.location.search);

const tdata = urlParams.get("id");
// const tdata = 'hpinet1696211121764results'

const pdata = JSON.parse(localStorage.getItem("param"));
// console.log(pdata)
// const domsp = `${pdata.species}_${pdata.pathogen}`




let category;
let species;
let genes;
let idt;
if (pdata){

  category = pdata.category
  species = pdata.species
  idt = pdata.ids

  if (category==='domain'){

  
  if (pdata.genes ===''){
    console.log("yes")
    genes = []
  }
  if (pdata.genes !==''){
      genes = pdata.genes.split(", ")
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
      dList : [],
      MasterChecked: false,
      SelectedList: [],
      offset: 0,
      perPage: 25,
      currentPage: 0,
      pageCount: 20,
      hostp: 0,
      pathogenp: 0,
      dResult:[],
      isOpen:false,
      species:species,
      domsp:'',
      category:category,
      idt:idt,
      genes:genes,
    };
    this.handlePageClick = this.handlePageClick.bind(this);
    this.downloadResults = this.downloadResults.bind(this)
   
  }

  openModel = () => this.setState({ isOpen: true, dList:[]});
  closeModel = () => this.setState({ isOpen: false });
  
    fetchResults() {
    const postBody = {
      species:`${pdata.species}_${pdata.pathogen}`,
      page:this.state.currentPage,
      size: this.state.perPage,
      genes: this.state.genes,
      idt: this.state.idt,
      intdb:pdata.domdb,
      
    }
    // console.log(postBody)
    if (category === 'domain'){
      // console.log(this.state.genes)
      this.openModel();
      axios
      .post(
        `${env.BACKEND}/api/domain_results/`, postBody, { crossDomain: true }
      )
      .then((res) => {
        this.closeModel();
        const dList = res.data.results;
        const dl = Math.ceil(res.data.total / this.state.perPage);
        console.log(res.data.results)
        this.setState({
          dList,
          pageCount: dl,
          total: parseInt(res.data.total),
          hostp: res.data.hostcount,
          pathogenp: res.data.pathogencount,
        });
      }).catch(e => {
        console.log(e);
    });
    }
    else{
     axios
      .get(
        `${env.BACKEND}/api/results/?results=${tdata}&category=${category}&page=${this.state.currentPage}&size=${this.state.perPage}`
      )
      .then((res) => {
        const List = res.data.results;
        const dl = Math.ceil(res.data.total / this.state.perPage);
        console.log(res.data.total)
        this.setState({
          List,
          pageCount: dl,
          total: parseInt(res.data.total),
          hostp: res.data.hostcount,
          pathogenp: res.data.pathogencount,
        });
      });
    }
  }

  downloadResults(){
    if (category ==='domain'){
      const species =`${pdata.species}_${pdata.pathogen}`
      axios
      .get(
        `${env.BACKEND}/api/domain_download/?species=${species}&intdb=${pdata.domdb}`
      )
      .then((res) => {
        const dResult = res.data.results 
        this.setState({dResult})
        console.log(dResult)
      })
    }
    else{
    axios
      .get(
        `${env.BACKEND}/api/download/?results=${tdata}`
      )
      .then((res) => {
        const dResult = res.data.results 
        this.setState({dResult})
       
      })
    }
  }

  componentDidMount() {
    
    this.fetchResults();
    this.downloadResults();
    
    
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
    if (tdata){
      localStorage.setItem("resultid", JSON.stringify(tdata))

      ddata = disease[`${pdata.species}_${pdata.pathogen}`]
      console.log(ddata)
    }
    const csvButton = <Button type="primary" shape="round" size="large" onClick={() => downloadCsv(this.state.dResult, this.state.category)}> Download CSV</Button>;
    if (this.state.List.length>1){
      
      results = ( <><div className="row flex-lg-row align-items-center g-2 my-2 mx-2">
      <div className="col-md-2">

        {csvButton}
      </div>
      <div className="col-md-8">
        <h5>
          Showing {this.state.offset + 1} to {this.state.offset + 25} of <b>{this.state.total}</b> interactions (Host Protein: {this.state.hostp} and Pathogen Protein: {this.state.pathogenp})
        </h5>
      </div>
      <div className="col-md-2">
        <a href={`${env.BASE_URL}/network`} target="_blank"
        rel="noopener noreferrer"><Button type="primary" shape="round" size="large">
          <b>Visualize Network</b>
        </Button></a>
      </div>
    </div>

    <Table responsive className="kbl-table table-borderless">
      <thead className="kbl-thead">
        <tr>
          <th scope="col">
            <input
              type="checkbox"
              className="form-check-input"
              checked={this.state.MasterChecked}
              id="mastercheck"
              onChange={(e) => this.onMasterCheck(e)}
            />
          </th>
          {this.state.category ==='interolog' && (
          <>
          <th>Host</th>
          <th>Expression</th>
          <th>Pathogen</th>
          <th>InteractorA</th>
          <th>InteractorB</th>
          <th>Source</th>
          <th>Method</th>
          <th>Type</th>
          <th>Confidence</th>
          <th>PMID</th>
          </>
)}
        {this.state.category ==='domain' && (
          <>
          <th>Host</th>
          <th>Expression</th>
          <th>Pathogen</th>
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
 {this.state.category ==='gosim' && (
          <>
          <th>Host</th>
          <th>Expression</th>
          <th>Pathogen</th>
          <th>Host GO Terms</th>
          <th>Pathogen Go Terms</th>
          <th>Score</th>
        
          </>
)}
        </tr>
      </thead>
      <tbody>
        {this.state.isOpen && (
          <tr>
            <td colSpan={6}></td>
            <td >
            <ReactLoading type={'spokes'} color={'#bff1de'}/>
            </td>
          </tr>
         
        )}
        
        {this.state.List.map((result, index) => (
          <tr key={index + 1} className={result.selected ? "selected" : ""}>
            <td>
              <input
                type="checkbox"
                checked={result.selected}
                className="form-check-input"
                id={result._id}
                onChange={(e) => this.onItemCheck(e, result)}
              />
         
            </td>
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
{pdata.species==='Maize' &&(<>

  <td>
              <a
                href={`https://www.ebi.ac.uk/gxa/genes/${result["Host_Protein"].split("_")[0]}?bs={"zea mays"%3A["ORGANISM_PART"%2C"CULTIVAR"%2C"DEVELOPMENTAL_STAGE"%2C"SAMPLING_SITE"%2C"SAMPLING_TIME_POINT"]%2C"sorghum bicolor"%3A["ORGANISM_PART"%2C"CELL_TYPE"]}&ds={"kingdom"%3A["plants"]}#differential`}
                target="_blank"
                rel="noreferrer"
                className="button"
              >
 <Button type="primary" shape="round"  size={'small'}>exp</Button>
            </a>
            <a
              href={`https://pubmed.ncbi.nlm.nih.gov/?term=${pdata.species}+AND+${ddata}+AND+expression`}
              target="_blank"
              rel="noreferrer"
            
            >
  <Button type="primary" shape="round"  size={'small'}>pubmed</Button>
            </a>
            </td>
</>)}
{pdata.species==='Rice' &&(<>

<td>
            <a
              href={`https://www.ebi.ac.uk/gxa/genes/${result["Host_Protein"].split("-")[0].replace('t', 'g')}?bs={"oryza sativa"%3A["ORGANISM_PART"%2C"CULTIVAR"%2C"DEVELOPMENTAL_STAGE"%2C"SAMPLING_SITE"%2C"SAMPLING_TIME_POINT"]%2C"sorghum bicolor"%3A["ORGANISM_PART"%2C"CELL_TYPE"]}&ds={"kingdom"%3A["plants"]}#differential`}
              target="_blank"
              rel="noreferrer"
              className="host"
            >
 <Button type="primary" shape="round"  size={'small'}>exp</Button>
            </a>
            <a
              href={`https://pubmed.ncbi.nlm.nih.gov/?term=${pdata.species}+AND+${ddata}+AND+expression`}
              target="_blank"
              rel="noreferrer"
            
            >
  <Button type="primary" shape="round"  size={'small'}>pubmed</Button>
            </a>
          </td>
</>)}
{pdata.species==='Sorghum' &&(<>

<td>
            <a
              href={`https://www.ebi.ac.uk/gxa/genes/${sorghum_genes[result["Host_Protein"].split("-")[0]]}?bs={"Sorghum bicolor"%3A["ORGANISM_PART"%2C"CULTIVAR"%2C"DEVELOPMENTAL_STAGE"%2C"SAMPLING_SITE"%2C"SAMPLING_TIME_POINT"]%2C"sorghum bicolor"%3A["ORGANISM_PART"%2C"CELL_TYPE"]}&ds={"kingdom"%3A["plants"]}#differential`}
              target="_blank"
              rel="noreferrer"
              className="host"
            >
 <Button type="primary" shape="round"  size={'small'}>exp</Button>
            </a>
            <a
              href={`https://pubmed.ncbi.nlm.nih.gov/?term=${pdata.species}+AND+${ddata}+AND+expression`}
              target="_blank"
              rel="noreferrer"
            
            >
  <Button type="primary" shape="round"  size={'small'}>pubmed</Button>
            </a>
          </td>
</>)}
{pdata.species==='Foxtail' &&(<>

<td>
            <a
              href={`https://www.ebi.ac.uk/gxa/genes/${foxtail_genes[result["Host_Protein"].split("-")[0]]}?bs={"Setaria italica"%3A["ORGANISM_PART"%2C"CULTIVAR"%2C"DEVELOPMENTAL_STAGE"%2C"SAMPLING_SITE"%2C"SAMPLING_TIME_POINT"]%2C"sorghum bicolor"%3A["ORGANISM_PART"%2C"CELL_TYPE"]}&ds={"kingdom"%3A["plants"]}#differential`}
              target="_blank"
              rel="noreferrer"
              className="host"
            >
 <Button type="primary" shape="round"  size={'small'}>exp</Button>
            </a>
            <a
              href={`https://pubmed.ncbi.nlm.nih.gov/?term=${pdata.species}+AND+${ddata}+AND+expression`}
              target="_blank"
              rel="noreferrer"
            
            >
  <Button type="primary" shape="round"  size={'small'}>pubmed</Button>
            </a>
          </td>
</>)}

{pdata.species==='Barley' &&(<>

<td>
            <a
              href={`https://www.ebi.ac.uk/gxa/genes/${result["Host_Protein"].split(".")[0]}${result["Host_Protein"].split(".")[3].split("G")[0]}r1G${result["Host_Protein"].split(".")[3].split('G')[1]}?bs={"Hordeum vulgare"%3A["ORGANISM_PART"%2C"CULTIVAR"%2C"DEVELOPMENTAL_STAGE"%2C"SAMPLING_SITE"%2C"SAMPLING_TIME_POINT"]%2C"sorghum bicolor"%3A["ORGANISM_PART"%2C"CELL_TYPE"]}&ds={"kingdom"%3A["plants"]}#differential`}
              target="_blank"
              rel="noreferrer"
              className="host"
            >
 <Button type="primary" shape="round"  size={'small'}>exp</Button>
            </a>
            <a
              href={`https://pubmed.ncbi.nlm.nih.gov/?term=${pdata.species}+AND+${ddata}+AND+expression`}
              target="_blank"
              rel="noreferrer"
            
            >
  <Button type="primary" shape="round"  size={'small'}>pubmed</Button>
            </a>
          </td>
</>)}
{pdata.species==='Wheat' &&(<>

<td>
            <a
              href={`http://wheat-expression.com/genes/show?gene_set=RefSeq1.1&name=${result["Host_Protein"].split(".")[0]}&search_by=gene`}
              target="_blank"
              rel="noreferrer"
            
            >
  <Button type="primary" shape="round"  size={'small'}>exp</Button>
            </a>
            <a
              href={`https://pubmed.ncbi.nlm.nih.gov/?term=${pdata.species}+AND+${ddata}+AND+expression`}
              target="_blank"
              rel="noreferrer"
            
            >
  <Button type="primary" shape="round"  size={'small'}>pubmed</Button>
            </a>
          </td>
</>)}
{pdata.species!=='Wheat' && pdata.species!=='Maize' && pdata.species!=='Rice' && pdata.species!=='Sorghum' && pdata.species!=='Foxtail' && pdata.species!=='Barley' &&(

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
{this.state.category !=='gosim' && (
  <>
            <td>
            {console.log(result["ProteinA"])}

            {(() => {
              if (onlyNumbers(result['ProteinA'])){
                  return (
                    <a
                    href={` https://www.ncbi.nlm.nih.gov/protein/${result["ProteinA"]}`}
                    target="_blank"
                    rel="noreferrer"
                    className="interactor"
                  >
                  {result["ProteinA"]}
                    {console.log(result["ProteinA"])}
                  </a>
                  )
              }
              else {
                return(
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
              if (onlyNumbers(result['ProteinB'])){
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
              else{
                return(
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
             </> )}
     {this.state.category==='interolog' &&(
       <>
            <td>{result["intdb_x"]}</td>
            <td>{result["Method"]}</td>
            <td>{result["Type"]}</td>
            <td>{result["Confidence"]}</td>
            <td>{result["PMID"]}</td>
            </>
     )}
              {this.state.category==='domain' &&(
       <>
            <td>{result["intdb"]}</td>
            <td>{result["DomainA_name"]}</td>
            <td>{result["DomainA_interpro"]}</td>
            <td>{result["DomainB_name"]}</td>
            <td>{result["DomainB_interpro"]}</td>
            <td>{result["Score"]}</td>
            </>
     )}
      {this.state.category==='gosim' &&(
       <>
            <td>{result["Host_GO"]}</td>
            <td>{result["Pathogen_GO"]}</td>
            <td>{result["Score"]*100}</td>
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
       {this.state.category ==='interolog' && (
         <>
        <Divider />
        <div className="row flex-lg-row align-items-center ">
          <p className="heading2"> Your Selected Search Parameters are:</p>
          <div className="col-md-6">
            <div className="row mx-4">
              <div className="col-md-2 heading2">
                <b>Host:</b>
              </div>
              <div className="col-md-8">
                <p className="heading2">
                  {" "}
                  evalue:&nbsp; {pdata.he}&nbsp; &nbsp; identity:&nbsp;{" "}
                  {pdata.hi} &nbsp; &nbsp; coverage:&nbsp; {pdata.hc}
                </p>
              </div>
            </div>
            </div>
            <div className="col-md-6">
            <div className="row mx-4">
              <div className="col-md-2 heading2">
                <b>Pathogen:</b>
              </div>
              <div className="col-md-8">
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
    {this.state.category ==='gosim' &&(
      <>
      <Divider />
       <div className="row flex-lg-row align-items-center ">
          <h4> Gene Ontology Sementic Similarity</h4>
          <Divider/>
          </div>
       {results}
      </>
     
    )}

    {this.state.category ==='domain' && (
      <>
      <Divider />
        <div className="row flex-lg-row align-items-center ">
          <p className="heading2"> Your Selected Search Parameters are: &nbsp;{pdata.domdb}</p>
          <Divider/>
          </div>
      <div className="row flex-lg-row align-items-center g-2 my-2 mx-2">
      <div className="col-md-2">

        {csvButton}
      </div>
      <div className="col-md-8">
        <h5>
          Showing {this.state.offset + 1} to {this.state.offset + 25} of <b>{this.state.total}</b> interactions (Host Protein: {this.state.hostp} and Pathogen Protein: {this.state.pathogenp})
        </h5>
      </div>
      <div className="col-md-2">
        <a href={`${env.BASE_URL}/network`} target="_blank"
        rel="noopener noreferrer"><Button type="primary" shape="round" size="large">
          <b>Visualize Network</b>
        </Button></a>
      </div>
    </div>

    <Table responsive className="kbl-table table-borderless">
      <thead className="kbl-thead">
        <tr>
          <th scope="col">
            <input
              type="checkbox"
              className="form-check-input"
              checked={this.state.MasterChecked}
              id="mastercheck"
              onChange={(e) => this.onMasterCheck(e)}
            />
          </th>

          <th>Host</th>
          <th>Pathogen</th>
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
            <ReactLoading type={'spokes'} color={'#bff1de'}/>
            </td>
          </tr>
          </>
        )}
        
        {this.state.dList.map((result, index) => (
          <tr key={index + 1} className={result.selected ? "selected" : ""}>
            <td>
              <input
                type="checkbox"
                checked={result.selected}
                className="form-check-input"
                id={result._id}
                onChange={(e) => this.onItemCheck(e, result)}
              />
            </td>

            {pdata.species==='Maize' &&(<>

<td>
            <a
              href={`https://www.ebi.ac.uk/gxa/genes/${result["Host_Protein"].split("_")[0]}?bs={"zea mays"%3A["ORGANISM_PART"%2C"CULTIVAR"%2C"DEVELOPMENTAL_STAGE"%2C"SAMPLING_SITE"%2C"SAMPLING_TIME_POINT"]%2C"sorghum bicolor"%3A["ORGANISM_PART"%2C"CELL_TYPE"]}&ds={"kingdom"%3A["plants"]}#differential`}
              target="_blank"
              rel="noreferrer"
              className="host"
            >
              {result["Host_Protein"]}
            </a>
          </td>
</>)}
{pdata.species==='Rice' &&(<>

<td>
          <a
            href={`https://www.ebi.ac.uk/gxa/genes/${result["Host_Protein"].split("-")[0].replace('t', 'g')}?bs={"oryza sativa"%3A["ORGANISM_PART"%2C"CULTIVAR"%2C"DEVELOPMENTAL_STAGE"%2C"SAMPLING_SITE"%2C"SAMPLING_TIME_POINT"]%2C"sorghum bicolor"%3A["ORGANISM_PART"%2C"CELL_TYPE"]}&ds={"kingdom"%3A["plants"]}#differential`}
            target="_blank"
            rel="noreferrer"
            className="host"
          >
            {result["Host_Protein"]}
          </a>
        </td>
</>)}
{pdata.species==='Sorghum' &&(<>

<td>
          <a
            href={`https://www.ebi.ac.uk/gxa/genes/${sorghum_genes[result["Host_Protein"].split("-")[0]]}?bs={"Sorghum bicolor"%3A["ORGANISM_PART"%2C"CULTIVAR"%2C"DEVELOPMENTAL_STAGE"%2C"SAMPLING_SITE"%2C"SAMPLING_TIME_POINT"]%2C"sorghum bicolor"%3A["ORGANISM_PART"%2C"CELL_TYPE"]}&ds={"kingdom"%3A["plants"]}#differential`}
            target="_blank"
            rel="noreferrer"
            className="host"
          >
            {result["Host_Protein"]}
          </a>
        </td>
</>)}
{pdata.species==='Foxtail' &&(<>

<td>
          <a
            href={`https://www.ebi.ac.uk/gxa/genes/${foxtail_genes[result["Host_Protein"].split("-")[0]]}?bs={"Setaria italica"%3A["ORGANISM_PART"%2C"CULTIVAR"%2C"DEVELOPMENTAL_STAGE"%2C"SAMPLING_SITE"%2C"SAMPLING_TIME_POINT"]%2C"sorghum bicolor"%3A["ORGANISM_PART"%2C"CELL_TYPE"]}&ds={"kingdom"%3A["plants"]}#differential`}
            target="_blank"
            rel="noreferrer"
            className="host"
          >
            {result["Host_Protein"]}
          </a>
        </td>
</>)}

{pdata.species==='Barley' &&(<>

<td>
          <a
            href={`https://www.ebi.ac.uk/gxa/genes/${result["Host_Protein"].split(".")[0]}${result["Host_Protein"].split(".")[3].split("G")[0]}r1G${result["Host_Protein"].split(".")[3].split('G')[1]}?bs={"Hordeum vulgare"%3A["ORGANISM_PART"%2C"CULTIVAR"%2C"DEVELOPMENTAL_STAGE"%2C"SAMPLING_SITE"%2C"SAMPLING_TIME_POINT"]%2C"sorghum bicolor"%3A["ORGANISM_PART"%2C"CELL_TYPE"]}&ds={"kingdom"%3A["plants"]}#differential`}
            target="_blank"
            rel="noreferrer"
            className="host"
          >
            {result["Host_Protein"]}
          </a>
        </td>
</>)}
{pdata.species==='Wheat' &&(<>

<td>
          <a
            href={`http://wheat-expression.com/genes/show?gene_set=RefSeq1.1&name=${result["Host_Protein"].split(".")[0]}&search_by=gene`}
            target="_blank"
            rel="noreferrer"
            className="host"
          >
            {result["Host_Protein"]}
          </a>
        </td>
</>)}
{pdata.species!=='Wheat' && pdata.species!=='Maize' && pdata.species!=='Rice' && pdata.species!=='Sorghum' && pdata.species!=='Foxtail' && pdata.species!=='Barley' &&(

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
