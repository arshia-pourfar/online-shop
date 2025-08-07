"use client";

import React, { useState, useEffect, useRef } from "react";
import { Product } from "../types/product";
import { getProducts } from "@/lib/api/products";
import Header from "@/components/Header";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCardSkeleton from "@/components/Skeletons/Home/ProductCardSkeleton";
import PosterSkeleton from "@/components/Skeletons/Home/PosterSkeleton";
import { NavigationOptions } from "swiper/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { faTwitter } from "@fortawesome/free-brands-svg-icons/faTwitter";
import { faFacebook } from "@fortawesome/free-brands-svg-icons/faFacebook";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
    getProducts().then((data) => {
      setProducts(data);
      setIsLoading(false);
    });
  }, []);

  // داده‌های اسلایدرها
  const largeSlides = [
    { id: 0, imageSrc: "poster-1.png" },
    { id: 1, imageSrc: "poster-2.png" },
    { id: 2, imageSrc: "poster-3.png" },
    { id: 3, imageSrc: "poster-4.png" },
    { id: 4, imageSrc: "poster-5.png" },
  ];
  const smallSlides = [
    { id: 0, imageSrc: "poster-1.png" },
    { id: 1, imageSrc: "poster-2.png" },
    { id: 2, imageSrc: "poster-3.png" },
    { id: 3, imageSrc: "poster-4.png" },
    { id: 4, imageSrc: "poster-5.png" },
    { id: 5, imageSrc: "poster-6.png" },
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
              <div className="w-full lg:w-2/3 h-full rounded-2xl overflow-hidden shadow-lg bg-secondary-bg">
                {isLoading ? (
                  <PosterSkeleton />
                ) : (
                  <Swiper loop autoplay={{ delay: 3000 }} style={{ height: '100%' }}>
                    {largeSlides.map((i) => (
                      <SwiperSlide key={i.id}>
                        <div className="w-full h-full">
                          <Image
                            src={`/posters/${i.imageSrc}`}
                            alt={`Main Slide`}
                            fill
                            className="object-fill"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>

              {/* اسلایدرهای کوچک سمت راست */}
              <div className="w-full lg:w-1/3 flex flex-col gap-4 md:gap-6 h-full ">
                <div className="flex-1 rounded-2xl overflow-hidden shadow-md relative bg-secondary-bg">
                  {isLoading ? (
                    <PosterSkeleton />
                  ) : (
                    <Swiper loop autoplay={{ delay: 4000 }} style={{ height: '100%' }}>
                      {smallSlides.map((i) => (
                        <SwiperSlide key={i.id}>
                          <div className="relative w-full h-full">
                            <Image
                              src={`/posters/small/${i.imageSrc}`}
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

                <div className="flex-1 rounded-2xl overflow-hidden shadow-md relative bg-secondary-bg">
                  {isLoading ? (
                    <PosterSkeleton />
                  ) : (
                    <Swiper loop autoplay={{ delay: 5000 }} style={{ height: '100%' }}>
                      {smallSlides.map((i) => (
                        <SwiperSlide key={i.id}>
                          <div className="relative w-full h-full">
                            <Image
                              src={`/posters/small/${i.imageSrc}`}
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
          <section className="w-full relative">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">
                Featured Products
                <a href="./shop" className="underline text-sm ms-4">See More</a>
              </h2>
              <div className="absolute right-0 top-0 flex justify-between items-center gap-3">
                <button ref={prevRef} className="z-10 bg-accent text-primary-text text-2xl rounded-full size-12 shadow">
                  <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <button ref={nextRef} className="z-10 bg-accent text-primary-text text-2xl rounded-full size-12 shadow">
                  <FontAwesomeIcon icon={faAngleRight} />
                </button>
              </div>
            </div>

            {!isClient || products.length === 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <Swiper
                modules={[Navigation]}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                  const navigation = swiper.params.navigation as NavigationOptions;
                  navigation.prevEl = prevRef.current;
                  navigation.nextEl = nextRef.current;
                }}
                spaceBetween={16}
                slidesPerView={2}
                observeParents
                observer
                style={{ padding: '10px 0px 10px 10px' }}
                breakpoints={{
                  640: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                  1280: { slidesPerView: 5 },
                }}
              >

                {products.map((product) => (
                  <SwiperSlide key={product.id}>
                    <div className="bg-secondary-bg rounded-xl h-80 shadow-md flex flex-col p-4 space-y-8 hover:shadow-xl hover:scale-105 transition-all duration-300">
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

                      <div className="flex justify-between items-center ">
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

          <div className="flex gap-4">
            <div className="basis-1/2 flex items-center justify-around bg-secondary-bg rounded-lg px-2 py-10">
              <div className="flex flex-col gap-2">
                <h2 className="font-bold text-lg">Get 10% Off Your First Order!</h2>
                <p className="text-sm">Sign up for our newsletter to receive exclusive deals and updates.</p>
              </div>
              <a href="./login" className="bg-accent font-semibold rounded-lg px-4 py-2">Sign Up</a>
            </div>

            <div className="basis-1/2 flex items-center justify-around bg-secondary-bg rounded-lg px-4 py-8">
              <div className="flex flex-col gap-2">
                <h2 className="font-bold text-lg">Stay Connected</h2>
                <p className="text-sm">Follow us on social media for the latest updates and products.</p>
              </div>
              <div className="flex text-3xl gap-2">
                <div className="size-12 bg-primary-bg rounded-full flex justify-center items-center">
                  <FontAwesomeIcon icon={faInstagram} />
                </div>
                <div className="size-12 bg-primary-bg rounded-full flex justify-center items-center">
                  <FontAwesomeIcon icon={faTwitter} />
                </div>
                <div className="size-12 bg-primary-bg rounded-full flex justify-center items-center">
                  <FontAwesomeIcon icon={faFacebook} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;