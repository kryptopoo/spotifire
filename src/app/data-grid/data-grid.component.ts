import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Album, Playlist, Song } from 'src/types/interfaces';
import { AudioService, StreamInfo } from '../services/audio.service';
import { DialogService } from '../services/dialog.service';

declare var DatastoreService: any;

export interface DataGridItem {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    url: string;
    type: string;
    duration: string;
    owner: string;
    creator: string;
    dataSource?: Song | Album | Playlist;
}

export class BindDataGridItem implements DataGridItem {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    url: string;
    type: string;
    duration: string;
    owner: string;
    creator: string;
    dataSource?: Song | Album | Playlist;

    constructor(ds: Song | Album | Playlist, type: string) {
        this.dataSource = ds;
        this.type = type;
        if (this.type == 'song') this.bindSongData(this.dataSource as Song);
        if (this.type == 'album') this.bindAlbumData(this.dataSource as Album);
        if (this.type == 'playlist') this.bindPlaylistData(this.dataSource as Playlist);
    }

    private bindAlbumData(item: Album) {
        this.id = item._id;
        this.name = item.title;
        this.description = item.artist.name;
        this.thumbnail = item.thumbnailUrl;
        this.creator = item.creator;
        this.owner = item.creator;
    }

    private bindSongData(item: Song) {
        this.id = item._id;
        this.name = item.title;
        this.description = item.artist.name;
        this.thumbnail = item.thumbnailUrl;
        this.creator = item.creator;
        this.duration = item.duration.toString();
        this.url = item.audioUrl;
        this.owner = item.creator;
    }

    private bindPlaylistData(item: Playlist) {
        this.id = item._id;
        this.name = item.name;
        this.description = item.description;
        this.thumbnail = item.thumbnailUrl;
        this.creator = item.creator;
        this.owner = item.creator;
    }
}

@Component({
    selector: 'app-data-grid',
    templateUrl: './data-grid.component.html',
    styleUrls: ['./data-grid.component.scss']
})
export class DataGridComponent implements OnInit {
    @Input() items: Array<DataGridItem>;

    selectedItem: DataGridItem;
    playlists: Array<any> = new Array<any>();
    walletAddress: string = '0xE13336D630Bfc6292ffD631eCefCfbE6d617C07E';

    constructor(
        private _audioService: AudioService,
        private _router: Router,
        private _dialogService: DialogService,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.playlists = JSON.parse(localStorage.getItem('spotifire.playlists'));
    }

    shortAddress(address: string) {
        return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
    }

    play(item: DataGridItem): void {
        if (item.type == 'song') {
            let song: Song = item.dataSource as Song;
            let streamInfo: StreamInfo = { index: 0, songs: [song] };
            this._audioService.playStream(streamInfo).subscribe((events) => {});
        } else if (item.type == 'album') {
            this._router.navigateByUrl(`/album/${item.id}`);
        } else if (item.type == 'playlist') {
            this._router.navigateByUrl(`/playlist/${item.id}`);
        }
    }

    async addToPlaylist(playlist) {
        console.log('addToPlaylist', this.selectedItem.dataSource as Song, playlist);

        // await DatastoreService.addToPlaylist({
        //     _id: this.selectItem.id,
        //     title: this.selectItem.name,
        //     artist: {
        //         _id: '',
        //         avatarUrl: '',
        //         name: '',
        //         created: 0
        //     },
        //     audioUrl: '',
        //     created: 0,
        //     creator: '',
        //     duration: 0,
        //     genre: '',
        //     thumbnailUrl: ''
        // }, playlist, '')

        await DatastoreService.addToPlaylist(this.selectedItem.dataSource as Song, playlist.id, this.walletAddress);
        this._snackBar.open(`Added "${this.selectedItem.name}" to "${playlist.name}" successfully`, null, {
            duration: 3000,
            panelClass: ['snackbar-success']
        });

        // const dataBytes = Buffer.from('').length;
        // const dataUploadFee = await this._bundlrService.getPrice(dataBytes);
        // this._dialogService
        //     .confirmDialog({
        //         fee: dataUploadFee.toFixed(5)
        //     })
        //     .subscribe(async (confirmed) => {
        //         if (confirmed) {
        //             let tags = [
        //                 { name: 'Content-Type', value: 'application/json' },
        //                 { name: 'Data-Type', value: 'playlist-song' },
        //                 { name: 'Title', value: this.selectedItem.name },
        //                 { name: 'Artist', value: this.selectedItem.description },
        //                 { name: 'Thumbnail', value: this.selectedItem.thumbnail?.split('/').pop() },
        //                 { name: 'Duration', value: this.selectedItem.duration },
        //                 { name: 'Playlist', value: playlist.id },
        //                 { name: 'Song', value: this.selectedItem.url?.split('/').pop() }
        //             ];

        //             let rsAddPlaylist: any = await this._bundlrService.upload(Buffer.from(''), tags);
        //             console.log('rsAddPlaylist', rsAddPlaylist.data);

        //             //this._snackBar.open(`Transaction ${rsAddPlaylist.data.id} has been submitted`, null, { duration: 3000, panelClass: ['snackbar-success'] });
        //             this._snackBar.open(`Added "${this.selectedItem.name}" to "${playlist.name}" successfully`, null, {
        //                 duration: 3000,
        //                 panelClass: ['snackbar-success']
        //             });
        //         }
        //     });
    }

    selectItem(item: DataGridItem) {
        this.selectedItem = item;
    }
}
