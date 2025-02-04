import React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  helperText?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, helperText, ...props }, ref) => {
    const baseStyles = "block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF7F6E] focus:ring-[#FF7F6E] sm:text-sm"
    const errorStyles = error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
    
    const combinedClassName = `${baseStyles} ${errorStyles} ${className}`

    return (
      <div>
        <input
          ref={ref}
          className={combinedClassName}
          {...props}
        />
        {helperText && (
          <p className={`mt-1 text-sm ${error ? "text-red-500" : "text-gray-500"}`}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input" 