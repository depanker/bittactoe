import { Component, OnInit, ViewChild } from '@angular/core';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import { BidRequest } from '../bidrequest';
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
  xIsNext: boolean;
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

  // constructor(private httpClient: HttpClient) {}
  constructor() {}


  ngOnInit() {
    this.newGame();
  }

  /**
   * Initilize the game board
   */
  newGame() {
    this.squares = Array(9).fill(null);
    this.winner =  null;
    this.xIsNext = true;
    this.usersMaxValue = 100;
    this.botsMaxValue = 100;
    this.pauseAllInputs = true;
    this.gameIsOn =  true;
  }
  onClose() {
    this.bidMessage = null
  }
  sendDataToUser(usersBid: any) {
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
      this.statusValue = 'info';
      this.bidMessage = 'You won the bid, make a move.';
      this.xIsNext = true;
      this.pauseAllInputs = false;
    } else if (bidValue <  this.botBidValue) {
      this.statusValue = 'danger';
      this.bidMessage = 'Sorry you did not win.';
    }
    this.xIsNext = true;
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
  get player() {
    return this.xIsNext ? 'X' : 'O';
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

    if (!this.squares[idx]) {
      this.squares.splice(idx, 1, this.player);
      this.xIsNext = !this.xIsNext;
    }

    this.winner = this.calculateWinner();
    this.pauseAllInputs = true;
    this.bidMessage = null;
    this.statusValue = null;
  }

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
    return null;
  }
  // setNextPlayer() {
  // }

}
