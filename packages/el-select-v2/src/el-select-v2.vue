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
    :allow-create="false"
    :loading="loading"
    :popper-class="`el-select-v2__popper ${popperClass || ''}`"
    :remote="remote"
    :loading-text="loadingText"
    :no-match-text="noMatchText"
    :no-data-text="noDataText"
    :remote-method="remoteMethod"
    :filter-method="localFilterMethod"
    :multiple="multiple"
    :multiple-limit="multipleLimit"
    :placeholder="placeholder"
    :default-first-option="defaultFirstOption"
    :reserve-keyword="reserveKeyword"
    :collapse-tags="collapseTags"
    :popper-append-to-body="popperAppendToBody"
    :value-key="objectKey"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <div v-if="$slots.header" class="el-select-dropdown__header">
      <slot name="header" />
    </div>
    <RecycleScroller
      v-if="localOptions.length"
      ref="scroller"
      v-slot="{ item }"
      class="scroller"
      :style="scrollerStyle"
      :items="localOptions"
      :min-item-size="minItemSize"
      :key-field="valueKey"
      @visible="handleScrollerVisible"
    >
      <li v-if="item._isGroup" class="el-select-group__title">{{ item[labelKey] }}</li>
      <el-option
        v-else
        :key="getOptionKey(item)"
        :value="item[valueKey]"
        :label="item[labelKey]"
        :disabled="item[disabledKey]"
      >
        <slot name="default" :item="item" />
      </el-option>
    </RecycleScroller>
    <div v-if="$slots.footer" class="el-select-dropdown__footer">
      <slot name="footer" />
    </div>
    <template v-if="$slots.prefix" slot="prefix">
      <slot name="prefix" />
    </template>
    <template v-if="$slots.empty" slot="empty">
      <slot name="empty" />
    </template>
  </el-select>
</template>

<script>
  import NavigationMixin from './navigation-mixin';
  import { RecycleScroller } from 'vue-virtual-scroller';
  import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
  import isEqual from 'lodash/isEqual';
  import isPlainObject from 'lodash/isPlainObject';
  import { v4 as uuidv4 } from 'uuid';

  export default {
    mixins: [NavigationMixin],
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
      disabledKey: {
        type: String,
        default: 'disabled',
      },
      objectKey: {
        type: String,
        default: 'value',
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
      reserveKeyword: {
        type: Boolean,
        default: true,
      },
      collapseTags: Boolean,
      popperAppendToBody: {
        type: Boolean,
        default: true,
      },
      minItemSize: {
        type: Number,
        default: 34,
      },
      fitInputWidth: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        localValue: '',
        localIndex: -1,
        localOptions: [],
        dropdownWidth: '',
        query: '',
      };
    },
    mounted() {
      this.updateSelectedLabel();
      if (this.$refs.select) {
        this.$refs.select.navigateOptions = this.navigateOptions;
        this.$watch(() => this.$refs.select.visible, value => {
          if (value) {
            this.query = '';
            this.updateOptions();
          }
        });
      }
    },
    methods: {
      updateSelectedLabel() {
        if (!this.$refs.select) {
          return;
        }
        const { setSelected, cachedOptions } = this.$refs.select;
        const values = this.multiple ? this.localValue : [this.localValue];
        const selectedOptions = this.flattedOptions.filter(option => values?.some(value => this.isSameValue(value, option[this.valueKey]))).map(option => ({
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
      },
      handleScrollerVisible() {
        const firstValue = this.multiple ? this.localValue?.[0] : this.localValue;
        this.localIndex = this.localOptions.findIndex(option => this.isSameValue(option[this.valueKey], firstValue));
        this.$refs.scroller.scrollToItem(this.localIndex);
        this.updateHoverIndex();
      },
      localFilterMethod(query) {
        this.localIndex = this.defaultFirstOption ? 0 : -1;
        this.query = query;
        if (typeof this.filterMethod === 'function') {
          this.filterMethod(query);
        } else {
          const groupNameList = this.flattedOptions.filter(option => !option._isGroup &&
            option[this.labelKey]?.toLowerCase().includes(query.toLowerCase())).map(option => option._groupName);
          this.localOptions = this.flattedOptions.filter(option => {
            if (option._isGroup) {
              return groupNameList.some(groupName => option._groupName === groupName);
            }
            return option[this.labelKey]?.toLowerCase().includes(query.toLowerCase());
          });
        }
      },
      updateOptions() {
        this.localOptions = this.flattedOptions;
      },
      async updateDropdownWidth() {
        if (!this.$refs.select?.$refs.popper || this.fitInputWidth) {
          return;
        }
        const { inputWidth } = this.$refs.select;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        await this.$nextTick();
        const itemEl = this.$refs.select.$refs.popper.$el.querySelector('.el-select-dropdown__item');
        if (!itemEl) {
          return;
        }
        const style = getComputedStyle(itemEl);
        const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        const scrollWidth = 6;
        ctx.font = `bold ${style.font}`;
        let width = 0;
        this.localOptions.forEach(option => {
          const metrics = ctx.measureText(option[this.labelKey]);
          width = Math.max(metrics.width, width);
        });
        this.dropdownWidth = Math.max(width + padding + scrollWidth, inputWidth - 2);
      },
      isSameValue(value1, value2) {
        if (isPlainObject(value1) && isPlainObject(value2)) {
          return value1[this.objectKey] === value2[this.objectKey];
        }
        return value1 === value2;
      },
      getOptionKey(item) {
        const value = item[this.valueKey];
        return isPlainObject(value) ? value[this.objectKey] : value;
      },
      focus() {
        this.$refs.select.focus();
      },
      blur() {
        this.$refs.select.blur();
      },
    },
    computed: {
      flattedOptions() {
        if (!Array.isArray(this.options)) {
          return [];
        }
        const list = [];
        this.options.forEach(option => {
          const _groupName = uuidv4();
          if (Array.isArray(option.options)) {
            list.push({
              ...option,
              _isGroup: true,
              _groupName,
              [this.valueKey]: uuidv4(),
            });
            list.push(...option.options.map(subOption => ({
              ...subOption,
              _groupName,
            })));
          } else {
            list.push(option);
          }
        });
        if (this.allowCreate && this.query && !list.some(option => option[this.labelKey] === this.query)) {
          list.unshift({
            [this.valueKey]: this.query,
            [this.labelKey]: this.query,
          });
        }
        return list;
      },
      scrollerStyle() {
        return {
          width: this.dropdownWidth ? `${this.dropdownWidth}px` : '',
        };
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
          this.updateOptions();
          const inputs = this.$el.querySelectorAll('input');
          if (!Array.from(inputs).includes(document.activeElement)) {
            this.updateSelectedLabel();
          }
        },
        deep: true,
      },
      localOptions() {
        this.updateDropdownWidth();
      },
    },
  };
</script>

<style lang="scss">
.el-select-v2__popper {
  .el-select-dropdown__wrap {
    max-height: unset;

    .el-select-dropdown__list {
      padding: 0;

      .el-select-dropdown__header {
        padding: 10px;
        border-bottom: 1px solid #e4e7ed;
      }

      .el-select-dropdown__footer {
        padding: 10px;
        border-top: 1px solid #e4e7ed;
      }
    }
  }

  .scroller {
    padding: 6px 0;
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
</style>
