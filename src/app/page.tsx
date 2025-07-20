"use client";

import React, { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { getProducts } from '@/lib/api/products';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import Header from '@/components/Header';
import Image from 'next/image';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    Promise.all([
      getProducts().then(setProducts),
    ]).finally();
  }, []);

  return (
    <div className="w-full h-full text-white flex flex-col">
      <Header />
      <h1 className="text-4xl font-extrabold text-center my-4 text-blue-400">Our Shop</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12 p-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 flex flex-col transform hover:scale-105 transition-transform duration-300">
              {product.imageUrl && (
                <Image
                  src={`/products/${product.imageUrl}`}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-full max-h-48 object-contain object-center bg-gray-800 rounded-t-xl p-4"
                />
              )}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-blue-400">
                    {/* Using mock FontAwesomeIcon with a simple object for icon */}
                    <FontAwesomeIcon icon={faDollarSign} className="text-xl mr-1" />
                    {product.price.toFixed(2)}
                  </span>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
                  >
                    <FontAwesomeIcon icon={faShoppingCart} className="text-lg" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400 text-xl">No products available.</p>
        )}
      </div>

      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h2 className="text-3xl font-extrabold text-white mb-6 flex items-center space-x-3">
          <FontAwesomeIcon icon={faShoppingCart} className="text-blue-400 text-3xl" />
          <span>Your Cart</span>
        </h2>
      </div>
    </div>
  );
};

export default Home;
