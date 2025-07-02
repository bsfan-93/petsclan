// src/services/apiClient.ts

// --- 1. 类型定义区 ---

// 新增：ShopCategory 类型定义
export interface ShopCategory {
  id: string | number;
  name: string;
  path?: string;
  imageUrl?: string;
  // 根据API返回的数据，您可以按需添加更多字段
}

// Banner 数据类型
export interface ApiBannerData {
  id: string | number;
  imageUrl: string;
  altText?: string;
  linkUrl?: string;
  [key: string]: any;
}

// 产品卡片数据类型
export interface ProductCardData {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
  tag?: string;
  link?: string;
}

// "Follow" 图片数据类型
export interface FollowImageData {
  id: string;
  src: string;
}

// 健康板块数据类型
export interface HealthSectionData {
  id: string;
  title: string;
  imageUrl: string;
}

// 搜索结果项数据类型 (合并后的唯一版本)
export interface SearchResultItem {
  id: string;
  name: string;
  url: string;
  price: string | number;
}


// --- 2. API 配置区 ---

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.2.9:9999"; 

const BANNER_API_ENDPOINT = "/standalones/photo/details?type=1";
const PRODUCT_CARDS_API_ENDPOINT = "/standalones/photo/details?type=2"; 
const SHOP_CATEGORIES_API_ENDPOINT = "/standalones/photo/details?type=0";
const FOLLOW_IMAGES_API_ENDPOINT = "/standalones/photo/details?type=3";
const HEALTH_SECTION_API_ENDPOINT = "/standalones/photo/details?type=4";


// --- 3. API 函数区 ---

// 辅助函数，用于拼接完整的URL
function getFullImageUrl(url: string): string {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}


export async function fetchBannerDetails(): Promise<ApiBannerData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${BANNER_API_ENDPOINT}`);
    if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }
    const apiResponse = await response.json();
    if (!apiResponse.success || !Array.isArray(apiResponse.data)) { return []; }
    return apiResponse.data.map((item: any) => ({
      ...item,
      imageUrl: getFullImageUrl(item.url),
      altText: item.name
    }));
  } catch (error) {
    console.error("Error in fetchBannerDetails service:", error);
    throw error;
  }
}

export async function fetchShopCategories(): Promise<ShopCategory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${SHOP_CATEGORIES_API_ENDPOINT}`);
    if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }
    const apiResponse = await response.json();
    if (!apiResponse.success || !Array.isArray(apiResponse.data)) { return []; }
    
    return apiResponse.data.map((item: any) => {
      return {
        ...item,
        path: `/shop/category/${item.id}`,
        imageUrl: getFullImageUrl(item.url)
      };
    });
  } catch (error) {
    console.error("Error in fetchShopCategories service:", error);
    throw error;
  }
}

export async function fetchProductCards(): Promise<ProductCardData[]> {
  try {
    const url = `${API_BASE_URL}${PRODUCT_CARDS_API_ENDPOINT}`;
    const response = await fetch(url);
    if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }
    
    const apiResponse = await response.json();
    if (!apiResponse.success || !Array.isArray(apiResponse.data)) {
      return [];
    }
    
    const rawProducts: any[] = apiResponse.data;
    const descriptions: { [key: string]: string } = {
      'product -1': 'Redefine Pet Walking with a New Method',
      'product -2': '',
      'product -3': 'New Ways of Smart Feeding',
    };

    return rawProducts.map((item: any) => ({
      id: item.id,
      name: item.name,
      imageUrl: getFullImageUrl(item.url),
      description: descriptions[item.name] || '',
      tag: 'CHECK',
      link: `/shop/product/${item.id}`
    }));
  } catch (error) {
    console.error('Error in fetchProductCards service:', error);
    throw error;
  }
}

export async function fetchFollowImages(): Promise<FollowImageData[]> {
  try {
    const url = `${API_BASE_URL}${FOLLOW_IMAGES_API_ENDPOINT}`;
    const response = await fetch(url);
    if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }
    const apiResponse = await response.json();
    if (!apiResponse.success || !apiResponse.data || !Array.isArray(apiResponse.data)) {
      return [];
    }

    return apiResponse.data.map((item: any) => ({
      id: item.id,
      src: getFullImageUrl(item.url),
    }));
  } catch (error: any) {
    console.error('Error in fetchFollowImages service:', error);
    throw error;
  }
}

export async function fetchHealthSectionData(): Promise<HealthSectionData | null> {
  try {
    const url = `${API_BASE_URL}${HEALTH_SECTION_API_ENDPOINT}`;
    const response = await fetch(url);
    if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }
    const apiResponse = await response.json();

    if (!apiResponse.success || !Array.isArray(apiResponse.data) || apiResponse.data.length === 0) {
      return null;
    }
    const item = apiResponse.data[0];
    
    return {
      id: item.id,
      title: item.name,
      imageUrl: getFullImageUrl(item.url),
    };
  } catch (error: any) {
    console.error('Error in fetchHealthSectionData service:', error);
    throw error;
  }
}

export async function subscribeEmail(email: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/standalones/mail/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email }),
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.msg || 'An unknown error occurred.' };
    }
  } catch (error) {
    console.error("Subscription API call failed:", error);
    return { success: false, message: 'Network error or server is down.' };
  }
}

// 修正后的、唯一的 fetchSearchResults 函数
export async function fetchSearchResults(keyword: string): Promise<SearchResultItem[]> {
  if (!keyword.trim()) {
    return [];
  }
  try {
    const url = `${API_BASE_URL}/standalones/good/search`; // POST请求，URL中不再需要参数

    // --- 以下是主要修改点 ---
    const response = await fetch(url, {
      method: 'POST', // 1. 明确指定请求方法为 POST
      headers: {
        'Content-Type': 'application/json', // 2. 告诉后端我们发送的是JSON格式的数据
      },
      // 3. 将搜索关键词放在请求体(body)中
      body: JSON.stringify({ name: keyword }), 
    });
    // --- 修改结束 ---

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const apiResponse = await response.json();

    if (apiResponse.success && Array.isArray(apiResponse.data)) {
      return apiResponse.data.map((item: any) => ({
        ...item,
        url: getFullImageUrl(item.url)
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}