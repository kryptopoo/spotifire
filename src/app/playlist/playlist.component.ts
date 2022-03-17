import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AudioService, StreamInfo } from '../services/audio.service';
import { Album, Playlist } from 'src/types/interfaces';
import { secondsToTime } from '../app.helper';

declare var DatastoreService: any;

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {
    songs: any[];
    playlist: Playlist;
    type: string; // Playlist | Album

    constructor(private route: ActivatedRoute, private _audioService: AudioService) {}

    async ngOnInit(): Promise<void> {
        const id = this.route.snapshot.paramMap.get('id');
        this.type = this.route.routeConfig.path.split('/')[0];

        this.route.params.subscribe(async (params) => {
            const id = params.id;

            if (this.type == 'playlist') {
                this.playlist = await DatastoreService.getPlaylistById(id);

                // get songs
                var songs = await DatastoreService.getPlaylistSongs(id);
                this.playlist.songs = songs;
                console.log('this.playlist', this.playlist);
            }

            if (this.type == 'album') {
                var album: Album = await DatastoreService.getAlbumById(id);
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
        });

        this._audioService.getState().subscribe((state) => {
            if (!state.playing) {
                this.clearPlaying();
            }
        });
    }

    playSong(song: any): void {
        this.clearPlaying();
        song.playing = true;
        let streamInfo: StreamInfo = { index: 0, songs: [song] };
        this._audioService.playStream(streamInfo).subscribe((events) => {});
    }

    playPlaylist(): void {
        this.clearPlaying();
        this.playlist.songs[0].playing = true;
        let streamInfo: StreamInfo = { index: 0, songs: this.playlist.songs };
        this._audioService.playStream(streamInfo).subscribe((events) => {});
    }

    pause(): void {
        this.clearPlaying();
        this._audioService.pause();
    }

    isPlaying() {
        var playing = false;
        this.playlist.songs.forEach((song) => {
            if (song.playing) playing = true;
        });
        return playing;
    }

    clearPlaying() {
        this.playlist.songs.forEach((song) => {
            song.playing = false;
        });
    }

    secondsToTime(val) {
        return secondsToTime(val);
    }

    totalDuration() {
        var totalDuration = this.secondsToTime(this.playlist.songs.reduce((sum, { duration }) => sum + duration, 0));
        return totalDuration;
    }
}
