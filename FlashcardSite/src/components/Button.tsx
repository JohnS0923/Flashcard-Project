import { ReactNode } from "react";
import "bootstrap/dist/css/bootstrap.css";
interface Props {
  children: ReactNode;
  color?: "primary" | "secondary" | "danger" | "success";
  outline?: "outline-" | "";
  onClick: () => void;
}
function Button({ children, color = "primary", outline = "", onClick }: Props) {
  return (
    <>
      <button
        type="button"
        className={"btn btn-" + outline + color}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
}

export default Button;
