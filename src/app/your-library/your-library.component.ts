import { Component, OnInit, ViewChild } from '@angular/core';
import { ArweaveGraphqlService, ArweaveGraphqlTag } from '../services/arweave-graphql.service';
import { AudioService, StreamState, StreamInfo, SongInfo } from '../services/audio.service';
import { BindDataGridItem, DataGridItem } from '../data-grid/data-grid.component';
import { WalletComponent } from '../wallet/wallet.component';
import { Album, DatastoreService, Song } from '../services/datastore.service';

@Component({
    selector: 'app-your-library',
    templateUrl: './your-library.component.html',
    styleUrls: ['./your-library.component.scss']
})
export class YourLibraryComponent implements OnInit {
    @ViewChild('walletCompoment', { static: false }) walletCompoment: WalletComponent;
    songs: Array<DataGridItem> = new Array<DataGridItem>();
    playlists: Array<DataGridItem> = new Array<DataGridItem>();
    albums: Array<DataGridItem> = new Array<DataGridItem>();

    loading: boolean = false;
    state: StreamState;
    tab: string = 'songs';
    walletConnected: boolean = true;
    walletAddress: string = '0xE13336D630Bfc6292ffD631eCefCfbE6d617C07E';

    constructor(
        private _datastoreService: DatastoreService,
        private _audioService: AudioService,
        private _arweaveGrapqlService: ArweaveGraphqlService // private _bundlrService: BundlrService
    ) {}

    async ngOnInit(): Promise<void> {
        await this._datastoreService.init();

        // this._bundlrService.connection$.subscribe((isConnected: boolean) => {
        //     this.walletConnected = isConnected;
        //     this.loadAlbums();
        //     this.loadSongs();
        //     this.loadPlaylists();
        // });

        // this.walletConnected = this._bundlrService.isConnected();
        // if (!this.walletConnected) return;

        // // load data
        this.loadAlbums();
        this.loadSongs();
        // this.loadPlaylists();
    }

    playSong(song: any): void {
        let streamInfo: StreamInfo = { index: 0, songs: [song] };
        this._audioService.playStream(streamInfo).subscribe((events) => {});
    }

    playPlaylist(playlist: any): void {
        let streamInfo: StreamInfo = { index: 0, songs: playlist.songs };
        this._audioService.playStream(streamInfo).subscribe((events) => {});
    }

    connectWallet() {
        this.walletCompoment.openConnectDialog();
    }

    loadAlbums() {
        this.loading = true;
        this._datastoreService.getAlbums('', this.walletAddress).then((data) => {
            console.log('albums', data);
            data.forEach((item: Album) => {
                var dataItem = new BindDataGridItem();
                dataItem.bindAlbumData(item);
                this.albums.push(dataItem);
            });
            this.loading = false;
        });


        // this.loading = true;
        // this._datastoreService.getSongs('', this.walletAddress).then(data => {
        //     console.log('loadAlbums', data);
        //     data.forEach((item: Song) => {
        //             var dataGridItem: DataGridItem = {
        //                 id: item._id,
        //                 name: item.title,
        //                 description: item.artist,
        //                 thumbnail: item.thumbnailUrl,
        //                 creator: item.creator,
        //                 duration: item.duration.toString(),
        //                 url: item.audioUrl,
        //                 owner: item.creator,
        //                 type: 'song'
        //             }
        //             this.albums.push(dataGridItem);
        //         });
        //     this.loading = false;
        // });
        // this.loading = true;
        // // get albums
        // this._arweaveGrapqlService
        //     .queryByTags(
        //         [
        //             { name: 'Data-Type', values: ['album'] },
        //             { name: 'Creator', values: [this._bundlrService.getAddress()] }
        //         ],
        //         this._bundlrService.getAddress()
        //     )
        //     .subscribe((rs) => {
        //         var edges: any[] = rs.data.transactions.edges;
        //         edges.forEach((edge) => {
        //             var dataGridItem = this._arweaveGrapqlService.bindNodeToDataGridItem(edge.node);
        //             this.albums.push(dataGridItem);
        //         });
        //         this.loading = false;
        //     });
    }

    loadSongs() {
        this.loading = true;
        this._datastoreService.getSongs('', this.walletAddress).then((data) => {
            console.log('songs', data);
            data.forEach((item: Song) => {
                var dataItem = new BindDataGridItem();
                dataItem.bindSongData(item);
                this.songs.push(dataItem);
            });
            this.loading = false;
        });

        // // get songs
        // this.loading = true;
        // this._arweaveGrapqlService
        //     .queryByTags([
        //         { name: 'Data-Type', values: ['song'] },
        //         { name: 'Creator', values: [this._bundlrService.getAddress()] }
        //     ])
        //     .subscribe((rs) => {
        //         var edges: any[] = rs.data.transactions.edges;
        //         edges.forEach((edge) => {
        //             var dataGridItem = this._arweaveGrapqlService.bindNodeToDataGridItem(edge.node);
        //             this.songs.push(dataGridItem);
        //         });

        //         this.loading = false;
        //     });
    }

    loadPlaylists() {
        // this.loading = true;
        // this._arweaveGrapqlService
        //     .queryByTags([
        //         { name: 'Data-Type', values: ['playlist'] },
        //         { name: 'Creator', values: [this._bundlrService.getAddress()] }
        //     ])
        //     .subscribe((rs) => {
        //         var edges: any[] = rs.data.transactions.edges;
        //         edges.forEach((edge) => {
        //             var dataGridItem = this._arweaveGrapqlService.bindNodeToDataGridItem(edge.node);
        //             this.playlists.push(dataGridItem);
        //         });
        //         this.loading = false;
        //     });
    }
}
