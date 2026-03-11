import { BlobServiceClient } from "@azure/storage-blob"

const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
)

const containerClient = blobServiceClient.getContainerClient(
    process.env.AZURE_STORAGE_CONTAINER
)

export async function uploadFile(fileBuffer, fileName) {

    const blockBlobClient = containerClient.getBlockBlobClient(fileName)

    await blockBlobClient.uploadData(fileBuffer)

    return blockBlobClient.url
}