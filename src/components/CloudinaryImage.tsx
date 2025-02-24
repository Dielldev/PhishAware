'use client'

import Image from 'next/image'
import { memo } from 'react'

interface CloudinaryImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

const CloudinaryImage = memo(function CloudinaryImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '' 
}: CloudinaryImageProps) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#e2e8f0"/>
  </svg>`
  const blurDataUrl = `data:image/svg+xml;base64,${btoa(svg)}`

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      placeholder="blur"
      blurDataURL={blurDataUrl}
      loading="lazy"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
})

export default CloudinaryImage