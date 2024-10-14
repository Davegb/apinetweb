import React, { Component } from 'react';
import { Divider } from 'antd';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import './VisPage.scss';

import { Visualization } from '../../components/Visualization/Visualization';
import { VisTable } from '../../components/VisTable/VisTable';
import { NodeMenu } from '../../components/NodeMenu/NodeMenu';
import { EdgeMenu } from '../../components/EdgeMenu/EdgeMenu';

const NodeTypeDict = {
  'host': 'Host',
  'pat': 'Pathogen Protein'
}


class VisPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedBar: 'table',
      currentNodeData: {},
      currentEdgeData: {},
      searchTerm: '',
      infoType: ''
    };

    this.handleNodeClicked = this.handleNodeClicked.bind(this);
    this.handleSearchTerm = this.handleSearchTerm.bind(this);
    this.handleEdgeClicked = this.handleEdgeClicked.bind(this);
  }

  handleBarSwitch(newMenu) {
    this.setState({ selectedBar: newMenu });
  }

  handleSearchTerm(term) {
    this.setState({ searchTerm: term });
  }

  handleNodeClicked(e) {
    this.setState({ infoType: 'Node' });
    const data = e.target.data();
    const nodeType = NodeTypeDict[data.className];
    const itemName = data.id;
    const itemDegree = e.target.degree();

    const parsedData = {
      nodeType,
      name: itemName,
      degree: itemDegree
    };

    this.setState({ currentNodeData: parsedData }, () => {
      this.handleBarSwitch('info');
    });
  }

  handleEdgeClicked(data) {
    this.setState({ infoType: 'Edge' });

    this.setState({ currentEdgeData: data }, () => {
      this.handleBarSwitch('info');
    });
  }

  render() {
    const { searchTerm, selectedBar, infoType, currentNodeData, currentEdgeData } = this.state;

    let tableClass = selectedBar === 'table' ? 'selected' : '';
    let nodeClass = selectedBar === 'info' ? 'selected' : '';

    let menuComponent;
    if (selectedBar === 'table') {
      menuComponent = <VisTable handleSearchChange={this.handleSearchTerm} tableRowClicked={this.handleEdgeClicked} />;
    } else {
      menuComponent = infoType.toLowerCase() === 'node' ? 
        <NodeMenu nodeData={currentNodeData} /> :
        infoType.toLowerCase() === 'edge' ? 
          <EdgeMenu edgeData={currentEdgeData} /> :
          <div>No node or edge selected.</div>;
    }

    return (
      <div className="container">
        <Row className='mt-4'>
          <Col sm={7}>
            <Visualization edgeHandler={this.handleEdgeClicked} nodeHandler={this.handleNodeClicked} searchTerm={searchTerm} />
          </Col>
          <Col sm={5}>
            <div className="bar-selector mb-3">
              <span className={`${tableClass} mr-3`} onClick={() => this.handleBarSwitch('table')}>Table</span>
              <span className={nodeClass}  onClick={() => this.handleBarSwitch('info')}>{infoType}Info</span>
            </div>
            {menuComponent}
          </Col>
        </Row>
        <Divider />
      </div>
    );
  }
}

VisPage.propTypes = {
  // Define PropTypes here if needed
};

export default VisPage;
