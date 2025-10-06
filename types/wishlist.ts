export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: {
    id: string;
    title: string;
    price: number;
    currency: string;
    image_url: string;
    author: string;
    source_url: string;
  };
  addedAt: Date;
}

export interface AddToWishlistRequest {
  userId: string;
  productId: string;
}