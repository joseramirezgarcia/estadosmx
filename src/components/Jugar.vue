<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <div class="card bg-light border-info w-100" v-if="estados.length">
          <h5 class="card-header">
            <router-link
              class="btn btn-primary btn-sm float-left" 
              title='Atras'
              to='/'
              tag="button">
              <i class="fa fa-chevron-left fa-lg"></i>
            </router-link>
            {{ nombre }}
            <span class="badge seconds float-right" v-bind:class="{ 'badge-success' : tiempo, 'badge-warning' : !tiempo }" v-text="secondsShown"></span>
          </h5>
            <ul class="list-group  list-group-flush">
              <li class="list-group-item">
                <h3 class="card-text">{{pregunta}}</h3>
              </li>
              <li class="list-group-item">
                <button 
                  v-for="respuesta in respuestas"
                  class='col-lg-4 col-sm-12 mx-md-4 my-md-2 mx-0 my-1 btn'
                  @click="respuesta.click=true; respuesta.bien ? calificar(true) : calificar(false)"
                  v-bind:class="{ 'btn-outline-primary' : !respuesta.click, 'btn-success' : respuesta.click && respuesta.bien, 'btn-danger' : respuesta.click && !respuesta.bien }">
                  {{respuesta.texto}}
                </button>
              </li>                            
            </ul>
            <audio id="player" autoplay='false'>
							<source v-bind:src="sonido" type="audio/mpeg">
						</audio>            
          <div class="card-footer">
            <div class="progress">
              <div class="progress-bar bg-success" role="progressbar" v-bind:style="{width: porcentaje.bien + '%'}" aria-valuemin="0" aria-valuemax="100">{{bien}}</div>
              <div class="progress-bar bg-warning" role="progressbar" v-bind:style="{width: porcentaje.regular + '%'}" aria-valuemin="0" aria-valuemax="100">{{regular}}</div>
              <div class="progress-bar bg-danger" role="progressbar" v-bind:style="{width: porcentaje.mal + '%'}" aria-valuemin="0" aria-valuemax="100">{{mal}}</div>
            </div>            
          </div>
        </div> 
      </div>        
    </div>
  </div>
</template>

<script>

import db from './../Database';
let estadosRef = db.ref("estados");
let calificacionesRef = db.ref("calificaciones/");

