<template>
  <div>
    <h1 class="dev__components__demo__header">Audio</h1>
    <p>Play an audio file using the native browser audio player.</p>

    <ImportPath path="import MediaAudio from 'Components/audio/MediaAudio.vue';" />

    <CodeExample
      :code="code.file"
      title="Audio File"
      description="Play an audio file using the native browser audio player."
    >
      <MediaAudio src="https://workbench.wbrowar.com/audio/clip.mp3" />
    </CodeExample>

    <PropsTable :props="props" />
  </div>
</template>

<script>
import MediaAudio from 'Components/audio/MediaAudio.vue';
import CodeExample from 'WB/docs/vue/CodeExample.vue';
import ImportPath from 'WB/docs/vue/ImportPath.vue';
import PropsTable from 'WB/docs/vue/PropsTable.vue';

export default {
  components: {
    MediaAudio,
    CodeExample,
    ImportPath,
    PropsTable,
  },
  data() {
    return {
      code: false,
      modifiers: false,
      props: false,
    };
  },
  props: {
    globalData: Object,
  },
  created() {
    this.code = {
      file: `<MediaAudio src="https://workbench.wbrowar.com/audio/clip.mp3" />`,
    };
    this.modifiers = [{ name: 'test', description: `Test` }];
    this.props = [
      { name: 'controls', type: 'Boolean', default: `true`, description: `Enable controls for audio player.` },
      {
        name: 'loading',
        type: 'String',
        default: `'lazy'`,
        description: `Lazy loads file src when the component enters the viewport. Accepts: 'lazy', 'auto'`,
      },
      { name: 'loop', type: 'Boolean', default: `false`, description: `Loops the audio.` },
      { name: 'src', type: 'String', description: `The URL of the audio file.` },
    ];
  },
};
</script>
