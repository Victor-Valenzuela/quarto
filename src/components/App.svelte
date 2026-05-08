<script>
  import { loadGameState, clearGameState } from '../lib/storage.js';
  import PantallaInicio from './PantallaInicio.svelte';
  import PantallaSetup from './PantallaSetup.svelte';
  import Juego from './Juego.svelte';

  let screen = $state('inicio');
  let players = $state(['Jugador 1', 'Jugador 2']);
  let hasSavedGame = $state(!!loadGameState());

  if (typeof window !== 'undefined') {
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && screen === 'juego') {
        screen = 'inicio';
        hasSavedGame = !!loadGameState();
      }
    });
  }

  function goToSetup() {
    screen = 'setup';
  }

  function continueGame() {
    const saved = loadGameState();
    if (saved) players = saved.players;
    goFullscreenAndPlay();
  }

  function startGame(config) {
    clearGameState();
    players = config.players;
    goFullscreenAndPlay();
  }

  function goFullscreenAndPlay() {
    screen = 'juego';
    const isMobile = navigator.maxTouchPoints > 0 && window.innerWidth < 1024;
    if (isMobile && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().then(() => {
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('landscape').catch(() => {});
        }
      }).catch(() => {});
    }
  }

  function restart() {
    screen = 'inicio';
    players = ['Jugador 1', 'Jugador 2'];
    hasSavedGame = !!loadGameState();
    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => {
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('portrait').catch(() => {});
        }
      }).catch(() => {});
    }
  }

  function backToStart() {
    screen = 'inicio';
  }
</script>

{#if screen === 'inicio'}
  <PantallaInicio onStart={goToSetup} {hasSavedGame} onContinue={continueGame} />
{:else if screen === 'setup'}
  <PantallaSetup onStart={startGame} onBack={backToStart} />
{:else if screen === 'juego'}
  <Juego {players} onRestart={restart} />
{/if}
