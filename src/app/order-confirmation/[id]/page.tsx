"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMapMarkerAlt, faClock, faArrowRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/lib/context/authContext";
import { Address } from "types/address";
import { getAddressesByUser, addAddress } from "@/lib/api/address";

export default function OrderConfirmationPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const orderId = Array.isArray(params.id) ? params.id[0] : params.id;

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | "new" | undefined>(undefined);
    const [newAddress, setNewAddress] = useState<Omit<Address, "id" | "userId">>({
        title: "",
        street: "",
        city: "",
        postalCode: "",
        country: "",
    });
    const [loading, setLoading] = useState(true);
    const [orderTime, setOrderTime] = useState<string>("");

    useEffect(() => {
        if (!user?.id) return;

        getAddressesByUser(user.id)
            .then(setAddresses)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user]);

    const handleAddAddress = async () => {
        if (Object.values(newAddress).some((v) => !v)) return alert("Please fill in all fields");
        const added = await addAddress(user!.id, newAddress);
        setAddresses((prev) => [...prev, added]);
        setSelectedAddressId(added.id);
        setNewAddress({ title: "", street: "", city: "", postalCode: "", country: "" });
    };

    const handleConfirmOrder = () => {
        if (!selectedAddressId || selectedAddressId === "new") return alert("Please select an address");
        if (!orderTime) return alert("Please select a delivery time");

        // می‌تونی اینجا PATCH بزنیم برای ذخیره سفارش با آدرس و زمان
        console.log("Order confirmed with:", { selectedAddressId, orderTime, orderId });

        router.push(`/order-confirmation/${orderId}/payment`);
    };

    return (
        <div className="min-h-screen w-full bg-primary-bg text-primary-text">
            <Header />

            <main className="p-4 md:p-8 space-y-6 max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-accent mb-6">Order Confirmation</h1>

                {loading ? (
                    <div className="flex justify-center items-center py-20 text-accent">
                        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl" />
                        <span className="ml-3 text-lg">Loading addresses...</span>
                    </div>
                ) : (
                    <div className="bg-secondary-bg rounded-xl shadow-md p-6 space-y-6">
                        {/* Address Selector */}
                        <div className="flex flex-col space-y-2">
                            <label className="flex items-center gap-2 font-medium text-lg">
                                <FontAwesomeIcon icon={faMapMarkerAlt} /> Address
                            </label>
                            <select
                                value={selectedAddressId ?? ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "new") setSelectedAddressId("new");
                                    else setSelectedAddressId(Number(val));
                                }}
                                className="w-full p-3 rounded-lg border bg-primary-bg text-primary-text"
                            >
                                <option value="" disabled>
                                    Select address
                                </option>
                                {addresses.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.title} - {a.street}, {a.city}
                                    </option>
                                ))}
                                <option value="new">Add new address</option>
                            </select>
                        </div>

                        {/* New Address Form */}
                        {selectedAddressId === "new" && (
                            <div className="p-4 border rounded-lg space-y-2 bg-primary-bg">
                                {["title", "street", "city", "postalCode", "country"].map((field) => (
                                    <input
                                        key={field}
                                        type="text"
                                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                        value={newAddress[field as keyof typeof newAddress]}
                                        onChange={(e) =>
                                            setNewAddress({ ...newAddress, [field]: e.target.value })
                                        }
                                        className="w-full p-3 rounded-lg border bg-primary-bg placeholder:text-secondary-text"
                                    />
                                ))}
                                <button
                                    onClick={handleAddAddress}
                                    className="w-full bg-accent text-white py-2 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-accent/80 transition"
                                >
                                    Add Address <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </div>
                        )}

                        {/* Delivery Time */}
                        <div className="flex flex-col space-y-2">
                            <label className="flex items-center gap-2 font-medium text-lg">
                                <FontAwesomeIcon icon={faClock} /> Delivery Time
                            </label>
                            <input
                                type="datetime-local"
                                value={orderTime}
                                onChange={(e) => setOrderTime(e.target.value)}
                                className="w-full p-3 rounded-lg border bg-primary-bg placeholder:text-secondary-text"
                            />
                        </div>

                        {/* Confirm Button */}
                        <button
                            onClick={handleConfirmOrder}
                            className="w-full bg-accent text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-accent/80 transition"
                        >
                            Confirm & Continue
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
