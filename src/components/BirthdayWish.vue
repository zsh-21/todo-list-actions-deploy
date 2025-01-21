<script setup lang="ts">
import { onMounted, ref, computed, onUnmounted } from "vue";
import confetti from "canvas-confetti";
import Music from "../../public/audio/birthday_music.mp3";

const name = ref("Happy Birthday");
const message = ref("祝小娅生日快乐，哒哒哒 哒~");
const isPlaying = ref(false);
const audioRef = ref<HTMLAudioElement>();
const timeElapsed = ref(0);

// 将 name 拆分成字符数组，并处理空格
const nameChars = computed(() =>
  name.value.split("").map((char) => (char === " " ? "\u00A0" : char))
);

// 根据时间变化的特效状态
const effectState = computed(() => ({
  confettiIntensity: Math.min(1 + timeElapsed.value / 30, 3),
  bearScale: 1 + Math.sin(timeElapsed.value / 2) * 0.1,
  messageGlow: Math.abs(Math.sin(timeElapsed.value / 3)) * 20,
  cakeRotation: Math.sin(timeElapsed.value / 4) * 10,
}));

const toggleMusic = () => {
  if (audioRef.value) {
    if (isPlaying.value) {
      audioRef.value.pause();
    } else {
      audioRef.value.play();
    }
    isPlaying.value = !isPlaying.value;
  }
};

// 更新动画帧
const updateAnimation = () => {
  timeElapsed.value += 0.05;
  requestAnimationFrame(updateAnimation);
};

// 尝试自动播放音乐
const tryAutoPlay = async () => {
  try {
    if (audioRef.value) {
      await audioRef.value.play();
      isPlaying.value = true;
    }
  } catch (error) {
    console.log("Auto-play failed:", error);
    // 自动播放失败时显示提示
    alert("点击任意位置开始播放音乐~");
  }
};

// 点击页面任意位置播放音乐
const handlePageClick = async () => {
  if (!isPlaying.value) {
    await tryAutoPlay();
    // 移除点击事件监听
    document.removeEventListener("click", handlePageClick);
  }
};

onMounted(() => {
  // 创建音频元素
  audioRef.value = new Audio(Music);
  audioRef.value.loop = true;

  // 监听音频播放状态
  audioRef.value.addEventListener("play", () => {
    isPlaying.value = true;
  });
  audioRef.value.addEventListener("pause", () => {
    isPlaying.value = false;
  });

  // 尝试自动播放
  tryAutoPlay();

  // 添加点击事件监听
  document.addEventListener("click", handlePageClick);

  // 启动五彩纸屑效果
  const frame = () => {
    confetti({
      particleCount: Math.floor(3 * effectState.value.confettiIntensity),
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#ff0000", "#ffd700", "#ff69b4", "#00ff00", "#ff1493"],
    });

    confetti({
      particleCount: Math.floor(3 * effectState.value.confettiIntensity),
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#ff0000", "#ffd700", "#ff69b4", "#00ff00", "#ff1493"],
    });

    requestAnimationFrame(frame);
  };

  frame();
  updateAnimation();

  // 创建心形动画
  const hearts = document.querySelectorAll(".heart");
  hearts.forEach((heart) => {
    const delay = Math.random() * 5;
    (heart as HTMLElement).style.animationDelay = `${delay}s`;
  });
});

// 组件卸载时清理
onUnmounted(() => {
  document.removeEventListener("click", handlePageClick);
  if (audioRef.value) {
    audioRef.value.pause();
    audioRef.value = undefined;
  }
});
</script>

