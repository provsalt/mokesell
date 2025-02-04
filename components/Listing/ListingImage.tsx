"use client";

import {motion, useAnimate} from "motion/react";
import Image from "next/image"
import {useState} from "react";

interface ImageProps {
  id: number;
  url: string;
  position: number;
}

export const ListingImage = ({images}: {images: ImageProps[]}) => {
  const [selectedImage, setSelectedImage] = useState(images[0].url)

  const [animateRef, animate] = useAnimate()
  return (
    <div className="flex flex-col gap-3">
      <motion.div
        className="flex-shrink-1 aspect-square relative"
        initial={{opacity: 0.5}}
        animate={{opacity: 1}}
        transition={{duration: 1}}
      >
        <Image
          ref={animateRef}
          src={selectedImage}
          alt={"Listing"}
          fill
          priority
          className="object-cover rounded-md"
        />
      </motion.div>

      <div className="flex flex-grow-1 flex-row h-16 md:h-24 gap-2">
        {images.map((img, index) => (
          <div
            key={img.id}
            className="aspect-square relative border rounded-md overflow-hidden"
          >
            <button onClick={() => {
              if (img.url === selectedImage) return;
              animate(animateRef.current, {opacity: 0.5});
              setSelectedImage(img.url)
              setTimeout(() => animate(animateRef.current, {opacity: 1}), 500)
            }}>
              <Image
                src={img.url}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}