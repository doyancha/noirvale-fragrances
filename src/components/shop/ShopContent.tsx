'use client';

import { useState, useMemo, Suspense } from 'react';
import type { Product } from '@/lib/types';
import { getAllScentFamilies, getAllOccasions, getAllConcentrations } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { slugify } from '@/lib/utils';

function ShopContentInner({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentFamily = searchParams.get('family') || '';
  const currentOccasion = searchParams.get('occasion') || '';
  const currentConcentration = searchParams.get('concentration') || '';
  const currentSort = searchParams.get('sort') || 'featured';
  const currentSearch = searchParams.get('q') || '';

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const families = getAllScentFamilies();
  const occasions = getAllOccasions();
  const concentrations = getAllConcentrations();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }

    if (currentFamily) {
      result = result.filter((p) => p.scentFamily === currentFamily);
    }

    if (currentOccasion) {
      result = result.filter((p) =>
        p.occasions?.some((occasion) => slugify(occasion) === currentOccasion)
      );
    }

    if (currentConcentration) {
      result = result.filter((p) => p.concentration === currentConcentration);
    }

    switch (currentSort) {
      case 'price-low':
        result.sort((a, b) => (a.sizes[0]?.price ?? 0) - (b.sizes[0]?.price ?? 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.sizes[0]?.price ?? 0) - (a.sizes[0]?.price ?? 0));
        break;
      case 'newest':
        result.sort((a, b) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        });
        break;
      default: // featured
        result.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });
    }

    return result;
  }, [
    initialProducts,
    currentSearch,
    currentFamily,
    currentOccasion,
    currentConcentration,
    currentSort,
  ]);

  return (
    <div className="flex flex-col gap-8">
      {/* Desktop Filter Bar */}
      <div className="hidden lg:flex flex-col gap-4 bg-[#111111] border border-[#2a2a2a] p-4 rounded-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search fragrances..."
              value={currentSearch}
              onChange={(e) => updateParam('q', e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#c9a96e] transition-colors"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">Sort by:</span>
            <select
              value={currentSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-md py-2 px-3 text-sm focus:outline-none focus:border-[#c9a96e]"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-6 pt-4 border-t border-[#2a2a2a] text-sm">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Family:</span>
            <select
              value={currentFamily}
              onChange={(e) => updateParam('family', e.target.value)}
              className="bg-transparent focus:outline-none hover:text-[#c9a96e] transition-colors cursor-pointer"
            >
              <option value="">All Families</option>
              {families.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Occasion:</span>
            <select
              value={currentOccasion}
              onChange={(e) => updateParam('occasion', e.target.value)}
              className="bg-transparent focus:outline-none hover:text-[#c9a96e] transition-colors cursor-pointer"
            >
              <option value="">All Occasions</option>
              {occasions.map((occasion) => (
                <option key={occasion} value={slugify(occasion)}>
                  {occasion}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Concentration:</span>
            <select
              value={currentConcentration}
              onChange={(e) => updateParam('concentration', e.target.value)}
              className="bg-transparent focus:outline-none hover:text-[#c9a96e] transition-colors cursor-pointer"
            >
              <option value="">All Concentrations</option>
              {concentrations.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {(currentSearch || currentFamily || currentOccasion || currentConcentration || currentSort !== 'featured') && (
            <button
              onClick={clearFilters}
              className="text-[#c9a96e] hover:text-[#e0c592] ml-auto flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="flex lg:hidden items-center justify-between gap-4">
        <button
          className="flex-1 flex items-center justify-center gap-2 border border-[#2a2a2a] bg-[#111111] py-2 px-4 rounded-md text-sm"
          onClick={() => setIsMobileFiltersOpen(true)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters & Sort
        </button>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-zinc-400">
        <p>Showing {filteredProducts.length} of {initialProducts.length} fragrances</p>
      </div>

      {/* Results Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-[#2a2a2a] rounded-lg bg-[#111111]/50">
          <p className="text-xl font-serif text-[#faf7f4] mb-2">No matches found</p>
          <p className="text-zinc-400 mb-6">No fragrances match your criteria. Try adjusting your filters.</p>
          <button onClick={clearFilters} className="bg-[#c9a96e] text-black px-4 py-2 rounded-md hover:bg-[#e0c592]">Clear Filters</button>
        </div>
      )}

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="relative ml-auto w-full max-w-xs bg-[#111111] border-l border-[#2a2a2a] h-full flex flex-col p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-serif">Filters</h2>
              <button onClick={() => setIsMobileFiltersOpen(false)}>
                <X className="w-6 h-6 text-zinc-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={currentSearch}
                    onChange={(e) => updateParam('q', e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#c9a96e]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Sort By</label>
                <select
                  value={currentSort}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md py-2 px-3 text-sm focus:outline-none focus:border-[#c9a96e]"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Scent Family</label>
                <select
                  value={currentFamily}
                  onChange={(e) => updateParam('family', e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md py-2 px-3 text-sm focus:outline-none focus:border-[#c9a96e]"
                >
                  <option value="">All Families</option>
                  {families.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Concentration</label>
                <select
                  value={currentConcentration}
                  onChange={(e) => updateParam('concentration', e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md py-2 px-3 text-sm focus:outline-none focus:border-[#c9a96e]"
                >
                  <option value="">All Concentrations</option>
                  {concentrations.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Occasion</label>
                <select
                  value={currentOccasion}
                  onChange={(e) => updateParam('occasion', e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md py-2 px-3 text-sm focus:outline-none focus:border-[#c9a96e]"
                >
                  <option value="">All Occasions</option>
                  {occasions.map((occasion) => (
                    <option key={occasion} value={slugify(occasion)}>{occasion}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-[#2a2a2a] mt-auto flex flex-col gap-3">
              <button onClick={() => setIsMobileFiltersOpen(false)} className="w-full bg-[#c9a96e] text-black py-2 rounded-md hover:bg-[#e0c592]">
                Show {filteredProducts.length} Results
              </button>
              <button onClick={clearFilters} className="w-full border border-[#2a2a2a] text-zinc-300 py-2 rounded-md hover:bg-[#1a1a1a]">
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopContent({ initialProducts }: { initialProducts: Product[] }) {
  return (
    <Suspense fallback={<div className="h-96 w-full animate-pulse bg-[#111111] rounded-lg"></div>}>
      <ShopContentInner initialProducts={initialProducts} />
    </Suspense>
  );
}