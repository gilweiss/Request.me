import React from 'react';
import { css } from '@emotion/core';
// Another way to import. This is recommended to reduce bundle size
import PacmanLoader from 'react-spinners/PacmanLoader';

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
    display: block;
    margin: 10 auto;
    border-color: black;
`;

export function updateStateLDR(text){
    this.setState(text);
}

export  class AwesomeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
    updateStateLDR = updateStateLDR.bind(this);
  }
  render() {
    return (
      
      <div className='sweet-loading'>
       
        <PacmanLoader
          css={override}
          sizeUnit={"px"}
          size={25}
          color={'#6D6D6D'}
          loading={this.state.loading}
        />
       
      </div> 
    )
  }
}