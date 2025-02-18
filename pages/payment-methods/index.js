import ApiClient from "@/api/apiClient";
import Loader from "@/components/Loader";
import Inputbox from "@/components/common/Inputbox";
import { getSetData } from "@/utils";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConditionalDownloadButton from "../ConditionalDownloadButton";
import { motion } from "framer-motion"; // For animations
import { FaUniversity, FaMobileAlt } from "react-icons/fa"; // For react-icons
// For react-icons

const PaymentMethods = () => {
    const router = useRouter();
    const checkUserToken = !!getSetData("token");
    const [active, setActive] = useState(0);
    const [loading, setloading] = useState(false);
    const [allData, setAllData] = useState({});
    const { user_id } = getSetData("userData", false, true);

    useEffect(() => {
        if (user_id) {
            getPaymentDetails();
        }
    }, [user_id]);

    const getPaymentDetails = () => {
        let payload = {
            user_id: user_id,
        };
        setloading(true);
        ApiClient.userPaymentDetails(payload)
            .then((res) => {
                if (res?.data?.payment_details) {
                    let newData = structuredClone(res.data.payment_details[0]);
                    newData.phon_pay_no = newData.phone_pay_number;
                    newData.paytm_no = newData.paytm_number;
                    newData.google_pay_no = newData.google_pay_number;
                    newData.upi_type = newData.upi_id;
                    setAllData(newData);
                }
                setloading(false);
            })
            .catch((err) => {
                setloading(false);
                console.log(err);
            });
    };

    const saveUpiDetails = async () => {
        const upiTypes = [
            { key: 'paytm_no', type: 1, name: 'Paytm' },
            { key: 'google_pay_no', type: 2, name: 'Google Pay' },
            { key: 'phon_pay_no', type: 3, name: 'PhonePe' },
            { key: 'upi_type', type: 4, name: 'UPI' }
        ];
        setloading(true);
        for (const upi of upiTypes) {
            if (allData[upi.key]) {
                const payload = {
                    user_id: user_id,
                    upi_type: upi.type,
                    paytm_no: upi.type === 1 ? allData[upi.key] : undefined,
                    google_pay_no: upi.type === 2 ? allData[upi.key] : undefined,
                    phon_pay_no: upi.type === 3 ? allData[upi.key] : undefined,
                    upi_id: upi.type === 4 ? allData[upi.key] : undefined
                };
                try {
                    const res = await ApiClient.addUserUpiDetails(payload);
                    if (res.data && res.data.status) {
                        toast.success(res.data.msg);
                    } else {
                        toast.error(res.data.msg || `Failed to save ${upi.name} details`);
                    }
                } catch (err) {
                    console.error(`Error saving ${upi.name} details:`, err);
                    toast.error(`Failed to save ${upi.name} details. Please try again.`);
                }
            }
        }
        setloading(false);
        getPaymentDetails(); // Refresh the payment details after saving
    };

    const saveBankDetails = () => {
        if (allData.confirm_ac_number != allData.ac_number) {
            return toast.error("Account number and confirm account number are not the same.");
        }
        let payload = {
            user_id: user_id,
        };
        setloading(true);
        ApiClient.addUserBankDetails(payload)
            .then((res) => {
                setloading(false);
                toast.success(res.data.msg);
            })
            .catch((err) => {
                setloading(false);
                toast.error("Something went wrong.");
                console.log(err);
            });
    };

    useEffect(() => {
        if (!checkUserToken) {
            router.push("/signup");
        }
    }, []);

    const renderTypes = () => {
        const types = [
            { id: 0, label: "UPI Details", icon: FaMobileAlt },
            { id: 1, label: "Bank Details", icon: FaUniversity },
        ];

        return (
            <div className="flex space-x-4 overflow-x-auto py-4">
                {types.map((type) => (
                    <motion.button
                        key={type.id}
                        className={`flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white focus:outline-none transition-colors duration-300 ${active === type.id
                            ? "bg-gradient-to-r from-orange-500 to-yellow-500 shadow-md"
                            : "bg-gray-700 hover:bg-gray-600"
                            }`}
                        onClick={() => setActive(type.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <type.icon className="mr-2" size={20} />
                        {type.label}
                    </motion.button>
                ))}
            </div>
        );
    };

    const renderActiveSection = () => {
        if (active === 0) {
            return (
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Inputbox
                        label="Paytm Number"
                        type="number"
                        value={allData.paytm_no || ""}
                        onChange={(value) => setAllData({ ...allData, paytm_no: value })}
                    />
                    <Inputbox
                        label="Google Pay Number"
                        type="number"
                        value={allData.google_pay_no || ""}
                        onChange={(value) => setAllData({ ...allData, google_pay_no: value })}
                    />
                    <Inputbox
                        label="PhonePe Number"
                        type="number"
                        value={allData.phon_pay_no || ""}
                        onChange={(value) => setAllData({ ...allData, phon_pay_no: value })}
                    />
                    <Inputbox
                        label="UPI ID"
                        type="text"
                        value={allData.upi_type || ""}
                        onChange={(value) => setAllData({ ...allData, upi_type: value })}
                    />
                    <motion.button
                        className="w-full py-3 rounded-lg font-semibold text-white bg-green-500 hover:bg-green-600 focus:outline-none transition-colors duration-300"
                        onClick={saveUpiDetails}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Save UPI Details
                    </motion.button>
                </motion.div>
            );
        } else if (active === 1) {
            return (
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Inputbox
                        label="Account Holder Name"
                        type="text"
                        value={allData.ac_holder_name || ""}
                        onChange={(value) => setAllData({ ...allData, ac_holder_name: value })}
                    />
                    <Inputbox
                        label="Account Number"
                        type="number"
                        value={allData.ac_number || ""}
                        onChange={(value) => setAllData({ ...allData, ac_number: value })}
                    />
                    <Inputbox
                        label="Confirm Account Number"
                        type="number"
                        value={allData.confirm_ac_number || ""}
                        onChange={(value) => setAllData({ ...allData, confirm_ac_number: value })}
                    />
                    <Inputbox
                        label="IFSC Code"
                        type="text"
                        value={allData.ifsc_code || ""}
                        onChange={(value) => setAllData({ ...allData, ifsc_code: value })}
                    />
                    <motion.button
                        className="w-full py-3 rounded-lg font-semibold text-white bg-green-500 hover:bg-green-600 focus:outline-none transition-colors duration-300"
                        onClick={saveBankDetails}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Save Bank Details
                    </motion.button>
                </motion.div>
            );
        }
        return null;
    };

    return (
        <motion.div
            className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
                <h2 className="text-3xl font-bold text-orange-500 text-center">
                    Payment Methods
                </h2>
                {renderTypes()}
                {renderActiveSection()}
                <ConditionalDownloadButton />
            </div>
            <Loader show={loading} />
        </motion.div>
    );
};

export default PaymentMethods;
