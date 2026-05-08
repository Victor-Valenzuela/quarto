<script>
  import { loadGameState, clearGameState } from '../lib/storage.js';
  import PantallaInicio from './PantallaInicio.svelte';
  import PantallaSetup from './PantallaSetup.svelte';
  import Juego from './Juego.svelte';

  let screen = $state('inicio');
  let players = $state(['Jugador 1', 'Jugador 2']);
  let hasSavedGame = $state(!!loadGameState());
  let transitioning = $state(false);

  if (typeof window !== 'undefined') {
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && screen === 'juego') {
        screen = 'inicio';
        hasSavedGame = !!loadGameState();
        transitioning = false;
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
    const isMobile = navigator.maxTouchPoints > 0 && window.innerWidth < 1024;
    if (isMobile && document.documentElement.requestFullscreen) {
      transitioning = true;
      document.documentElement.requestFullscreen().then(() => {
        if (window.screen.orientation && window.screen.orientation.lock) {
          window.screen.orientation.lock('landscape').then(() => {
            window.screen.orientation.addEventListener('change', function onRotate() {
              window.screen.orientation.removeEventListener('change', onRotate);
              screen = 'juego';
              transitioning = false;
            }, { once: true });
          }).catch(() => {
            screen = 'juego';
            transitioning = false;
          });
        } else {
          screen = 'juego';
          transitioning = false;
        }
      }).catch(() => {
        screen = 'juego';
        transitioning = false;
      });
    } else {
      screen = 'juego';
    }
  }

  function restart() {
    transitioning = true;
    hasSavedGame = !!loadGameState();
    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => {
        if (window.screen.orientation && window.screen.orientation.lock) {
          window.screen.orientation.lock('portrait').catch(() => {});
        }
        window.screen.orientation.addEventListener('change', function onRotate() {
          window.screen.orientation.removeEventListener('change', onRotate);
          screen = 'inicio';
          players = ['Jugador 1', 'Jugador 2'];
          transitioning = false;
        }, { once: true });
      }).catch(() => {
        screen = 'inicio';
        transitioning = false;
      });
    } else {
      screen = 'inicio';
      players = ['Jugador 1', 'Jugador 2'];
      transitioning = false;
    }
  }

  function backToStart() {
    screen = 'inicio';
  }
</script>

{#if transitioning}
  <div class="flex items-center justify-center min-h-[100dvh] bg-[var(--bg)]">
    <div class="w-8 h-8 border-3 border-[var(--gold)] border-t-transparent rounded-full animate-spin"></div>
  </div>
{:else if screen === 'inicio'}
  <PantallaInicio onStart={goToSetup} {hasSavedGame} onContinue={continueGame} />
{:else if screen === 'setup'}
  <PantallaSetup onStart={startGame} onBack={backToStart} />
{:else if screen === 'juego'}
  <Juego {players} onRestart={restart} />
{/if}
