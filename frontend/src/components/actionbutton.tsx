import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  classNames?: string;
  text: string;
  icon?: string;
}

const ActionButton: React.FC<ButtonProps> = ({
  classNames,
  text,
  icon,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`${classNames} flex items-center justify-center gap-2 px-4 py-2 text-sm`}
    >
      <i className={icon}></i>
      {text}
    </button>
  );
};

export default ActionButton;
