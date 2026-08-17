"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

// Replace with dynamic environment variable in production
const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:5000/api/v1`;
  }
  return "http://localhost:5000/api/v1";
};

interface Product {
  _id: string;
  title: string;
  vendor: string;
  status: string;
  images: Array<{ url: string; altText?: string }>;
  options: Array<{ name: string; position: number; values: string[] }>;
}

export default function Home() {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch(`${getApiUrl()}/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center" suppressHydrationWarning>
        <div className="text-lg font-medium animate-pulse">Loading amazing products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        <p>Error loading products. Is the API running?</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Selection</h1>
          <p className="text-muted-foreground mt-2">
            Select a product to start customizing your design.
          </p>
        </div>
      </div>

      <Separator className="mb-8" />

      {products?.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed">
          <h3 className="text-2xl font-semibold text-slate-700">No products found</h3>
          <p className="text-slate-500 mt-2">Did you sync products from Shopify yet?</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map((product) => (
            <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-all border-slate-200">
              <div className="relative aspect-square overflow-hidden bg-slate-100 p-6 flex justify-center items-center">
                {product.images?.[0]?.url ? (
                  <img
                    src={product.images[0].url}
                    alt={product.title}
                    className="object-contain h-full w-full hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-slate-400">No Image</div>
                )}
                {product.status === "draft" && (
                  <Badge variant="secondary" className="absolute top-3 left-3 bg-slate-800 text-white">
                    Draft
                  </Badge>
                )}
              </div>
              <CardContent className="p-5">
                <div className="text-xs text-slate-500 mb-1 font-medium tracking-wide uppercase">
                  {product.vendor || "Craftify Store"}
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 line-clamp-1">
                  {product.title}
                </h3>

                <div className="mt-4 flex flex-wrap gap-1">
                  {product.options?.map((opt, i) => (
                    opt.values.length > 0 && opt.name !== 'Title' ? (
                      <Badge key={i} variant="outline" className="text-xs bg-slate-50 border-slate-200 text-slate-600">
                        {opt.values.length} {opt.name}s
                      </Badge>
                    ) : null
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0">
                <Link href={`/customize/${product._id}`} className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-medium h-11 transition-colors">
                    Customize Product
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
