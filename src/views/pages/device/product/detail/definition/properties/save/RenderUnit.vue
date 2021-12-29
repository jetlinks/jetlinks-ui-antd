<template>
  <a-auto-complete v-model:value="value" style="width: 100%">
    <template #options>
      <a-select-opt-group v-for="(value, name) in units" :key="name" :label="name">
        <a-select-option :title="`${i.name}/${i.symbol}`" v-for="i in value" :key="i.id" :value="i.id">{{ i.name }}/{{ i.symbol }}</a-select-option>
      </a-select-opt-group>
    </template>
  </a-auto-complete>
</template>

<script lang="ts">
import { getUnit } from '../../../../service'
import { groupBy } from 'lodash'
import { defineComponent, onMounted, ref, watch } from 'vue'
export default defineComponent({
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup (props) {
    const value = ref()
    const units = ref<any>([])
    watch(() => props.modelValue, (newValue) => {
      value.value = newValue
    })
    onMounted(() => {
      getUnit().then(resp => {
        if (resp.data.status === 200) {
          const grouped = groupBy(resp.data.result, i => i.type)
          units.value = grouped
        }
      })
    })
    return {
      value,
      units
    }
  }
})
</script>
