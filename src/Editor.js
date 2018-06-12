import React from 'react';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { Dropbox } from 'dropbox';

import Path from './Path.js';
import Properties from './Properties.js';

class FilesDropBucket extends React.Component {
  onDragOver(e) {
    e.preventDefault();
  }

  onDrop(e) {
    e.preventDefault();

    const updateModelFromFile = file => {
      const reader = new FileReader();
      reader.onload = e => this.load(file.name, JSON.parse(e.target.result));
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
}

class ProjectLinks extends React.Component {
  render() {
    const sourceCodeLink = () =>
      <a href="https://github.com/AlexAtNet/modelx">source code</a>;
    const featuresLink = () =>
      <a href="https://github.com/AlexAtNet/modelx/issues?utf8=%E2%9C%93&amp;q=is%3Aissue+is%3Aclosed+is%3Aenhancement">features</a>;
    const issuesLink = () =>
      <a href="https://github.com/AlexAtNet/modelx/issues">issues</a>;
    return (
      <p>{sourceCodeLink()} ~ {featuresLink()} ~ {issuesLink()}</p>
    );
  }
}

export default class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = { model : null, dropbox : null };

    // model : { location : null, root : null, path : null }
    // dropbox : { accessKey : null, path : '/', folders : [], files : [] }
    const [, accessToken ] = window.location.hash.match(/access_token=([^&]+)/) || [];
    if (accessToken) {
      localStorage.dropboxAccessToken = accessToken;
      this.dropboxReadDir([]);
    }
  }

  navigate(path) {
    this.setState({ model : Object.assign({}, this.state.model, { path : path }) });
  }

  load(location, root) {
    this.setState({ model : { location, root, path : [ ] } });
  }

  dropboxReadDir(path) {
    const dbx = new Dropbox({ accessToken : localStorage.dropboxAccessToken });
    dbx.filesListFolder({ path : path.map(v => '/' + v).join('') })
      .then(response => {
        const folders = response.entries.filter(e => e['.tag'] === 'folder').map(e => e.name);
        const files = response.entries.filter(e => e['.tag'] === 'file').map(e => e.name);
        this.setState({ dropbox : { path, folders, files } });
      })
      .catch(error => console.log(error));
  }

  render() {
    const dropboxReadFile = path => {
      const location = path.map(v => '/' + v).join('');
      const dbx = new Dropbox({ accessToken : localStorage.dropboxAccessToken });
      dbx.filesDownload({ path : location })
        .then(response => {
          const reader = new FileReader();
          reader.addEventListener('loadend', () => {
            this.load(location, JSON.parse(reader.result));
          });
          reader.readAsText(response.fileBlob);
        })
        .catch(error => console.log(error));
    };

    const dropboxWriteFile = () => {
      const dbx = new Dropbox({ accessToken : localStorage.dropboxAccessToken });
      dbx.filesUpload({
        path : this.state.model.location,
        mode : { '.tag' : 'overwrite' },
        contents : JSON.stringify(this.state.model.root, null, 2)
      }).then(() => console.log('saved')).catch(error => console.log(error));
    };

    const dropboxOpen = () => {
      if (localStorage.dropboxAccessToken) {
        this.dropboxReadDir([]);
      } else {
        const url = new Dropbox({ clientId : 'dlc05g8hb4ebuem' })
          .getAuthenticationUrl(window.location);
        window.location = url;
      }
    };

    const dropbox = () => {
      const dropbox = this.state.dropbox;
      if (!dropbox || this.state.model) return;
      return (
        <List>
          {dropbox.folders.map(folder => (
            <ListItem button key={folder}
              onClick={() => this.dropboxReadDir(dropbox.path.concat([folder]))}>
              <ListItemIcon><i className="fas fa-folder"></i></ListItemIcon>
              <ListItemText primary={folder} />
            </ListItem>
          ))}
          {dropbox.files.map(file => (
            <ListItem button key={file}
              onClick={() => dropboxReadFile(dropbox.path.concat([file]))}>
              <ListItemIcon><i className="fas fa-file"></i></ListItemIcon>
              <ListItemText primary={file} />
            </ListItem>
          ))}
        </List>
      );
    }

    const path = () => {
      const model = this.state.model;
      if (!model) return;
      return <Path name={model.location} path={model.path} model={model.root}
          onNavigate={path => this.navigate(path)} />;
    };

    const properties = () => {
      const model = this.state.model;
      if (!model) return;
      return <Properties path={model.path} model={model.root}
          onNavigate={path => this.navigate(path)}
          onChange={() => dropboxWriteFile() } />;
    };

    const welcomeScreen = (model, dropbox) => {
      if (this.state.model || this.state.dropbox) return;
      return (
        <div style={{ padding : '1rem' }}>
          <p>Edit JSON model files in:</p>
          <div><Button onClick={dropboxOpen}>Dropbox</Button></div>
          <ProjectLinks/>
        </div>
      );
    };

    return (
      <div id="editor"
        onDrop={e => this.onDrop(e)}
        onDragOver={e => this.onDragOver(e)}>
        {welcomeScreen()}
        {dropbox()}
        {path()}
        {properties()}
      </div>
    );
  }
}
    