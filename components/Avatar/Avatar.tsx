import { createAvatar } from "@dicebear/core";
import { pixelArt } from "@dicebear/collection";
import Image from "next/image";

export const Avatar = ({
  username,
  size,
}: { username: string; size: number }) => {
  const avatar = createAvatar(pixelArt, {
    size: 64,
    seed: username,
  }).toDataUri();
  return (
    <Image
      src={avatar}
      alt={username}
      width={size}
      height={size}
      className="rounded-full bg-white"
    />
  );
};
