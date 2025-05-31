import { ReactNode } from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  children: ReactNode;
};

const Portal = ({ children }: PortalProps) => {
  const portalRoot = document.getElementById("portal-root");
  if (!portalRoot) return null;
  return createPortal(children, portalRoot);
};

export default Portal;
