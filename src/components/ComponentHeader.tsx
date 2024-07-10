import { ReactNode } from "react";
import { FaUser } from "react-icons/fa";

interface ComponentHeaderProps {
  title: string;
  icon: ReactNode;
}
const ComponentHeader = ({ title, icon }: ComponentHeaderProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="text-2xl font-bold">{icon}</div>
      <div className="text-2xl font-bold">{title}</div>
    </div>
  );
};

export default ComponentHeader;
