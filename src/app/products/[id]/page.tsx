import Header from "@/components/Header";
import AddToCartButton from "@/components/ProductsCard/AddToCartButton";
import { getProductById } from "@/lib/api/products";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

type CustomStyle = {
    main: string;
    button: string;
    text: string;
};
type ProductPageProps = {
    params: {
        id: string;
    };
};

export default async function ProductPage({ params }: ProductPageProps) {
    const product = await getProductById(params.id);

    if (!product) {
        return (
            <div className="p-10 text-center text-status-negative">
                Product not found
            </div>
        );
    }

    // استایل سفارشی برای دکمه
    const mainStyle: CustomStyle = {
        main: "dark:bg-secondary-bg shadow-md p-4 gap-6 border border-secondary-text",
        button: "dark:bg-primary-bg dark:hover:bg-primary-bg/80 mx-4 text-2xl size-10",
        text: "text-2xl size-10",
    };


    return (
        <div className="min-h-screen w-full bg-primary-bg text-primary-text">
            <Header />

            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Product Image */}
                    <div className="flex justify-center">
                        <div className="relative w-full max-w-lg aspect-square border border-secondary-text bg-secondary-bg rounded-2xl shadow-lg p-8">
                            <Image
                                src={`/products/${product.imageUrl}`}
                                alt={product.name}
                                autoFocus
                                width={600}
                                height={600}
                                className="rounded-xl object-contain size-full"
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col justify-between h-full py-1 gap-8">
                        {/* Title + Description */}
                        <div className="space-y-4">
                            <h1 className="text-4xl font-extrabold leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-lg text-secondary-text leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Price + Discount */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-4">
                                <span className="text-4xl font-bold text-accent">
                                    ${product.price}
                                </span>
                                <span className="bg-accent text-white text-sm px-3 py-1 rounded-lg shadow">
                                    50% OFF
                                </span>
                            </div>
                            <span className="line-through text-secondary-text text-base">
                                $250.00
                            </span>
                        </div>

                        {/* Add to Cart */}
                        <div>
                            <AddToCartButton product={product} customStyle={mainStyle} />
                        </div>

                        {/* ثابت: مزایای خرید */}
                        <div className="border-t border-secondary-text pt-6 space-y-4">
                            <h2 className="text-xl font-semibold">Why shop with us?</h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-secondary-text">
                                <li className="flex items-center gap-2 ">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-500"></FontAwesomeIcon> 7-Day Return Guarantee
                                </li>
                                <li className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-500"></FontAwesomeIcon> Free Shipping over $100
                                </li>
                                <li className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-500"></FontAwesomeIcon> 100% Authentic Products
                                </li>
                                <li className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-500"></FontAwesomeIcon> Cash on Delivery
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
