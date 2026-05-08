<script>
  let { piece, size = 'md', selected = false, disabled = false, placed = false, onclick = null } = $props();

  const sizes = {
    sm: piece.tall ? 'w-11.5 h-11.5 lg:w-19 lg:h-19' : 'w-7.5 h-7.5 lg:w-13 lg:h-13',
    md: piece.tall ? 'w-12 h-12 lg:w-14 lg:h-14' : 'w-7 h-7 lg:w-10 lg:h-10',
    lg: piece.tall ? 'w-[75%] h-[75%] aspect-square' : 'w-[45%] h-[45%] aspect-square',
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
    <div class="{size === 'lg' ? 'w-[45%] h-[45%]' : 'w-[55%] h-[55%]'} {getShape()} bg-[#1a1410]"></div>
  {/if}
</button>
