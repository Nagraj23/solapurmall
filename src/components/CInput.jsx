import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment'; // Required for adornment

const Input = ({
  label,
  icon, // This will be used as startAdornment
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error = false,
  helperText = '',
  className = '',
  ...rest
}) => {
  return (
    <div className="w-full mb-4">
      <TextField
        fullWidth
        id={id}
        name={name}
        type={type}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={error}
        helperText={helperText}
        variant="outlined"
        size="small"
        className={`${className}`}
        InputProps={{
          startAdornment: icon ? (
            <InputAdornment position="start">
              <span className="text-lg text-blue-600">{icon}</span>
            </InputAdornment>
          ) : null,
          className: `
            px-2 py-0
            text-sm
            rounded-xl
            shadow-sm
            focus:outline-none
            focus:ring-2
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-blue-500 focus:ring-blue-500'}
          `,
        }}
        InputLabelProps={{
          className: 'text-gray-700 text-sm mb-2',
        }}
        FormHelperTextProps={{
          className: `mt-1 text-xs ${error ? 'text-red-500' : 'text-gray-500'}`,
        }}
        {...rest}
      />
    </div>
  );
};

export default Input;
