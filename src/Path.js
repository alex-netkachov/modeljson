import React from 'react';

export default class Path extends React.Component {
    render() {
      const copy = () => {
        const json = JSON.stringify(this.props.model, null, 2);
        const ta = document.createElement('textarea');
        ta.value = json;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      };
  
      const renderPathItem = (item, index) => {
        return (
          <li key={index}>
            <span onClick={() =>
              this.props.onNavigate(this.props.path.slice(0, index+1))}>{item}</span>
          </li>
        );
      };

      return (
        <div className="path">
          <span className="copy" onClick={copy} title="copy model to clipboard">
            <i className="fas fa-copy"></i>
          </span>
          <ul>
            <li><span onClick={() => this.props.onNavigate([])}>{this.props.name}</span></li>
            {this.props.path.map(renderPathItem)}</ul>
        </div>
      );
    }
  }
  