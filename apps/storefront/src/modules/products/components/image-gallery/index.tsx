import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  title: string
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  return (
    <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto md:grid md:grid-cols-2 md:overflow-visible">
      {images.map((image, index) => (
        <figure
          key={image.id}
          className={`relative aspect-[4/5] shrink-0 snap-start overflow-hidden bg-ui-bg-subtle ${images.length > 1 ? "w-[88%] md:w-full" : "w-full"} ${index === 0 ? "md:col-span-2" : ""}`}
        >
          <Image
            src={image.url}
            preload={index === 0}
            className="object-cover"
            alt={index === 0 ? title : `${title}, foto ${index + 1}`}
            fill
            sizes={index === 0 ? "(max-width: 767px) 90vw, 57vw" : "(max-width: 767px) 88vw, 28vw"}
          />
        </figure>
      ))}
    </div>
  )
}
