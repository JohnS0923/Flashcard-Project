import { ReactNode } from "react";
import "./popup.css";
interface Props {
  trigger: boolean;
  children: ReactNode;
  title: string;
  setTrigger: () => void;
}
function EditFolder({ trigger, children, title, setTrigger }: Props) {
  return trigger ? (
    <>
      <div className="popup">
        <div className="popup-inner">
          <button className="close-btn" onClick={setTrigger}>
            close
          </button>
          <h1 className="popup-title">{title}</h1>
          {children}
        </div>
      </div>
    </>
  ) : null;
}

export default EditFolder;
