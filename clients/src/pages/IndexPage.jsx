import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Hero from "../components/Hero";
import About from "../components/About";
import { countries, uniqueFilters } from "../constants";
import { Link, useNavigate } from "react-router-dom";
import Cover from "../components/Cover";
import FeedbackForm from "../components/FeedbackForm";
import { languages, UniversityOptions } from "../constants";
import logo from "../assets/logo.png";

const IndexPage = () => {
  const [consultants, setConsultants] = useState([]);
  const [filteredConsultants, setFilteredConsultants] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedFilterObj, setSelectedFilterObj] = useState(null);
  const [visibleConsultants, setVisibleConsultants] = useState(8);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedMajors, setSelectedMajors] = useState([]);

  const mentorsSectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const response = await axios.get("/api/registerConsultant");
        setConsultants(response.data.consultants);
        setFilteredConsultants(response.data.consultants);
      } catch (error) {
        console.error("Error fetching consultants:", error);
      }
    };
    fetchConsultants();
  }, []);

  useEffect(() => {
    let filtered = consultants;
    if (selectedFilter) {
      filtered = filtered.filter((consultant) =>
        consultant.category.includes(selectedFilter)
      );
    }
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter((consultant) =>
        selectedSubcategories.every((subcat) =>
          consultant.subcategories.includes(subcat)
        )
      );
    }
    setFilteredConsultants(filtered);
  }, [selectedFilter, selectedSubcategories, consultants]);

  useEffect(() => {
    if (selectedFilter && mentorsSectionRef.current) {
      mentorsSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    const filterObj = uniqueFilters.find((f) => f.value === selectedFilter);
    setSelectedFilterObj(filterObj);
    setSelectedSubcategories([]);
    updateURL(filterObj ? filterObj.value : "", []);
  }, [selectedFilter]);


  const handleFilterClick = (filter) => {
    if (selectedFilter === filter) {
      setSelectedFilter(null);
    } else {
      setSelectedFilter(filter);
    }

  };
  

  const handleSubcategoryClick = (subcategory) => {
    const newSelectedSubcategories = selectedSubcategories.includes(subcategory)
      ? selectedSubcategories.filter((sc) => sc !== subcategory)
      : [...selectedSubcategories, subcategory];

    setSelectedSubcategories(newSelectedSubcategories);
    // setVisibleConsultants(1);
    updateURL(selectedFilter, newSelectedSubcategories);
  };

  const updateURL = (filter, subcategories) => {
    const params = new URLSearchParams();
    if (filter) params.set("topic", filter);
    subcategories.forEach((subcat) => params.append("tag[]", subcat));
    navigate({ search: params.toString() });
  };
  const toggleModal = () => { setIsModalOpen(!isModalOpen); };

  const handleApplyFilters = () => {
    setIsModalOpen(false);
  };

  const handleRegionChange = (region) => {
    setSelectedRegions(region.target.value);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleUniversityLocation = (event) => {
    setSelectedCountries(event.target.value);
  };

  const handleMajorChange = (major) => {
    setSelectedMajors((prevMajors) =>
      prevMajors.includes(major)
        ? prevMajors.filter((m) => m !== major)
        : [...prevMajors, major]
    );
  };

  const handleShowMore = () => {
    setVisibleConsultants((prevVisible) => prevVisible + 4);
  };

  return (
    <>
      <div className="w-full">
        <Hero />
      </div>
  
        <About />
        {/* <Cover /> */}

      <nav className="bg-gray-200 w-full">
        <h2 className="font-bold text-6xl mt-12 p-6">
          <span className="text-secondary">In</span>siders{" "}
          <span className="text-secondary">At</span> Your Fingertips
        </h2>

        <div className="overflow-x-auto scrollbar-thin scrollbar-webkit flex p-4 space-x-4">
          {uniqueFilters.map((filter, index) => (
            <div
              key={index}
              className={`flex flex-col items-center cursor-pointer ${
                selectedFilter === filter.value
                  ? "text-white font-semibold border-gray-700 bg-primary rounded-md border"
                  : "text-black border-black font-bold rounded-xl border"
              }`}
              onClick={() => handleFilterClick(filter.value)}
            >
              <div className="w-52 px-2 h-16 flex items-center justify-center">
                <span className="text-center font-semibold">{filter.name}</span>
              </div>
            </div>
          ))}
        </div>
      </nav>

      <section
        ref={mentorsSectionRef}
        className="w-full  px-8 py-4 bg-gray-200"
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap">
            {selectedFilterObj &&
              selectedFilterObj.subcategories.length > 0 && (
                <div className="flex gap-4">
                  {selectedFilterObj.subcategories.map((subcat, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer ${
                        selectedSubcategories.includes(subcat.value)
                          ? "text-white font-semibold border-black bg-primary rounded-lg border"
                          : "text-black border-black font-semibold rounded-lg border"
                      } p-2 border border-black rounded-lg`}
                      onClick={() => handleSubcategoryClick(subcat.value)}
                    >
                      {subcat.name}
                    </div>
                  ))}
                </div>
              )}
          </div>
          <button
            className="text-black border-black flex mr-32 gap-2 p-4 font-semibold rounded-lg border"
            onClick={toggleModal}
          >
            Filter
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
              />
            </svg>
          </button>
        </div>

        <div className="bg-gray-200 w-full mb-16">
          <div className="grid grid-cols-4 gap-4">
            {filteredConsultants
              .slice(0, visibleConsultants)
              .map((consultant) => (
                <Link
                  to={`/insider/${consultant._id}?name=${encodeURIComponent(
                    consultant.name
                  )}&category=${encodeURIComponent(
                    consultant.major.join(",")
                  )}`}
                  key={consultant._id}
                  className="bg-white w-full rounded-lg relative shadow-lg overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <img
                      src={consultant.profilePicture}
                      alt={consultant.name}
                      className="w-40 mt-2 ml-2 h-40 object-cover rounded-full border-4 border-gray-300 shadow-lg"
                    />
                    <button className="rounded-lg w-24 mb-16 h-12 mr-4 bg-secondary text-white  text-center font-semibold">
                      Book a Call
                    </button>
                  </div>
                  <div className="p-4">
                    <h2 className="text-2xl font-bold mb-4">
                      {consultant.name}
                    </h2>
                    <div className="flex gap-2 m-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="size-6"
                      >
                        <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                        <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
                        <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
                      </svg>
                      <p className="text-xl font-semibold">
                        {consultant.country}
                      </p>
                    </div>

                    <div className="flex gap-2 text-xl m-2 font-semibold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="size-6"
                      >
                        <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                      </svg>

                      {consultant.major.map((subcategory, index) => (
                        <span key={index}>
                          {subcategory}
                          {index < consultant.major.length - 1 && " & "}
                        </span>
                      ))}
                    </div>

                    <div className="flex m-2 gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="size-6"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM9.763 9.51a2.25 2.25 0 0 1 3.828-1.351.75.75 0 0 0 1.06-1.06 3.75 3.75 0 0 0-6.38 2.252c-.033.307 0 .595.032.822l.154 1.077H8.25a.75.75 0 0 0 0 1.5h.421l.138.964a3.75 3.75 0 0 1-.358 2.208l-.122.242a.75.75 0 0 0 .908 1.047l1.539-.512a1.5 1.5 0 0 1 .948 0l.655.218a3 3 0 0 0 2.29-.163l.666-.333a.75.75 0 1 0-.67-1.342l-.667.333a1.5 1.5 0 0 1-1.145.082l-.654-.218a3 3 0 0 0-1.898 0l-.06.02a5.25 5.25 0 0 0 .053-1.794l-.108-.752H12a.75.75 0 0 0 0-1.5H9.972l-.184-1.29a1.863 1.863 0 0 1-.025-.45Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <p className="text-xl text-black font-semibold">
                        {consultant.price[0]}{" "}
                      </p>
                      <span className="text-xl font-bold text-black">
                        • Session
                      </span>
                    </div>
                    <p className="two-line-ellipsis font-semibold text-gray-900 text-lg">
                      {consultant.bio}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
          {/* {visibleConsultants < filteredConsultants.length && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleShowMore}
                className="text-white bg-primary hover:bg-primary-dark font-bold py-2 px-4 rounded"
              >
                Show More
              </button>
            </div>
          )} */}
        </div>
      </section>

      <FeedbackForm />

      {isModalOpen && (
        <section className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-end items-center z-50">
          <div className="bg-white p-8 h-full  rounded-md w-full md:w-1/2 lg:w-1/4 xl:w-1/3 relative">
            <button
              onClick={toggleModal}
              className="absolute top-2 right-2 text-black text-4xl"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-4xl mb-16 font-semibold">Filters</h2>
            <div className="flex-cols gap-6 ">
              <div className="mb-6">
                <h3 className="font-semibold text-2xl underline">
                  Language Fluency
                </h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  <select
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                    className="border border-gray-300 p-2 w-full rounded-lg"
                  >
                    <option value="">Select Language</option>
                    {languages.map((language) => (
                      <option key={language} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-2xl underline">
                  Location of University
                </h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  <select
                    value={selectedRegions}
                    onChange={handleRegionChange}
                    className="border border-gray-300 p-2 w-full rounded-lg"
                  >
                    <option value="">Select Region</option>
                    {countries.map((reg) => (
                      <option key={reg} value={reg}>
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-2xl underline">
                  Country of Origin
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <select
                    value={selectedCountries}
                    onChange={handleUniversityLocation}
                    className="border border-gray-300 p-2 w-full rounded-lg"
                  >
                    <option value="">Select Country</option>
                    {UniversityOptions.map((Uni) => (
                      <option key={Uni} value={Uni}>
                        {Uni}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-2xl underline">Major</h3>
                <div className="flex-1 gap-2 mt-2">
                  {[
                    "STEM",
                    "Social Sciences",
                    "Humanities",
                    "Law / Pre-Law",
                    "Business & Management",
                    "Medicine / Pre-Med",
                    "Music & Arts",
                  ].map((major) => (
                    <label
                      key={major}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMajors.includes(major)}
                        onChange={() => handleMajorChange(major)}
                      />
                      {major}
                    </label>
                  ))}
                </div>
              </div>
            </div>


            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={handleApplyFilters}
                className="bg-secondary text-white font-bold flex items-center text-2xl px-6 py-2 rounded-lg"
              >
                Apply
                <img src={logo} alt="logo" className="w-24 h-16 object-cover" />
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default IndexPage;
