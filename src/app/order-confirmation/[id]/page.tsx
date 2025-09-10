"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faMapMarkerAlt,
    faClock,
    faArrowRight,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/lib/context/authContext";
import { Address } from "types/address";
import { getAddressesByUser, addAddress } from "@/lib/api/address";
import { updateOrder } from "@/lib/api/orders";
type DeliveryOption = 'today' | 'tomorrow' | 'dayAfterTomorrow' | 'threeDaysLater' | 'custom';

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

    // delivery time state
    const [deliveryOption, setDeliveryOption] = useState<DeliveryOption | "">("");
    const [customDate, setCustomDate] = useState("");

    useEffect(() => {
        if (!user?.id) return;

        getAddressesByUser(user.id)
            .then(setAddresses)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user]);

    const handleAddAddress = async () => {
        if (Object.values(newAddress).some((v) => !v)) {
            return alert("Please fill in all fields");
        }
        const added = await addAddress(user!.id, newAddress);
        setAddresses((prev) => [...prev, added]);
        setSelectedAddressId(added.id);
        setNewAddress({ title: "", street: "", city: "", postalCode: "", country: "" });
    };

    const handleConfirmOrder = async () => {
        if (!selectedAddressId || selectedAddressId === "new") {
            return alert("Please select an address");
        }
        if (!deliveryOption) {
            return alert("Please select a delivery time");
        }

        let deliveryTime: string;
        const now = new Date();

        switch (deliveryOption) {
            case "today":
                now.setHours(10, 0, 0, 0);
                deliveryTime = now.toISOString();
                break;
            case "tomorrow":
                now.setDate(now.getDate() + 1);
                now.setHours(10, 0, 0, 0);
                deliveryTime = now.toISOString();
                break;
            case "dayAfterTomorrow":
                now.setDate(now.getDate() + 2);
                now.setHours(10, 0, 0, 0);
                deliveryTime = now.toISOString();
                break;
            case "threeDaysLater":
                now.setDate(now.getDate() + 3);
                now.setHours(10, 0, 0, 0);
                deliveryTime = now.toISOString();
                break;
            case "custom":
                if (!customDate) return alert("Please select a custom date");
                deliveryTime = new Date(`${customDate}T10:00`).toISOString();
                break;
            default:
                return alert("Invalid delivery option");
        }

        try {
            if (!orderId) return;
            await updateOrder(orderId, {
                addressId: selectedAddressId as number,
                deliveryTime,
            });

            router.push(`/order-confirmation/${orderId}/payment`);
        } catch (error: unknown) {
            console.error("Order confirmation error:", error);
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("Failed to update order. Please try again.");
            }
        }
    };

    const getMinDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 4);
        return date.toISOString().split("T")[0];
    };

    const getMaxDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 10);
        return date.toISOString().split("T")[0];
    };

    return (
        <div className="min-h-screen w-full bg-[var(--color-primary-bg)] text-[var(--color-primary-text)]">
            <Header />

            <main className="p-4 md:p-8 space-y-6 max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-[var(--color-accent)] mb-6">
                    Order Confirmation
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center py-20 text-[var(--color-accent)]">
                        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl" />
                        <span className="ml-3 text-lg">Loading addresses...</span>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Address List */}
                        <section>
                            <label className="flex items-center gap-2 font-medium text-lg mb-3">
                                <FontAwesomeIcon icon={faMapMarkerAlt} /> Select Address
                            </label>
                            <div className="space-y-3">
                                {addresses.map((a) => (
                                    <div
                                        key={a.id}
                                        onClick={() => setSelectedAddressId(a.id)}
                                        className={`cursor-pointer border rounded-xl p-4 transition ${selectedAddressId === a.id
                                            ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                                            : "border-gray-300 bg-[var(--color-secondary-bg)]"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-bold">{a.title}</p>
                                                <p className="text-sm text-[var(--color-secondary-text)]">
                                                    {a.street}, {a.city}, {a.postalCode}, {a.country}
                                                </p>
                                            </div>
                                            <input
                                                type="radio"
                                                checked={selectedAddressId === a.id}
                                                onChange={() => setSelectedAddressId(a.id)}
                                            />
                                        </div>
                                    </div>
                                ))}

                                {/* Add New Address */}
                                <div
                                    onClick={() => setSelectedAddressId("new")}
                                    className={`cursor-pointer border-dashed rounded-xl p-4 text-center transition ${selectedAddressId === "new"
                                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 border-2"
                                        : "border-2 border-gray-300 bg-[var(--color-secondary-bg)]"
                                        }`}
                                >
                                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                    Add New Address
                                </div>
                            </div>
                        </section>

                        {/* New Address Form */}
                        {selectedAddressId === "new" && (
                            <section className="p-4 border rounded-lg space-y-3 bg-[var(--color-secondary-bg)] shadow">
                                {["title", "street", "city", "postalCode", "country"].map((field) => (
                                    <input
                                        key={field}
                                        type="text"
                                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                        value={newAddress[field as keyof typeof newAddress]}
                                        onChange={(e) =>
                                            setNewAddress({ ...newAddress, [field]: e.target.value })
                                        }
                                        className="w-full p-3 rounded-lg border bg-[var(--color-primary-bg)] placeholder:text-[var(--color-secondary-text)]"
                                    />
                                ))}
                                <button
                                    onClick={handleAddAddress}
                                    className="w-full bg-[var(--color-accent)] text-white py-2 rounded-lg flex items-center justify-center gap-2 font-medium hover:opacity-90 transition"
                                >
                                    Save Address
                                </button>
                            </section>
                        )}

                        {/* Delivery Time */}
                        <section>
                            <label className="flex items-center gap-2 font-medium text-lg mb-3">
                                <FontAwesomeIcon icon={faClock} /> Delivery Time
                            </label>
                            <div className="space-y-3">
                                {["today", "tomorrow", "dayAfterTomorrow", "threeDaysLater", "custom"].map(option => {
                                    let label = "";
                                    switch (option) {
                                        case "today": label = "Today (10:00 - 18:00)"; break;
                                        case "tomorrow": label = "Tomorrow (10:00 - 18:00)"; break;
                                        case "dayAfterTomorrow": label = "Day after tomorrow (10:00 - 18:00)"; break;
                                        case "threeDaysLater": label = "Three days later (10:00 - 18:00)"; break;
                                        case "custom": label = "Pick Custom Date"; break;
                                    }
                                    return (
                                        <div key={option} onClick={() => setDeliveryOption(option as DeliveryOption)}
                                            className={`cursor-pointer border rounded-xl p-4 transition ${deliveryOption === option
                                                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                                                : "border-gray-300 bg-[var(--color-secondary-bg)]"
                                                }`}>
                                            <div className="flex items-center justify-between">
                                                <span>{label}</span>
                                                <input type="radio" checked={deliveryOption === option} onChange={() => setDeliveryOption(option as DeliveryOption)} />
                                            </div>

                                            {option === "custom" && deliveryOption === "custom" && (
                                                <input type="date"
                                                    value={customDate}
                                                    min={getMinDate()}
                                                    max={getMaxDate()}
                                                    onChange={e => setCustomDate(e.target.value)}
                                                    className="mt-3 w-full p-3 rounded-lg border bg-[var(--color-primary-bg)] placeholder:text-[var(--color-secondary-text)]"
                                                />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </section>

                        {/* Confirm Button */}
                        <button
                            onClick={handleConfirmOrder}
                            className="w-full bg-[var(--color-accent)] text-white py-3 rounded-lg flex items-center justify-center gap-2 font-medium hover:opacity-90 transition"
                        >
                            Proceed to Payment
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
