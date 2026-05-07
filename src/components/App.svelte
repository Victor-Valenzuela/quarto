<script>
  import { loadGameState, clearGameState } from '../lib/storage.js';
  import PantallaInicio from './PantallaInicio.svelte';
  import PantallaSetup from './PantallaSetup.svelte';
  import Juego from './Juego.svelte';

  let screen = $state('inicio');
  let players = $state(['Jugador 1', 'Jugador 2']);

  // Retomar partida si hay estado guardado
  const saved = loadGameState();
  if (saved) {
    players = saved.players;
    screen = 'juego';
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
  <Juego {players} onRestart={restart} />
{/if}
