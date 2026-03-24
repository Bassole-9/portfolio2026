"use client";
import { FaChevronDown, FaGithub, FaLinkedin, FaWhatsapp, FaPlay  } from "react-icons/fa";
import { FiEye, FiDownload, FiGlobe  } from "react-icons/fi";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState,useEffect, useMemo } from "react";
import axios from "axios";
import { User } from "lucide-react";
import dynamic from "next/dynamic";
import { BsFillSendFill } from "react-icons/bs";


const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false
});



export default function Home() {
//////////////////////////////////////////////////// State pour bar de recherche
const [results, setResults] = useState<string[]>([]);
const [history, setHistory] = useState<string[]>([]);
const [search, setSearch] = useState<string>("");
const [selectedIndex, setSelectedIndex] = useState<number>(-1);
const [open, setOpen] = useState<boolean>(false);


//////////////////////////////////////////////////// State pour formulaire
const [formData, setFormData] = useState({
  name: "",
  email: "",
  text: ""
});

//////////////state pour over
 const [hover, setHover] = useState(false);


/////////////tableau language
const languages = [
  { code: "fr", label: "Français" , drapeau:{} },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "ar", label: "العربية" },
  { code: "ru", label: "Русский" },
];

/////////////tableau data
const data = [
  "UI Designer",
  "UX Designer",
  "Web Designer",
  "Product Designer",
  "Frontend Developer",
  "React Developer",
];

////////////state pour detail articles
const [selectedItem, setSelectedItem] = useState(null);


///////////state pour changer language
const [lang, setLang] = useState("fr");
const [openLang, setOpenLang] = useState(false);





////////////state menu open et close
const [menuOpen, setMenuOpen] = useState(false);




////////////////////////////////////fonction de input /////////////////////////////////
//recherche instantané input
const handleSearch = (value: string) => {
  setSearch(value);
  const filtered = data.filter((item) =>
    item.toLowerCase().includes(value.toLowerCase())
  );
};

  // sauvegarde historique input
  const selectItem = (item: string) => {
  setSearch(item);
  setHistory((prev) => {
    const newHistory = [item, ...prev.filter((h: string) => h !== item)];
    return newHistory.slice(0, 5);
  });
};

  //clavier navigation input
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "ArrowDown") {
    setSelectedIndex((prev: number) =>
      prev < results.length - 1 ? prev + 1 : prev
    );
  }

  if (e.key === "ArrowUp") {
    setSelectedIndex((prev: number) =>
      prev > 0 ? prev - 1 : prev
    );
  }

  if (e.key === "Enter" && selectedIndex >= 0) {
    selectItem(results[selectedIndex]);
  }

  if (e.key === "Escape") {
    setOpen(false);
  }
};




  //////////////recuperation des données d'un API et rechercher a l'interieur ////////////

  // évite trop de requêtes
  useEffect(() => {

  const timer = setTimeout(() => {

    if (search.trim() !== "") {
      fetchResults();
    }

  }, 300);

  return () => clearTimeout(timer);

}, [search]);

//recuperation des donnée api
  const fetchResults = async (): Promise<void> => {
  try {
    const res = await axios.get<string[]>(
      `http://localhost:5000/search?q=${search}`
    );
    setResults(res.data);
  } catch (err) {
    console.log(err);
  }
};
//////////////Fermer dropdown clic extérieur

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
  if (
    searchRef.current &&
    !searchRef.current.contains(event.target as Node)
  ) {
    setOpen(false);
  }
};
  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


//////////////Fermer menu ambergeur


useEffect(() => {
  function handleResize() {
    if (window.innerWidth >= 768) {
      setMenuOpen(false);
    }
  }

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);

////////changer language

const changeLang = (code: string) => {
  setLang(code);
  setOpenLang(false);
};

///////////////globe qui tourne 
const globeRef = useRef<any>(null);

useEffect(() => {
  let frameId;

  const rotateGlobe = () => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 2; // ajuste la vitesse
    }
    frameId = requestAnimationFrame(rotateGlobe);
  };

  rotateGlobe();

  return () => cancelAnimationFrame(frameId);
}, []);




const handleGlobeReady = () => {
  const controls = globeRef.current.controls();

  controls.autoRotate = true;
  controls.enableZoom = false; // optionnel
};

const cities = [
    { lat: 48.85, lng: 2.35 },
    { lat: 28.61, lng: 77.20 },
    { lat: 35.68, lng: 139.69 },
    { lat: 1.35, lng: 103.81 },
    { lat: -33.86, lng: 151.20 }
  ];







