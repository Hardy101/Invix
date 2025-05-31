interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  classNames?: string;
}

const NavButton: React.FC<ButtonProps> = ({ text, classNames, ...props }) => {
  return (
    <button
      {...props}
      className={`${classNames} group relative text-white text-sm font-poppins-bold rounded-xl px-3 py-3`}
    >
      <span className="relative z-2 group-hover:text-white">{text}</span>
    </button>
  );
};

export default NavButton;
