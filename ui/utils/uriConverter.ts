export function uriConverter(uri) {
    const requestURL = uri.replace("ipfs://", "https://ipfs.io/ipfs/")
    return requestURL
}