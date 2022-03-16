import { Injectable } from '@angular/core';

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// @Injectable({
//     providedIn: 'root'
// })
// export class ImageHelper {

// }

export interface SelectInputFile {
    file: File;
    src: string | ArrayBuffer;
}

@Injectable({
    providedIn: 'root'
})
export class FileHelper {
    constructor() {}

    readFileAsBuffer(file: File, callback: any) {
        const reader = new FileReader();
        reader.onload = function () {
            if (reader.result) {
                const buffer = Buffer.from(reader.result as ArrayBuffer);
                callback(buffer);
            } else {
                callback(null);
            }
        };
        reader.readAsArrayBuffer(file);
    }

    readFileAsDataURL(blob: Blob, callback) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            callback(e.target.result);
        };
        reader.readAsDataURL(blob);
    }

    onFileChanged(event: Event, selectedFile: SelectInputFile) {
        const target = event.target as HTMLInputElement;
        const file: File = (target.files as FileList)[0];
        console.log(file);
        selectedFile.file = file;

        // const thumbElement = document.getElementById(`thumb`);
        // this.readFileAsDataURL(file, (result) => thumbElement.setAttribute('src', result as string));

        // this.readFileAsBuffer(file, async (buffer) => {
        //     this.thumbBuffer = buffer;
        // });

        // preview image
        const reader = new FileReader();
        reader.onload = () => {
            selectedFile.src = reader.result as string;
        };
        reader.readAsDataURL(file);
    }
}