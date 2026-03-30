<script setup>
// 获取文件夹列表
const { data: folders } = await useFetch('/api/folders', {
  key: 'home-folders-v3'
})
</script>

<template>
  <div class="p-6 md:p-12 max-w-7xl mx-auto min-h-screen bg-slate-50">
    <header class="mb-10 text-center">
      <h1 class="text-3xl font-black text-slate-800 tracking-tight">我的相册</h1>
      <p class="text-slate-400 text-sm mt-2">共 {{ folders?.length || 0 }} 个分类</p>
    </header>

    <div class="flex flex-wrap justify-center gap-8">

      <NuxtLink
        v-for="f in folders"
        :key="f.name"
        :to="`/${f.name}`"
        class="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200"
        style="width: 320px; flex: 0 0 320px;"
      >
        <div class="relative overflow-hidden bg-slate-100" style="height: 240px;">
          <NuxtImg
            v-if="f.cover"
            :src="f.cover"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            style="display: block; width: 100%; height: 100%; object-fit: cover;"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-slate-300 italic">
            No Images
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        <div class="p-6 text-center">
          <h2 class="text-xl font-bold text-slate-800 capitalize mb-1 group-hover:text-blue-600 transition-colors">
            {{ f.name }}
          </h2>
          <div class="text-blue-500 font-bold text-sm">点击浏览 →</div>
        </div>
      </NuxtLink>

    </div>

    <div v-if="!folders?.length" class="mt-20 p-20 text-center border-2 border-dashed border-slate-300 rounded-3xl text-slate-400">
      尚未检测到图片文件夹
    </div>
  </div>
</template>