<template>
  <el-select
    ref="select"
    v-model="value"
    :multiple="multiple"
    :filterable="filterable"
    :disabled="disabled"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <RecycleScroller
      ref="scroller"
      v-slot="{ item }"
      class="scroller"
      :items="options"
      :item-size="itemSize"
      :key-field="valueKey"
      @visible="handleScrollerVisible"
    >
      <el-option
        :key="item[valueKey]"
        :value="item[valueKey]"
        :label="item[labelKey]"
        :disabled="item.disabled"
      >
        <slot name="label" :item="item">{{ item[labelKey] }}</slot>
      </el-option>
    </RecycleScroller>
  </el-select>
</template>

<script>
  import { RecycleScroller } from 'vue-virtual-scroller';
  import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

  export default {
    name: 'ElSelectV2',
    components: {
      RecycleScroller,
    },
    props: {
      options: {
        type: Array,
        default: () => [],
      },
      valueKey: {
        type: String,
        default: 'value',
      },
      labelKey: {
        type: String,
        default: 'label',
      },
      multiple: {
        type: Boolean,
        default: false,
      },
      filterable: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      noDataText: String,
      itemSize: {
        type: Number,
        default: 34,
      },
    },
    data() {
      return {
        value: '',
        keyword: '',
      };
    },
    methods:{
      handleScrollerVisible() {
        this.$refs.scroller.scrollToItem(100);
      },
    },
  };
</script>

<style lang="scss">
  .scroller {
    max-height: 238px;

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 4px;
      background-color: rgba(144, 147, 153, .3);

      &:hover {
        background-color: rgba(144, 147, 153, .5);
      }
    }
  }

  .el-scrollbar__bar {
    display: none;
  }
</style>
