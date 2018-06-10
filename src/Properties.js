import React from 'react';

import Property from './Property.js';

export default class Properties extends React.Component {
  render() {
    const path = this.props.path;
    const obj = path[path.length-1][1];
    return (
      <div className="props">
        {Object.entries(obj).map(v => (
          <div key={v[0]}>
            <Property
              path={path.concat([[v[0], v[1]]])}
              obj={obj} label={v[0]} value={v[1]}
              onNavigate={path => this.props.onNavigate(path)}/>
          </div>
        ))}
      </div>
    );
  }
}
