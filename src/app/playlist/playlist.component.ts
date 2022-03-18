import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AudioService, StreamInfo } from '../services/audio.service';
import { Album, Playlist, Song } from 'src/types/interfaces';
import { secondsToTime } from '../app.helper';
import { DatastoreLoaderService } from '../services/datastore-loader.service';
import { Observable } from 'rxjs';

declare var DatastoreService: any;

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {
    songs: any[];
    playlist: Playlist = {
        _id: '',
        name: '',
        description: '',
        thumbnailUrl: '/assets/images/no-image.png',
        creator: '',
        songs: []
    };

    id: string; // playlist/album id
    type: string; // Playlist | Album
    isPlaying: boolean = false;

    constructor(
        private cd: ChangeDetectorRef,
        private route: ActivatedRoute,
        private _audioService: AudioService,
        private _datastoreLoaderService: DatastoreLoaderService
    ) {}

    async ngOnInit(): Promise<void> {
        this.id = this.route.snapshot.paramMap.get('id');
        this.type = this.route.routeConfig.path.split('/')[0];

        this.route.params.subscribe(async (params) => {
            const id = params.id;

            this._datastoreLoaderService.load$.subscribe(async () => {
                await this.loadData();
            });
            if (this._datastoreLoaderService.isLoaded) await this.loadData();
        });

        this._audioService.getState().subscribe((state) => {
            if (!state.playing) {
                setTimeout(() => {
                    this.clearPlaying();
                });
            }
        });
    }

    async loadData() {
        if (this.type == 'playlist') {
            this.playlist = await DatastoreService.getPlaylistById(this.id);

            // get songs
            var songs = await DatastoreService.getPlaylistSongs(this.id);
            this.playlist.songs = songs;
            console.log('this.playlist', this.playlist);
        }

        if (this.type == 'album') {
            var album: Album = await DatastoreService.getAlbumById(this.id);
            this.playlist = {
                _id: album._id,
                name: album.title,
                description: album.description,
                thumbnailUrl: album.thumbnailUrl,
                songs: album.songs,
                creator: album.creator
            };

            console.log('this.album', this.playlist);
        }
    }

    playSong(song: any): void {
        let streamInfo: StreamInfo = { index: 0, songs: [song] };
        this._audioService.playStream(streamInfo).subscribe((events) => {
            this.setPlaying(song);
        });
    }

    playPlaylist(): void {
        let streamInfo: StreamInfo = { index: 0, songs: this.playlist.songs };
        this._audioService.playStream(streamInfo).subscribe((events) => {
            this.setPlaying(this.playlist.songs[0]);
        });
    }

    pause(): void {
        this._audioService.pause();

        setTimeout(() => {
            this.clearPlaying();
        });
    }

    setPlaying(song: Song) {
        this.clearPlaying();
        this.playlist.songs.forEach((s) => {
            if (s._id == song._id) s.playing = true;
        });
        this.isPlaying = true;
    }

    clearPlaying() {
        this.playlist.songs.forEach((song) => {
            song.playing = false;
        });
        this.isPlaying = false;
    }

    secondsToTime(val) {
        return secondsToTime(val);
    }

    totalDuration() {
        var totalDuration = this.secondsToTime(this.playlist.songs.reduce((sum, { duration }) => sum + duration, 0));
        return totalDuration;
    }
}
