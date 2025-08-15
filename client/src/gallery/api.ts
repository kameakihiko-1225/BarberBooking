export async function fetchGallery({page=1,pageSize=30,locale='pl',tag}:{page?:number;pageSize?:number;locale?:string;tag?:string}) {
  const qs=new URLSearchParams({page:String(page),pageSize:String(pageSize),locale, ...(tag?{tag}:{} )});
  const r=await fetch('/api/gallery?'+qs,{headers:{Accept:'application/json'}});
  if(!r.ok) throw new Error('Gallery fetch failed');
  return r.json();
}

export async function fetchGalleryTags(locale='pl') {
  const r=await fetch(`/api/gallery/tags?locale=${locale}`,{headers:{Accept:'application/json'}});
  if(!r.ok) throw new Error('Gallery tags fetch failed');
  return r.json();
}

export interface GalleryItem {
  slug: string;
  title: string;
  alt: string;
  w: number;
  h: number;
  srcsets: {
    avif: string;
    webp: string;
    jpg: string;
  };
  blurData: string;
  tags: Array<{
    slug: string;
    name: string;
  }>;
}

export interface GalleryResponse {
  items: GalleryItem[];
  nextPage: number | null;
  totalItems: number;
  currentPage: number;
  pageSize: number;
}

export interface GalleryTag {
  slug: string;
  name: string;
  count: number;
}

export interface GalleryTagsResponse {
  tags: GalleryTag[];
}