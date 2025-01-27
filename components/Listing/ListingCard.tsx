export const ListingCard = (props: {
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
    !props.image
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
    <div className="space-y-2 drop-shadow-lg">
      <img
        className="aspect-square bg-gray-200 rounded-lg object-cover"
        src={props.image}
        alt={props.name}
        width={300}
        height={300}
      />
      <div className="space-y-1">
        <p className="text-lg text-gray-600">{props.name}</p>
        <p className="font-medium">{props.price}</p>
        <p className="text-gray-500 capitalize">
          {props.condition.replace("_", " ")}
        </p>
      </div>
    </div>
  );
};
