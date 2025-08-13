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
import {
  faAngleLeft,
  faAngleRight,
  faArrowRotateLeft,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { faTwitter } from "@fortawesome/free-brands-svg-icons/faTwitter";
import { faFacebook } from "@fortawesome/free-brands-svg-icons/faFacebook";
import { useAuth } from "@/lib/context/authContext";
import { getCategories } from "@/lib/api/categories";
import { Category } from "types/category";
import CategorySkeleton from "@/components/Skeletons/Home/categorySkeleton";
import ProductCard from "@/components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const prevLargePosterRef = useRef(null);
  const nextLargePosterRef = useRef(null);

  const prevSmallPosterRef = useRef(null);
  const nextSmallPosterRef = useRef(null);

  const prevSmallPoster2Ref = useRef(null);
  const nextSmallPoster2Ref = useRef(null);

  const prevProductRef = useRef(null);
  const nextProductRef = useRef(null);

  const { user } = useAuth();

  useEffect(() => {
    setIsClient(true);
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Slider data
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
  ];
  const smallSlides2 = [
    { id: 0, imageSrc: "poster-4.png" },
    { id: 1, imageSrc: "poster-5.png" },
    { id: 2, imageSrc: "poster-6.png" },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-primary-bg text-primary-text">
      <Header />
      <div className="flex-1 flex flex-col">
        <main className="p-4 md:p-8 flex-1 space-y-16">

          {/* Poster / Banner Section */}
          <section className="w-full">
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6 md:h-[500px] sm:h-[300px] h-[30vh] relative">
              {/* Left large slider */}
              <div className="group w-full lg:w-2/3 h-full relative rounded-2xl overflow-hidden shadow-lg bg-secondary-bg">
                <div className="w-full h-full absolute right-0 z-20 px-3 flex justify-between items-center gap-3 transition-all duration-300 lg:opacity-0 lg:group-hover:opacity-100 opacity-100 lg:group-hover:bg-black/15">
                  <button
                    ref={prevLargePosterRef}
                    className="z-10 bg-accent lg:bg-secondary-bg text-primary-text lg:text-3xl md:text-2xl text-xl rounded-full lg:size-14 md:size-12 size-10 shadow flex justify-center items-center"
                  >
                    <FontAwesomeIcon icon={faAngleLeft} />
                  </button>
                  <button
                    ref={nextLargePosterRef}
                    className="z-10 bg-accent lg:bg-secondary-bg text-primary-text lg:text-3xl md:text-2xl text-xl rounded-full lg:size-14 md:size-12 size-10 shadow flex justify-center items-center"
                  >
                    <FontAwesomeIcon icon={faAngleRight} />
                  </button>
                </div>
                {isLoading ? (
                  <PosterSkeleton />
                ) : (
                  <Swiper
                    modules={[Navigation]}
                    loop
                    style={{ height: "100%" }}
                    navigation={{
                      prevEl: prevLargePosterRef.current,
                      nextEl: nextLargePosterRef.current,
                    }}
                    onBeforeInit={(swiper) => {
                      const navigation = swiper.params.navigation as NavigationOptions;
                      navigation.prevEl = prevLargePosterRef.current;
                      navigation.nextEl = nextLargePosterRef.current;
                    }}
                  >
                    {largeSlides.map((slide) => (
                      <SwiperSlide key={slide.id}>
                        <div className="w-full h-full">
                          <Image
                            src={`/posters/${slide.imageSrc}`}
                            alt={`Main Slide`}
                            fill
                            className="lg:object-cover object-contain"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>

              {/* Right small sliders - فقط در lg به بالا نمایش */}
              <div className="w-full lg:w-1/3 flex-col gap-4 md:gap-6 h-full hidden lg:flex">
                <div className="group flex-1 rounded-2xl overflow-hidden shadow-md relative bg-secondary-bg">
                  <div className="w-full h-full absolute right-0 z-20 px-3 flex justify-between items-center gap-3 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-black/15">
                    <button
                      ref={prevSmallPosterRef}
                      className="z-10 bg-secondary-bg text-primary-text text-2xl rounded-full size-12 shadow flex justify-center items-center"
                    >
                      <FontAwesomeIcon icon={faAngleLeft} className="text-2xl" />
                    </button>
                    <button
                      ref={nextSmallPosterRef}
                      className="z-10 bg-secondary-bg text-primary-text text-2xl rounded-full size-12 shadow flex justify-center items-center"
                    >
                      <FontAwesomeIcon icon={faAngleRight} className="text-2xl" />
                    </button>
                  </div>
                  {isLoading ? (
                    <PosterSkeleton />
                  ) : (
                    <Swiper
                      modules={[Navigation]}
                      loop
                      autoplay={{ delay: 4000 }}
                      style={{ height: "100%" }}
                      navigation={{
                        prevEl: prevSmallPosterRef.current,
                        nextEl: nextSmallPosterRef.current,
                      }}
                      onBeforeInit={(swiper) => {
                        const navigation = swiper.params.navigation as NavigationOptions;
                        navigation.prevEl = prevSmallPosterRef.current;
                        navigation.nextEl = nextSmallPosterRef.current;
                      }}
                    >
                      {smallSlides.map((slide) => (
                        <SwiperSlide key={slide.id}>
                          <div className="relative w-full h-full">
                            <Image
                              src={`/posters/small/${slide.imageSrc}`}
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

                <div className="group flex-1 rounded-2xl overflow-hidden shadow-md relative bg-secondary-bg">
                  <div className="w-full h-full absolute right-0 z-20 px-3 flex justify-between items-center gap-3 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-black/15">
                    <button
                      ref={prevSmallPoster2Ref}
                      className="z-10 bg-secondary-bg text-primary-text text-2xl rounded-full size-12 shadow flex justify-center items-center"
                    >
                      <FontAwesomeIcon icon={faAngleLeft} className="text-2xl" />
                    </button>
                    <button
                      ref={nextSmallPoster2Ref}
                      className="z-10 bg-secondary-bg text-primary-text text-2xl rounded-full size-12 shadow flex justify-center items-center"
                    >
                      <FontAwesomeIcon icon={faAngleRight} className="text-2xl" />
                    </button>
                  </div>
                  {isLoading ? (
                    <PosterSkeleton />
                  ) : (
                    <Swiper
                      modules={[Navigation]}
                      loop
                      autoplay={{ delay: 5000 }}
                      style={{ height: "100%" }}
                      navigation={{
                        prevEl: prevSmallPoster2Ref.current,
                        nextEl: nextSmallPoster2Ref.current,
                      }}
                      onBeforeInit={(swiper) => {
                        const navigation = swiper.params.navigation as NavigationOptions;
                        navigation.prevEl = prevSmallPoster2Ref.current;
                        navigation.nextEl = nextSmallPoster2Ref.current;
                      }}
                    >
                      {smallSlides2.map((slide) => (
                        <SwiperSlide key={slide.id}>
                          <div className="relative w-full h-full">
                            <Image
                              src={`/posters/small/${slide.imageSrc}`}
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

          <section className="w-full">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-blue-400">
              Shop by Category
            </h2>

            {isLoading ? (
              <div
                className="grid grid-flow-col grid-rows-2 gap-4 overflow-x-auto pb-2 px-2 overflow-hidden
                 lg:grid-flow-row lg:grid-cols-6 lg:overflow-x-hidden lg:pb-0"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <CategorySkeleton
                    key={i}
                    className="min-w-[140px] lg:min-w-0 flex-shrink-0"
                  />
                ))}
              </div>
            ) : (
              <div
                className="grid grid-flow-col grid-rows-2 md:gap-4 gap-2 overflow-x-auto py-2 px-2
                 lg:grid-flow-row lg:grid-cols-6 lg:overflow-x-hidden "
              >
                {categories.map((category) => (
                  <a
                    key={category.id}
                    href={`/shop?category=${category.id}`}
                    className="group flex flex-col items-center justify-center bg-secondary-bg md:p-4 p-2 rounded-xl shadow hover:shadow-lg transition hover:scale-105 
                     min-w-[140px] lg:min-w-0 flex-shrink-0"
                  >
                    <div className="relative md:size-24 size-20 mb-3">
                      <Image
                        src={`/categories/${category.imageSrc || "default.png"}`}
                        alt={category.name}
                        fill
                        className="object-contain rounded-full"
                      />
                    </div>
                    <span className="md:text-base text-sm font-semibold text-center group-hover:text-accent">
                      {category.name}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </section>

          {/* Featured Products Section */}
          <section className="w-full relative">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-400 mb-6 text-center">
                Featured Products
                <a href="./shop" className="underline text-xs sm:text-sm ms-4">
                  See More
                </a>
              </h2>
              <div className="sm:absolute sm:right-0 sm:top-0 flex justify-between items-center gap-3">
                <button
                  ref={prevProductRef}
                  className="z-10 bg-accent text-primary-text text-2xl rounded-full size-12 shadow sm:static absolute left-0 top-1/2"
                >
                  <FontAwesomeIcon icon={faAngleLeft} className="text-2xl" />
                </button>
                <button
                  ref={nextProductRef}
                  className="z-10 bg-accent text-primary-text text-2xl rounded-full size-12 shadow sm:static absolute right-0 top-1/2"
                >
                  <FontAwesomeIcon icon={faAngleRight} className="text-2xl" />
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
                  prevEl: prevProductRef.current,
                  nextEl: nextProductRef.current,
                }}
                onBeforeInit={(swiper) => {
                  const navigation = swiper.params.navigation as NavigationOptions;
                  navigation.prevEl = prevProductRef.current;
                  navigation.nextEl = nextProductRef.current;
                }}
                spaceBetween={14}
                slidesPerView={2}
                observeParents
                observer
                style={{ padding: "10px 0px 10px 10px" }}
                breakpoints={{
                  640: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                  1440: { slidesPerView: 5 },
                }}
              >
                {products.map((product) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </section>

          <div className="flex lg:flex-row flex-col gap-4">
            {user ? (
              <div className="sm:basis-1/2 flex sm:flex-row flex-col sm:items-center justify-around items-center bg-secondary-bg rounded-lg px-4 sm:py-8 py-5 sm:space-y-0 space-y-5">
                <div className="flex items-center justify-between gap-5">
                  <FontAwesomeIcon
                    icon={faTruck}
                    className="text-4xl text-accent"
                  />
                  <div className="flex flex-col gap-1">
                    <h2 className="font-bold text-lg">Free Shiping</h2>
                    <p className="text-sm">On all orders over $50.</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-5">
                  <FontAwesomeIcon
                    icon={faArrowRotateLeft}
                    className="text-4xl text-accent"
                  />
                  <div className="flex flex-col gap-1">
                    <h2 className="font-bold text-lg">Easy Returns</h2>
                    <p className="text-sm">30-day money-back guarantee.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="sm:basis-1/2 sm:flex-row flex-col flex items-center justify-around bg-secondary-bg rounded-lg px-4 sm:py-8 py-5 sm:space-y-0 space-y-5">
                <div className="flex flex-col gap-1">
                  <h2 className="font-bold text-lg">
                    Get 10% Off Your First Order!
                  </h2>
                  <p className="text-sm">
                    Sign up for our newsletter to receive exclusive deals and
                    updates.
                  </p>
                </div>
                <a
                  href="./login"
                  className="bg-accent font-semibold rounded-lg px-4 py-2 min-w-fit"
                >
                  Sign Up
                </a>
              </div>
            )}

            <div className="sm:basis-1/2 sm:flex-row flex-col flex items-center justify-around bg-secondary-bg rounded-lg px-4 sm:py-8 py-5 sm:space-y-0 space-y-5">
              <div className="flex flex-col gap-1">
                <h2 className="font-bold text-lg">Stay Connected</h2>
                <p className="text-sm">
                  Follow us on social media for the latest updates and products.
                </p>
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