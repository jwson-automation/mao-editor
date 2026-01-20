<template>
  <div class="logo-container">
    <h1 class="logo" data-text="MAO">
      <span class="logo-text">MAO</span>
    </h1>
  </div>
</template>

<style scoped>
.logo-container {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.logo {
  position: relative;
  font-size: 4rem;
  font-weight: 900;
  letter-spacing: 0.3em;
  color: #ffffff;
  text-transform: uppercase;
}

.logo-text {
  position: relative;
  display: inline-block;
  animation: glitch-skew 2s infinite linear alternate-reverse;
}

.logo-text::before,
.logo-text::after {
  content: 'MAO';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.logo-text::before {
  color: #00ffff;
  animation: glitch-1 0.5s infinite linear alternate-reverse;
  clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
}

.logo-text::after {
  color: #ff00ff;
  animation: glitch-2 0.5s infinite linear alternate-reverse;
  clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
}

@keyframes glitch-1 {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-3px);
  }
  40% {
    transform: translateX(3px);
  }
  60% {
    transform: translateX(-1px);
  }
  80% {
    transform: translateX(2px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes glitch-2 {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(3px);
  }
  40% {
    transform: translateX(-3px);
  }
  60% {
    transform: translateX(1px);
  }
  80% {
    transform: translateX(-2px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes glitch-skew {
  0% {
    transform: skew(0deg);
  }
  10% {
    transform: skew(-0.5deg);
  }
  20% {
    transform: skew(0.5deg);
  }
  30% {
    transform: skew(0deg);
  }
  100% {
    transform: skew(0deg);
  }
}
</style>
