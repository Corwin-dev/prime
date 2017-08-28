var saveFile = false;
var halt = false;
var index = 9000;

function stop() {
  halt = true;
}

function load(event) {
  window.file = event.target.files[0];
  var reader = new FileReader();

  reader.onload = function() {
    var json = JSON.parse(reader.result);
    var primeList = json.primeList;
    var candidate = json.candidate;
    var rootIndex = json.rootIndex;
    var primes = new primeObject(candidate, primeList, rootIndex);
    window.setTimeout(prime(primes), 10);
  };

  reader.onerror = function() {
    console.log("Error Loading File: " + reader.error);
  };

  reader.readAsText(file);
}

function createNew() {
  var primeList = [3];
  var candidate = 5;
  var rootIndex = 0;
  var primes = new primeObject(candidate, primeList, rootIndex);
  window.setTimeout(prime(primes), 10);
}

function primeObject(candidate, primeList, rootIndex) {
  this.candidate = candidate;
  this.primeList = primeList;
  this.rootIndex = rootIndex;
  this.squareNum = primeList[rootIndex] ** 2;
  this.timer      = new Date();
}


function prime(primes) {
  primes = setSquare(primes);
  var isPrime = modAll(primes);
  if (isPrime) {
    primes.primeList.push(primes.candidate);
  }
  primes.candidate += 2;
  if (saveFile) {saveToFile(primes);}
  if (halt) {halt = false; return false;}
  if (--index === 0) {
    primes = setIndex(primes);
    window.setTimeout(function(){prime(primes);});
    output(primes);
  } else {
    prime(primes);
  }
}

function setSquare(primes) {
  while(primes.squareNum < primes.candidate) {
    primes.squareNum = primes.primeList[++primes.rootIndex] ** 2;
  }
  return primes;
}

function modAll(primes) {
  for (var i = primes.rootIndex; i >= 0; i--) {
    if (primes.candidate % primes.primeList[i] === 0) return false;
  }
  return true;
}

function output(primes) {
  document.getElementById("primes").innerHTML = primes.candidate - 2;
  document.getElementById("data").innerHTML = primes.rootIndex+" | "+primes.primeList[primes.rootIndex]+" | "+primes.squareNum+" | "+primes.primeList.length;
}

function saveToFile(primes) {
  var content = {
    candidate: primes.candidate,
    rootIndex: primes.rootIndex,
    primeList: primes.primeList
  };
  var text = JSON.stringify(content);
  var name = primes.rootIndex + ".JSON";
  var type = "application/json";
  download(text, name, type);
  saveFile = false;
}

function download(text, name, type) {
  var file = new Blob([text], {type: type});
  saveAs(file, name);
}

function setIndex(primes) {
  var elapsed = new Date() - primes.timer;
  primes.timer = new Date();

  elapsed /= 10;
  elapsed += 1;
  index = getRandomInt(9000/elapsed,9999/elapsed);
  return primes;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function save() {
  saveFile = true;
}