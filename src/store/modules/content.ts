import { defineStore } from 'pinia';
import { fetchFollowImages, type FollowImageData } from '@/services/apiClient';

/**
 * 这个模块专门用于缓存“Follow along”轮播图的数据
 */
export const useContentStore = defineStore('content', {
  state: () => ({
    images: [] as FollowImageData[], // 用来存放缓存的图片
    hasFetched: false, // 一个标记，用来判断是否已经请求过API
  }),
  actions: {
    /**
     * 获取轮播图数据。
     * 如果是第一次调用，它会从API获取数据并缓存起来。
     * 如果已经调用过，它会直接返回，不再请求API。
     */
    async ensureImagesFetched() {
      // 如果已经请求过，就直接退出，不再执行任何操作
      if (this.hasFetched) {
        return;
      }
      try {
        const fetchedImages = await fetchFollowImages();
        this.images = fetchedImages; // 将获取到的数据存入state
        this.hasFetched = true; // 将标记设置为true，表示已经请求过了
      } catch (error) {
        console.error('Failed to fetch and cache follow images:', error);
      }
    },
  },
});