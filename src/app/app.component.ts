import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BindDataGridItem, DataGridItem } from './data-grid/data-grid.component';
import { FileHelper, generateId } from './app.helper';
import { Web3storageService } from './services/web3storage.service';
import { WalletComponent } from './wallet/wallet.component';
import { Playlist } from 'src/types/interfaces';
import { WalletService } from './services/wallet.service';
import { DialogService } from './services/dialog.service';
import { DatastoreLoaderService } from './services/datastore-loader.service';

declare var DatastoreService: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChild('createPlaylistDialogRef') createPlaylistDialogRef: TemplateRef<any>;
    @ViewChild('walletCompoment', { static: false }) walletCompoment: WalletComponent;

    walletAddress: string = null;

    playlist: any = {
        name: '',
        description: '',
        thumbnailFile: { src: '/assets/images/no-image.png', file: null }
    };
    playlists: Array<DataGridItem> = new Array<DataGridItem>();

    fileHelper: FileHelper;

    constructor(
        private _fileHelper: FileHelper,
        private _dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _web3StorageService: Web3storageService,
        private _walletService: WalletService,
        private _dialogService: DialogService,
        private _datastoreLoaderService: DatastoreLoaderService
    ) {
        this.fileHelper = _fileHelper;
    }

    async ngOnInit() {
        await this._datastoreLoaderService.load();
        // const progressDialog = this._dialogService.startProgressDialog({
        //     progressMsg: 'Loading database...',
        //     progressIcon: 'sync',
        //     doneMsg: 'Database has been loaded successfully!',
        //     isProcessed: false,
        //     showDoneButton: false
        // });

        // await DatastoreService.initOrbitDB();

        // this._dialogService.closeProgressDialog(progressDialog);

        this.walletAddress = this._walletService.getAddress();
        localStorage.removeItem('spotifire.playlists');
        await this.loadPlaylists();

        this.loadLikedSongs();
    }

    ngAfterViewInit(): void {
        this._walletService.connection$.subscribe((isConnected: boolean) => {
            if (isConnected) {
                this.walletAddress = this._walletService.getAddress();
                this.loadPlaylists();
            }
        });
    }

    openCreatePlaylistDialog() {
        if (!this.walletAddress) return;

        this.playlist = {
            name: '',
            description: '',
            thumbnailFile: { src: '/assets/images/no-image.png', file: null }
        };
        this._dialog.open(this.createPlaylistDialogRef, {
            width: '35rem'
        });
    }

    async savePlaylist() {
        const thumbCid = await this._web3StorageService.upload([this.playlist.thumbnailFile.file]);
        const thumbnailUrl = `https://${thumbCid}.ipfs.dweb.link/${this.playlist.thumbnailFile.file.name}`;
        console.log('thumbCid', thumbCid);
        console.log('thumb url', thumbnailUrl);

        var newPlaylist: Playlist = {
            _id: generateId(),
            name: this.playlist.name,
            description: this.playlist.description,
            thumbnailUrl: thumbnailUrl,
            created: Math.round(Date.now()),
            creator: this.walletAddress
        };

        await DatastoreService.createPlaylist(newPlaylist);

        this._snackBar.open(`Playlist has been created`, null, { duration: 3000, panelClass: ['snackbar-success'] });
        await this.loadPlaylists();
    }

    async loadPlaylists() {
        this.playlists = [];
        var myPlaylists = await DatastoreService.getPlaylists(this.walletAddress);
        myPlaylists.forEach((item) => {
            var dataItem = new BindDataGridItem(item, 'playlist');
            // dataItem.bindPlaylistData(item);
            this.playlists.push(dataItem);
        });
        console.log('load playlists', this.playlists);
        localStorage.setItem('spotifire.playlists', JSON.stringify(this.playlists));
    }

    loadLikedSongs() {
        var myLikedSongs = DatastoreService.getLikedSongs(this.walletAddress);
        console.log('myLikedSongs', myLikedSongs);
        localStorage.setItem('spotifire.likedSongs', JSON.stringify(myLikedSongs));
    }
}
