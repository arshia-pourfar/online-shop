"use client";

import React, { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { getProducts } from '@/lib/api/products';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faDollarSign } from '@fortawesome/free-solid-svg-icons';


const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    Promise.all([
      getProducts().then(setProducts),
    ]).finally();
  }, []);

  return (
    <div className="min-h-screen bg- font-sans text-white p-6">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-blue-400">Our Shop</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 flex flex-col transform hover:scale-105 transition-transform duration-300">
              {/* <Image
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover object-center rounded-t-xl"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/4a5568/ffffff?text=No+Image"; }}
              /> */}
              {/* test image */}
              <div className='w-full h-48 object-cover object-center rounded-t-xl bg-amber-400'></div>
              {/* test image */}
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
