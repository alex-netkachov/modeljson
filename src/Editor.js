import React from 'react';

import Path from './Path.js';
import Properties from './Properties.js';

export default class Editor extends React.Component {
    constructor(props) {
      super(props);
      this.state = { };
    }
  
    navigate(path) {
      this.setState({ path : path });
    }
  
    onDragOver(e) {
      e.preventDefault();
    }
  
    onDrop(e) {
      e.preventDefault();
  
      const updateModelFromFile = file => {
        let reader = new FileReader();
        reader.onload = e => {
          const model = JSON.parse(e.target.result);
          this.setState({ path : [ [ file.name, model ] ] });
        };
        reader.readAsText(file);
      }
    
      if (e.dataTransfer.items) {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          if (e.dataTransfer.items[i].kind === 'file') {
            let file = e.dataTransfer.items[i].getAsFile();
            updateModelFromFile(e.dataTransfer.files[i]);
            break;
          }
        }
      } else {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          updateModelFromFile(e.dataTransfer.files[i]);
          break;
        }
      }
  
      if (e.dataTransfer.items) {
        e.dataTransfer.items.clear();
      } else {
        e.dataTransfer.clearData();
      }
  
    }
  
    render() {
      const sourceCodeLink = () =>
        <a href="https://github.com/AlexAtNet/modelx">source code</a>;
      const featuresLink = () =>
        <a href="https://github.com/AlexAtNet/modelx/issues?utf8=%E2%9C%93&amp;q=is%3Aissue+is%3Aclosed+is%3Aenhancement">features</a>;
      const issuesLink = () =>
        <a href="https://github.com/AlexAtNet/modelx/issues">issues</a>;
      const example = () => {
        const example = [ [ 'example.js', {
          name : 'Sample JSON file',
          public : true,
          version : 1,
          properties : { boolean : true, string : 'Lorem ipsum', number : 10 }
        } ] ];
        return <a href="#" onClick={() => this.navigate(example) }>example</a>;
      };
      return (
        <div id="editor"
          onDrop={e => this.onDrop(e)}
          onDragOver={e => this.onDragOver(e)}>
          {
            this.state.path ? (
              <Path path={this.state.path}
                onNavigate={path => this.navigate(path)} />
            ) : null
          }
          {
            this.state.path ? (
              <Properties path={this.state.path}
                onNavigate={path => this.navigate(path)} />
            ) : (
              <div style={{ padding : '1rem' }}>
                <h1>Minimalistic JSON editor</h1>
                <p>Drag'n'drop a JSON file on this page, browse and update it,
                  and click <i className="fas fa-copy"></i> to copy the result
                  into the clipboard when you finish.</p>
                <p>{sourceCodeLink()} ~ {featuresLink()} ~ {issuesLink()} ~ {example()}</p>
              </div>
            )
          }
        </div>
      );
    }
  }
    