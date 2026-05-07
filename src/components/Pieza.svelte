<script>
  let { piece, size = 'md', selected = false, disabled = false, placed = false, onclick = null } = $props();

  const sizes = {
    sm: piece.tall ? 'w-11 h-11 md:w-11 md:h-11' : 'w-8 h-8 md:w-10 md:h-10',
    md: piece.tall ? 'w-12 h-12 md:w-14 md:h-14' : 'w-8 h-8 md:w-10 md:h-10',
    lg: piece.tall ? 'w-[70%] h-[70%] aspect-square' : 'w-[50%] h-[50%] aspect-square',
  };

  function getShape() {
    return piece.round ? 'rounded-full' : 'rounded-sm';
  }

  function getColor() {
    return piece.dark ? '#5c3a1e' : '#d4a76a';
  }

  function getHeight() {
    return '';
  }
</script>

<button
  class="{sizes[size]} {getShape()} {getHeight()} flex items-center justify-center transition-all {placed ? 'cursor-default' : disabled ? 'cursor-default opacity-40' : 'cursor-pointer hover:scale-110'} {selected ? 'ring-2 ring-[var(--gold)] scale-110' : ''}"
  style="background: {getColor()}; border-color: {piece.dark ? '#3d2010' : '#a07840'};"
  {onclick}
  disabled={disabled || placed}
>
  {#if piece.hollow}
    <div class="w-3 h-3 {getShape()} bg-[#1a1410]"></div>
  {/if}
</button>
