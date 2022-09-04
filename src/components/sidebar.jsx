import React from "react";
import { BsFillLightningFill } from "react-icons/bs";
import { FaTrophy, FaStream, FaPoo, FaHome } from "react-icons/fa";

const SideBar = (props) => {
  return (
    <div className="fixed top-0 left-0 h-screen w-16 flex flex-col text-white shadow-lg bg-white">
      <a href="/">
        <SideBarIcon
          icon={<FaHome size="28" color={props.homeColor} />}
          text="Home"
        />
      </a>
      <a href="/driver-standings">
        <SideBarIcon icon={<FaTrophy size="28" />} text="Driver Standings" />
      </a>
      <a href="/results">
        <SideBarIcon icon={<FaStream size="28" />} text="Race Results" />
      </a>

      <SideBarIcon
        icon={<BsFillLightningFill size="28" />}
        text="Fastest Laps"
      />
      <SideBarIcon icon={<FaPoo size="28" />} text="More Info" />
    </div>
  );
};

const SideBarIcon = ({ icon, text }) => (
  <div className="sidebar-icon group">
    {icon}
    <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
  </div>
);

export default SideBar;
