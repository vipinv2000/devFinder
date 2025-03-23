import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";
import { FaXmark } from "react-icons/fa6";
import { FiSend } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ChooseDeveloper = () => {
    const { developersList = [], getDeveloperToDisplay, totalDevelopers = 0 } = useAuthStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [allDeveloperList, setAllDeveloperList] = useState(new Map());
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
    const navigate = useNavigate()

    useEffect(() => {
        getDeveloperToDisplay(currentPage);
    }, [currentPage]);

    useEffect(() => {
        if (developersList.length > 0) {
            setAllDeveloperList((prev) => {
                const updatedList = new Map(prev);
                developersList.forEach(dev => updatedList.set(dev._id, dev));
                return updatedList;
            });
        }
    }, [developersList]);

    const developersArray = Array.from(allDeveloperList.values());
    const hasMoreToLoad = allDeveloperList.size < totalDevelopers;

    const nextDeveloper = () => {
        if (currentIndex < developersArray.length - 1) {
            setDirection(1);
            setCurrentIndex((prev) => prev + 1);
        } else if (hasMoreToLoad) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const prevDeveloper = () => {
        if (currentIndex > 0) {
            setDirection(-1);
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const removeDeveloper = () => {
        if (developersArray.length === 0) return;

        setAllDeveloperList((prev) => {
            const updatedList = new Map(prev);
            updatedList.delete(developersArray[currentIndex]._id);

            // Convert Map back to an array
            const updatedArray = Array.from(updatedList.values());

            // Adjust currentIndex to stay within bounds
            let newIndex = currentIndex;
            if (currentIndex >= updatedArray.length && updatedArray.length > 0) {
                newIndex = updatedArray.length - 1;
            }

            setCurrentIndex(newIndex);
            return updatedList;
        });
    };

    const cardVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 200 : -200,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: { duration: 0.5 },
        },
        exit: (direction) => ({
            x: direction > 0 ? -200 : 200,
            opacity: 0,
            transition: { duration: 0.5 },
        }),
    };

    return (
        <div className="pt-20 flex flex-col items-center h-screen justify-center rounded-lg">
            {developersArray.length > 0 ? (
                <motion.div
                    key={developersArray[currentIndex]._id}
                    className="relative card shadow-xl bg-opacity-40 bg-base-300 sm:p-6 p-4 text-center sm:w-[450px] w-80 text-black flex gap-1 rounded-lg"
                    variants={cardVariants}
                    custom={direction}
                    initial="enter"
                    animate="center"
                    exit="exit"
                >
                    <div className="relative w-full">
                        <div className="h-full w-28 p-2 bg-gradient-to-r from-[#0f0f0f] absolute rounded-lg"></div>
                        <img
                            src={developersArray[currentIndex].profilePic}
                            alt="Pic"
                            className="w-full h-[340px] rounded-lg object-fill"
                        />
                        <div
                            className={`absolute top-1/2 left-0 right-0 flex   
                            ${currentIndex > 0 && (currentIndex < developersArray.length - 1 || hasMoreToLoad)
                                    ? "justify-between"
                                    : currentIndex > 0
                                        ? "justify-start"
                                        : "justify-end"}`}
                        >
                            {currentIndex > 0 && (
                                <div className="z-10">
                                    <button
                                        onClick={prevDeveloper}
                                        className="px-4 py-2 text-white rounded-full text-2xl"
                                    >
                                        {"<"}
                                    </button>
                                </div>
                            )}
                            {currentIndex < developersArray.length - 1 || hasMoreToLoad ? (
                                <div className="h-full z-10">
                                    <button
                                        onClick={nextDeveloper}
                                        className="px-4 py-2 text-white rounded-full text-2xl"
                                    >
                                        {">"}
                                    </button>
                                </div>
                            ) : null}
                        </div>
                        <div className="h-full w-28 p-2 bg-gradient-to-l from-[#0f0f0f] absolute top-0 right-0 rounded-lg"></div>
                    </div>
                    <p className="text-base-content/70 mt-2 text-[33px] font-bold tracking-widest space-x-5">
                        {developersArray[currentIndex].fullName.toUpperCase()}
                    </p>
                    <div className="w-full h-auto flex items-end justify-evenly py-3">
                        <div>
                            <button onClick={()=>{navigate(`/devProfile/${developersArray[currentIndex]._id}`)}} className="flex bg-accent items-center justify-center gap-2  p-3 rounded-full">
                                <FiSend size={30} className="text-neutral" />
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={removeDeveloper}
                                className="flex bg-accent items-center justify-center gap-2 p-3 rounded-full"
                            >
                                <FaXmark size={30} className="text-neutral" />
                            </button>
                        </div>
                    </div>
                    <div className="w-full flex text-primary-content/70">
                        <p className="text-base-content">Skills :</p>
                    </div>

                    {/* Skills Marquee Section */}
                    <div className="relative w-full mt-3 overflow-hidden">
                        {/* First Row - Left Scroll */}
                        <motion.div
                            className="flex gap-4 whitespace-nowrap w-full"
                            initial={{ x: "100%" }}
                            animate={{ x: "-100%" }}
                            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                        >
                            {developersArray[currentIndex].field.concat(developersArray[currentIndex].field).map((item, index) => (
                                <div key={index} className="opacity-85 py-1 px-3 bg-primary rounded-lg">
                                    <h1 className="text-primary-content/70">{item}</h1>
                                </div>
                            ))}
                        </motion.div>

                        {/* Second Row - Right Scroll */}
                        <motion.div
                            className="flex gap-4 whitespace-nowrap w-full mt-5"
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                        >
                            {developersArray[currentIndex].field.concat(developersArray[currentIndex].field).map((item, index) => (
                                <div key={index} className="opacity-85 py-1 px-3 bg-primary rounded-lg">
                                    <h1 className="text-primary-content/70">{item}</h1>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            ) : (
                <p>No developers found.</p>
            )}
        </div>
    );
};

export default ChooseDeveloper;
