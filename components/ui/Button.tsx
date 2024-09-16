// En '@/components/buttons/Button.tsx'
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary'; // 
}

const Button: React.FC<ButtonProps> = ({ variant, children, ...props }) => {
    const variantClass = variant === 'secondary' ? 'bg-secondary' : 'bg-primary';
    return (
        <button className={`${variantClass} p-2 rounded text-gray-800 font-bold`} {...props}>
            {children}
        </button>
    );
};

export default Button;
