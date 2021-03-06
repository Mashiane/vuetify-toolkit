import { VAutocomplete, VSelect, VDataTable, consoleError } from '../../vuetify-import'
import VDataGridSelectList from './VDataGridSelectList'
import DefaultMenuProps from '../../utils/MenuProps'

export default VAutocomplete.extend({
  name: 'v-data-grid-select',
  props: {
    ...VSelect.options.props,
    ...VAutocomplete.options.props,
    ...VDataTable.options.props,
    autocomplete: {
      type: Boolean,
      default: false
    },
    openAll: Boolean,
    menuProps: {
      type: [String, Array, Object],
      default: () => DefaultMenuProps
    },
    itemText: {
      type: [String, Array, Function],
      default: 'text'
    }
  },
  data: () => ({
    selectedItems: []
  }),
  computed: {
    classes () {
      if (this.autocomplete) {
        return Object.assign({}, VSelect.options.computed.classes.call(this), {
          'v-autocomplete': true,
          'v-autocomplete--is-selecting-index': this.selectedIndex > -1
        })
      } else {
        return Object.assign({}, VSelect.options.computed.classes.call(this), {})
      }
    },
    internalSearch: {
      get () {
        const result = this.autocomplete ? VAutocomplete.options.computed.internalSearch.get.call(this)
          : ''
        return result
      },
      set (val) {
        if (this.autocomplete) {
          VAutocomplete.options.computed.internalSearch.set.call(this, val)
        }
      }
    },
    listData () {
      const data = VSelect.options.computed.listData.call(this)
      Object.assign(data.props, {
        activatable: this.activatable,
        activeClass: this.activeClass,
        dark: this.dark,
        selectable: true,
        selectedColor: this.selectedColor,
        indeterminateIcon: this.indeterminateIcon,
        onIcon: this.onIcon,
        offIcon: this.offIcon,
        expandIcon: this.expandIcon,
        loadingIcon: this.loadingIcon,
        itemKey: this.itemKey,
        itemText: this.itemText,
        multiple: this.multiple,
        transition: this.transition,
        selectedItems: this.selectedItems,
        openAll: this.openAll,
        openOnClick: this.openOnClick,
        headers: this.headers,
        headersLength: this.headersLength,
        headerText: this.headerText,
        headerKey: this.headerKey,
        hideHeaders: this.hideHeaders,
        rowsPerPageText: this.rowsPerPageText,
        customFilter: this.customFilter,
        useDefaultCommands: this.useDefaultCommands
      })
      Object.assign(data.on, {
        select: e => {
          this.selectItems(e)
        },
        input: e => {
          this.selectItems(e)
        }
      })
      Object.assign(data.scopedSlots, this.$scopedSlots)
      return data
    },
    staticList () {
      if (this.$slots['no-data'] || this.$slots['prepend-item'] || this.$slots['append-item']) {
        consoleError('assert: staticList should not be called if slots are used')
      }
      const slots = []
      slots.push(this.$scopedSlots.items)
      return this.$createElement(VDataGridSelectList, this.listData, slots)
    }
  },
  methods: {
    register () {},
    genInput () {
      return this.autocomplete ? VAutocomplete.options.methods.genInput.call(this)
        : VSelect.options.methods.genInput.call(this)
    },
    genList () {
      // If there's no slots, we can use a cached VNode to improve performance
      if (this.$slots['no-data'] || this.$slots['prepend-item'] || this.$slots['append-item']) {
        return this.genListWithSlot()
      } else {
        return this.staticList
      }
    },
    genListWithSlot () {
      const slots = ['prepend-item', 'no-data', 'append-item']
        .filter(slotName => this.$slots[slotName])
        .map(slotName => this.$createElement('template', {
          slot: slotName
        }, this.$slots[slotName]))
      return this.$createElement(VDataGridSelectList, {
        ...this.listData
      }, slots)
    },
    genSelections () {
      return VSelect.options.methods.genSelections.call(this)
    },
    selectItems (items) {
      this.selectedItems = items
      if (!this.multiple) {
        this.isMenuActive = false
      }
    },
    clearableCallback () {
      this.internalValue = null
      this.$refs.input.internalValue = ''
      this.$refs.input.value = ''
      this.selectedItems = []
      this.$nextTick(() => this.$refs.input.focus())
    }
  }
})
