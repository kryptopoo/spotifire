import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConstants } from '../app.constants';
import { BindDataGridItem, DataGridItem } from '../data-grid/data-grid.component';
import { DatastoreService } from '../services/datastore.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    loading: boolean = false;
    showResult: boolean = false;
    genres: any[] = new Array();

    searchTextValue: string = null;
    searchGenreValue: string = null;

    foundAlbums: Array<DataGridItem> = new Array<DataGridItem>();
    foundSongs: Array<DataGridItem> = new Array<DataGridItem>();
    foundPlaylists: Array<DataGridItem> = new Array<DataGridItem>();

    constructor(private route: ActivatedRoute, private _datastoreService: DatastoreService) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this.searchTextValue = this.route.snapshot.queryParams.v;
            this.searchGenreValue = this.route.snapshot.queryParams.g;

            if (this.searchGenreValue) {
                this.searchByGenre();
            }
        });

        // get genres
        this.genres = AppConstants.Genres;
    }

    enterSearch(event) {
        this.searchGenreValue = null;
        this.searchTextValue = event.target.value;
        this.searchByText();
    }

    async searchByGenre() {
        this.loading = true;
        this.searchTextValue = null;
        this.foundAlbums = [];
        this.foundSongs = [];
        this.foundPlaylists = [];

        var albums = await this._datastoreService.getAlbums(this.searchGenreValue.toLowerCase(), null);
        albums.forEach((item) => {
            var dataItem = new BindDataGridItem(item, 'album');
            this.foundAlbums.push(dataItem);
        });

        this.loading = false;
    }

    async searchByText() {
        this.loading = true;
        this.searchGenreValue = null;
        this.foundAlbums = [];
        this.foundSongs = [];
        this.foundPlaylists = [];

        var searchWords = this.searchTextValue.split(' ');

        // search album
        var albums = this._datastoreService.searchAlbums(searchWords, searchWords);
        albums.forEach((item) => {
            var dataItem = new BindDataGridItem(item, 'album');
            this.foundAlbums.push(dataItem);
        });

        // search songs
        var songs = this._datastoreService.searchSongs(searchWords, searchWords);
        songs.forEach((item) => {
            var dataItem = new BindDataGridItem(item, 'song');
            this.foundSongs.push(dataItem);
        });

        // search playlists
        var playlists = this._datastoreService.searchPlaylists(searchWords);
        playlists.forEach((item) => {
            var dataItem = new BindDataGridItem(item, 'playlist');
            this.foundPlaylists.push(dataItem);
        });

        this.loading = false;
    }
}
