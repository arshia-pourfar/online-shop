"use client";

import React, { useState, useEffect } from "react";
import { Product } from "../types/product";
import { getProducts } from "@/lib/api/products";
import Header from "@/components/Header";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCardSkeleton from "@/components/Skeletons/ProductCardSkeleton";
import PosterSkeleton from "@/components/Skeletons/PosterSkeleton";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    getProducts().then((data) => {
      setProducts(data);
      setIsLoading(false);
    });
  }, []);

  // داده‌های اسلایدرها
  const largeSlides = [
    { id: 0, imageSrc: "Gemini_Generated_Image_2sq8f12sq8f12sq8.png" },
    { id: 1, imageSrc: "ChatGPT Image Jul 8, 2025, 11_54_13 PM.png" },
    { id: 2, imageSrc: "Gemini_Generated_Image_2sq8f12sq8f12sq8.png" },
    { id: 3, imageSrc: "ChatGPT Image Jul 8, 2025, 11_54_13 PM.png" },
    { id: 4, imageSrc: "Gemini_Generated_Image_2sq8f12sq8f12sq8.png" },
    { id: 5, imageSrc: "ChatGPT Image Jul 8, 2025, 11_54_13 PM.png" },
    { id: 6, imageSrc: "Gemini_Generated_Image_2sq8f12sq8f12sq8.png" },
  ];
  const smallSlides = [
    { id: 0, imageSrc: "61EZQh0-TZL._AC_UY327_FMwebp_QL65_.png" },
    { id: 1, imageSrc: "61EZQh0-TZL.911ujeCkGfL._AC_UY327_FMwebp_QL65_.png" },
    { id: 2, imageSrc: "61EZQh0-TZL._AC_UY327_FMwebp_QL65_.png" },
    { id: 3, imageSrc: "61EZQh0-TZL.911ujeCkGfL._AC_UY327_FMwebp_QL65_.png" },
    { id: 4, imageSrc: "61EZQh0-TZL._AC_UY327_FMwebp_QL65_.png" },
    { id: 5, imageSrc: "61EZQh0-TZL.911ujeCkGfL._AC_UY327_FMwebp_QL65_.png" },
    { id: 6, imageSrc: "61EZQh0-TZL._AC_UY327_FMwebp_QL65_.png" },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-primary-bg text-primary-text">
      <Header />
      <div className="flex-1 flex flex-col">
        <main className="p-4 md:p-8 flex-1 space-y-12">

          {/* Poster / Banner Section */}
          <section className="w-full">
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6 h-[500px] relative">
              {/* اسلایدر بزرگ سمت چپ */}
              <div className="w-full lg:w-2/3 h-full rounded-2xl overflow-hidden shadow-lg">
                {isLoading ? (
                  <PosterSkeleton />
                ) : (
                  <Swiper loop autoplay={{ delay: 3000 }}>
                    {largeSlides.map((i) => (
                      <SwiperSlide key={i.id}>
                        <div className="w-full h-[500px]">
                          <Image
                            src={`/uiux/${i.imageSrc}`}
                            alt={`Main Slide`}
                            fill
                            className="object-cover h-full"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>

              {/* اسلایدرهای کوچک سمت راست */}
              <div className="w-full lg:w-1/3 flex flex-col gap-4 md:gap-6 h-full">
                <div className="flex-1 rounded-2xl overflow-hidden shadow-md relative">
                  {isLoading ? (
                    <PosterSkeleton />
                  ) : (
                    <Swiper loop autoplay={{ delay: 4000 }}>
                      {smallSlides.map((i) => (
                        <SwiperSlide key={i.id}>
                          <div className="relative w-full h-[220px]">
                            <Image
                              src={`/products/${i.imageSrc}`}
                              alt={`Small Top Slide`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </div>

                <div className="flex-1 rounded-2xl overflow-hidden shadow-md relative">
                  {isLoading ? (
                    <PosterSkeleton />
                  ) : (
                    <Swiper loop autoplay={{ delay: 5000 }}>
                      {smallSlides.map((i) => (
                        <SwiperSlide key={i.id}>
                          <div className="relative w-full h-[220px]">
                            <Image
                              src={`/products/${i.imageSrc}`}
                              alt={`Small Bottom Slide`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </div>
              </div>
            </div>
          </section>


          {/* Featured Products Section */}
          <section className="w-full">
            <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">
              Featured Products
            </h2>

            {!isClient || products.length === 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <Swiper
                spaceBetween={16}
                slidesPerView={2}
                observeParents
                observer
                breakpoints={{
                  640: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                  1280: { slidesPerView: 5 },
                }}
              >
                {products.map((product) => (
                  <SwiperSlide key={product.id}>
                    <div className="bg-secondary-bg rounded-xl shadow-md h-80 flex flex-col p-4 space-y-3 hover:shadow-xl hover:scale-105 transition-all duration-300">
                      <div className="w-full h-32 relative">
                        <Image
                          src={`/products/${product.imageUrl}`}
                          alt={product.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-semibold truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-lg font-bold text-blue-400">
                          ${product.price}
                        </span>
                        <button className="bg-accent text-white font-bold py-1.5 px-4 rounded-lg hover:scale-105 transition-transform shadow-md">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </section>

        </main>
      </div>
    </div>
  );
};

export default Home;