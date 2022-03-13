import { Component, OnInit } from '@angular/core';
import { ArweaveGraphqlService } from '../services/arweave-graphql.service';
import { DataGridItem } from '../data-grid/data-grid.component';
import { Album, DatastoreService, Song } from '../services/datastore.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    loading: boolean = false;
    songs: Array<DataGridItem> = new Array<DataGridItem>();
    playlists: Array<DataGridItem> = new Array<DataGridItem>();
    albums: Array<DataGridItem> = new Array<DataGridItem>();

    constructor(
        private _datastoreService: DatastoreService,
        private _arweaveGrapqlService: ArweaveGraphqlService
        ) {}

    async ngOnInit(): Promise<void> {
        await this._datastoreService.init();
        // this._datastoreService.createSong({_id: this._datastoreService.generateId(), artist: 'Justin', title: 'Show me the Meaning of Lonely', audioUrl: 'google.com'})
        // .then(hash => {
        //     console.log('hash', hash);
        // })

        // console.log('this._datastoreService.songStore', this._datastoreService.songStore)

//         let newAlbum: Album = {
//             _id: this._datastoreService.generateId(),
//             title: 'test 2',
//             artist: 'test 2',
//             genre: 'test',
//             description: 'test',
//             thumbnailUrl: 'test',
//             songs: new Array<Song>()
//         };
//         let albumHash = await this._datastoreService.createAlbum(newAlbum);
// console.log('albumhash', albumHash);
        
        // await this._datastoreService.songStore.load()
        // let allSongs = this._datastoreService.songStore.get('') // this gets all the entries in the database store
        // console.log('allSongs', allSongs)

        // allSongs.forEach(async (song) => {
        //     let removed = await this._datastoreService.songStore.del(song.title);
        //     console.log('removed', removed);
        // });

        // allSongs = this._datastoreService.songStore.get('') // this gets all the entries in the database store
        // console.log('allSongs', allSongs)

        // const querySongs = this._datastoreService.songStore.query((e)=> e.genre == 'Pop');

        // console.log('querySongs', querySongs)

        await this._datastoreService.albumStore.load()
        const allAlbums = this._datastoreService.albumStore.get('') // this gets all the entries in the database store
        console.log('allAlbums', allAlbums)
        // allAlbums.forEach(async (song) => {
        //     let removed = await this._datastoreService.albumStore.del(song.title);
        //     console.log('removed', removed);
        // });

        var search = await this._datastoreService.searchSongs('show', 'lonely');
            console.log(search)

        // this._datastoreService.songStore.events.on('ready', (dbname, heads) => {
        //     console.log('on ready', dbname)
            
        // } );
        // this._datastoreService.songStore.events.on('data', (dbname, event) => {
        //     console.log('on data', dbname)
        // } )

      

        
        // // get albums
        // this.loading = true;
        // this._arweaveGrapqlService.queryByTags([{ name: 'Data-Type', values: ['album'] }]).subscribe((rs) => {
        //     var edges: any[] = rs.data.transactions.edges;
        //     edges.forEach((edge) => {
        //         var dataGridItem = this._arweaveGrapqlService.bindNodeToDataGridItem(edge.node);
        //         this.albums.push(dataGridItem);
        //     });
        //     this.loading = false;
        // });

        // // get songs
        // this.loading = true;
        // this._arweaveGrapqlService.queryByTags([{ name: 'Data-Type', values: ['song'] }]).subscribe((rs) => {
        //     var edges: any[] = rs.data.transactions.edges;
        //     edges.forEach((edge) => {
        //         var dataGridItem = this._arweaveGrapqlService.bindNodeToDataGridItem(edge.node);
        //         this.songs.push(dataGridItem);
        //     });
        //     this.loading = false;
        // });

        // // get playlist
        // this.loading = true;
        // this._arweaveGrapqlService.queryByTags([{ name: 'Data-Type', values: ['playlist'] }]).subscribe((rs) => {
        //     var edges: any[] = rs.data.transactions.edges;
        //     edges.forEach((edge) => {
        //         var dataGridItem = this._arweaveGrapqlService.bindNodeToDataGridItem(edge.node);
        //         this.playlists.push(dataGridItem);
        //     });
        //     this.loading = false;
        // });
    }
}
