import React from 'react'
import Select from 'react-select';
import PropTypes from 'prop-types';

function DropDown(props){
    const { clsName, options, prefix, value, id, handleChange } = props
    return (
        <div className={clsName}>
          {prefix && <span>{prefix} </span>}
          <Select
            value={value}
            onChange={(val)=>handleChange(val,id)}
            options={options}
            id={id}
          />
        </div>        
    );
}

DropDown.propTypes = {
  clsName: PropTypes.string,
  options: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  prefix: PropTypes.string.isRequired
};

DropDown.defaultProps = {
  clsName: '',
  value: {}
};

export default DropDown