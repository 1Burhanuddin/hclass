import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

export const useFileUpload = () => {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

  const uploadFile = async (file: File) => {
    try {
      // Step 1: Generate upload URL
      const uploadUrl = await generateUploadUrl()
      
      // Step 2: Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      
      const { storageId } = await result.json()
      
      return { storageId, fileId: storageId }
    } catch (error) {
      console.error('File upload failed:', error)
      throw error
    }
  }

  return { uploadFile }
}