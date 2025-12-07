"use client";

import { CSSProperties, FC } from "react";
import { MdEmail } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa6";
import { FaPlus, FaCrown, FaUserPlus, FaCopy } from "react-icons/fa";

const IconsIndex = {
  email: MdEmail,
  logout: FaPowerOff,
  plus: FaPlus,
  crown: FaCrown,
  invite: FaUserPlus,
  copy: FaCopy,
};

const EventIndex = {
  //
}

const SocialsIndex = {
  //
}

const Index = {
  ...EventIndex,
  ...IconsIndex,
  ...SocialsIndex
}

export type IconName = keyof typeof Index | "none";

type Props = {
  icon: IconName
  className?: string
  title?: string
  style?: CSSProperties
  onClick?: () => void;
}

export const Icon: FC<Props> = ({ icon, className, style, title, onClick }) => {
  if (icon == "none") {
    return null;
  }

  const Icon = Index[icon];
  return (
    <Icon className={className} title={title} style={style} onClick={onClick} />
  )
}