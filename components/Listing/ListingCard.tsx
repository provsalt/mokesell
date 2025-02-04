import Image from "next/image";
import Link from "next/link";

export const ListingCard = (props: {
  id?: number
  name?: string;
  price?: string;
  condition?: string;
  image?: string;
}) => {
  if (
    !props ||
    !props.name ||
    !props.price ||
    !props.condition ||
    !props.image ||
    !props.id
  ) {
    return (
      <div className="space-y-2">
        <div className="aspect-square animate-pulse bg-gray-200 rounded-lg"></div>
        <div className="text-sm space-y-1">
          <div className="w-1/2 h-4 animate-pulse bg-gray-200 rounded"></div>
          <div className="w-1/4 h-4 animate-pulse bg-gray-200 rounded"></div>
          <div className="w-1/4 h-4 animate-pulse bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="hover:bg-gray-200 space-y-2 rounded-lg drop-shadow-lg">
      <Link href={`/listings/${props.id}`} >
        <Image
          className="aspect-square bg-gray-200 rounded-lg object-cover"
          src={props.image}
          alt={props.name}
          width={300}
          height={300}
          loading="lazy"
        />
        <div className="space-y-1">
          <p className="text-lg text-gray-600">{props.name}</p>
          <p className="font-medium">{props.price}</p>
          <p className="text-gray-500 capitalize">
            {props.condition.replace("_", " ")}
          </p>
        </div>
      </Link>
    </div>
  );
};
