import React from "react";
import "./GO.scss";
import '../../scss/style.scss';
import axios from "axios";
import ReactPaginate from "react-paginate";
import Table from "react-bootstrap/Table";
import hosts from '../Hosts/plants.json';
import { Divider } from "antd";
import { env } from '../../env';
import {data} from "./data";
const urlParams = new URLSearchParams(window.location.search);

const species = urlParams.get("id");
const sptype = urlParams.get("class");
export default class GO extends React.Component {
  constructor({ props }) {
    super(props);

    this.state = {
      List: [],
      offset: 0,
      perPage: 25,
      currentPage: 0,
      pageCount: 20,
      total: 0,
    };
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  handlePageClick = (e) => {
    const selectedPage = e.selected;

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

  fetchResults() {
    if (sptype == "host")
      species = hosts.find(item => item.name === species).sname.replaceAll(' ', '_').replaceAll('.', '').replaceAll('(', '_').replaceAll(')', '_')
    axios
      .get(
        `${env.BACKEND}/api/go/?species=${species}&sptype=${sptype}&page=${this.state.currentPage}&size=${this.state.perPage}`
      )
      .then((res) => {
        const List = res.data.data;

        const dl = Math.ceil(res.data.total / this.state.perPage);

        this.setState({
          List: List,
          pageCount: dl,
          total: parseInt(res.data.total),
        });
      });
  }

  componentDidMount() {
    this.fetchResults();
  }
  render() {
    return (
      <div className="container">
        <Divider />
        <div className="row flex-lg-row justify-content-center g-2 my-2">
          <h5>Gene Ontology of <i>{data[species]}</i> </h5>
          <Divider />
        </div>
        <div className="row flex-lg-row align-items-center g-2 my-2">
          <h5>
            {" "}
            Showing {this.state.offset + 1} to {this.state.offset + 25} of{" "}
            {this.state.total} Gene Ontology Terms
          </h5>
        </div>
        <Table responsive className="kbl-table table-borderless">
          <thead className="kbl-thead">
            <tr>
              <th>Protein</th>
              <th>GO ID</th>
              <th>GO Term</th>
              <th>Definition</th>
              <th>GO Evidence Code</th>
              <th>Ontology</th>
            </tr>
          </thead>
          <tbody>
            {this.state.List.map((result, index) => (
              <tr key={index + 1}>
{(() => {
                  if (species === "tindica") {
                    return (
                      <td>
                        <a
                          href={`https://www.ncbi.nlm.nih.gov/search/all/?term=${result["gene"]}%09`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {result["gene"]}
                        </a>
                      </td>
                    );
                  } else {
                    return (
                      <td>
                        <a
                          href={`https://plants.ensembl.org/Multi/Search/Results?species=all;idx=;q=${result["gene"]};site=ensemblunit`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {result["gene"]}
                        </a>
                      </td>
                    );
                  }
                })()}
                <td>
                  <a
                    href={`http://amigo.geneontology.org/amigo/term/${result["term"]}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {result["term"]}
                  </a>
                </td>
                <td className="desc">{result["description"]}</td>

                <td className="desc2">{result["definition"]}</td>
                <td>{result["evidence"]}</td>
                <td>{result["ontology"]}</td>
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

       
      </div>
    );
  }
}
