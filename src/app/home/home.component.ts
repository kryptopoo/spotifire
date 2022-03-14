import { Component, OnInit } from '@angular/core';
import { BindDataGridItem, DataGridItem } from '../data-grid/data-grid.component';
import { DatastoreService } from '../services/datastore.service';

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

    constructor(private _datastoreService: DatastoreService) {}

    async ngOnInit(): Promise<void> {
        this.loading = true;

        // // get songs
        // let newSongs = await this._datastoreService.getNews('song');
        // newSongs.forEach((item) => {
        //     var dataItem = new BindDataGridItem(item.object, 'song');
        //     this.songs.push(dataItem);
        // });

        // // get albums
        // let newAlbums = await this._datastoreService.getNews('album');
        // newAlbums.forEach((item) => {
        //     var dataItem = new BindDataGridItem(item.object, 'album');
        //     this.albums.push(dataItem);
        // });

        // // get playlists
        // let newPlaylists = await this._datastoreService.getNews('playlist');
        // newPlaylists.forEach((item) => {
        //     var dataItem = new BindDataGridItem(item.object, 'playlist');
        //     this.playlists.push(dataItem);
        // });

        this.loading = false;
    }
}
