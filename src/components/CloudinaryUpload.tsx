'use client'

import { CldUploadWidget } from 'next-cloudinary'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  onUpload: (url: string) => void
}

interface CloudinaryResult {
  info?: {
    secure_url?: string;
    public_id?: string;
  };
  event?: string;
}

const CloudinaryUpload = ({ onUpload }: Props) => {
  const [isUploading, setIsUploading] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <CldUploadWidget
        uploadPreset="phishaware_images"
        options={{
          maxFiles: 1,
          resourceType: "image",
          clientAllowedFormats: ["png", "jpeg", "jpg"],
          maxFileSize: 10000000, // 10MB
        }}
        onOpen={() => {
          console.log("Upload widget opened")
          setIsUploading(true)
        }}
        onClose={() => {
          console.log("Upload widget closed")
          setIsUploading(false)
        }}
        onSuccess={(results) => {
          console.log("Upload success:", results)
          setIsUploading(false)
          if (typeof results.info === 'object' && results.info?.secure_url) {
            console.log("Secure URL:", results.info.secure_url)
            onUpload(results.info.secure_url)
            toast.success('Image uploaded successfully')
          } else {
            console.error("Upload failed - No secure URL in response:", results)
            toast.error('Upload failed - Invalid response from server')
          }
        }}
        onError={(error: any) => {
          console.error("Upload error:", error)
          toast.error('Upload failed - ' + (error.message || 'Unknown error'))
          setIsUploading(false)
        }}
      >
        {({ open }) => (
          <Button 
            type="button"
            variant="outline"
            onClick={() => {
              try {
                open()
              } catch (error) {
                console.error("Error opening upload widget:", error)
                toast.error('Failed to open upload widget')
                setIsUploading(false)
              }
            }}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        )}
      </CldUploadWidget>
    </div>
  )
}

export default CloudinaryUpload