import React from "react";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { PiStudentLight } from "react-icons/pi";
import { MdContacts } from "react-icons/md";
import { GrDocumentVerified } from "react-icons/gr";

const IconMap = {
  group: HiOutlineUserGroup,
  student: PiStudentLight,
  contacts: MdContacts,
  verified: GrDocumentVerified,
};

const StoryCard = ({ icon, number, text }) => (
  <div className="story-div">
    {icon}
    <p className="number">{number}</p>
    <p className="story-content">{text}</p>
  </div>
);

StoryCard.Icon = ({ type }) => {
  const Icon = IconMap[type];
  return <Icon className="story-icon" />;
};

export default StoryCard;
