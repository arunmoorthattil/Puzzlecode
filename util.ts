import { Api } from 'chessground/api';
import { Color, Key } from 'chessground/types';
const swal = require('sweetalert');

declare var positions: any;
declare var currPos: any;
declare var currMov: any;
declare var dpzsolved: any;
declare var autoload: any;
export function toDests(chess: any): Map<Key, Key[]> {
  const dests = new Map();
  chess.SQUARES.forEach(s => {
    const ms = chess.moves({square: s, verbose: true});
    if (ms.length) dests.set(s, ms.map(m => m.to));
  });
  return dests;
}

export function toColor(chess: any): Color {
  return (chess.turn() === 'w') ? 'white' : 'black';

}

export function aiPlay(cg: Api, chess:any, delay: number) {
  return (orig, dest) => {
    if ((chess.get(orig).type === 'p') && ((dest.substring(1, 2) === '8') || (dest.substring(1, 2) === '1'))) {
     swal("Select the promotion figure", {
          buttons: {
              queen: {text: "Queen", value: 'q'},
              rook: {text: "Rook", value: 'r'},
              bishop: {text: "Bishop", value: 'b'},
              knight: {text: 'Knight', value: 'n'}
          }
      }).then((value) => {  onSnapEndFinish(cg,chess,delay,orig,dest,value)});
  } else{
    var promote;
   onSnapEndFinish(cg,chess,delay,orig,dest,promote);
  }
  };
}


export function onSnapEndFinish(cg: Api, chess:any,delay: number,orig:any,dest:any,promote:any) {
  var move;
  if(currMov<positions[currPos].moves.length){
    if (promote) {
      move= chess.move({from: orig, to: dest,promotion:promote});
   } else{  
     move= chess.move({from: orig, to: dest});    
  }
  cg.set({
    fen:chess.fen(),
    turnColor: toColor(chess),
    movable: {
      color: toColor(chess),
      dests: toDests(chess)
    }
  });
  var mv=positions[currPos].moves[currMov].trim();
  var undomove=false;
 if (move!==null && move.from.concat(move.to.substring(0,2))!== mv && !chess.in_checkmate()) { 	
    chess.undo();
    cg.set({
      fen:chess.fen(),
      turnColor: toColor(chess),
      movable: {
        color: toColor(chess),
        dests: toDests(chess)
      }
    });
   undomove=true;
   currMov=positions[currPos].moves.length
    $('#usermsg').html("Wrong, Click on Load Nex Puzzle");
    
 } 
if(undomove===false){
    setTimeout(() => {
       currMov+=1;
      if(currMov<positions[currPos].moves.length){
      var mv=positions[currPos].moves[currMov].trim();
        var move= chess.move(mv,{ sloppy: true });
	if(move!==null){
        currMov+=1;
	  console.log(move);
      cg.move(move.from, move.to);
      cg.set({
        turnColor: toColor(chess),
        movable: {
          color: toColor(chess),
          dests: toDests(chess)
        }
      });
    } } else {  
    if(dpzsolved !==null){
      dpzsolved=dpzsolved+1;
   } else {
    dpzsolved=1
   }
   $('#usermsg').html("Solved, Click on Load Nex Puzzle");
   $('#score').html("Puzzles Solved: "+ dpzsolved.length);
   }    
    } , delay);}
 } else {
  console.log("Next Puzzle");
 }
}