////////////////////////////////////fonction de formulaire /////////////////////////////////

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value
  }));
};


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:5000/register",
      formData
    );

    console.log(res.data);

    setFormData({
      name: "",
      email: "",
      text: "",
      password: "",
    });

  } catch (error) {
    console.log(error);
  }
};



  

  

  const items = [
    { img: "e-commerce.png",
      direction: -100,
      nom:"E-commerce",
      definition :"Site e-commerce permettant de vendre des produits en ligne avec gestion du panier, des commandes et des utilisateurs dans une interface intuitive.",
      année:"Decembre 2025",
      link: "https://e-commerce-back-3.onrender.com",
      link2:"https://github.com/Bassole-9/e-commerce",
      stack:["React", "Node.js", "MongoDB", "Tailwind"],
      role: "Développeur Full-Stack Conception architecture, développement backend Express, développement frontend React, déploiement",
      Timeline:"Novembre 2025 Projet académique - 1 mois"
    },

    { img: "catch.jpeg",
      direction: 100, nom:"Catch wwe",
      definition :"Application web immersive dédiée au catch, permettant de découvrir les superstars, suivre les événements et explorer les statistiques dans une interface moderne et dynamique.",
      année:"Novembre 2025",
      link: "https://catch-lake.vercel.app/",
      link2:"https://github.com/Bassole-9/catch",
      stack:["VueJS", "Css"],
      role: "Développeur Full-Stack Architecture, intégration API, interface utilisateur",
      Timeline:"Développé en 2025 Projet personnel"
    }
      ,
    { img: "todo.jpeg",
      direction: -100,
      nom:"TodoListe",
      definition :"Application de gestion de tâches permettant d’ajouter, modifier et supprimer des éléments pour mieux organiser son quotidien.",
      année:"Juin 2025",
      link: "https://todo-angular-one-silk.vercel.app/",
      link2:"https://github.com/Bassole-9/TodoAngular",
      stack:["Angular","Tailwind"],
      role:"Développeur web Application gestion de tach projet-académique",
      Timeline:"Juin 2025"
    },
  ];

  const logos = {
  "React": "/logos/react.png",
  "Node.js": "/logos/node.png",
  "MongoDB": "/logos/mongo.png",
  "Tailwind": "/logos/tailwind.png",
  "Angular": "/logos/angular.png",
  "VueJS": "/logos/VueJs.png",
  "Css": "/logos/Css.png",
};


