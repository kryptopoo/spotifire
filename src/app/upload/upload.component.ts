import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import * as id3 from 'id3js';
import { Subject } from 'rxjs';
import { AppConstants } from '../app.constants';
import { FileHelper, SelectInputFile } from '../app.helper';
import { ProgressDialogData } from '../dialogs/progress-dialog/progress-dialog.component';
import { Album, Artist, DatastoreService, Song } from '../services/datastore.service';
import { DialogService } from '../services/dialog.service';
import { Web3storageService } from '../services/web3storage.service';
import { WalletComponent } from '../wallet/wallet.component';
import { environment } from './../../environments/environment';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, AfterViewInit {
    @ViewChild('walletCompoment', { static: false }) walletCompoment: WalletComponent;

    walletAddress: string = null;

    genres = AppConstants.Genres;

    // thumbBuffer: Buffer = null;
    album: any = {
        title: '',
        artist: '',
        genre: '',
        description: '',
        thumbnailFile: { src: '/assets/images/no-image.png', file: null },
        songs: []
    };

    fileHelper: FileHelper;

    constructor(
        private _fileHelper: FileHelper,
        private _datastoreService: DatastoreService,
        private _web3StorageService: Web3storageService,
        private _snackBar: MatSnackBar,
        private _dialogService: DialogService
    ) {
        this.fileHelper = _fileHelper;
    }

    ngOnInit(): void {
        this.walletAddress = localStorage.getItem('spotifire.wallet') ;
    }

    
    ngAfterViewInit(): void {
        this.walletCompoment.connection$.subscribe((isConnected: boolean) => {
            this.walletAddress = localStorage.getItem('spotifire.wallet');
        });
    }

    async onAddAudioFileChanged(event: Event) {
        const target = event.target as HTMLInputElement;
        const file: File = (target.files as FileList)[0];

        let addSong = {
            title: '',
            artist: '',
            genre: 'Unknown',
            duration: 0,
            audioFile: { src: null, file: file }
        };
        this.album.songs.push(addSong);

        setTimeout(() => {
            const audioElement = document.getElementById(`audio-${this.album.songs.length}`);
            this.fileHelper.readFileAsDataURL(file, (result) => {
                audioElement.setAttribute('src', result as string);
                addSong.audioFile.src = result as string;

                audioElement.onloadedmetadata = function () {
                    addSong.duration = (audioElement as any).duration;
                };
            });
            // this.readFileAsBuffer(file, async (buffer) => {
            //     try {
            //         addSong.price = (await this._bundlrService.getPrice(buffer.length)).toFixed(5);
            //     } catch {}

            //     addSong.buffer = buffer;
            // });
        }, 100);

        id3.fromFile(file).then((tags) => {
            // tags now contains v1, v2 and merged tags
            console.log(tags);
            addSong.title = tags.title;
            addSong.artist = tags.artist?.split(',').pop();
            //addSong.duration = tags.duration;
        });

        console.log('this.album.songs', this.album.songs);
    }

    async upload() {
        this._dialogService.startProgressDialog( {
            progressMsg: 'The upload process would be taken a little time. Please wait...',
            doneMsg: 'Done!',
            isProcessed: false
        });

        // TODO: validation
        console.log('upload album', this.album);

        // upload to web3storage
        const thumbCid = await this._web3StorageService.upload([this.album.thumbnailFile.file]);
        const thumbnailUrl =  `https://${thumbCid}.ipfs.dweb.link/${this.album.thumbnailFile.file.name}`;
        console.log('thumbCid', thumbCid);
        console.log('thumb url', thumbnailUrl);

        // get artist
        var artists = await this._datastoreService.getArtists(this.album.artist);
        console.log('artists', artists)
        let artist: Artist = {
            _id: this._datastoreService.generateId(),
            avatarUrl: '',
            created:  Math.round(Date.now()),
            name: this.album.artist
        }
        if (artists.length == 0){
            
            await this._datastoreService.createArtist(artist)
        } else {
            artist = artists[0];
        }
        console.log('artist', artist)

         // add album to orbitdb
         let newAlbum: Album = {
            _id: this._datastoreService.generateId(),
            title: this.album.title,
            artist: artist,
            genre: this.album.genre.toLowerCase(),
            description: this.album.description,
            thumbnailUrl: thumbnailUrl,
            songs: new Array<Song>(),
            created: Math.round(Date.now()),
            creator: this.walletAddress
        };

        for (let i = 0; i < this.album.songs.length; i++) {
            let song = this.album.songs[i];
            let audioCid = await this._web3StorageService.upload([song.audioFile.file]);
            let audioUrl =  `https://${audioCid}.ipfs.dweb.link/${song.audioFile.file.name}`;
            console.log('audioCid', audioCid);
            console.log('audio url', audioUrl);

            // add song to orbitdb
            let newSong: Song = {
                _id: this._datastoreService.generateId(),
                title: song.title,
                artist: artist,
                genre: this.album.genre.toLowerCase(),
                duration: song.duration,
                audioUrl: audioUrl,
                thumbnailUrl: thumbnailUrl,
                created: Math.round(Date.now()),
                creator: this.walletAddress
            };
            await this._datastoreService.createSong(newSong);
            newAlbum.songs.push(newSong);
        }

        await this._datastoreService.createAlbum(newAlbum);

        this._dialogService.stopProgressDialog();
    }

    log(type: string, contentType: string, txId: string, description: string) {
        // var transactionCollection = this._firestore.collection(`logs-${this._bundlrService.getAddress()}`);
        // transactionCollection.add({
        //     time: Math.round(Date.now() / 1000).toString(),
        //     type: type,
        //     contentType: contentType,
        //     txId: txId,
        //     description: description
        // });
    }

    connectWallet() {
        this.walletCompoment.openConnectDialog();
    }
}
