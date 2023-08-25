<template>
  <el-select
    ref="select"
    v-model="localValue"
    :autocomplete="autocomplete"
    :automatic-dropdown="automaticDropdown"
    :size="size"
    :disabled="disabled"
    :clearable="clearable"
    :filterable="filterable"
    :allow-create="allowCreate"
    :loading="loading"
    :popper-class="popperClass"
    :remote="remote"
    :loading-text="loadingText"
    :no-match-text="noMatchText"
    :no-data-text="noDataText"
    :remote-method="remoteMethod"
    :filter-method="filterMethod || localFilterMethod"
    :multiple="multiple"
    :multiple-limit="multipleLimit"
    :placeholder="placeholder"
    :default-first-option="defaultFirstOption"
    :reserve-keyword="reserveKeyword"
    :collapse-tags="collapseTags"
    :popper-append-to-body="popperAppendToBody"
    v-bind="$attrs"
    v-on="$listeners"
    @change="handleSelectChange"
    @focus="handleSelectFocus"
  >
    <RecycleScroller
      v-if="localOptions.length"
      ref="scroller"
      v-slot="{ item }"
      class="scroller"
      :items="localOptions"
      :min-item-size="minItemSize"
      :key-field="valueKey"
      @visible="handleScrollerVisible"
    >
      <el-option
        :key="item[valueKey]"
        :value="item[valueKey]"
        :label="item[labelKey]"
        :disabled="item.disabled"
      >
        <slot name="default" :item="item" />
      </el-option>
    </RecycleScroller>
    <template v-if="$slots.prefix" slot="prefix">
      <slot name="prefix" />
    </template>
    <template v-if="$slots.empty" slot="empty">
      <slot name="empty" />
    </template>
  </el-select>
</template>

<script>
  import { RecycleScroller } from 'vue-virtual-scroller';
  import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
  import isEqual from 'lodash/isEqual';

  export default {
    name: 'ElSelectV2',
    components: {
      RecycleScroller,
    },
    props: {
      value: {
        type: [Array, String, Number, Boolean, Object],
        default: undefined,
      },
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
      autocomplete: {
        type: String,
        default: 'off',
      },
      automaticDropdown: Boolean,
      size: String,
      disabled: Boolean,
      clearable: Boolean,
      filterable: Boolean,
      allowCreate: Boolean,
      loading: Boolean,
      popperClass: String,
      remote: Boolean,
      loadingText: String,
      noMatchText: String,
      noDataText: String,
      remoteMethod: Function,
      filterMethod: Function,
      multiple: Boolean,
      multipleLimit: {
        type: Number,
        default: 0,
      },
      placeholder: {
        type: String,
        required: false,
      },
      defaultFirstOption: Boolean,
      reserveKeyword: Boolean,
      collapseTags: Boolean,
      popperAppendToBody: {
        type: Boolean,
        default: true,
      },
      minItemSize: {
        type: Number,
        default: 34,
      },
    },
    data() {
      return {
        localValue: '',
        localOptions: [],
      };
    },
    methods: {
      handleScrollerVisible() {
        const index = this.localOptions.findIndex(option => option[this.valueKey] === this.localValue);
        this.$refs.scroller.scrollToItem(index);
      },
      localFilterMethod(query) {
        this.localOptions = this.options.filter(option => option[this.labelKey].toLowerCase().includes(query.toLowerCase()));
      },
      handleSelectChange(value) {
        this.localValue = value;
        this.$emit('input', value);
      },
      handleSelectFocus() {
        this.localOptions = this.options;
      },
      focus() {
        this.$refs.select.focus();
      },
      blur() {
        this.$refs.select.blur();
      },
    },
    watch: {
      value: {
        handler() {
          if (!isEqual(this.value, this.localValue)) {
            this.localValue = this.value;
          }
        },
        deep: true,
        immediate: true,
      },
      options: {
        handler() {
          this.localOptions = this.options;
        },
        deep: true,
        immediate: true,
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
