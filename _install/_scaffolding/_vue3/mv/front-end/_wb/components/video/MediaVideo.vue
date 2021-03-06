<template>
  <div :element-type="elementType" class="c-video relative" :class="classes">
    <LazyLoad
      :class="videoClasses"
      :after-load="{ src: src || false }"
      :autoplay="background ? true : autoplay"
      :controls="background ? false : controls"
      element-type="video"
      :enabled="lazyLoad"
      :loop="background ? true : loop"
      :muted="background ? true : muted"
      :playsinline="background ? 'playsinline' : playsinline ? 'playsinline' : null"
      :poster="poster || false"
      v-if="source === 'file'"
    />
    <LazyLoad
      :class="videoClasses"
      allowfullscreen
      :after-load="{
        src: videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&amp;controls=0&amp;showinfo=0` : false,
      }"
      :check-for-native-lazy-load="lazyLoad"
      element-type="iframe"
      :enabled="lazyLoad"
      frameborder="0"
      height="480"
      :loading="loading"
      width="853"
      v-else-if="source === 'youtube'"
    />
    <LazyLoad
      :class="videoClasses"
      :after-load="{ src: videoId ? `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0` : false }"
      allowfullscreen
      :check-for-native-lazy-load="lazyLoad"
      element-type="iframe"
      :enabled="lazyLoad"
      frameborder="0"
      height="281"
      :loading="loading"
      mozallowfullscreen
      webkitallowfullscreen
      width="500"
      v-else-if="source === 'vimeo'"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import LazyLoad from 'Components/lazy_load/LazyLoad.vue';

export default defineComponent({
  name: 'MediaVideo',
  components: {
    LazyLoad,
  },
  props: {
    autoplay: { type: Boolean, default: false },
    background: { type: Boolean, default: false },
    box: {
      type: Object,
      default: () => {
        return {};
      },
    },
    controls: { type: Boolean, default: true },
    elementType: { type: String, default: 'div' },
    loading: { type: String, default: 'lazy' }, // lazy, auto, eager
    loop: { type: Boolean, default: false },
    muted: { type: Boolean, default: false },
    playsinline: { type: Boolean, default: false },
    poster: String,
    source: { type: String, default: 'file' }, // file, youtube, vimeo
    src: String,
    videoClass: String,
    videoId: String,
  },
  data() {
    return {
      lazyLoad: false,
      playerUrl: false,
    };
  },
  computed: {
    classes() {
      const classes = [];

      if (this.background) {
        classes.push(`w-full h-full`);
      } else {
        classes.push(`w-full pb-16/9`);
      }

      if (classes.length) {
        return classes;
      }
      return null;
    },
    videoClasses() {
      const classes = [];

      classes.push(`absolute w-full h-full object-cover`);

      if (this.videoClass) {
        classes.push(this.videoClass);
      }

      if (classes.length) {
        return classes;
      }
      return null;
    },
  },
  created() {
    this.lazyLoad = this.loading === 'lazy';
  },
});
</script>
