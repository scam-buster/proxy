export interface Collection {
  banner_image_url: string | null;
  chat_url: string | null;
  created_date: string;
  default_to_fiat: boolean;
  description: string | null;
  dev_buyer_fee_basis_points: string;
  dev_seller_fee_basis_points: string;
  discord_url: string | null;
  display_data: {
    card_display_style: string;
    images: string[];
  };
  external_url: string | null;
  featured: boolean;
  featured_image_url: string | null;
  fees: {
    opensea_fees: Record<string, number>;
    seller_fees: Record<string, number>;
  };
  hidden: boolean;
  image_url: string | null;
  instagram_username: string | null;
  is_nsfw: boolean;
  is_rarity_enabled: boolean;
  is_subject_to_whitelist: boolean;
  large_image_url: string | null;
  medium_username: string | null;
  name: string;
  only_proxied_transfers: boolean;
  opensea_buyer_fee_basis_points: string;
  opensea_seller_fee_basis_points: '250';
  payout_address: string | null;
  require_email: boolean;
  safelist_request_status: 'not_requested';
  short_description: string | null;
  slug: string;
  telegram_url: string | null;
  twitter_username: string | null;
  wiki_url: string | null;
}

export interface ContractInfo {
  address: string;
  asset_contract_type: string;
  buyer_fee_basis_points: number;
  collection: Collection;
  created_date: string;
  default_to_fiat: boolean;
  description: string | null;
  dev_buyer_fee_basis_points: number;
  dev_seller_fee_basis_points: number;
  external_link: string | null;
  image_url: string | null;
  name: string;
  nft_version: string;
  only_proxied_transfers: boolean;
  opensea_buyer_fee_basis_points: number;
  opensea_seller_fee_basis_points: number;
  owner: null;
  payout_address: string | null;
  schema_name: string;
  seller_fee_basis_points: number;
  symbol: string;
  total_supply: string;
}
