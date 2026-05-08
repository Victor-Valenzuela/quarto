<script>
  import { loadGameState, clearGameState } from '../lib/storage.js';
  import PantallaInicio from './PantallaInicio.svelte';
  import PantallaSetup from './PantallaSetup.svelte';
  import Juego from './Juego.svelte';

  let screen = $state('inicio');
  let players = $state(['Jugador 1', 'Jugador 2']);
  let isPortrait = $state(false);

  // Retomar partida si hay estado guardado
  const saved = loadGameState();
  if (saved) {
    players = saved.players;
    screen = 'juego';
  }

  // Detectar orientación
  if (typeof window !== 'undefined') {
    const mq = window.matchMedia('(orientation: portrait) and (max-width: 1024px)');
    isPortrait = mq.matches;
    mq.addEventListener('change', (e) => { isPortrait = e.matches; });

    // Si sale de fullscreen durante partida, volver a inicio
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && screen === 'juego') {
        screen = 'inicio';
        players = ['Jugador 1', 'Jugador 2'];
      }
    });
  }

  function goToSetup() {
    screen = 'setup';
  }

  function startGame(config) {
    players = config.players;
    screen = 'juego';
  }

  function restart() {
    clearGameState();
    screen = 'inicio';
    players = ['Jugador 1', 'Jugador 2'];
    // Salir de fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => {
        // Forzar portrait después de salir de fullscreen
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
  <PantallaInicio onStart={goToSetup} />
{:else if screen === 'setup'}
  <PantallaSetup onStart={startGame} onBack={backToStart} />
{:else if screen === 'juego'}
  {#if isPortrait && !document.fullscreenElement}
    <div class="flex items-center justify-center min-h-[100dvh] bg-[var(--bg)]">
      <div class="w-8 h-8 border-3 border-[var(--gold)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else}
    <Juego {players} onRestart={restart} />
  {/if}
{/if}
