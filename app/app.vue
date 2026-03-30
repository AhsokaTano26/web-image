<template>
  <div class="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
    <header class="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
      <div class="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="text-xl font-black tracking-tighter uppercase">Cloud Gallery</span>
        </NuxtLink>
        <div class="text-xs text-slate-400 font-mono hidden sm:block">
          NODE v24 | NUXT 4.0
        </div>
      </div>
    </header>

    <main>
      <NuxtPage />
    </main>

    <footer class="border-t bg-white py-8 mt-20">
      <div class="container mx-auto px-4 text-center text-sm text-slate-400">
        &copy; 2026 实时文件扫描系统
      </div>
    </footer>
  </div>
</template>

<style>
/* 全局页面切换动画 */
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(0.5rem);
}
</style>