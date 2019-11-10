import { Component, OnInit, ViewChild } from '@angular/core';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import { BidRequest } from '../bidrequest';
import { Angulartics2 } from 'angulartics2';

@Component({
  selector: 'app-boad',
  templateUrl: './boad.component.html',
  styleUrls: ['./boad.component.scss']
})
// @Injectable({
//   providedIn: 'root'
// })
export class BoadComponent implements OnInit {

  apiURL = 'http://www.server.com/api/';
  squares: any[];
  // xIsNext: boolean;
  winner: string;
  usersMaxValue: number;
  botsMaxValue: number;
  pauseAllInputs: boolean;
  // logicalError = false;
  // errorLable: string;
  gameIsOn: boolean;
  bidMessage: string = null;
  botBidValue: number = null;
  statusValue: string = null;
  userBidValue: number = null;
  moveInProgress = false;

  // constructor(private httpClient: HttpClient) {}
  constructor(private angulartics2: Angulartics2) {
    this.angulartics2.eventTrack.next({
      action: 'FirstView',
      properties: { category: 'openGame' },
    });
  }


  ngOnInit() {
    this.newGame();
  }

  /**
   * Initilize the game board
   */
  newGame() {
    this.squares = Array(9).fill(null);
    this.winner =  null;
    // this.xIsNext = true;
    this.usersMaxValue = 100;
    this.botsMaxValue = 100;
    this.botBidValue =  0;
    this.userBidValue = 0;
    this.pauseAllInputs = true;
    this.gameIsOn =  true;
    this.bidMessage = null;
    this.statusValue = null;
  }
  onClose() {
    this.bidMessage = null;
  }
  sendDataToUser(usersBid: any) {
    // console.log(usersBid);
    usersBid.blur();
    if (this.winner != null || this.moveInProgress) {
      return;
    }
    this.bidMessage = null;
    const bidValue =  +usersBid.value;
    this.userBidValue = bidValue;
    if (bidValue > this.usersMaxValue || bidValue <  1) {
      this.statusValue = 'danger';
      this.bidMessage = 'User\'s bid cannot be greater than ' + this.usersMaxValue + ' or less than 1';
      usersBid.value = '';
      return;
    }
    this.botBidValue = this.getBotBid();
    if (bidValue >  this.botBidValue) {
      this.pauseAllInputs = false;
      this.statusValue = 'info';
      this.bidMessage = 'You won the bid, make a move. (You: ' + bidValue + ',  Bot: ' + this.botBidValue + ').';
      this.botsMaxValue += bidValue;
      this.usersMaxValue -= bidValue;
      this.moveInProgress = true;
      this.angulartics2.eventTrack.next({
        action: 'BidWon',
        properties: { category: 'playing', label: bidValue + '-' + this.botBidValue  },
      });
    } else if (bidValue <  this.botBidValue) {
      this.statusValue = 'warning';
      this.bidMessage = 'Sorry you did not win the bid, (You: ' + bidValue + ',  Bot: ' + this.botBidValue + ').';
      this.botsMaxValue -= this.botBidValue;
      this.usersMaxValue += this.botBidValue;
      this.makeBotsmove();
      this.angulartics2.eventTrack.next({
        action: 'BidLost',
        properties: { category: 'playing', label: bidValue + '-' + this.botBidValue  },
      });
    } else {
      this.statusValue = 'warning';
      this.bidMessage = 'No one bid please bid again, (You: ' + bidValue + ',  Bot: ' + this.botBidValue + ').';
      this.userBidValue = 0;
      this.botBidValue = 0;
      this.angulartics2.eventTrack.next({
        action: 'BidDraw',
        properties: { category: 'playing', label: bidValue + '-' + this.botBidValue  },
      });
    }
  }
  // Get bid bot
  getBotBid() {
    if (this.botsMaxValue === 0 || this.botsMaxValue === 1) {
      return this.botsMaxValue;
    }
    let botsBid = this.botsMaxValue / 2;
    const tmp = Math.floor(Math.random() * (botsBid + 10) ) + 1 ;
    if (tmp >  botsBid) {
      botsBid +=  tmp;
    } else if (tmp < botsBid) {
       botsBid -= tmp;
    }
    if (botsBid > 100) {
      botsBid = botsBid / 2;
    }
    botsBid = Math.ceil(botsBid);
    return botsBid;
  }
  /**
   * Get the current player
   */
  // get player() {
  //   return this.xIsNext ? 'X' : 'O';
  // }

  calculateWinner() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c]
      ) {
        return this.squares[a];
      }
    }
    if (this.usersMaxValue <= 0) {
      return 'O';
    }
    if (this.botsMaxValue <= 0) {
      return 'X';
    }
    return null;
  }
  /**
   * If current move had
   * been made do not make
   * any move
   */
  makeMove(idx: number) {
    if (this.pauseAllInputs) {
      return;
    }
    this.moveHelper(idx, 'X');
    this.pauseAllInputs = true;
    this.moveInProgress  = false;
  }
  /**
   * This function will make move for
   * bot based on a simple lookup
   * not the most subhesicated
   * way but should work for now
   * todo Need to add a better functionality.
   */
  makeBotsmove() {
    // let idx
    const avaliableMoves: Array<number> = [];
    for (let i = 0; i < this.squares.length; i++) {
      if (!this.squares[i]) {
        avaliableMoves.push(i);
      }
    }
    if (avaliableMoves.length > 0) {
      const tmp = Math.floor(Math.random() * (avaliableMoves.length) );
      this.moveHelper(avaliableMoves[tmp], 'O');
    }
  }

  moveHelper(idx: number, player: string) {
      if (!this.squares[idx]) {
        this.squares.splice(idx, 1, player);
      }
      this.winner = this.calculateWinner();
      this.setWinnerMessage();
      this.userBidValue = 0;
      this.botBidValue = 0;
      // this.bidMessage = null;
      // this.statusValue = null;
  }

  setWinnerMessage() {
    if (this.winner === 'X') {
      this.angulartics2.eventTrack.next({
        action: 'GameWon',
        properties: { category: 'playing' },
      });
      this.bidMessage = 'Conguralations you won!';
      this.statusValue = 'success';
      return;
    }

    if (this.winner === 'O') {
      this.angulartics2.eventTrack.next({
        action: 'GameLost',
        properties: { category: 'playing' },
      });
      this.bidMessage = 'Sorry you lost, better luck next time.';
      this.statusValue = 'danger';
      return;
    }

  }

}
