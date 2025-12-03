"use client";

import { CSSProperties, FC } from "react";
import { MdEmail } from "react-icons/md";

const IconsIndex = {
  email: MdEmail,
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
  style?: CSSProperties
  onClick?: () => void;
}

export const Icon: FC<Props> = ({ icon, className, style, onClick }) => {
  if (icon == "none") {
    return null;
  }

  const Icon = Index[icon];
  return (
    <Icon className={className} style={style} onClick={onClick} />
  )
}