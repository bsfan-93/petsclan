export interface ApiBannerData {
  id: string | number;
  imageUrl: string;
  altText?: string;
  linkUrl?: string;
  [key: string]: any;
}

export interface ProductCardData {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
  tag?: string;
  link?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://192.168.2.9:9999"; 

const BANNER_API_ENDPOINT = "/standalones/photo/details?type=1";
// --- START: 使用您提供的正确API端点 ---
const PRODUCT_CARDS_API_ENDPOINT = "/standalones/photo/details?type=2"; 
// --- END ---
const SHOP_CATEGORIES_API_ENDPOINT = "/standalones/photo/details?type=0";

export async function fetchBannerDetails(): Promise<ApiBannerData[] | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${BANNER_API_ENDPOINT}`);
    if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }
    const apiResponse = await response.json();
    if (!apiResponse.success || !Array.isArray(apiResponse.data)) { return []; }
    return apiResponse.data.map((item: any) => ({
      ...item,
      imageUrl: item.url.startsWith('http') ? item.url : `${API_BASE_URL}${item.url}`,
      altText: item.name
    }));
  } catch (error) {
    console.error("Error in fetchBannerDetails service:", error);
    throw error;
  }
}

export async function fetchShopCategories(): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}${SHOP_CATEGORIES_API_ENDPOINT}`);
    if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }
    const apiResponse = await response.json();
    if (!apiResponse.success || !Array.isArray(apiResponse.data)) { return []; }
    return apiResponse.data.map((item: any) => ({
        ...item,
        path: `/shop/category/${item.id}`
    }));
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
      console.warn('Product cards API call failed or data is malformed:', apiResponse);
      return [];
    }
    
    const rawProducts: any[] = apiResponse.data;

    // --- START: 为每个产品添加描述文字 ---
    // 创建一个描述文字的映射表
    const descriptions: { [key: string]: string } = {
      'product -1': 'Redefine Pet Walking with a New Method',
      'product -2': '', // 设计图中 Fountains 卡片没有描述
      'product -3': 'New Ways of Smart Feeding',
    };
    // --- END ---

    return rawProducts.map(item => {
      // 构造完整的图片URL
      const fullImageUrl = item.url.startsWith('http') 
        ? item.url 
        : `${API_BASE_URL}${item.url.startsWith('/') ? '' : '/'}${item.url}`;
      
      return {
        id: item.id,
        name: item.name,
        imageUrl: fullImageUrl,
        // --- START: 从映射表中获取描述，并提供默认值 ---
        description: descriptions[item.name] || '', // 如果找不到匹配的描述，则为空字符串
        tag: 'CHECK',
        link: `/shop/product/${item.id}`
        // --- END ---
      };
    });

  } catch (error) {
    console.error('Error in fetchProductCards service:', error);
    throw error;
  }
}

// --- START: 为 "Follow" 图片新增的接口和函数 ---

// 定义 "Follow" 图片需要的数据结构
export interface FollowImageData {
  id: string;
  src: string; // 我们将把API返回的 fullImageUrl 映射到 src
}

// 新的API端点
const FOLLOW_IMAGES_API_ENDPOINT = "/standalones/photo/details?type=3";

/**
 * 从API获取 "Follow along for more" 的图片列表
 */
export async function fetchFollowImages(): Promise<FollowImageData[]> {
  try {
    const url = `${API_BASE_URL}${FOLLOW_IMAGES_API_ENDPOINT}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error fetching follow images! Status: ${response.status}`);
    }

    const apiResponse = await response.json();

    if (!apiResponse.success || !apiResponse.data || !Array.isArray(apiResponse.data)) {
      console.warn('Follow images API call was not successful or "data" is malformed:', apiResponse);
      return [];
    }

    const rawImages: any[] = apiResponse.data;

    // 将API返回的原始数据，映射成我们的 FollowImageData 格式
    return rawImages.map(item => {
      // 构造完整的图片URL
      const fullImageUrl = item.url.startsWith('http') 
        ? item.url 
        : `${API_BASE_URL}${item.url.startsWith('/') ? '' : '/'}${item.url}`;
      
      return {
        id: item.id,
        src: fullImageUrl, // 将 fullImageUrl 赋给 src 属性
      };
    });

  } catch (error: any) {
    console.error('Error in fetchFollowImages service:', error);
    throw error;
  }
}
// 定义图文区域需要的数据结构
export interface HealthSectionData {
  id: string;
  title: string; // 我们将把API返回的 name 映射到 title
  imageUrl: string;
}

// 新的API端点
const HEALTH_SECTION_API_ENDPOINT = "/standalones/photo/details?type=4";

/**
 * 从API获取健康板块的图文数据
 */
export async function fetchHealthSectionData(): Promise<HealthSectionData | null> {
  try {
    const url = `${API_BASE_URL}${HEALTH_SECTION_API_ENDPOINT}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error fetching health section data! Status: ${response.status}`);
    }

    const apiResponse = await response.json();

    // 假设API返回一个包含单个对象的数组
    if (!apiResponse.success || !Array.isArray(apiResponse.data) || apiResponse.data.length === 0) {
      console.warn('Health section API call was not successful or "data" is empty:', apiResponse);
      return null;
    }

    const item = apiResponse.data[0]; // 只取数组中的第一个对象

    const fullImageUrl = item.url.startsWith('http') 
      ? item.url 
      : `${API_BASE_URL}${item.url.startsWith('/') ? '' : '/'}${item.url}`;
      
    return {
      id: item.id,
      title: item.name, // 将 name 映射为 title
      imageUrl: fullImageUrl,
    };

  } catch (error: any) {
    console.error('Error in fetchHealthSectionData service:', error);
    throw error;
  }
}

/**
 * 提交订阅邮件地址
 * @param email - 用户输入的邮件地址
 */
export async function subscribeEmail(email: string): Promise<boolean> {
  // 注意：这里的 API 地址是我根据你之前的输入补充的
  const API_URL = "http://192.168.2.9:9999/standalones/mail/subscribe";
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Subscription failed');
    }

    const result = await response.json();
    console.log('Subscription successful:', result);
    return true;

  } catch (error) {
    console.error('Error in subscribeEmail service:', error);
    return false;
  }
}