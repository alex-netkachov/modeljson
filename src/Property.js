import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

export default class Property extends React.Component {
    constructor(props) {
      super(props)
      this.state = { value : props.value };
    }
  
    update(value) {
      this.setState({ value : value });
      this.props.model[this.props.property] = value;
      this.props.onChange();
    }
  
    render() {
      switch (typeof this.state.value) {
        case 'string':
          return (
            <TextField type="text"
              label={this.props.label}
              value={this.state.value}
              margin="normal"
              fullWidth
              onChange={e => this.update(e.target.value)}/>
          );
        case 'number':
          return (
            <TextField type="text"
              label={this.props.label}
              value={this.state.value}
              margin="normal"
              onChange={e => this.update(e.target.value)} />
          );
        case 'boolean':
          return (
            <FormControl margin="normal">
              <InputLabel>{this.props.label}</InputLabel>
              <Select value={this.state.value ? 'true' : 'false'}
                input={<Input/>}
                onChange={e => this.update(e.target.value === 'true')}>
                <MenuItem value={'true'}>true</MenuItem>
                <MenuItem value={'false'}>false</MenuItem>
              </Select>
            </FormControl>
          );
        case 'object':
          return (
            <TextField
              label={this.props.label}
              margin="normal"
              fullWidth
              value={JSON.stringify(this.state.value).substr(0, 1024)}
              onClick={() => this.props.onNavigate(this.props.path)}
            />
          );
      }
    }
  }