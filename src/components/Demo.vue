<template>
  <div class="demo-container">
    <el-select-v2
      v-model="value"
      :options="options"
      filterable
      multiple
    />
  </div>
</template>

<script>
  export default {
    name: 'Demo',
    data() {
      return {
        options: [],
        value: [],
      };
    },
    created() {
      for (let i = 0; i < 10000; i++) {
        this.options.push({
          value: `value ${i + 1}`,
          label: `label ${i + 1}`,
        });
      }
    },
  };
</script>

<style lang="scss" scoped>
  .demo-container {

  }
</style>
