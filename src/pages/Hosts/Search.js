import React from "react";
import { Divider, Radio , Input, Button} from "antd";
import "./Search.scss";
import '../../scss/components/buttons.scss';
import '../../scss/style.scss'
import {data} from '../Annotation/data'
const urlParams = new URLSearchParams(window.location.search);
const hspecies = urlParams.get("host");
const pspecies = urlParams.get("pathogen");

export default class Search extends React.Component {

  render() {
    return (
      <div className="container">
        <div className="row flex-lg-row align-items-center g-2 mt-2 ">
          <Divider />
          <h5>Advance Search Module</h5>
          <Divider />
        </div>
        <div className="row flex-lg-row justify-content-center g-2">
            <div className="col-md-10">
            <p className="infos1">
            {" "}
            This search module enables search of protein functional ananotations
            like (Gene Ontology, Subcellular Location, Pathways, Transcription
            Facors, Virulence Proteins)
          </p>
            </div>
          
         <Divider />
        </div>
        <div className="row flex-lg-row align-items-center g-2">
        <h5>Select Species</h5>
          <Radio.Group name="radiogroup" defaultValue={hspecies}>
            <Radio value={hspecies} onChange={this.speciesHandler}>
              <i>{data[hspecies]} </i>
            </Radio>
            <Radio value={pspecies} onChange={this.speciesHandler}>
              <i>{data[pspecies]} </i>
            </Radio>
           
          </Radio.Group>
          <Divider />
          </div>
          <div className="row flex-lg-row align-items-center g-2">
          <h5>Select Annotation</h5>
          <Radio.Group name="radiogroup" defaultValue={"go"}>
            <Radio value="go" onChange={this.speciesHandler}>
              Gene Ontology
            </Radio>
            <Radio value="pathway" onChange={this.speciesHandler}>
              KEGG Pathways
            </Radio>
            <Radio value="local" onChange={this.speciesHandler}>
             Subcellular Localization
            </Radio>
            <Radio value="tf" onChange={this.speciesHandler}>
             Transcription Factors
            </Radio>
            <Radio value="interpro" onChange={this.speciesHandler}>
             Functional Domains
            </Radio>
            <Radio value="virulence" onChange={this.speciesHandler}>
             Virulence Proteins
            </Radio>
          </Radio.Group>
          <Divider />
          </div>
          <div className="row flex-lg-row justify-content-center g-2">
              <div className="col-md-4">
                  <h6>Enter a Keyword (e.g: Ubiquitin)</h6>
              <Input placeholder="keyword" />
              </div>
              <div className="col-md-2">
                  <b>OR</b>
              </div>
              <div className="col-md-4">
                  <h6>Enter Protein Accession (e.g: OAJ27264)</h6>
              <Input placeholder="Accession" />
              </div>
              <Divider/>
          </div>
          <div className="row flex-lg-row align-items-center g-2">
              <div className="col-md-6">
              <h6>Protein Length</h6>
              <div className="row flex-lg-row justify-content-center">
                  
              <div className="col-md-4">
                  <h6>Min</h6>
              <Input placeholder="Min Length" step='any' type='number' />
              </div>
              -
              <div className="col-md-4">
                  <h6>Max</h6>
              <Input placeholder="Max Length" step='any' type='number' />
              </div>
              </div>
              </div>
              <Divider/>
          </div>
          <div className="row flex-lg-row justify-content-center g-2"> 
          <div className="col-md-10">
          <p className="infos"> Note: Keyword is the only field that is required to run the search, you may leave the others blank if preferred. Placeholders inside input boxes are just hints for the users to help them to know what to type inside. If the user want to use an additional filter (e.g: Protein length) must type something in those boxes to run a valid search. </p>
          
          </div>
          <Divider/>
          </div>
          <div className="row flex-lg-row justify-content-center g-2">
          <div className="col-md-2">
            <Button
              type="primary"
              shape="round"
              size="large"
              onClick={this.getInteractions}
            >
              Advance Search{" "}
            </Button>
          </div>
         
          </div>
          <Divider />
      </div>
    );
  }
}