const refSection = useRef<HTMLDivElement | null>(null);
    // const refText = useRef(null);
   const searchRef = useRef<HTMLDivElement | null>(null);

    const { scrollYProgress: scrollYProgress } = useScroll({
    target: refSection,
          offset: ["start end", "end start"]
    });
    // const { scrollYProgress: textProgress } = useScroll({
    // target: refText
    // });



    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [200, -200]);
    const y3 = useTransform(scrollYProgress, [0, 1], [300, -300]);
    // const x = useTransform(textProgress, [0, 1], ["0%", "-200%"]);



    const text = "BASSOLE ARNAUD FRANCK OLIVIER";



  return (
    <>
      <div className={selectedItem ? "blur-sm" : ""}>
              <div className="min-min-h-screen w-full bg-zinc-50 dark:bg-black flex justify-center flex-col items-center ">
                  {/* navbar */}
                  <nav className="w-full h-14 flex justify-between items-center px-6 p-1 fixed top-0 left-0 z-50 bg-white">
                      <a href="#home" className="flex items-center gap-2">
                                        <h2
                                          className="bg-black text-white rounded p-1 cursor-pointer font-bold text-xl hover:text-gray-400 shadow-2xl hover:scale-105 transition"
                                          onMouseEnter={() => setHover(true)}
                                          onMouseLeave={() => setHover(false)}
                                        >
                                          BAFO
                                        </h2>

                                        <div  className={` w-25 flex justify-center text-black font-semibold transform transition-all duration-600 ease-in-out  text-xs rounded  p-2${
                                            hover
                                              ? "translate-x-0 opacity-100"
                                              : "-translate-x-full opacity-0 pointer-events-none"
                                          }`}>
                                            <span className="p-1 font-bold">
                                            Bassole Arnaud Franck Olivier
                                          </span>

                                        </div>
                      </a>
                      <div className="rounded p-4 flex justify-center items-center ">

                                      
                                              {/* search */}
                                          {/* <div ref={searchRef}  className="relative hidden md:block">

                                            <div className="bg-gray-200 rounded-full px-4 py-2 flex items-center gap-3 hover:bg-white ">

                                              <input
                                                value={search}
                                                onChange={(e) => handleSearch(e.target.value)}
                                                onFocus={() => setOpen(true)}
                                                onKeyDown={handleKeyDown}
                                                className="bg-transparent outline-none w-96 p-2"
                                                placeholder="what are you looking for ?"
                                              />

                                              <h2 className="cursor-pointer hover:text-gray-400 transition">
                                                Designers
                                              </h2>

                                              <div className="bg-purple-400 rounded-full px-3 py-1 cursor-pointer">
                                                🔍
                                              </div>

                                            </div>

                                            {open && (
                                              <div className="absolute top-full mt-2 w-full bg-white shadow-xl rounded-xl p-3 z-50">

                                                {history.length > 0 && (
                                                  <div className="mb-2">
                                                    <p className="text-xs text-gray-400 mb-1">Recent</p>

                                                    {history.map((item, index) => (
                                                      <div
                                                        key={index}
                                                        onClick={() => selectItem(item)}
                                                        className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                                                      >
                                                        {item}
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}

                                                {results.map((item, index) => (
                                                  <div
                                                    key={index}
                                                    onClick={() => selectItem(item)}
                                                    className={`p-2 rounded cursor-pointer ${
                                                      selectedIndex === index
                                                        ? "bg-purple-100"
                                                        : "hover:bg-gray-100"
                                                    }`}
                                                  >
                                                    {item}
                                                  </div>
                                                ))}

                                              </div>
                                            )}

                                          </div> */}
                                  {/* menu */}
                                  <ul className="w-full border-1 text-gray-700 border-red-300 p-1 bg-gray-200 rounded-2xl hidden md:flex gap-6 items-center text-sm/6">

                                    {/* Acceuil */}
                                    <li className="relative group cursor-pointer">
                                      <a href="#home">
                                        <div className="flex gap-1 hover:text-black hover:bg-white px-2 rounded-2xl p-1 transition">
                                        Acceuil
                                        <FaChevronDown className="text-xs mt-1" />
                                      </div>
                                      </a>
                                    </li>

                                    {/* A propos */}
                                    <li className="relative group cursor-pointer" >
                                      <a href="#Portfolio">
                                      <span className="flex gap-1 hover:text-black hover:bg-white px-2 rounded-2xl p-1 whitespace-nowrap transition">
                                        A propos
                                        <FaChevronDown className="text-xs mt-1" />
                                      </span>
                                       </a>
                                    </li>

                                    {/* Competence */}
                                    <li className="relative group cursor-pointer">
                                        <a href="#outils">
                                            <span className="flex gap-1 hover:text-black hover:bg-white px-2 rounded-2xl p-1 transition">
                                              Competences
                                              <FaChevronDown className="text-xs mt-1" />
                                            </span>
                                        </a>
                     
                                    </li>

                                    {/* Projet */}
                                    <li className="relative group cursor-pointer">
                                      <a href="#projet">
                                        <span className="flex gap-1 hover:text-black hover:bg-white px-2 rounded-2xl p-1 transition">
                                          projets
                                          <FaChevronDown className="text-xs mt-1" />
                                        </span>
                                      </a>
                                      
                                    </li>
                                    {/* parcourt */}
                                    <li className="relative group cursor-pointer">
                                        <a href="#parcourt">
                                          <span className="flex gap-1 hover:text-black hover:bg-white px-2 rounded-2xl p-1 transition">
                                            Parcourt
                                            <FaChevronDown className="text-xs mt-1" />
                                          </span>
                                        </a>


                                    </li>
                                    {/* Service */}
                                    <li className="relative group cursor-pointer">
                                      <a href="#service">
                                          <span className="flex gap-1 hover:text-black hover:bg-white px-2 rounded-2xl p-1 transition">
                                            Services
                                            <FaChevronDown className="text-xs mt-1" />
                                          </span>
                                      </a>
                              
                                    </li>
                                    {/* Contact */}
                                    <li className="relative group cursor-pointer">
                                      <a href="#contact">
                                          <span className="flex gap-1 hover:text-black hover:bg-white px-2 rounded-2xl p-1 transition">
                                            Contact
                                            <FaChevronDown className="text-xs mt-1" />
                                          </span>
                                      </a>
                                          <div className="absolute top-full left-0 pt-3 hidden group-hover:block">

                                            <div className="bg-white shadow-xl rounded-xl w-64 p-4 space-y-2">

                                              <a href="#service">
                                            <div className="hover:bg-gray-100 p-2 rounded cursor-pointer">
                                                Service
                                            </div>
                                          </a>

                                            <a href="#projet">
                                            <div className="hover:bg-gray-100 p-2 rounded cursor-pointer">
                                                projet
                                            </div>
                                          </a>

                                            <a href="#outils">
                                            <div className="hover:bg-gray-100 p-2 rounded cursor-pointer">
                                                competences
                                            </div>
                                          </a>

                                            </div>

                                          </div>
                                      


                                    </li>

                                  </ul>

                      </div>     
                      {/* auth */}
                      <div className="hidden md:flex justify-center items-center gap-4 mr-6 ">
                                <a
                                href="/cv_bassol.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="flex bg-black text-white p-1 px-2 justify-center items-center gap-2 hover:bg-gray-500 transition cursor-pointer rounded-xl"
                                >
                                <div><FiDownload/>
                                </div>Telecharger Cv</a>
                              <div className="relative">
                          

                                {openLang && (
                                  <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-xl p-2 w-40 z-50">
                                    {languages.map((l) => (
                                      <div
                                        key={l.code}
                                        onClick={() => changeLang(l.code)}
                                        className="p-2 hover:bg-gray-200 rounded cursor-pointer"
                                      >
                                        {l.label}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>



                      </div>
                      <div className="md:hidden">
                            <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
                                ☰
                            </button>
                        </div>
                  </nav>
                  {/* navbar mobile */}
                  <div
                      onClick={() => setMenuOpen(false)}
                      className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-500 ${
                        menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
                      }`}
                    />
                  <div className={`fixed top-0 left-0 w-full h-128 p-6 bg-gray-300 z-40 flex flex-col items-center justify-center
                                    gap-2 text-lg transform transition-all duration-500 ease-in-out ${
                                      menuOpen
                                        ? "translate-y-0 opacity-100"
                                        : "-translate-y-full opacity-0 pointer-events-none"
                                    }`}
                                  >
                                    <div className="w-full text-gray-700 p-4 rouned-2xl" onClick={(e) => e.stopPropagation()}>
                                             <a href="#home" className="w-full flex justify-start p-1 rounded gap-3 hover:bg-gray-200 transition cursor-pointer " onClick={() => setMenuOpen(false)}>Accueil</a>
                                          <a href="#Portfolio" className="w-full flex justify-start p-1 rounded gap-1 hover:bg-gray-200 transition cursor-pointer " onClick={() => setMenuOpen(false)}>A propos</a>
                                          <a href="#outils" className="w-full flex justify-start p-1 rounded gap-1 hover:bg-gray-200 transition cursor-pointer " onClick={() => setMenuOpen(false)}>Competences</a>
                                          <a href="#projet" className="w-full flex justify-start p-1 rounded gap-1 hover:bg-gray-200 transition cursor-pointer " onClick={() => setMenuOpen(false)}>Projet</a>
                                          <a href="#parcourt" className="w-full flex justify-start p-1 rounded gap-1 hover:bg-gray-200 transition cursor-pointer " onClick={() => setMenuOpen(false)}>Parcourt</a>
                                          <a href="#service" className="w-full flex justify-start p-1 rounded gap-1 hover:bg-gray-200 transition cursor-pointer " onClick={() => setMenuOpen(false)}>Services</a>
                                          <a href="#contact" className="w-full flex justify-start p-1 rounded gap-1 hover:bg-gray-200 transition cursor-pointer " onClick={() => setMenuOpen(false)}>Contact</a>

                                          <div className="w-full flex justify-start  gap-4 mt-6">
                                              <a
                                                href="/cv_bassol.pdf"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                                className="flex bg-black text-white p-1 px-2 justify-center items-center gap-2 hover:bg-gray-500 transition cursor-pointer rounded-xl"
                                                >
                                                <div><FiDownload/>
                                                </div>Cv
                                              </a>
                                                <div className="relative">
                                                  <button
                                                    onClick={() => setOpenLang(!openLang)}
                                                    className="flex items-center gap-3 bg-black text-white px-4 py-2 rounded-full cursor-pointer hover:bg-gray-500 transition cursor-pointer rounded-xl"
                                                  >
                                                    <FiGlobe /> {languages.find(l => l.code === lang)?.label}
                                                  </button>

                                                  {openLang && (
                                                    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-xl p-2 w-40 z-50">
                                                      {languages.map((l) => (
                                                        <div
                                                          key={l.code}
                                                          onClick={() => changeLang(l.code)}
                                                          className="p-2 hover:bg-gray-200 rounded cursor-pointer"
                                                        >
                                                          {l.label}
                                                        </div>
                                                      ))}
                                                    </div>
                                                  )}
                                              </div>
                                          </div>
                                    </div>

                  </div>
                  {/* main */}
                  <main className="mb-0 pb-0 w-full flex justify-center md:px-8 py-10 bg-white text-sm md:text-lg lg:text-2xl">
                    <div className="w-full bg-white max-w-8xl rounded md: shadow overflow-x-hidden">

                          {/*les Texte qui apparaît lettre par lettre */}

                            <div className="bg-[#DFDBE5] bg-repeat bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2716%27%20height%3D%2716%27%20viewBox%3D%270%200%2016%2016%27%20xmlns%3D%27http://www.w3.org/2000/svg%27%3E%3Cpath%20d%3D%27M0%200h16v2h-6v6h6v8H8v-6H2v6H0V0zm4%204h2v2H4V4zm8%208h2v2h-2v-2zm-8%200h2v2H4v-2zm8-8h2v2h-2V4z%27%20fill%3D%27%239C92AC%27%20fill-opacity%3D%270.05%27%20fill-rule%3D%27evenodd%27/%3E%3C/svg%3E')] text-center text-sm + md:text-lg + lg:text-2xl rounded py-40 bg-gray-100" id="home">
                              <div>
                                <h1 className="text-6xl font-bold text-center">
                                  {text.split("").map((letter, i) => (
                                    <motion.span
                                      key={i}
                                      initial={{ opacity: 0, y: 50 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: i * 0.15 }}
                                    >
                                      {letter}
                                    </motion.span>
                                  ))}
                                </h1>

                              </div>
                              <div >
                                <motion.p
                                    className="font-serif mt-8 text-5xl font-semibold text-blue-600 text-center "
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: text.length * 0.15 + 0.5, duration: 0.8 }}
                                  >
                                    Étudiant en Informatique Développeur d'Applications
                                    <span className="mt-8 text-2xl font-semibold text-gray-600"><br/>
                                      passionné par la creation de sites web perfomants et l’intelligence artificielle . certfifié<br/> par
                                    Nan Digital Academy et Growing Consulting
                                    </span>
                                  </motion.p>

                              </div>

                            </div>

                          {/*Hero section */}
                          <section className="h-[80vh] bg-gray-100 flex items-center" >
                            <div className="max-w-7xl mx-auto px-10 mt-40">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-18">
                                <div className="bg-gray-900 text-white p-6 rounded-2xl">
                                    <h1 className="text-5xl font-bold mb-6">
                                    Construis des sites modernes 🚀
                                    </h1>

                                    <p className=" mb-8">
                                    Apprends à créer des interfaces rapides et élégantes avec Tailwind CSS.
                                    </p>

                                    <div className="flex flex-wrap gap-4">

                                    <a href="#projet">
                                      <button className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:scale-105 transition cursor-pointer">
                                        Voir mes projets
                                      </button>
                                    </a>
                                    <a href="#contact">
                                      <button className="bg-white text-gray-700 border border-gray-600 px-6 py-3 rounded-lg hover:scale-105 transition cursor-pointer">
                                      me contacter
                                      </button>
                                    </a>
                                    </div>
                                    <div className="flex justify-between items-center p-4 mt-15 w-[64] gap-4">

                                      <a href="https://github.com/Bassole-9" target="_blank">
                                          <div className="relative group">

                                        <FaGithub className="w-6 h-6 cursor-pointer hover:text-blue-300"/>

                                        <span className="
                                          absolute -top-10 left-1/2 -translate-x-1/2
                                          bg-white text-black text-xs px-2 py-1 rounded-md
                                          opacity-0 translate-y-2
                                          group-hover:opacity-100 group-hover:translate-y-0
                                          transition-all duration-300
                                        ">
                                          GitHub
                                          <span className="
                                            absolute left-1/2 -translate-x-1/2 top-full
                                            w-2 h-2 bg-white rotate-45
                                          "></span>
                                        </span>

                                      </div>
                                      </a>
                                      <a href="https://www.linkedin.com/in/arnaud-bassole-6422a933b/" target="_blank">
                                        <div className="relative group">

                                        <FaLinkedin className="w-6 h-6 cursor-pointer hover:text-blue-300"/>

                                        <span className="
                                          absolute -top-10 left-1/2 -translate-x-1/2
                                          bg-white text-black text-xs px-2 py-1 rounded-md
                                          opacity-0 translate-y-2
                                          group-hover:opacity-100 group-hover:translate-y-0
                                          transition-all duration-300
                                        ">
                                          linkedin
                                          <span className="
                                            absolute left-1/2 -translate-x-1/2 top-full
                                            w-2 h-2 bg-black rotate-45
                                          "></span>
                                        </span>

                                      </div>
                                      </a>

                                      <a href="https://www.linkedin.com/in/arnaud-bassole-6422a933b/" target="_blank">
                                          <div className="relative group">

                                        <FaWhatsapp className="w-6 h-6 cursor-pointer hover:text-blue-300"/>

                                        <span className="
                                          absolute -top-10 left-1/2 -translate-x-1/2
                                          bg-white text-black text-xs px-2 py-1 rounded-md
                                          opacity-0 translate-y-2
                                          group-hover:opacity-100 group-hover:translate-y-0
                                          transition-all duration-300
                                        ">
                                        whatsapp
                                          <span className="
                                            absolute left-1/2 -translate-x-1/2 top-full
                                            w-2 h-2 bg-black rotate-45
                                          "></span>
                                        </span>

                                      </div>
                                      </a>

                                    </div>
                                </div>

                                <div className="bg-gray-900 text-white rounded-2xl p-4">
                                    <img
                                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
                                    className="w-full h-96 object-cover rounded-xl animate-float shadow-lg"/>
                                </div>
                              </div>
                            </div>

                          </section>

                        {/*motion quand tu scroll : image s'affiche et vas vers le haut  */ }
                          <div className="py-20 bg-gray-100" id="Portfolio">
                            <div className="max-w-6xl mx-auto px-10 grid md:grid-cols-2 gap-15 items-center bg-gray-100 py-40 px-4 ">
                            
                                <div className="max-w-3xl mx-auto bg-gray-100 rounded-xl shadow-xl overflow-hidden ">

                                  <div className="border-red-300 flex items-center gap-2 px-4 py-2 bg-gray-200">
                                    <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                                    <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                                    <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                                    <span className="ml-4 text-sm text-gray-600 font-mono">terminal</span>
                                  </div>
                                  <div className="p-6 font-mono text-sm text-gray-800 leading-relaxed ">

                                    <p>&gt; const developer = {"{"}</p>

                                    <p className="text-green-500 ml-4">name: "BASSOLE ARNAUD FRANCK OLIVIER",</p>
                                    <p className="text-green-500 ml-4">role: "Étudiant en Informatique developpeur d'application",</p>
                                    <p className="text-green-500 ml-4">school: "Nan Digital Academy",</p>
                                    <p className="text-green-500 ml-4">skills: ["React", "nodeJS", "VueJs", "NextJS"],</p>
                                    <p className="text-green-500 ml-4">certifications: ["developpeur junior JavaScript", "developpement web full stack"],</p>
                                    <p className="text-green-500 ml-4">passion: "IA & Développement Logiciel"</p>

                                    <p>{"};"}</p>

                                    <br/>

                                    <p className="text-gray-600">&gt; developer.build()</p>
                                    <p className="text-green-500">✓ Passionné par l'innovation technologique</p>
                                    <hr className="border-gray-300 mt-4 mb-4"/>

                                    <div className="flex gap-12">
                                      <div>
                                        <p className="text-3xl font-bold text-indigo-500">9+</p>
                                        <p className="text-xs text-gray-500 tracking-wider">CERTIFICATIONS</p>
                                      </div>

                                      <div>
                                        <p className="text-3xl font-bold text-indigo-500">3+</p>
                                        <p className="text-xs text-gray-500 tracking-wider">ANNÉES D'ÉTUDES</p>
                                      </div>
                                    </div>

                                  </div>
                                </div>
                                <div className="flex justify-center gap-6">
                                  <motion.img
                                  src="/bassole.jpeg"
                                  className="w-96 h-96 object-cover rounded-xl shadow-xl border-4 border-white"
                                  alt="profil"
                                  initial={{ opacity: 0, y: 80 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.8 }}
                                />
                                </div>

                            </div>
                          </div>

                          {/*Outils et Tech*/}
                          <section className="py-40 bg-blue-100" id="outils">
                                <div className="max-w-7xl mx-auto px-6">

                                  <h2 className="text-3xl font-bold text-center mb-16">
                                    Outils et technologie
                                  </h2>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-18 items-center">

                                    <div className="bg-white h-120 p-7 rounded-3xl shadow-lg">

                                      <p className="text-lg font-semibold mb-8">
                                       Je m’adapte facilement aux échanges, quel que soit le fuseau horaire.
                                      </p>

                                                              <div className="flex justify-center">
                                                                 <Globe
                                                                  ref={globeRef}
                                                                  width={260}
                                                                  height={260}
                                                                  backgroundColor="rgba(0,0,0,0)"
                                                                  globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                                                                  pointsData={cities}
                                                                  pointLat="lat"
                                                                  pointLng="lng"
                                                                  pointColor={() => "#ff7a00"}
                                                                  pointRadius={0.6}
                                                                  pointAltitude={0.01}
                                                                  animateIn={true}
                                                                  showAtmosphere={true}
                                                                  atmosphereColor="#3b82f6"
                                                                  atmosphereAltitude={0.25}
                                                                  onGlobeReady={handleGlobeReady} 
                                                                />

                                                              </div>

                                    </div>
                                    <div className="bg-white h-120  p-7 rounded-3xl shadow-lg">
                                          <div>
                                            <h3 className="text-2xl font-bold mb-4">
                                            Outils et technologie
                                          </h3>
                                          <p className="text-gray-600 text-sm/6 leading-relaxed">
                                            Maîtrise du développement web fullstack
                                            avec React.js, NodeJS, Javascript et PostgreSQL
                                          </p>

                                          </div>


                                                    <div className="grid md:grid-cols-1 gap-12 items-center">
                                                      <div className="w-full flex justify-center">
                                                          <User className="text-orange-500 text-2xl h-8 w-8 rounded-full border border-gray-300 shadow-lg shadow-orange-500/50 "/>
                                                      </div>
                                                      
                                                      <div className="rounded-full bg-white shadow-lg shadow-blue-500/50  flex items-center justify-center">
                                                        {"</>"}
                                                      </div>
                                                      <div className="flex flex-col px-17">
                                                        <div  className="w-full flex justify-between">
                                                           <div className="w-14 h-14 bg-white rounded-full shadow-lg shadow-cyan-400/50 flex items-center justify-center hover:scale-110 transition ">
                                                          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="w-12 h-12"/>
                                                        </div>

                                                        <div className="w-14 h-14 bg-white rounded-full shadow-lg shadow-green-500/50  flex items-center justify-center hover:scale-110 transition">
                                                          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" className="w-12 h-12"/>
                                                        </div>

                                                        <div className="w-14 h-14 bg-white rounded-full shadow-lg shadow-yellow-500/50 flex items-center justify-center hover:scale-110 transition">
                                                          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" className="w-12 h-12"/>
                                                        </div>
                                                        </div>

                                                          <div className="w-full flex justify-between mt-7">
                                                            <div className="w-14 h-14 bg-white rounded-full shadow-lg shadow-blue-500/50  flex items-center justify-center hover:scale-110 transition">
                                                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" className="w-12 h-12"/>
                                                          </div>
                                                          <div className="w-14 h-14 bg-white rounded-full shadow-lg shadow-black  flex items-center justify-center hover:scale-110 transition">
                                                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="NextJS" className="w-12 h-12"/>
                                                          </div>
                                                          <div className="w-14 h-14 bg-white rounded-full shadow-lg shadow-green-500/50  flex items-center justify-center hover:scale-110 transition">
                                                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" alt="VueJs" className="w-12 h-12"/>
                                                          </div>
                                                          </div>

                                                       

                                                        
                                                      </div>
                                                    </div>

                                    </div>

                                  </div>

                                </div>

                          </section>

                          {/*motion quand tu scroll : image s'affiche gauche vers le centre, droite vers le centre  */}
                          <div className="py-40 + bg-gray-100 flex + items-center" id="projet">
                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                                <div>
                                  <h1 className="font-bold">Projet récent</h1>
                                  <p className="text-sm/6 text-gray-700">selection de mes meilleurs projet</p>
                                </div>
                                    <div className="grid grid-cols-1 gap-7">
                                            <div className="max-w-xl mx-auto p-4 py-10 space-y-20 ">
                                                {items.map((item, index) => (
                                                  <motion.div
                                                    key={index}
                                                    className="overflow-hidden "
                                                    initial={{ opacity: 0, x: item.direction }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.8 }}
                                                    exit={{ opacity: 0, x: item.direction }}
                                                    viewport={{ once: false, margin: "-100px"  }}
                                                  >

                                                    <div className="grid grid-cols-1 gap-7 ">
                                                      <div className="border-1 bg-gray-200 border-gray-200 p-4 rounded-xl">
                                                        <div className="w-full h-64 overflow-hidden rounded-lg">
                                                          <img
                                                            onClick={() => setSelectedItem(item)}
                                                            src={item.img}
                                                            className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110 cursor-pointer"
                                                              />


                                                        </div>
                                                        <div className="mt-6 " >
                                                          <h1 className="font-bold ">{item.nom}</h1>
                                                          <p className="text-gray-600 text-sm/6">{item.année}</p>
                                                          <p className="text-gray-600 text-sm/6">
                                                              {item.definition}
                                                          </p>

                                                        </div>
                                                        <div className="mt-4 w-[290] grid grid-cols-4 gap-8 ">
                                                          {
                                                            item.stack.map((item,i)=>(
                                                              <span
                                                              key={i}
                                                              className="text-xs w-full text-center bg-indigo-200 rounded-md "
                                                              >
                                                                {item}
                                                              </span>
                                                            ))
                                                          }
                                                        </div>
                                                        <hr className="mt-4 border-1 border-red-300"/>
                                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 flex gap-2">

                                                          <button onClick={() => setSelectedItem(item)} className="bg-black text-white text-sm/8 rounded px-4 cursor-pointer text-sm/10 flex justify-center items-center gap-1">
                                                          <FiEye/>Details
                                                          </button>
                                                          <a href={item.link2} target="_blank" rel="noopener noreferrer" className="bg-black text-white text-sm/8 rounded px-4 cursor-pointer text-sm/10 flex justify-center items-center gap-1">
                                                              <FaGithub />Source
                                                          </a>
                                                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="bg-black text-white text-sm/8 rounded px-4 cursor-pointer text-sm/10 flex justify-center items-center gap-1">
                                                              <FaGithub />Site Web
                                                          </a>

                                                        </div>


                                                      </div>

                                                    </div>

                                                  </motion.div>
                                                ))}

                                            </div>
                                    </div>
                              </div>
                          </div>

                          {/*motion quand tu scroll : les images superposé bougent à des vitesses différentes  */}
                          <section className="py-40 bg-blue-100" id="parcourt">
                                  <div className="max-w-7xl mx-auto px-14 sm:px-16 lg:px-8">

                                    <div className="flex justify-center items-center">
                                      <h1 className="font-bold text-6xl mb-9">Mon parcourt en tant que Developpeur Web </h1>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-30 items-center">

                                      {/* Images */}
                                      <div ref={refSection} className="relative h-[500px] w-full max-w-[400px]">
                                        <motion.img
                                          src="Aibs.jpeg"
                                          style={{ y }}
                                          className="absolute rounded-2xl shadow-2xl object-cover h-96 w-85"
                                        />

                                        <motion.img
                                          src="nan.jpeg"
                                          style={{ y: y2 }}
                                          className="absolute top-40 left-50 rounded-2xl shadow-2xl object-cover h-96 "
                                        />

                                        <motion.img
                                          src="nan1.jpeg"
                                          style={{ y: y3 }}
                                          className="absolute top-80 -left-10 rounded-2xl shadow-2xl object-cover h-96 w-96"
                                        />
                                      </div>

                                      {/* Texte */}
                                      <div className="bg-white rounded-2xl text-center p-7 ">
                                        <div className="flex justify-center items-center flex-col p-3">
                                          <p className="w-full flex mb-1 font-bold text-2xl">Année scolaire 2025 :</p>
                                          <p className="text-xl">
                                                programme intensif axé sur le Développement web full Stack à Growing consulting
                                          </p>
                                            
                                        </div>

                                        <div className="flex justify-center items-center flex-col p-3">
                                          <p className="w-full flex mb-1 font-bold text-2xl">Année scolaire 2024 :</p>
                                          <p className="text-xl">
                                                Formation pratique à Nan Digital Academy
                                          </p>
                                          
                                        </div>
                                         <div className="flex justify-center items-center flex-col p-3">
                                          <p className="w-full flex mb-1 font-bold text-2xl">Année scolaire 2020 :</p>
                                          <p className="text-xl">
                                              BTS en Informatique Développeur d’Applications à Atlantique International Business School
                                          </p>
                                          
                                        </div>
                                      </div>

                                    </div>

                                  </div>
                                </section>

                            {/*motion quand tu scroll : les images apparaissent a droite et se superposent comme des cartes */}
                              {/* <section className="py-30 bg-red-200">
                                <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-900">

                                            <div className="min-h-screen flex items-center justify-center ">
                                              <p className="text-red-300 text-3xl">bassole</p>
                                            </div>


                                            <div className="min-h-screen flex items-center justify-center relative">

                                              <motion.img
                                                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
                                                className="absolute w-80 rounded-2xl"
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                whileInView={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.6 }}
                                              />

                                              <motion.img
                                                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
                                                className="absolute w-80 translate-x-10 translate-y-10 rounded-2xl"
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                whileInView={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                              />

                                              <motion.img
                                                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
                                                className="absolute w-80 -translate-x-10 translate-y-20 rounded-2xl"
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                whileInView={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.6 }}
                                              />

                                            </div>
                                  </div>

                                </div>
                              </section> */}

                              {/*motion quand tu scroll : les images defillent horizontallement */}
                                {/* <section ref={refText} className="relative h-[210vh] bg-black">
                                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                      <div className="sticky top-0 min-h-screen flex items-center overflow-hidden">
                                      <motion.div
                                        style={{ x }}
                                        className="flex gap-10 px-10 "
                                      >

                                        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" className="w-[400px] h-[500px] object-cover rounded-2xl shadow-2xl hover:scale-105 transition"/>
                                        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" className="w-[400px] h-[500px] object-cover rounded-2xl shadow-2xl hover:scale-105 transition"/>
                                        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" className="w-[400px] h-[500px] object-cover rounded-2xl shadow-2xl hover:scale-105 transition"/>
                                        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" className="w-[400px] h-[500px] object-cover rounded-2xl shadow-2xl hover:scale-105 transition"/>

                                      </motion.div>
                                      </div>
                                    </div>
                                </section> */}

                              {/*section Service*/}
                              <section className="py-40 bg-gray-300" id="service">
                                    <div className="max-w-7xl mx-auto px-6">

                                          <h2 className="text-4xl font-bold text-center mb-12">
                                          Mes Services
                                          </h2>

                                          <div className="grid md:grid-cols-3 gap-8">
                                              <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
                                              <div className="text-indigo-600 text-4xl mb-4">💻</div>
                                              <h3 className="text-xl font-semibold mb-3">Développement Web</h3>
                                              <p className="text-gray-600">
                                              Création de sites modernes rapides et optimisés.
                                              </p>
                                              </div>


                                              <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
                                              <div className="text-indigo-600 text-4xl mb-4">📱</div>
                                              <h3 className="text-xl font-semibold mb-3">Applications Mobile</h3>
                                              <p className="text-gray-600">
                                              Développement d'applications performantes pour Android et iOS.
                                              </p>
                                              </div>

                                              <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
                                              <div className="text-indigo-600 text-4xl mb-4">🎨</div>
                                              <h3 className="text-xl font-semibold mb-3">UI / UX Design</h3>
                                              <p className="text-gray-600">
                                              Conception d'interfaces modernes et faciles à utiliser.
                                              </p>
                                              </div>
                                          </div>
                                  </div>

                              </section>

                              {/*section Contact*/}
                              <section className ="py-40 bg-gray-100" id="contact">
                                <div className ="max-w-3xl mx-auto px-6 bg-gray-300 p-7 rounded-xl">

                                      <h2 className ="text-4xl font-bold text-center mb-10">
                                      Contactez-moi
                                      </h2>

                                      <form onSubmit={handleSubmit} className ="bg-white p-8 rounded-xl shadow-lg space-y-6">

                                      <div>
                                      <label className ="block mb-2 font-medium">Nom</label>
                                      <input
                                      type="text"
                                      name="name"
                                      value={formData.name}
                                      onChange={handleChange}
                                      placeholder="Bassole arnaud"
                                      className ="w-full border border-gray-300 text-xl rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                                      </div>

                                      <div>
                                      <label className ="block mb-2 font-medium">Email</label>
                                      <input
                                      type="email"
                                      name="email"
                                      value={formData.email}
                                      onChange={handleChange}
                                      placeholder="Bassole@example.com"
                                      className ="w-full border text-xl border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                                      </div>

                                      <div>
                                      <label className ="block mb-2 font-medium">Message</label>
                                      <textarea
                                      type="text"
                                      name="text"
                                      value={formData.text}
                                      onChange={handleChange}
                                      rows="5"
                                      placeholder="Décrivez votre projet..... "
                                      className ="w-full border border-gray-300 text-xl rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                                      </div>

                                          <button
                                          type="submit"
                                          className ="w-full flex justify-center gap-2 items-center bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition cursor-pointer">
                                            <div>
                                                Envoyer
                                            </div>
                                            <div>
                                                <BsFillSendFill/>
                                            </div>
                                          
                                          </button>

                                      </form>

                                </div>
                              </section>

                    </div>
                  </main>

                  {/* footer */}
                  <footer className="w-full bg-black text-gray-300 py-40 p-7">
                                  <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">

                                  <div>
                                  <h2 className="text-2xl font-bold text-white mb-4">MonSite</h2>
                                  <p className="text-gray-400">
                                  Nous créons des sites web modernes et performants pour les entreprises.
                                  </p>
                                  </div>

                                  <div>
                                  <h3 className="text-white font-semibold mb-4">Navigation</h3>
                                  <ul className="space-y-2">
                                  <li><a href="#" className="hover:text-white">Accueil</a></li>
                                  <li><a href="#service" className="hover:text-white">Services</a></li>
                                  <li><a href="#Portfolio" className="hover:text-white">Portfolio</a></li>
                                  <li><a href="#contact" className="hover:text-white">Contact</a></li>
                                  </ul>
                                  </div>

                                  <div>
                                  <h3 className="text-white font-semibold mb-4">Services</h3>
                                  <ul className="space-y-2">
                                  <li><a href="#service" className="hover:text-white">Web Design</a></li>
                                  <li><a href="#outils" className="hover:text-white">Développement</a></li>
                                  <li><a href="#service" className="hover:text-white">UI/UX</a></li>
                                  <li><a href="#" className="hover:text-white">SEO</a></li>
                                  </ul>
                                  </div>

                                  <div>
                                  <h3 className="text-white font-semibold mb-4 ">Contact</h3>
                                  <p >Email:<br/><span className="text-sm/6">bassolearnaud9@gmail.com</span></p>
                                  <p>phone:<br/><span className="text-sm">0142448765</span></p>
                                  <p>Abidjan, Côte d'Ivoire</p>
                                  </div>

                                  </div>

                                  <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500">
                                  © 2026 MonSite. Tous droits réservés.
                                  </div>

                  </footer>
              </div>
      </div>
{selectedItem && (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center w-full bg-black/50"
    onClick={() => setSelectedItem(null)}
  >
    <div
      className="
        w-full
        max-w-sm
        sm:max-w-md
        md:max-w-2xl
        lg:max-w-4xl
        xl:max-w-5xl
        max-h-[90vh]
        overflow-y-auto
        bg-white
        rounded-2xl
        shadow-lg
        p-2
      "
      onClick={(e) => e.stopPropagation()}
    >
      <div className="grid grid-cols-1 items-center">

        {/* HEADER */}
        <div className="flex justify-between border-b-2 border-gray-300 p-4 mb-4">
          <p className="flex justify-center items-center bg-black text-white font-bold rounded-2xl px-4">
            {selectedItem.nom}
          </p>

          <p
            onClick={() => setSelectedItem(null)}
            className="cursor-pointer bg-black text-white font-bold hover:bg-gray-300 rounded-2xl px-2 p-1 transition"
          >
            X
          </p>
        </div>

        {/* IMAGE */}
        <div className="w-full flex items-center justify-center p-4 px-10">
          <img
            src={selectedItem.img}
            alt={selectedItem.nom}
            className="rounded-2xl w-full h-[400px] object-cover hover:scale-105 transition "
          />
        </div>

        {/* CONTENU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white mt-3 p-5">

          {/* TEXTE */}
          <div className="bg-gray-300 p-7 rounded-2xl">
            <h1 className="font-bold text-2xl">
              {selectedItem.nom}
            </h1>

            <div className="text-gray-600 text-sm/8 mb-5">
              {selectedItem.definition}
            </div>

            <div className="text-black font-bold text-xm">
              Année : {selectedItem.année}
            </div>
          </div>

          {/* STACK */}
          <div className="bg-gray-300 rounded-2xl p-7">
            <h1 className="font-bold text-2xl mb-3">STACK</h1>

            <div className="bg-gray-700 p-4 rounded-2xl grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedItem.stack.map((tech, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-white text-black rounded-2xl text-sm hover:bg-gray-300"
                >
                  <img
                     src={logos[tech] || "/logos/default.png"}
                      alt={tech}
                    className="w-5 h-5 object-contain"
                  />
                  <span>{tech}</span>
                </div>
              ))}
            </div>

            {/* ROLE */}
            <div className="text-black mt-4">
              <p className="text-xl font-bold">Role</p>
              <p>{selectedItem.role}</p>
            </div>

            {/* TIMELINE */}
            <div className="text-black mt-4">
              <p className="text-xl font-bold">Timeline</p>
              <p>{selectedItem.Timeline}</p>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-gray-600 p-4 flex gap-4 justify-start mt-4 ">
        <a
          href={selectedItem.link2}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-700 text-white rounded-2xl px-4 cursor-pointer flex 
          justify-center items-center gap-3 hover:scale-110 shadow-xl transition p-1"
        >
          <FaGithub /> <p>code Source</p>
        </a>
        <a
          href={selectedItem.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-700 text-white rounded-2xl px-4 cursor-pointer flex 
          justify-center items-center gap-3 hover:scale-110 shadow-xl transition p-1"
        >
          <FaPlay /> <p>site web en ligne</p>
        </a>
      </div>

    </div>
  </div>
)}
      
    </>
  );
}