export default {
  name: "Jugar",
  firebase: {
    estados: {
      source: estadosRef,
      readyCallback: function() {
        this.aleatorio();
      }
    },
    calificaciones: {
      source: calificacionesRef
    }    
  },
  data() {
    return {
      seconds: 10,
      interval: null,
      titulo: "Estados y capitales de México",
      nombre: "",
      actual: "",
      isLoading: true,
      selectedVoice: 7,
      synth: window.speechSynthesis,
      voiceList: [],
      greetingSpeech: new window.SpeechSynthesisUtterance(),
      pregunta: '',
      respuestas: [],
      correcta: '',
      sesion: '',
      bien: 0,
      regular: 0,
      mal: 0,
      tiempo: true,
      sonido: '',
      player: '',
      porcentaje:{
        bien: 0,
        regular: 0,
        mal: 0
      }
    };
  },
  methods: {
    intervalCallback: function() {
      if(this.tiempo){
        if(this.seconds == 0) {
          this.tiempo = false;
          return null
          this.seconds = 59
        } else {
          this.seconds--
        }
      }
    },    
    aleatorio(){
      const siguiente = Math.floor(Math.random() * this.estados.length);
      if(siguiente !== this.actual && siguiente !== 8){//ciudad de mexico
        this.actual = siguiente;
        this.seconds = 10;
        this.tiempo = true;
      } else {
        this.aleatorio();
      }
    },
    calificar(bien){
      this.sonido = '';
      if(bien){
        if(this.tiempo){
          calificacionesRef.push({
            pregunta: this.pregunta,
            calificacion: 1,
            sesion: this.sesion
          });        
          this.bien++;
          this.sonido = 'http://estados.prueba.cc/bici.mp3'; //hacerlo local
        } else {
          calificacionesRef.push({
            pregunta: this.pregunta,
            calificacion: 0.5,
            sesion: this.sesion
          });        
          this.regular++;
          this.sonido = 'http://estados.prueba.cc/miau.mp3'; //hacerlo local
        }
        this.siguiente();        
      } else {
        calificacionesRef.push({
          pregunta: this.pregunta,
          calificacion: 0,
          sesion: this.sesion
        });
        this.sonido = 'http://estados.prueba.cc/pedo.mp3'; //hacerlo local
        this.mal++;
      }
      if(this.sonido !== ''){
        var audio = new Audio(this.sonido);
        audio.play();
      }
      const total = this.bien + this.regular + this.mal;
      this.porcentaje.bien = (this.bien * 100) / total;
      this.porcentaje.regular = (this.regular * 100) / total;
      this.porcentaje.mal = (this.mal * 100) / total;
//      this.totales();
    },
    totales(){
      /*this.bien = 0;
      this.mal = 0;
      this.regular = 0;
      var that = this;
      calificacionesRef.orderByChild("sesion").equalTo(this.sesion).on("child_added", function(snapshot) {
        console.log(snapshot.val().pregunta);
        if(snapshot.val().calificacion === 1){
          that.bien++;
          console.log('bien');
        } else if(snapshot.val().calificacion === 0.5){
          that.regular++;
        } else if(snapshot.val().calificacion === 0){
          that.mal++;
          console.log('mal');
        }        
      });*/
    },
    siguiente() {
      setTimeout(() => {
        this.aleatorio();
      }, 1111);
    },
    listenForSpeechEvents() {
      this.greetingSpeech.onstart = () => {
        this.isLoading = true;
      };
      this.greetingSpeech.onend = () => {
        this.isLoading = false;
      };
    },
    pronunciar() {
      this.greetingSpeech.text = this.estado+' \ '+this.capital;
      this.greetingSpeech.rate = 0.9;
      this.greetingSpeech.voice = this.voiceList[this.selectedVoice];
      this.greetingSpeech.lang = "es-ES";
      this.synth.speak(this.greetingSpeech);
    }
  },
  watch: {
    actual: function() {
      this.pregunta = this.estados[this.actual].estado;
      this.correcta = this.estados[this.actual].capital;
      if(Math.floor(Math.random() * Math.floor(2)) === 1){
        this.pregunta = this.estados[this.actual].capital;
        this.correcta = this.estados[this.actual].estado;
      }
      this.respuestas = [];
      this.respuestas.push({texto: this.correcta, bien: true, click: false});
      while(this.respuestas.length < 4){
        var ran = Math.floor(Math.random() * this.estados.length);
        if(ran !== 8){//ciudad de mexico
          var res = this.estados[ran].estado;
          if(Math.floor(Math.random() * Math.floor(2)) === 1){
            res = this.estados[ran].capital;
          }
          var existe = false;
          for (let i = 0; i < this.respuestas.length; i++) {
            if(this.respuestas[i].texto === res){
              existe = true;
            }
          }
          if(!existe){
            this.respuestas.push({texto: res, bien: false, click: false});
          }
        }
      }
      this.respuestas.sort(function compare(a,b) {
        if (a.texto < b.texto)
          return -1;
        if (a.texto > b.texto)
          return 1;
        return 0;
      });
      //this.pronunciar();
    }
  },
  mounted() {
    this.voiceList = this.synth.getVoices();
    if (this.voiceList.length) {
      this.isLoading = false;
    }
    this.synth.onvoiceschanged = () => {
      this.voiceList = this.synth.getVoices();
      setTimeout(() => {
        this.isLoading = false;
      }, 800);
    };
    this.listenForSpeechEvents();
    this.sesion = Date.now();
    setInterval(this.intervalCallback, 1000);
    this.player = document.getElementById('player');
  },
  computed: {
    secondsShown: function() {
      if(this.seconds < 10) {
        return "0" + parseInt(this.seconds, 10)
      }
      return this.seconds
    }    
  }
};
</script>

<style scoped>
.btn-outline-primary:hover{
  color: #007bff;
  background-color: transparent;
  background-image: none;
  border-color: #007bff;
}
</style>