<template>
  <div class="birthday-container">
    <!-- 音乐控制按钮 -->
    <button
      class="music-control"
      :class="{ playing: isPlaying }"
      title="播放/暂停背景音乐"
      @click="toggleMusic"
    >
      <span v-if="isPlaying">🔊</span>
      <span v-else>🔈</span>
    </button>

    <!-- 添加可爱的小熊 -->
    <div class="bears-container">
      <div
        v-for="position in ['left', 'right', 'bottom']"
        :key="position"
        :class="['bear', `${position}-bear`]"
        :style="{
          transform:
            position === 'bottom'
              ? `translateX(-50%) scale(${effectState.bearScale})`
              : `scale(${effectState.bearScale})`,
        }"
      >
        🧸
      </div>
    </div>

    <div class="content">
      <h1 class="title">
        <span
          v-for="(char, index) in nameChars"
          :key="index"
          class="rainbow-text"
          :style="{
            '--char-index': index,
            '--total-chars': nameChars.length,
          }"
        >
          {{ char }}
        </span>
      </h1>
      <p
        class="message"
        :style="{
          textShadow: `0 0 ${effectState.messageGlow}px rgba(255, 255, 255, 0.8)`,
        }"
      >
        {{ message }}
      </p>

      <!-- 漂浮的心形 -->
      <div class="hearts-container">
        <div v-for="n in 20" :key="n" class="heart">❤️</div>
      </div>

      <!-- 蛋糕图案 -->
      <div
        class="cake"
        :style="{
          transform: `rotate(${effectState.cakeRotation}deg)`,
        }"
      >
        🎂
      </div>
    </div>
  </div>
</template>

<style scoped>
.birthday-container {
  min-height: 100vh;
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  background: linear-gradient(
    45deg,
    #ff3366 0%,
    #ff0033 25%,
    #cc0033 50%,
    #ff0033 75%,
    #ff3366 100%
  );
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.content {
  text-align: center;
  color: white;
  z-index: 1;
}

.title {
  font-size: 4rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.2rem;
  padding: 0 1rem;
}

.rainbow-text {
  display: inline-block;
  animation:
    rainbow 4s linear infinite,
    bounce-text 2s ease-in-out infinite;
  animation-delay: calc(var(--char-index) * 0.1s);
  min-width: 0.5em;
  text-align: center;
}

@keyframes rainbow {
  0% {
    color: #fff;
    text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.6);
  }
  20% {
    color: #ffd700;
    text-shadow: 2px 2px 4px rgba(255, 215, 0, 0.6);
  }
  40% {
    color: #00ffff;
    text-shadow: 2px 2px 4px rgba(0, 255, 255, 0.6);
  }
  60% {
    color: #fff;
    text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.6);
  }
  80% {
    color: #ffd700;
    text-shadow: 2px 2px 4px rgba(255, 215, 0, 0.6);
  }
  100% {
    color: #fff;
    text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.6);
  }
}

@keyframes bounce-text {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px) scale(1.1);
  }
}

.message {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  transition: text-shadow 0.3s ease;
}

.cake {
  font-size: 5rem;
  margin-top: 2rem;
  transition: transform 0.3s ease;
}

.hearts-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.heart {
  position: absolute;
  font-size: 1.5rem;
  animation: float 5s infinite linear;
  opacity: 0.8;
  color: #fff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes float {
  0% {
    transform: translateY(100vh) translateX(var(--x, 0));
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(calc(var(--x, 0) + 50px));
    opacity: 0;
  }
}

/* 为每个心形设置随机的起始位置 */
.heart {
  --x: 0px;
}

.heart:nth-child(2n) {
  --x: 100px;
}

.heart:nth-child(3n) {
  --x: -100px;
}

.heart:nth-child(4n) {
  --x: 200px;
}

.heart:nth-child(5n) {
  --x: -200px;
}

.music-control {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  z-index: 100;
}

.music-control:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.music-control.playing {
  animation: pulse-light 2s infinite;
}

@keyframes pulse-light {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

.bears-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
}

.bear {
  position: absolute;
  font-size: 3rem;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
  animation: wave 3s ease-in-out infinite;
  transition: transform 0.3s ease;
}

.left-bear {
  left: 5%;
  top: 40%;
  animation-delay: 0s;
  transform-origin: bottom center;
}

.right-bear {
  right: 5%;
  top: 40%;
  animation-delay: 0.5s;
  transform-origin: bottom center;
}

.bottom-bear {
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 1s;
  font-size: 4rem;
  animation: jump 2s ease-in-out infinite;
}

@keyframes wave {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-15deg);
  }
  75% {
    transform: rotate(15deg);
  }
}

@keyframes jump {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-20px) rotate(10deg);
  }
}

/* 添加媒体查询以适应小屏幕 */
@media (max-width: 768px) {
  .bear {
    font-size: 2rem;
  }

  .bottom-bear {
    font-size: 3rem;
  }

  .left-bear {
    left: 2%;
  }

  .right-bear {
    right: 2%;
  }
}

/* 添加渐变背景动画 */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
