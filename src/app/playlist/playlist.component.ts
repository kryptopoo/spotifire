import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AudioService, StreamInfo } from '../services/audio.service';
import { Album, Playlist } from 'src/types/interfaces';
import moment from 'moment';

declare var DatastoreService: any;

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {
    songs: any[];
    playlist: any = { title: null, description: null, artist: null, thumbnail: null, creator: null, duration: 0, songs: [] };

    playingSongId: string = null;

    constructor(private route: ActivatedRoute, private _audioService: AudioService) {}

    async ngOnInit(): Promise<void> {
        const id = this.route.snapshot.paramMap.get('id');
        const type = this.route.routeConfig.path.split('/')[0];

        this.route.params.subscribe(async (params) => {
            const id = params.id;

            if (type == 'playlist') {
                var playlist: Playlist = await DatastoreService.getPlaylistById(id);
                this.playlist = {
                    title: playlist.name,
                    description: playlist.description,
                    type: type,
                    thumbnail: playlist.thumbnailUrl,
                    songs: [],
                    // owner: edges[0].node.owner.address,
                    creator: playlist.creator,
                    duration: 0
                };

                // get songs
                var songs = await DatastoreService.getPlaylistSongs(id);
                this.playlist.songs = songs;
                console.log('this.playlist', this.playlist);
            }

            if (type == 'album') {
                var album: Album = await DatastoreService.getAlbumById(id);
                this.playlist = {
                    title: album.title,
                    description: album.description,
                    type: type,
                    thumbnail: album.thumbnailUrl,
                    songs: album.songs,
                    // owner: edges[0].node.owner.address,
                    creator: album.creator,
                    duration: 0
                };

                console.log('this.album', this.playlist);
            }

            // calculate duration
            this.playlist.duration = this.secondsToTime(this.playlist.songs.reduce((sum, { durationValue }) => sum + parseFloat(durationValue), 0));
        });

        this._audioService.getState().subscribe((state) => {
            if (!state.playing) {
                this.playingSongId = null;
            }
        });
    }

    secondsToTime(val: any) {
        var secs = val;
        if (typeof val === 'string' || val instanceof String) secs = parseFloat(val.toString());

        return moment.utc(secs * 1000).format('HH:mm:ss');
    }

    playSong(song: any): void {
        this.playingSongId = song.id;
        let streamInfo: StreamInfo = { index: 0, songs: [song] };
        this._audioService.playStream(streamInfo).subscribe((events) => {});
    }

    playPlaylist(): void {
        this.playingSongId = this.playlist.songs[0].id;
        let streamInfo: StreamInfo = { index: 0, songs: this.playlist.songs };
        this._audioService.playStream(streamInfo).subscribe((events) => {});
    }

    pause(): void {
        this.playingSongId = null;
        this._audioService.pause();
    }
}
