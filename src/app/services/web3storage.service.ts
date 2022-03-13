import { Injectable } from '@angular/core';
import { CIDString, Web3Storage } from 'web3.storage';

@Injectable({
    providedIn: 'root'
})
export class Web3storageService {
    client: Web3Storage;

    constructor() {
        // Construct with token and endpoint
        this.client = new Web3Storage({
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDIxZUU4QzVhM0E2ZDMyRjUwNkVBMTVBZGVhMDFEODM3QmFmMDlGMmYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDcwNTk0NDMxMjcsIm5hbWUiOiJzcG90aWZpcmUifQ._mydq6XA2DoW72ugOqCksSLugkAvqOGIukJxwW3ulW0'
        });
    }

    async upload(files: File[]) : Promise<CIDString> {
      // Pack files into a CAR and send to web3.storage
      // const file = new File(['hello world'], 'hello.txt', { type: 'text/plain' })
      // const cid = await client.put([file])
      const rootCid = await this.client.put(files); // Promise<CIDString>
      return rootCid;
    }
}

// const fileInput = document.querySelector('input[type="file"]');



// // Get info on the Filecoin deals that the CID is stored in
// const info = await client.status(rootCid); // Promise<Status | undefined>

// // Fetch and verify files from web3.storage
// const res = await client.get(rootCid); // Promise<Web3Response | null>
// const files = await res.files(); // Promise<Web3File[]>
// for (const file of files) {
//     console.log(`${file.cid} ${file.name} ${file.size}`);
// }
