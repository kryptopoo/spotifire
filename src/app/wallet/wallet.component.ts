import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
    @ViewChild('walletDialogRef') walletDialogRef: TemplateRef<any>;
    @ViewChild('connectDialogRef') connectDialogRef: TemplateRef<any>;

    connection$: Subject<boolean> = new Subject<boolean>();

    bunlderAddress: string = null;
    address: string = null;
    shortAddress: string = null;
    balance: number = 0;
    amount: number = 0;
    loading = {
        fund: false,
        withdraw: false
    };

    constructor(private _snackBar: MatSnackBar, private _dialog: MatDialog) {}

    async ngOnInit(): Promise<void> {
        await this.loadWalletInfo();
    }

    async connect() {
        const ethereum = (window as any)?.ethereum;

        console.log('ethereum', ethereum);

        if (!ethereum?.isMetaMask) return null;
        await ethereum.enable();

        try {
            // Will open the MetaMask UI
            // You should disable this button while the request is pending!
            await ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            console.log('accounts', accounts);

            if (accounts.length > 0) {
                localStorage.setItem('spotifire.wallet', accounts[0]);
                this.loadWalletInfo();
                this._snackBar.open(`Connected wallet ${this.address}`, null, { duration: 3000, panelClass: ['snackbar-success'] });
                this.connection$.next(true);
            } else {
                this._snackBar.open(`Cannot connect wallet`, null, { duration: 3000, panelClass: ['snackbar-success'] });
            }
        } catch (error) {
            console.error(error);
        }

        // const isConnected = await this._bundlrService.connect(bunlderAddress);
        // if (isConnected) {
        //     await this.loadWalletInfo();
        //     this._snackBar.open(`Wallet has been connected`, null, { duration: 3000, panelClass: ['snackbar-success'] });
        // }
        // this._bundlrService.connection$.next(isConnected);
    }

    async disconnect() {
        localStorage.removeItem('spotifire.wallet');
        window.location.reload();
        // await this._bundlrService.disconnect();
    }

    async loadWalletInfo() {
        const walletAddr = localStorage.getItem('spotifire.wallet');
        if (walletAddr) {
            this.address = walletAddr;
            this.shortAddress = `${this.address.substring(0, 6)}...${this.address.substring(this.address.length - 4)}`;
        }
    }

    openWalletDialog() {
        this._dialog.open(this.walletDialogRef);
    }

    openConnectDialog() {
        this._dialog.open(this.connectDialogRef);
    }
}
