<script setup>
const route = useRoute()
const folderName = route.params.slug

// 获取当前文件夹下的图片数据
const { data: images, refresh, pending } = await useFetch('/api/images', {
  query: { folder: folderName },
  key: `gallery-images-${folderName}`
})

const selectedImg = ref(null)

// 实时轮询
let timer = null
onMounted(() => {
  timer = setInterval(() => refresh(), 3000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-10">
    <header class="max-w-7xl mx-auto mb-10 flex justify-between items-end">
      <div>
        <NuxtLink to="/" class="text-blue-600 text-sm font-bold mb-2 inline-block">← 返回列表</NuxtLink>
        <h1 class="text-3xl font-extrabold text-gray-900 capitalize">{{ folderName }}</h1>
      </div>

      <div class="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
        <span :class="['w-2.5 h-2.5 rounded-full', pending ? 'bg-yellow-400 animate-pulse' : 'bg-green-500']"></span>
        <span class="text-xs font-bold text-gray-500">{{ pending ? '同步中' : '已同步' }}</span>
      </div>
    </header>

    <main class="max-w-7xl mx-auto">
      <div v-if="images?.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div
          v-for="(img, index) in images"
          :key="index"
          @click="selectedImg = img"
          class="group relative aspect-square bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
        >
          <div class="relative w-full aspect-square overflow-hidden rounded-xl bg-gray-200">
            <img
              :src="img"
              loading="lazy"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div class="bg-white/90 p-2 rounded-full shadow-lg">
              <svg class="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="py-32 text-center text-gray-400 border-2 border-dashed border-gray-300 rounded-3xl">
        <p class="italic">等待图片加载或目录为空...</p>
      </div>
    </main>

    <Transition name="scale">
      <div v-if="selectedImg" class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4" @click="selectedImg = null">
        <img
          :src="selectedImg"
          class="max-w-full max-h-[90vh] object-contain rounded shadow-2xl transition-transform duration-300"
          @click.stop
        />
        <p class="absolute bottom-6 text-white/40 text-xs">点击任意位置退出</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.grid > div {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* 弹窗动画 */
.scale-enter-active, .scale-leave-active { transition: all 0.2s ease; }
.scale-enter-from, .scale-leave-to { opacity: 0; transform: scale(0.9); }
</style>