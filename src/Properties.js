import React from 'react';

import Property from './Property.js';
import Utils from './Utils.js';

export default class Properties extends React.Component {
  render() {
    const path = this.props.path;
    const node = Utils.locate(this.props.model, path);
    return (
      <div className="props">
        {Object.entries(node).map(v => (
          <div key={v[0]}>
            <Property
              path={path.concat([v[0]])}
              model={node}
              property={v[0]}
              label={v[0]}
              value={v[1]}
              onNavigate={path => this.props.onNavigate(path)}
              onChange={() => this.props.onChange()}/>
          </div>
        ))}
      </div>
    );
  }
}
