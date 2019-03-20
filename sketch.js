var mySketch = function(p) {

  var selectedNb = 200 // Nb elements à trier
  var selectedAlgo = 'Timsort'
  var selectedData = 'Random data'

  var framerate = 50
  var myheight = 400
  var mywidth = 1000 / selectedNb
  var statusP
  var sim
  var step = 0
  var stopped = false
  var algorithms = ['Timsort', 'Quicksort', 'Bubble sort', 'Insertion sort', 'Selection sort', 'Comb sort', 'Shellsort']

  // Visualizing Comb_sort
  p.setup = function() {
    var canvas = p.createCanvas(1220, myheight);
    var maindiv = canvas.parent().id

    btnreset = p.createButton('Reset');
    btnreset.parent(maindiv + 'btn')
    btnreset.mousePressed(resetSim);

    btnstart = p.createButton('Start');
    btnstart.parent(maindiv + 'btn')
    btnstart.mousePressed(function() {stopped = false})

    btnstop = p.createButton('Stop');
    btnstop.parent(maindiv + 'btn')
    btnstop.mousePressed(function() {stopped = true})

    selAlgo = p.createSelect();
    selAlgo.parent(maindiv + 'btn')
    selAlgo.option('Bubble sort');
    selAlgo.option('Comb sort');
    selAlgo.option('Insertion sort');
    selAlgo.option('Quicksort');
    selAlgo.option('Selection sort');
    selAlgo.option('Shellsort');
    selAlgo.option('Timsort');
    selAlgo.selected(selectedAlgo)
    selAlgo.changed(function() {
     selectedAlgo = selAlgo.value();
     resetSim()
    });

    selNb = p.createSelect();
    selNb.parent(maindiv + 'btn')
    selNb.option(100);
    selNb.option(200);
    selNb.option(300);
    selNb.option(400);
    selNb.option(500);
    selNb.selected(selectedNb)
    selNb.changed(function() {
     selectedNb = parseInt(selNb.value());
     resetSim()
    });

    selData = p.createSelect();
    selData.parent(maindiv + 'btn')
    selData.option('Random data');
    selData.option('Almost sorted');
    selData.option('Sorted data');
    selData.option('Inverted');
    selData.selected('Random data')
    selData.changed(function() {
     selectedData = selData.value();
     resetSim()
    });


    resetSim()
  }

  p.draw = function() {
    p.background(0);
    p.noStroke();

    sim.showStep(p, step)
    if (!stopped) {
      if (step >= sim.states.length - 1) {
        resetSim()
      }
      if (step == 0) {
        p.frameRate(1)
      }
      if (step == 1) {
        p.frameRate(framerate)
      }
      step = step + 1
    }
  }

  function resetSim() {
    sim = new Simulation(selectedNb, selectedAlgo)
    sim.run()
    step = 0
  }

  function Simulation(nb, algo) {

    this.algo = algo
    if (!algo) // If not specified, pick a random one
      this.algo = algorithms[Math.floor((Math.random() * algorithms.length))]

    console.log("Simulation of " + this.algo)
    this.states = []

    switch(selectedData) {
      case 'Random data' :  this.data = randomdata(nb, myheight); break;
      case 'Sorted data' :  this.data = sorted(nb, myheight); break;
      case 'Almost sorted' :  this.data = almostsorted(nb, myheight); break;
      case 'Inverted' :  this.data = inverted(nb, myheight); break;

    }

    this.run = function() {
      this.pushState(this.data, [])

      switch(this.algo) {
          case 'Quicksort'  : quicksort(this.data); break;
          case 'Bubble sort' : bubblesort(this.data); break;
          case 'Insertion sort' : insertionsort(this.data); break;
          case 'Selection sort' : selectionsort(this.data); break;
          case 'Comb sort' : combsort(this.data); break;
          case 'Shellsort' : shellsort(this.data); break;
          case 'Timsort' : this.data.timsort(this); break;
        }
      this.pushState(this.data, [])
      console.log("Nb states pushed " + this.states.length)
    }

    this.pushState = function(data, highlighted) {
      this.states.push(new State(data, highlighted))
    }

    this.showStep = function(p, step) {
      this.states[step].show(p)
    }
  }

  function State(data, highlighted) {
    this.data = data.slice() // Make a copy of the table
    this.highlighted = highlighted

    this.show = function(p) {
        for(var i = 0; i < this.data.length; i++) {
          if (highlighted.indexOf(i) >= 0)
            p.fill(255,0,0)
          else
            p.fill(255);
          var w = 1200 / selectedNb
          p.rect(10 + i * w, myheight - this.data[i], w - 1, this.data[i]);
        }
    }
  }




  //------------------------------------------------
  // quick sort
  //------------------------------------------------
  function quicksort(data) {
    quicksort0(data, 0, data.length - 1)
  }

  function quicksort0(data, lo, hi) {
    if (lo < hi) {
      var p = partition(data, lo, hi);
      quicksort0(data, lo, p - 1)
      quicksort0(data, p + 1, hi)
    }
  }

  function partition(data, lo, hi) {
    pivot = data[hi]
    var i = lo;
    for(var j = lo; j < hi; j++) {
      sim.pushState(data, [lo, hi, j])
      if (data[j] <= pivot) {
        swap(data, i, j)
        i++
      }
    }
    swap(data, i, hi)
    return i
  }

  //------------------------------------------------
  // bubble sort
  //------------------------------------------------
  function bubblesort(data) {
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data.length - i; j++) {
        sim.pushState(data, [j, j + 1])
        if (data[j] > data[j + 1])
          swap(data, j, j + 1)
      }
    }
  }



  //------------------------------------------------
  // insertion sort
  //------------------------------------------------
  function insertionsort(data) {
    for (var i = 0; i < data.length; i++) {
      var j = i
      while(j >= 0 && data[j-1] > data[j] ) {
        sim.pushState(data, [j-1,j])
        swap(data, j - 1, j)
        j--
      }
    }
  }

  //------------------------------------------------
  // selection sort
  //------------------------------------------------
  function selectionsort(data) {
    for (var i = 0; i < data.length; i++) {
      for (var j = i + 1; j < data.length; j++) {
        sim.pushState(data, [i,j])
        if (data[i] > data[j])
          swap(data, i, j)
      }
    }
  }

  //------------------------------------------------
  // comb sort
  //------------------------------------------------
  function combsort(data) {
    var gap = data.length
    var shrink = 1.3
    var sorted = false

    while(sorted == false) {
      gap = Math.floor(gap / shrink)
      if (gap > 1) sorted = false
      else {
        gap = 1
        sorted = true
      }

      for(var i = 0; i + gap < data.length; i++) {
        sim.pushState(data, [i, i + gap])
        if (data[i] > data[i + gap]) {
          swap(data, i, i + gap)
          sorted = false
        }
      }
    }
  }

  //------------------------------------------------
  // Shell sort
  // https://en.wikipedia.org/wiki/Shellsort
  //------------------------------------------------
  function shellsort(data) {
    var h = 1;
    while(h < data.length / 3) {
      h = 3 * h + 1;
    }
    while(h > 0){
      for (var i = h; i < data.length; i++) {
        for (var j = i; j > 0 && data[j] < data[j - h]; j -= h) {
          sim.pushState(data, [i, j, j - h])
          swap(data, j, j - h);
        }
      }
      h = (h - 1) / 3
    }
  }


  function swap(list, i, j){
     var temp = list[i];
     list[i] = list[j];
     list[j] = temp;
   }

  function randomdata(size, max) {
    var data = new Array(size)
    for (var i = 0; i < size; i++) {
      data[i] =  max * (.1 + .8 * Math.random()) | 0
    }
    return data
  }

  function almostsorted(size, max) {
    var data = new Array(size)
    for (var i = 0; i < size; i++) {
      //data[i] = (max / 10 + Math.random() * max * .8) | 0;
      data[i] =  (max / 10) + .6 * max / size * i + Math.random() * max / 3| 0
    }
    return data
  }

  function sorted(size, max) {
    var data = new Array(size)
    for (var i = 0; i < size; i++) {
      data[i] =  max / size * i | 0
    }
    return data
  }

  function inverted(size, max) {
    var data = new Array(size)
    for (var i = 0; i < size; i++) {
      data[i] =  max / size * (size - i) | 0
    }
    return data
  }
}
