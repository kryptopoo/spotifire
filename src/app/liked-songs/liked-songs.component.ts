import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Playlist, Song } from 'src/types/interfaces';
import { secondsToTime, timeToFromNow } from '../app.helper';
import { AudioService, StreamInfo } from '../services/audio.service';
import { WalletService } from '../services/wallet.service';

declare var DatastoreService: any;

@Component({
    selector: 'app-liked-songs',
    templateUrl: './liked-songs.component.html',
    styleUrls: ['./liked-songs.component.scss']
})
export class LikedSongsComponent implements OnInit, AfterViewInit {
    playlist: Playlist = {
        _id: 'liked-songs',
        name: 'Liked Songs',
        description: null,
        thumbnailUrl: 'assets/images/liked-songs.png',
        creator: '',
        songs: []
    };

    constructor(private _audioService: AudioService, private _walletService: WalletService, private _snackBar: MatSnackBar) {
        this.playlist = {
            _id: 'liked-songs',
            name: 'Liked Songs',
            description: null,
            thumbnailUrl: 'assets/images/liked-songs.png',
            creator: this._walletService.getAddress(),
            songs: []
        };
    }

    ngOnInit() {
        
    }

    ngAfterViewInit(): void {
        console.log('ngAfterViewInit')
        this.clearPlaying()
        this.loadLikedSongs();

        this._audioService.getState().subscribe((state) => {
            if (!state.playing) {
                this.clearPlaying()
            }
        });
    }

    private loadLikedSongs() {
        this.playlist.songs = [];
        var likedSongs: Array<Song> = DatastoreService.getLikedSongs(this._walletService.getAddress());
        this.playlist.songs = likedSongs;
        console.log('likedSongs playlist', this.playlist);
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

    clearPlaying(){
        this.playlist.songs.forEach((song) => {
            song.playing = false;
        });
    }

    secondsToTime(val) {
        return secondsToTime(val);
    }

    async removeLikeSong(likedSong) {
        likedSong.liked = false;
        var newLikedSongs = await DatastoreService.removeLikeSong(this._walletService.getAddress(), likedSong);
        localStorage.setItem('spotifire.likedSongs', JSON.stringify(newLikedSongs));
        this._snackBar.open(`Removed from your liked songs`, null, { duration: 1500, panelClass: ['snackbar-info'] });

        this.loadLikedSongs();
    }

    timeToFromNow(value) {
        return timeToFromNow(value);
    }
}
