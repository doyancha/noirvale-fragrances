export interface ApiVariantDto {
  label: string;
  ml: number;
  price: string;
  compare_at_price: string | null;
  in_stock: boolean;
}

export interface ApiProductImageDto {
  role: string;
  secure_url: string;
  alt_text: string;
  sort_order: number;
  format: string;
  width: number | null;
  height: number | null;
}

export interface ApiCollectionReferenceDto {
  slug: string;
  name: string;
}

export interface ApiProductDto {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  scent_family: string;
  concentration: string;
  currency: string;
  short_description: string;
  longevity: string;
  sillage: string;
  seasons: string[];
  occasions: string[];
  style_tags: string[];
  in_stock: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  variants: ApiVariantDto[];
  primary_image: ApiProductImageDto | null;
  full_description?: string;
  top_notes?: string[];
  heart_notes?: string[];
  base_notes?: string[];
  images?: ApiProductImageDto[];
  collections?: ApiCollectionReferenceDto[];
}

export interface ApiCollectionImageDto {
  secure_url: string;
  alt_text: string;
  format: string;
  width: number | null;
  height: number | null;
}

export interface ApiCollectionDto {
  slug: string;
  name: string;
  description: string;
  image: ApiCollectionImageDto | null;
  products?: ApiProductDto[];
}
