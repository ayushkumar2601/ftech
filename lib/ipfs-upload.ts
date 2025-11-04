// // import { NFTStorage, File } from "nft.storage";

// // export async function uploadEvidenceToIPFS(base64: string) {
// //   const client = new NFTStorage({
// //     token: process.env.NEXT_PUBLIC_NFT_STORAGE_KEY!,
// //   });

// //   const blob = await (await fetch(base64)).blob();

// //   const file = new File([blob], `evidence-${Date.now()}.png`, {
// //     type: "image/png",
// //   });

// //   const cid = await client.storeBlob(file);
// //   return cid; // ✅ return IPFS hash (CID)
// // }


// "use client"; // ✅ Forces client-side execution only

// import { NFTStorage, File } from "nft.storage/dist/bundle.esm.min.js"; // ✅ prevents node polyfills

// export async function uploadEvidenceToIPFS(base64: string) {
//   const client = new NFTStorage({
//     token: process.env.NEXT_PUBLIC_NFT_STORAGE_KEY!,
//   });

//   const blob = await (await fetch(base64)).blob();

//   const file = new File([blob], `evidence-${Date.now()}.png`, {
//     type: "image/png",
//   });

//   const cid = await client.storeBlob(file);
//   return cid;
// }
