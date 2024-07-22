import React from "react";


export default class Footer extends React.Component {
    render(){
        return(
            <div className="row flex-lg-row justify-content-center g-2 my-2">
            <p>
              &copy; 2024 |&nbsp;{" "}
              <a
                href="http://bioinfo.usu.edu"
                target="_blank"
                rel="noopener noreferrer"
              >
                Kaundal Artificial Intelligence and Advanced Bioinformatics Lab
              </a>
              &nbsp; |&nbsp;{" "}
              <a href="https://usu.edu" target="_blank" rel="noopener noreferrer">
                Utah State University
              </a>
            </p>
          </div>
        )
    }
}