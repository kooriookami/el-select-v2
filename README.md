# Select V2 虚拟列表选择器

基于 Element UI 适用于 Vue 2 版本的虚拟列表选择器组件。

## 在线演示

[在线演示](https://kooriookami.github.io/el-select-v2/)

## 使用说明

```npm i el-select-v2```
```npm i element-ui```

```js
  import Vue from 'vue';
  // 必须引入 element-ui
  import ElementUI from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import ElSelectV2 from 'el-select-v2';

  Vue.use(ElSelectV2);
```

```vue
<template>
  <el-select-v2 v-model="value" :options="options" />
</template>

<script>
  export default {
    data() {
      return {
        options: [],
        value: '',
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
```

## 示例代码

[示例代码](src/components/Demo.vue)

### Select Attributes
| 参数                      | 说明                                               | 类型                        | 可选值               | 默认值   |
|-------------------------|--------------------------------------------------|---------------------------|-------------------|-------|
| value / v-model         | 绑定值                                              | boolean / string / number | —                 | —     |
| options                 | 列表数据                                             | array                     | —                 | —     |
| value-key               | value 键名                                         | string                    | —                 | value |
| label-key               | label 键名                                         | string                    | —                 | label |
| min-item-size           | 每个选项的最小高度                                        | number                    | —                 | 34    |
| multiple                | 是否多选                                             | boolean                   | —                 | false |
| disabled                | 是否禁用                                             | boolean                   | —                 | false |
| size                    | 输入框尺寸                                            | string                    | medium/small/mini | —     |
| clearable               | 是否可以清空选项                                         | boolean                   | —                 | false |
| collapse-tags           | 多选时是否将选中值按文字的形式展示                                | boolean                   | —                 | false |
| multiple-limit          | 多选时用户最多可以选择的项目数，为 0 则不限制                         | number                    | —                 | 0     |
| name                    | select input 的 name 属性                           | string                    | —                 | —     |
| autocomplete            | select input 的 autocomplete 属性                   | string                    | —                 | off   |
| placeholder             | 占位符                                              | string                    | —                 | 请选择   |
| filterable              | 是否可搜索                                            | boolean                   | —                 | false |
| allow-create            | 是否允许用户创建新条目，需配合 `filterable` 使用                  | boolean                   | —                 | false |
| filter-method           | 自定义搜索方法                                          | function                  | —                 | —     |
| remote                  | 是否为远程搜索                                          | boolean                   | —                 | false |
| remote-method           | 远程搜索方法                                           | function                  | —                 | —     |
| loading                 | 是否正在从远程获取数据                                      | boolean                   | —                 | false |
| loading-text            | 远程加载时显示的文字                                       | string                    | —                 | 加载中   |
| no-match-text           | 搜索条件无匹配时显示的文字，也可以使用 `slot="empty"` 设置            | string                    | —                 | 无匹配数据 |
| no-data-text            | 选项为空时显示的文字，也可以使用 `slot="empty"` 设置               | string                    | —                 | 无数据   |
| popper-class            | Select 下拉框的类名                                    | string                    | —                 | —     |
| reserve-keyword         | 多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词                     | boolean                   | —                 | false |
| default-first-option    | 在输入框按下回车，选择第一个匹配项。需配合 `filterable` 或 `remote` 使用 | boolean                   | —                 | false |
| popper-append-to-body   | 是否将弹出框插入至 body 元素。在弹出框的定位出现问题时，可将该属性设置为 false    | boolean                   | —                 | true  |
| automatic-dropdown      | 对于不可搜索的 Select，是否在输入框获得焦点后自动弹出选项菜单               | boolean                   | —                 | false |
| fit-input-width (1.1.0) | 下拉框的宽度是否与输入框相同，设置为 false 后自动计算宽度，性能会有所降低         | boolean                   | —                 | true  |

### Select Events
| 事件名称           | 说明                   | 回调参数                 |
|----------------|----------------------|----------------------|
| change         | 选中值发生变化时触发           | 目前的选中值               |
| visible-change | 下拉框出现/隐藏时触发          | 出现则为 true，隐藏则为 false |
| remove-tag     | 多选模式下移除tag时触发        | 移除的tag值              |
| clear          | 可清空的单选模式下用户点击清空按钮时触发 | —                    |
| blur           | 当 input 失去焦点时触发      | (event: Event)       |
| focus          | 当 input 获得焦点时触发      | (event: Event)       |

### Select Slots
| name   | 说明                 |
|--------|--------------------|
| —      | 自定义模板，参数为 { item } |
| prefix | Select 组件头部内容      |
| empty  | 无选项时的列表            |


### Options
| 参数       | 说明                        | 类型                   | 可选值 | 默认值   |
|----------|---------------------------|----------------------|-----|-------|
| value    | 选项的值                      | string/number/object | —   | —     |
| label    | 选项的标签，若不设置则默认与 `value` 相同 | string/number        | —   | —     |
| disabled | 是否禁用该选项                   | boolean              | —   | false |

### Methods
| 方法名   | 说明                  | 参数 |
|-------|---------------------|----|
| focus | 使 input 获取焦点        | —  |
| blur  | 使 input 失去焦点，并隐藏下拉框 | —  |
