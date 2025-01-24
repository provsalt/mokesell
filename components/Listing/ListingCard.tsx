import Image from "next/image";

export const ListingCard = (props: { name?: string, price?: string; condition?: string, imageSource: string } ) => {
  if (!props || !props.name || !props.price || !props.condition || !props.imageSource) {
    return (
      <div className="space-y-2">
        <div className="aspect-square animate-pulse bg-gray-200 rounded-lg"></div>
        <div className="text-sm space-y-1">
          <div className="w-1/2 h-4 animate-pulse bg-gray-200 rounded"></div>
          <div className="w-1/4 h-4 animate-pulse bg-gray-200 rounded"></div>
          <div className="w-1/4 h-4 animate-pulse bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-2">
      <Image className="aspect-square bg-gray-200 rounded-lg" src={props.imageSource} alt={props.name} />
     <div className="space-y-1">
       <p className="text-lg text-gray-600">{props.name}</p>
       <p className="font-medium">{props.price}</p>
       <p className="text-gray-500">{props.condition}</p>
     </div>
   </div>
 )
}