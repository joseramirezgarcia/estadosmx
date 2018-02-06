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
          </h5>
            <ul class="list-group  list-group-flush">
              <li class="list-group-item">
                <geo-chart :data="chartData" :library="{region: 'MX', resolution: 'provinces', tooltip: {pointFormat: 'Awesome values: <b>{capital}</b>'}}"></geo-chart>
              </li>
              <li class="list-group-item">
                <h3 class="card-text">{{estado}}</h3>
              </li>
              <li class="list-group-item">
                <p class="card-text">{{capital}}</p>
              </li>                            
            </ul>
          <div class="card-footer">
            <div class="btn-group btn-group-toggle float-left" data-toggle="buttons">
              <label class="btn btn-info btn-sm" v-bind:class="{ active: !aleatorio }">
                <input type="radio" id="falso" autocomplete="off" :value='false' v-model="aleatorio">
                <i class="fa fa-sort-alpha-asc" aria-hidden="true" title='Orden alfabético'></i>
              </label>
              <label class="btn btn-info btn-sm" v-bind:class="{ active: aleatorio }">
                <input type="radio" id="verdadero" autocomplete="off" :value='true' v-model="aleatorio">
                <i class="fa fa-random" aria-hidden="true"  title='Orden aleatorio'></i>
              </label>
            </div>            
            <button 
              v-on:click="pronunciar()"
              class="btn btn-primary btn-sm" 
              title='Repetir'
              :disabled="isLoading || auto">
              <i class="fa fa-repeat fa-lg"></i>
            </button>            
            ({{actual+1}}/{{estados.length}})
            <div class="btn-group btn-group-toggle float-right" data-toggle="buttons">
              <button 
                v-on:click="siguiente()"
                class="btn btn-success btn-sm"
                title='Siguiente'
                :disabled="isLoading || auto">
                Siguiente
              </button>
              <button 
                v-bind:class="{ active: auto }"
                v-on:click="auto=!auto"
                class="btn btn-primary btn-sm"
                title='Siguiente'>
                <i class="fa" v-bind:class="{ 'fa-stop' : auto, 'fa-play' : !auto }" aria-hidden="true"  title='Reproducción automática'></i>
              </button>              
            </div>
          </div>
        </div>  
      </div>        
    </div>
  </div>
</template>

<script>

import db from './../Database'
let estadosRef = db.ref("estados");

export default {
  name: "Estudiar",
  firebase: {
    estados: {
      source: estadosRef,
      readyCallback: function() {
        this.actual = 0;
      }
    }
  },
  data() {
    return {
      titulo: "Estados y capitales de México",
      nombre: "",
      actual: "",
      isLoading: true,
      selectedVoice: 7,
      synth: window.speechSynthesis,
      voiceList: [],
      greetingSpeech: new window.SpeechSynthesisUtterance(),
      aleatorio: false,
      chartData: [],
      auto: false
    };
  },
  computed: {
    alfabeticamente: function() {
      function compare(a, b) {
        if (a.estado.toLowerCase() < b.estado.toLowerCase()) return -1;
        if (a.estado.toLowerCase() > b.estado.toLowerCase()) return 1;
        return 0;
      }
      return this.estados.sort(compare);
    },
    estado: function() {
      return this.alfabeticamente[this.actual].estado;
    },
    capital: function() {
      return this.alfabeticamente[this.actual].capital;
    }
  },
  methods: {
    siguiente() {
      if (this.aleatorio) {
        this.actual = Math.floor(Math.random() * this.alfabeticamente.length);
      } else {
        const siguiente = this.actual + 1;
        if (siguiente >= this.alfabeticamente.length) {
          this.actual = 0;
        } else {
          this.actual = siguiente;
        }
      }
    },
    listenForSpeechEvents() {
      this.greetingSpeech.onstart = () => {
        this.isLoading = true;
      };
      this.greetingSpeech.onend = () => {
        this.isLoading = false;
        if(this.auto){
          setTimeout(() => this.siguiente(), 500);
        }        
      };
    },
    pronunciar() {
      this.greetingSpeech.text = this.estado+' \ '+this.capital;
      this.greetingSpeech.rate = 0.9;
      this.greetingSpeech.voice = this.voiceList[this.selectedVoice];
      this.greetingSpeech.lang = "es-ES";
      this.synth.speak(this.greetingSpeech);
    },
    mapa() {
      this.chartData = [[this.estado,100]]
    }
  },
  watch: {
    actual: function() {
      this.pronunciar();
      this.mapa();
    },
    auto: function(){
      if(this.auto){
        this.siguiente();
      }
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
  }
};
</script>

<style scoped>

</style>
