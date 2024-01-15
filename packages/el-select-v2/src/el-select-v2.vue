<template>
  <el-select
    ref="select"
    v-model="localValue"
    class="el-select-v2"
    :autocomplete="autocomplete"
    :automatic-dropdown="automaticDropdown"
    :size="size"
    :disabled="disabled"
    :clearable="clearable"
    :filterable="filterable"
    :allow-create="allowCreate"
    :loading="loading"
    :popper-class="`el-select-v2__popper ${popperClass || ''}`"
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
    <div class="placeholder-max-label" v-if="!textEllipsis && longestLabel">{{longestLabel}}</div>
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
      textEllipsis:{
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        localValue: '',
        localOptions: [],
        longestLabel: ''
      };
    },
    mounted() {
      this.updateSelectedLabel();
    },
    methods: {
      updateSelectedLabel() {
        if (!this.$refs.select) {
          return;
        }
        const { setSelected, cachedOptions } = this.$refs.select;
        const values = this.multiple ? this.localValue : [this.localValue];
        const selectedOptions = this.options.filter(option => values?.includes(option[this.valueKey])).map(option => ({
          value: option[this.valueKey],
          currentLabel: option[this.labelKey],
        }));
        selectedOptions.forEach(option => {
          const cachedOption = cachedOptions.find(cachedOption => cachedOption.value === option.value);
          if (cachedOption) {
            cachedOptions.splice(cachedOptions.indexOf(cachedOption), 1, option);
          } else {
            cachedOptions.push(option);
          }
        });
        setSelected();
        if(!this.textEllipsis && this.options && this.options.length > 0){
          const maxLabelObject = this.options.reduce((prev, current) => prev[this.labelKey].length > current[this.labelKey].length ? prev : current);
          this.longestLabel = maxLabelObject[this.labelKey];
        }
      },
      handleScrollerVisible() {
        const firstValue = this.multiple ? this.localValue?.[0] : this.localValue;
        const index = this.localOptions.findIndex(option => option[this.valueKey] === firstValue);
        this.$refs.scroller.scrollToItem(index);
      },
      localFilterMethod(query) {
        this.localOptions = this.options.filter(option => option[this.labelKey].toLowerCase().includes(query.toLowerCase()));
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
            this.updateSelectedLabel();
          }
        },
        deep: true,
        immediate: true,
      },
      options: {
        handler() {
          this.localOptions = this.options;
          const inputs = this.$el.querySelectorAll('input');
          if ([].indexOf.call(inputs, document.activeElement) === -1) {
            this.updateSelectedLabel();
          }
        },
        deep: true,
      },
    },
  };
</script>

<style lang="scss">
  .el-select-v2__popper {
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
  }
  .placeholder-max-label{
    height: 0;
    color: transparent;
    visibility: hidden;
    padding-right: 10px;
  }
</style>
