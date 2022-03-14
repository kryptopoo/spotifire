import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BindDataGridItem, DataGridItem } from './data-grid/data-grid.component';
import { environment } from './../environments/environment';
import { FileHelper } from './app.helper';
import { Web3storageService } from './services/web3storage.service';
import { DatastoreService, Playlist } from './services/datastore.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChild('createPlaylistDialogRef') createPlaylistDialogRef: TemplateRef<any>;

    walletConnected: boolean = true;
    walletAddress: string = '0xE13336D630Bfc6292ffD631eCefCfbE6d617C07E';

    // thumbBuffer: any = null;
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
        private _datastoreService: DatastoreService,
    ) {
        this.fileHelper = _fileHelper;

        // this._datastoreService.init().then(()=> { 
        //     console.log('datastore initiated')
        //     this._datastoreService.loadAll().then(()=> { 
        //         console.log('datastore loaded')
        //     });
        // });
        
    }

    async ngOnInit() {
        // localStorage.removeItem('arpomus.playlists');
        // this._bundlrService.connection$.subscribe((isConnected: boolean) => {
        //     this.walletConnected = isConnected;
        //     this.loadPlaylists();
        // });

        await this._datastoreService.init()
        // await this._datastoreService.loadAll();

        localStorage.removeItem('spotifire.playlists');
        await this.loadPlaylists();
    }

    openCreatePlaylistDialog() {
        if (!this.walletConnected) return;

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
            _id: this._datastoreService.generateId(),
            name: this.playlist.name,
            description: this.playlist.description,
            thumbnailUrl: thumbnailUrl,
            created: Math.round(Date.now()),
            creator: this.walletAddress
        };

        await this._datastoreService.createPlaylist(newPlaylist);

        this._snackBar.open(`Playlist has been created`, null, { duration: 3000, panelClass: ['snackbar-success'] });
        await this.loadPlaylists();
    }

    async loadPlaylists() {
        this.playlists = [];
        var myPlaylists = await this._datastoreService.getPlaylists(this.walletAddress);
        myPlaylists.forEach((item) => {
            var dataItem = new BindDataGridItem(item, 'playlist');
            // dataItem.bindPlaylistData(item);
            this.playlists.push(dataItem);
        });
        console.log('load playlists', this.playlists);
        localStorage.setItem('spotifire.playlists', JSON.stringify(this.playlists));
    }
}
