import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";
import { FaXmark } from "react-icons/fa6";
import { FiSend } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaCommentDots, FaHome, FaUser, FaUsers } from "react-icons/fa";
import { MdAddBox } from "react-icons/md";

const ChooseDeveloper = () => {
    const { developersList = [], getDeveloperToDisplay, totalDevelopers = 0 } = useAuthStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [allDeveloperList, setAllDeveloperList] = useState(new Map());
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFooter, setShowFooter] = useState(false);
    const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
    const navigate = useNavigate()

    const handleMouseMove = (event) => {
        setShowFooter(event.clientY > window.innerHeight - 60);
      };
    
      useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
      }, []);

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
        <div className="pt-20 flex flex-col bg-gray-900 items-center h-screen justify-center    ">
            {developersArray.length > 0 ? (
                <motion.div
                    key={developersArray[currentIndex]._id}
                    className="relative card shadow-2xl  bg-opacity-40 bg-gray-700 sm:p-9 p-4 text-center sm:w-[450px] w-80 text-black flex gap-1 rounded-lg"
                    variants={cardVariants}
                    custom={direction}
                    initial="enter"
                    animate="center"
                    exit="exit"
                >
                    <div className="relative w-full">
                        <div className="opacity-65  h-full w-28 p-2 bg-gradient-to-r from-[#0f0f0f] absolute rounded-lg"></div>
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
                                        className="px-4 py-2 text-white rounded-full text-2xl hover:scale-150"
                                    >
                                        {"<"}
                                    </button>
                                </div>
                            )}
                            {currentIndex < developersArray.length - 1 || hasMoreToLoad ? (
                                <div className="h-full z-10">
                                    <button
                                        onClick={nextDeveloper}
                                        className="px-4 py-2 text-white rounded-full text-2xl hover:scale-150"
                                    >
                                        {">"}
                                    </button>
                                </div>
                            ) : null}
                        </div>
                        <div className="opacity-65 h-full w-28 p-2 bg-gradient-to-l from-[#0f0f0f] absolute top-0 right-0 rounded-lg"></div>
                    </div>
                    <p className="w-full text-white mt-2 text-[33px] font-bold tracking-widest " style={{letterSpacing:"15px"}}>
                        {developersArray[currentIndex].fullName.toUpperCase()}
                    </p>
                    <div className="w-full h-auto flex items-end justify-evenly py-3">
                        <div>
                            <button onClick={()=>{navigate(`/devProfile/${developersArray[currentIndex]._id}`)}}
                             className="shadow-md shadow-gray-700 hover:scale-110 flex bg-gray-900 items-center justify-center gap-2  p-3 rounded-full">
                                <FiSend size={30} className="text-green-600 " />
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={removeDeveloper}
                                className="shadow-md shadow-gray-700  hover:scale-110 flex bg-gray-900 items-center justify-center gap-2 p-3 rounded-full"
                            >
                                <FaXmark size={30} className=" text-red-600" />
                            </button>
                        </div>
                    </div>
                    <div className="w-full flex text-primary-content/70">
                        <p className="text-white font-extrabold text-[17px]"style={{letterSpacing:"5px"}} >SKILLS </p>
                    </div>

                    {/* Skills Marquee Section */}
                    <div className="relative w-full mt-3 overflow-hidden">
                        {/* First Row - Left Scroll */}
                        <motion.div
                            className="flex gap-6 whitespace-nowrap w-full"
                            initial={{ x: "100%" }}
                            animate={{ x: "-100%" }}
                            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                        >
                            {developersArray[currentIndex].field.concat(developersArray[currentIndex].field).map((item, index) => (
                                <div key={index} className="opacity-85 py-2 px-6 bg-gray-900 shadow-md shadow-gray-700 rounded-lg">
                                    <h1 className="text-white font-extrabold">{item.toUpperCase()}</h1>
                                </div>
                            ))}
                        </motion.div>

                        {/* Second Row - Right Scroll */}
                        <motion.div
                            className="flex gap-6 whitespace-nowrap w-full mt-5"
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                        >
                            {developersArray[currentIndex].field.concat(developersArray[currentIndex].field).map((item, index) => (
                                <div key={index} className="opacity-85 py-2 px-6 bg-gray-900 shadow-md shadow-gray-700 rounded-lg">
                                    <h1 className="text-white font-extrabold">{item.toUpperCase()}</h1>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            ) : (
                <p className="text-gray-400">No developers found.</p>
            )}
            {/* Footer Navigation Bar */}
                  <div
              className={`fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-evenly rounded-3xl items-center transition-transform duration-300 mx-4 my-2 ${
                showFooter ? "translate-y-0" : "translate-y-[110%]"
              }`}
            >
                    <Link to="/" className="text-black text-2xl hover:text-blue-300">
                      <FaHome />
                    </Link>
                    <Link to="/chat" className="text-black text-2xl hover:text-blue-300">
                      <FaCommentDots />
                    </Link>
                    <Link
                      to="/add-post"
                      className="bg-blue-100 text-black p-3 rounded-full shadow-lg text-4xl hover:bg-green-300"
                    >
                      <MdAddBox />
                    </Link>
                    <Link to="/InteractedUsersList" className="text-black text-2xl hover:text-blue-300">
                      <FaUsers />
                    </Link>
                    <Link to="/devProfile/myProfile" className="text-black text-2xl hover:text-blue-300">
                      <FaUser />
                    </Link>
                  </div>
        </div>
    );
};

export default ChooseDeveloper;
