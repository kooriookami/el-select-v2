export default {
  computed: {
    optionsAllDisabled() {
      return this.localOptions.every(option => option[this.aliasProps.disabled]);
    },
  },
  methods: {
    navigateOptions(direction) {
      if (!this.$refs.select.visible) {
        this.$refs.select.visible = true;
        return;
      }
      if (!this.localOptions.length) return;
      if (!this.optionsAllDisabled) {
        let localOption;
        if (direction === 'next') {
          if (this.localIndex >= this.localOptions.length - 1) {
            this.localIndex = 0;
          } else {
            this.localIndex++;
          }
        } else if (direction === 'prev') {
          if (this.localIndex <= 0) {
            this.localIndex = this.localOptions.length - 1;
          } else {
            this.localIndex--;
          }
        }
        localOption = this.localOptions[this.localIndex];
        if (localOption[this.aliasProps.disabled] || localOption._isGroup) {
          this.navigateOptions(direction);
          return;
        }
        this.$refs.scroller.scrollToItem(this.localIndex);
      }
    },
    updateHoverIndex() {
      if (!this.$refs.select) {
        return;
      }
      this.$watch(() => this.$refs.select.options, () => {
        this.$refs.select.hoverIndex = -1;
        const localOption = this.localOptions[this.localIndex];
        if (localOption) {
          this.$refs.select.hoverIndex = this.$refs.select.options.findLastIndex(option => this.isSameValue(option.value, localOption[this.aliasProps.value]));
        }
      }, {
        immediate: true,
      });
    },
    hoverItem(item) {
      if (!item[this.aliasProps.disabled]) {
        this.localIndex = this.localOptions.indexOf(item);
      }
    },
  },
};
