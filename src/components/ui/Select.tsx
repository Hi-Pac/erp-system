import React, { forwardRef } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: Option[];
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  onChange: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    label, 
    options, 
    error, 
    helperText, 
    fullWidth = false,
    onChange,
    className = '',
    ...props 
  }, ref) => {
    const baseSelectClass = `
      block bg-white border rounded-md shadow-sm
      focus:ring-2 focus:ring-primary-500 focus:border-primary-500
      sm:text-sm
    `;
    
    const errorClass = error ? 'border-red-300 text-red-900' : 'border-gray-300 text-gray-900';
    const widthClass = fullWidth ? 'w-full' : '';
    
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value);
    };
    
    return (
      <div className={`${widthClass} ${className}`}>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        
        <select
          ref={ref}
          className={`${baseSelectClass} ${errorClass} p-2 ${widthClass}`}
          onChange={handleChange}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        >
          <option value="" disabled>اختر...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';