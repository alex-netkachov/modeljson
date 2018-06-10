import React from 'react';

export default class Path extends React.Component {
    render() {
      const renderPathItem = (item, index) => (
        <li key={index}>
          <span onClick={() =>
            this.props.onNavigate(this.props.path.slice(0, index+1))}>{item}</span>
        </li>
      );
  
      const copy = () => {
        const json = JSON.stringify(this.props.path[0][1], null, 2);
        const ta = document.createElement('textarea');
        ta.value = json;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      };
  
      return (
        <div className="path">
          <span className="copy" onClick={copy}>
            <i className="fas fa-copy"></i>
          </span>
          <ul>{this.props.path.map(v => v[0]).map(renderPathItem)}</ul>
        </div>
      );
    }
  }
  