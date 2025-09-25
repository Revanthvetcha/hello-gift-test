import React from 'react';

interface StoreIconProps {
  className?: string;
}

const StoreIcon: React.FC<StoreIconProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.5L18.5 12H17v7H7v-7H5.5L12 5.5zM9 13h6v5H9v-5z"/>
    </svg>
  );
};

export default StoreIcon;